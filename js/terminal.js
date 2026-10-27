let chartInstance = null;
let allComparisons = [];
let activeIndex = 0;

async function loadTerminal() {
    const container = document.getElementById('watchlist-container');
    if(!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        
        if(!res.ok) {
            container.innerHTML = '<div class="text-tertiary" style="padding: 16px; font-size: 11px;">Failed to load. Add competitors first.</div>';
            return;
        }

        const data = await res.json();
        
        if(data.comparisons && data.comparisons.length > 0) {
            allComparisons = data.comparisons;
            renderWatchlist();
            selectProduct(0); 
        } else {
            container.innerHTML = '<div class="text-tertiary" style="padding: 16px; font-size: 11px;">No matching products found.</div>';
        }
    } catch(e) {
        console.error("Terminal error:", e);
        container.innerHTML = '<div class="text-tertiary" style="padding: 16px; font-size: 11px;">Network error.</div>';
    }
}

function renderWatchlist() {
    const container = document.getElementById('watchlist-container');
    
    container.innerHTML = allComparisons.map((c, index) => {
        const isActive = index === activeIndex ? 'active' : '';
        
        let diff = 0;
        let diffClass = 'text-tertiary';
        let diffSign = '';
        let lowestPrice = c.my_price;

        if (c.competitor_matches && c.competitor_matches.length > 0) {
            const cheapest = c.competitor_matches.reduce((prev, curr) => (prev.comp_price < curr.comp_price) ? prev : curr);
            diff = c.my_price - cheapest.comp_price;
            lowestPrice = cheapest.comp_price;
            diffClass = diff > 0 ? 'text-red' : (diff < 0 ? 'text-green' : 'text-tertiary');
            diffSign = diff > 0 ? '+' : '';
        }

        return `
            <div class="watch-item ${isActive}" onclick="selectProduct(${index})">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(c.my_product)}&background=141414&color=00E5FF">
                <div class="watch-info">
                    <div class="watch-title">${c.my_product}</div>
                    <div class="watch-meta text-tertiary">${c.competitor_matches.length} Competitors</div>
                </div>
                <div>
                    <div class="watch-price">$${c.my_price}</div>
                    <div class="watch-change ${diffClass}" style="font-size:10px; text-align:right;">${diffSign}$${Math.abs(diff).toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function selectProduct(index) {
    activeIndex = index;
    const product = allComparisons[index];
    
    renderWatchlist();
    document.getElementById('chart-product-name').innerText = product.my_product.toUpperCase();

    renderChart(product);
    fetchAIAdvice(product.my_product);
    renderPriceWarPanel(product);
}

function renderPriceWarPanel(product) {
    const container = document.getElementById('ai-advisor-content');
    if (!container) return;
    
    // Find the best competitor match to evaluate the war
    const match = product.competitor_matches[0];
    if (!match) return;

    let badgeColor = "var(--green)";
    let statusText = "SAFE TO HOLD";
    let advice = `Your cost is ${product.my_cost.toFixed(2)}. Your absolute safe floor is ${match.safe_floor.toFixed(2)}.`;

    if (match.war_status === "DANGER") {
        badgeColor = "var(--red)";
        statusText = "DO NOT MATCH";
        advice = `Competitor is at ${match.comp_price.toFixed(2)}, which is below your safe floor of ${match.safe_floor.toFixed(2)}. If you match, you lose money. Hold your price and offer a bundle instead.`;
    } else if (match.war_status === "WARNING") {
        badgeColor = "var(--amber)";
        statusText = "PROCEED WITH CAUTION";
        advice = `Competitor dropped to ${match.comp_price.toFixed(2)}. You can safely match them because your floor is ${match.safe_floor.toFixed(2)}.`;
    }

    container.innerHTML = `
        <div style="background: var(--bg-surface); border: 1px solid ${badgeColor}; border-radius: 8px; padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="font-size: 16px; font-weight: 900; color: ${badgeColor};">${statusText}</div>
                <div class="badge" style="background: ${badgeColor}; color: #000;">PRICE WAR</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div>
                    <div class="text-tertiary" style="font-size: 10px;">Your Cost (COGS)</div>
                    <div class="mono" style="font-size: 14px; font-weight: 700;">${product.my_cost.toFixed(2)}</div>
                </div>
                <div>
                    <div class="text-tertiary" style="font-size: 10px;">Safe Floor (15% Margin)</div>
                    <div class="mono" style="font-size: 14px; font-weight: 700; color: ${badgeColor};">${match.safe_floor.toFixed(2)}</div>
                </div>
            </div>

            <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px;">
                ${advice}
            </div>
        </div>
    `;
}

function renderChart(product) {
    if(chartInstance) chartInstance.destroy();
    const ctx = document.getElementById('terminalChart').getContext('2d');
    
    const dates = ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25'];
    const myPrice = parseFloat(product.my_price);
    const myPriceData = [myPrice, myPrice, myPrice, myPrice, myPrice, myPrice];

    let datasets = [{
        label: 'Your Price',
        data: myPriceData,
        borderColor: '#00FF88',
        borderWidth: 2,
        tension: 0,
        pointRadius: 0
    }];

    const colors = ['#FF2266', '#FFAA00', '#8B7FFF'];

    if (product.competitor_matches && product.competitor_matches.length > 0) {
        product.competitor_matches.slice(0, 3).forEach((match, i) => {
            const compPrice = parseFloat(match.comp_price);
            const compData = [compPrice + 5, compPrice + 8, compPrice + 2, compPrice, compPrice + 4, compPrice];
            
            datasets.push({
                label: match.competitor_name,
                data: compData,
                borderColor: colors[i % colors.length],
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#000',
                pointBorderColor: colors[i % colors.length],
                pointBorderWidth: 2
            });
        });
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: dates, datasets: datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: true, labels: { color: '#BDBDBD', font: { family: 'JetBrains Mono', size: 10 } } } },
            scales: {
                y: { grid: { color: '#1F1F1F' }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } }
            }
        }
    });
}

async function fetchAIAdvice(productName) {
    const div = document.getElementById('ai-advisor-content');
    div.innerHTML = '<div class="text-tertiary" style="font-size: 12px; text-align: center; padding-top: 40px;"><span style="display:inline-block; width:12px; height:12px; border:2px solid var(--violet); border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></span> Analyzing...</div>';
    
    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/ai/advisor?product_name=${encodeURIComponent(productName)}`);
        const data = await res.json();
        
        if(res.ok && data.status === "success") {
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom: 12px;">
                    <div style="font-weight: 800; color: var(--text-primary);">${data.product}</div>
                </div>
                <div class="ai-box">
                    <div class="ai-row"><span class="text-tertiary">Your Price:</span><span class="mono text-green">$${data.my_price}</span></div>
                    <div class="ai-row"><span class="text-tertiary">Competitor:</span><span class="mono text-red">$${data.competitor_price}</span></div>
                    <div class="ai-row"><span class="text-tertiary">RECOMMEND:</span><span class="mono text-accent" style="font-weight:800;">HOLD</span></div>
                </div>
                <div style="margin-top: 16px; font-size: 12px; line-height: 1.6; color: var(--text-secondary);">
                    <b style="color: var(--violet);">AI Strategy:</b><br>${data.advice}
                </div>
            `;
        } else {
            div.innerHTML = `<div class="text-red" style="font-size: 12px;">${data.detail || 'AI failed.'}</div>`;
        }
    } catch(e) {
        div.innerHTML = `<div class="text-red" style="font-size: 12px;">Backend asleep.</div>`;
    }
}

// Run on load
if (window.location.pathname.includes('terminal.html')) {
    loadTerminal();
}

