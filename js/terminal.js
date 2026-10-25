let chartInstance = null;
let allComparisons = []; // Store data globally so we can switch between products
let activeIndex = 0;

// 1. Load Data
async function loadTerminal() {
    try {
        const compRes = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        const compData = await compRes.json();
        
        if(compData.comparisons && compData.comparisons.length > 0) {
            allComparisons = compData.comparisons;
            renderWatchlist();
            selectProduct(0); // Select the first item by default
        } else {
            document.getElementById('watchlist-container').innerHTML = '<div class="text-tertiary" style="padding: 16px; font-size: 11px;">No comparisons found.</div>';
        }
    } catch(e) {
        console.error("Terminal error:", e);
    }
}

// 2. Render the Watchlist UI
function renderWatchlist() {
    const container = document.getElementById('watchlist-container');
    
    container.innerHTML = allComparisons.map((c, index) => {
        const isActive = index === activeIndex ? 'active' : '';
        const diff = c.price_diff || 0;
        const diffClass = diff > 0 ? 'text-red' : (diff < 0 ? 'text-green' : 'text-tertiary');
        const diffSign = diff > 0 ? '+' : '';
        
        // Add an onclick event to switch products
        return `
            <div class="watch-item ${isActive}" onclick="selectProduct(${index})">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.my_product)}&background=141414&color=00E5FF">
                <div class="watch-info">
                    <div class="watch-title">${c.my_product}</div>
                    <div class="watch-meta">${c.comp_product || 'No Match'}</div>
                </div>
                <div>
                    <div class="watch-price">$${c.my_price}</div>
                    <div class="watch-change ${diffClass}">${diffSign}${diff}</div>
                </div>
            </div>
        `;
    }).join('');
}

// 3. Handle Product Switching
function selectProduct(index) {
    activeIndex = index;
    const product = allComparisons[index];
    
    // Update Watchlist UI
    renderWatchlist();
    
    // Update Title
    document.getElementById('chart-product-name').innerText = product.my_product.toUpperCase();

    // Re-draw Chart
    renderChart(product);

    // Re-fetch AI Advice for this specific product
    fetchAIAdvice(product.my_product);
}

// 4. Render Chart based on selected product
function renderChart(product) {
    if(chartInstance) chartInstance.destroy();
    const ctx = document.getElementById('terminalChart').getContext('2d');
    
    // Generate realistic mock history based on the actual price
    const dates = ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25'];
    const myPrice = parseFloat(product.my_price);
    const compPrice = parseFloat(product.comp_price) || myPrice;

    // Flat line for your price
    const myPriceData = [myPrice, myPrice, myPrice, myPrice, myPrice, myPrice];
    
    // Wavy line for competitor ending at their exact current price
    const compPriceData = [
        compPrice + 10, 
        compPrice + 12, 
        compPrice + 5, 
        compPrice + 2, 
        compPrice + 8, 
        compPrice
    ];

    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(255, 34, 102, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 34, 102, 0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Your Price',
                    data: myPriceData,
                    borderColor: '#00FF88',
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: 0
                },
                {
                    label: 'Competitor',
                    data: compPriceData,
                    borderColor: '#FF2266',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#000',
                    pointBorderColor: '#FF2266',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1E1E1E',
                    borderColor: '#2A2A2A',
                    borderWidth: 1,
                    titleColor: '#fff',
                    bodyColor: '#C8C8D0'
                }
            },
            scales: {
                y: {
                    grid: { color: '#1F1F1F' },
                    ticks: { 
                        color: '#8A8A94', 
                        font: { family: 'JetBrains Mono', size: 10 },
                        callback: function(value) { return '$' + value; }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } }
                }
            }
        }
    });
}

// 5. Fetch AI Advice for a specific product
async function fetchAIAdvice(productName) {
    const div = document.getElementById('ai-advisor-content');
    div.innerHTML = '<div class="text-tertiary" style="font-size: 12px; text-align: center; padding-top: 40px;">Analyzing new data...</div>';
    
    try {
        // Pass the product name to the backend
        const res = await fetch(`https://vantix-my5f.onrender.com/api/ai/advisor?product_name=${encodeURIComponent(productName)}`);
        const data = await res.json();
        
        if(data.status === "success") {
            div.innerHTML = `
                <div class="ai-text">
                    <b>${data.product.split(' ')[0]}</b> is currently priced at <b class="text-red">$${data.competitor_price}</b> at the competitor.
                </div>
                
                <div class="ai-data-box">
                    <div class="ai-row">
                        <span class="ai-label">Your Price:</span>
                        <span class="ai-val">$${parseFloat(data.my_price).toFixed(2)}</span>
                    </div>
                    <div class="ai-row">
                        <span class="ai-label">Competitor:</span>
                        <span class="ai-val text-red">$${parseFloat(data.competitor_price).toFixed(2)}</span>
                    </div>
                    <div class="ai-row">
                        <span class="ai-label">Safe Floor:</span>
                        <span class="ai-val text-amber">$${(data.my_price * 0.6).toFixed(2)}</span>
                    </div>
                    <div class="ai-row">
                        <span class="ai-label">RECOMMEND:</span>
                        <span class="ai-val text-green">HOLD</span>
                    </div>
                </div>

                <div class="ai-why">
                    <b style="color: var(--text-secondary);">Why?</b> ${data.advice}
                </div>
            `;
        } else {
            div.innerHTML = `<div class="text-red">${data.detail || 'AI failed.'}</div>`;
        }
    } catch(e) {
        div.innerHTML = `<div class="text-red">Backend asleep. AI unavailable.</div>`;
    }
}

// Run on page load
loadTerminal();
