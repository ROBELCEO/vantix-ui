let chartInstance = null;
let allComparisons = [];
let activeIndex = 0;

function trmEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
}

async function loadTerminal() {
    const container = document.getElementById('watchlist-container');
    const statusEl = document.getElementById('trm-status');
    if(!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        if(!res.ok) {
            container.innerHTML = '<div class="trm-empty trm-text-red">Failed to load data.</div>';
            if(statusEl) statusEl.innerText = "Connection error";
            return;
        }

        const data = await res.json();
        if(statusEl) statusEl.innerText = "Connected";
        
        if(data.comparisons && data.comparisons.length > 0) {
            allComparisons = data.comparisons;
            renderWatchlist();
            selectProduct(0); 
        } else {
            container.innerHTML = '<div class="trm-empty">No matching products found. Add competitors to compare.</div>';
        }
    } catch(e) {
        container.innerHTML = '<div class="trm-empty trm-text-red">Network error.</div>';
        if(statusEl) statusEl.innerText = "Offline";
    }
}

function renderWatchlist() {
    const container = document.getElementById('watchlist-container');
    
    container.innerHTML = allComparisons.map((c, index) => {
        const isActive = index === activeIndex ? 'active' : '';
        
        let diff = 0;
        let diffClass = 'trm-text-muted';
        let diffSign = '';

        if (c.competitor_matches && c.competitor_matches.length > 0) {
            const cheapest = c.competitor_matches.reduce((prev, curr) => (prev.comp_price < curr.comp_price) ? prev : curr);
            diff = c.my_price - cheapest.comp_price;
            diffClass = diff > 0 ? 'trm-text-red' : (diff < 0 ? 'trm-text-green' : 'trm-text-muted');
            diffSign = diff > 0 ? '+' : '';
        }

        return `
            <div class="trm-watch-item ${isActive}" onclick="selectProduct(${index})">
                <div class="trm-watch-body">
                    <div class="trm-watch-title">${trmEsc(c.my_product)}</div>
                    <div class="trm-watch-meta">${c.competitor_matches.length} Competitors</div>
                </div>
                <div class="trm-watch-pricing">
                    <div class="trm-watch-price">$${Number(c.my_price).toFixed(2)}</div>
                    <div class="trm-watch-diff ${diffClass}">${diffSign}$${Math.abs(diff).toFixed(2)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function selectProduct(index) {
    activeIndex = index;
    const product = allComparisons[index];
    
    renderWatchlist();
    document.getElementById('chart-product-name').innerText = product.my_product;

    const imgEl = document.getElementById('chart-product-img');
    if (imgEl) {
        if (product.my_image) {
            imgEl.src = product.my_image;
            imgEl.style.display = 'block';
        } else {
            imgEl.style.display = 'none';
        }
    }

    renderChart(product);
    renderSafeFloor(product);
    renderSimulator(product);
    fetchAIAdvice(product.my_product);
}

function renderChart(product) {
    if(chartInstance) chartInstance.destroy();
    const canvas = document.getElementById('terminalChart');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    const dates = ['-30d', '-20d', '-10d', 'Today'];
    const myPrice = Number(product.my_price);
    
    // Plot today's price (since historical data is not stored yet)
    const myPriceData = [myPrice, myPrice, myPrice, myPrice];

    let datasets = [{
        label: 'Your Price',
        data: myPriceData,
        borderColor: '#059669',
        borderWidth: 2,
        tension: 0,
        pointRadius: 0
    }];

    if (product.competitor_matches && product.competitor_matches.length > 0) {
        const colors = ['#E11D48', '#D97706', '#6D28D9'];
        product.competitor_matches.slice(0, 3).forEach((match, i) => {
            const compPrice = Number(match.comp_price);
            const compData = [compPrice, compPrice, compPrice, compPrice];
            
            datasets.push({
                label: match.competitor_name,
                data: compData,
                borderColor: colors[i % colors.length],
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 2,
                pointBackgroundColor: '#FFFFFF',
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
            plugins: { legend: { display: true, labels: { color: '#4B5563', font: { size: 10 } } } },
            scales: {
                y: { grid: { color: '#E5E7EB' }, ticks: { color: '#6B7280', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 10 } } }
            }
        }
    });
}

function renderSafeFloor(product) {
    const div = document.getElementById('safe-floor-content');
    if (!product.competitor_matches || product.competitor_matches.length === 0) {
        div.innerHTML = '<div class="trm-empty">No competitor matches.</div>';
        return;
    }
    
    const match = product.competitor_matches[0];
    let badgeColor = "trm-text-green";
    let statusText = "SAFE TO HOLD";
    let actionText = "You can safely drop to match them.";
    
    if (match.war_status === "UNKNOWN_COST") {
        badgeColor = "trm-text-red";
        statusText = "COGS MISSING";
        actionText = "You MUST add your product cost in Shopify to calculate a Safe Floor.";
    } else if (match.war_status === "DANGER") {
        badgeColor = "trm-text-red";
        statusText = "DO NOT MATCH";
        actionText = "Matching drops below your safe floor.";
    } else if (match.war_status === "WARNING") {
        badgeColor = "trm-text-amber";
        statusText = "PROCEED WITH CAUTION";
    }

    const costDisplay = product.my_cost !== null && product.my_cost > 0 ? `$${Number(product.my_cost).toFixed(2)}` : "MISSING";
    const floorDisplay = match.safe_floor !== null ? `$${Number(match.safe_floor).toFixed(2)}` : "UNKNOWN";

    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-size: 18px; font-weight: 900;" class="${badgeColor}">${statusText}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div class="trm-stat-box">
                <div class="trm-stat-label">Your Cost</div>
                <div class="trm-stat-value ${product.my_cost ? '' : 'trm-text-red'}">${costDisplay}</div>
            </div>
            <div class="trm-stat-box">
                <div class="trm-stat-label">Safe Floor</div>
                <div class="trm-stat-value ${match.safe_floor ? '' : 'trm-text-red'}">${floorDisplay}</div>
            </div>
        </div>

        <div class="trm-advice-box">
            Competitor price: <b>$${Number(match.comp_price).toFixed(2)}</b>. 
            ${actionText}
        </div>
    `;
}

function renderSimulator(product) {
    const div = document.getElementById('simulator-content');
    const cost = Number(product.my_cost || 0);
    const origPrice = Number(product.my_price || 0);
    
    div.innerHTML = `
        <div class="trm-input-group">
            <label class="trm-stat-label" style="margin-bottom: 6px; display: block;">New Price ($)</label>
            <input type="number" id="sim-price" class="trm-input" value="${origPrice}" oninput="calculateSimulation(${cost}, ${origPrice})">
        </div>
        <div id="sim-result" class="trm-advice-box">
            Adjust the price above to see required volume.
        </div>
    `;
}

function calculateSimulation(cost, originalPrice) {
    const input = document.getElementById('sim-price');
    if (!input) return;
    const newPrice = parseFloat(input.value) || 0;
    const resultDiv = document.getElementById('sim-result');
    
    const originalMargin = originalPrice - cost;
    const newMargin = newPrice - cost;

    if (newMargin <= 0) {
        resultDiv.innerHTML = `<span class="trm-text-red">You are selling at a loss.</span>`;
        return;
    }

    if (newPrice >= originalPrice) {
        resultDiv.innerHTML = `<span class="trm-text-green">You are raising your price. Any volume maintains higher profit.</span>`;
        return;
    }

    const multiplier = originalMargin / newMargin;
    const percentIncrease = Math.round((multiplier - 1) * 100);

    resultDiv.innerHTML = `
        To make the same profit, you must sell <b class="trm-text-cyan">${multiplier.toFixed(2)}x</b> more units.<br>
        That is a <b class="trm-text-amber">${percentIncrease}% increase</b> in sales volume.
    `;
}

async function fetchAIAdvice(productName) {
    const div = document.getElementById('ai-advisor-content');
    div.innerHTML = '<div class="trm-empty">Analyzing strategy…</div>';
    
    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/ai/advisor?product_name=${encodeURIComponent(productName)}`);
        if (!res.ok) {
            const err = await res.json();
            div.innerHTML = `<div class="trm-empty trm-text-red">${trmEsc(err.detail || 'No AI advice available.')}</div>`;
            return;
        }

        const data = await res.json();
        if(data.status === "success") {
            div.innerHTML = `
                <div class="trm-advice-box" style="border-left-color: #6D28D9;">
                    <div style="font-size: 10px; text-transform: uppercase; color: #9CA3AF; margin-bottom: 6px;">Groq Analysis</div>
                    <div style="font-size: 13px; line-height: 1.6; color: #111827;">${trmEsc(data.advice)}</div>
                </div>
            `;
        }
    } catch(e) {
        div.innerHTML = `<div class="trm-empty trm-text-red">Backend asleep. Try again.</div>`;
    }
}


