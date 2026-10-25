let chartInstance = null;

// Generate dates for the chart X-axis
const dates = ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25'];

// Mock data arrays to make the chart look exactly like the screenshot
const myPriceData = [120, 120, 120, 120, 120, 120];
const compPriceData = [125, 125, 118, 115, 120, 110];

async function loadTerminal() {
    try {
        // 1. Fetch comparisons to populate the watchlist
        const compRes = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        const compData = await compRes.json();
        
        const container = document.getElementById('watchlist-container');
        let activeProduct = "Air Max 90"; // Default

        if(compData.comparisons && compData.comparisons.length > 0) {
            activeProduct = compData.comparisons[0].my_product;
            
            container.innerHTML = compData.comparisons.map((c, index) => {
                const isActive = index === 0 ? 'active' : '';
                const diff = c.price_diff || 0;
                const diffClass = diff > 0 ? 'text-red' : (diff < 0 ? 'text-green' : 'text-tertiary');
                const diffSign = diff > 0 ? '+' : '';
                
                return `
                    <div class="watch-item ${isActive}">
                        <img src="https://ui-avatars.com/api/?name=${c.my_product}&background=141414&color=00E5FF">
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
        } else {
            container.innerHTML = '<div class="text-tertiary" style="padding: 16px; font-size: 11px;">No comparisons found.</div>';
        }

        document.getElementById('chart-product-name').innerText = activeProduct.toUpperCase();

        // 2. Render Chart
        renderChart();

        // 3. Fetch AI Advice
        fetchAIAdvice();

    } catch(e) {
        console.error("Terminal error:", e);
    }
}

function renderChart() {
    const ctx = document.getElementById('terminalChart').getContext('2d');
    
    // Create red gradient fill
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
                    borderColor: '#00FF88', // Green
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: 0
                },
                {
                    label: 'Competitor',
                    data: compPriceData,
                    borderColor: '#FF2266', // Red
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
                    titleColor: '#fff',
                    bodyColor: '#C8C8D0',
                    borderColor: '#2A2A2A',
                    borderWidth: 1
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

async function fetchAIAdvice() {
    const div = document.getElementById('ai-advisor-content');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/ai/advisor');
        const data = await res.json();
        
        if(data.status === "success") {
            // Extract just the core text, ignore the bullet points if it has them
            let adviceText = data.advice;
            
            div.innerHTML = `
                <div class="ai-text">
                    <b>${data.product.split(' ')[0]}</b> is currently priced at <b class="text-red">$${data.competitor_price}</b> at the competitor.
                </div>
                
                <div class="ai-data-box">
                    <div class="ai-row">
                        <span class="ai-label">Your Price:</span>
                        <span class="ai-val">$${data.my_price}.00</span>
                    </div>
                    <div class="ai-row">
                        <span class="ai-label">Competitor:</span>
                        <span class="ai-val text-red">$${data.competitor_price}.00</span>
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
                    <b style="color: var(--text-secondary);">Why?</b> ${adviceText}
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
