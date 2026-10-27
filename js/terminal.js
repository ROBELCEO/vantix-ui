let chartInstance = null;
let allComparisons = [];
let activeIndex = 0;

async function loadTerminal() {
    const container = document.getElementById('watchlist-container');
    if(!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        
        // Handle Tracking Prevention / Auth errors gracefully
        if (res.status === 401) {
            container.innerHTML = '<div class="text-red" style="padding: 16px; font-size: 11px; text-align: center;">Unauthorized.<br>Please disable Tracking Prevention or log in again.</div>';
            return;
        }
        if(!res.ok) throw new Error("Failed");
        
        const data = await res.json();
        
        if(data.comparisons && data.comparisons.length > 0) {
            allComparisons = data.comparisons;
            renderWatchlist();
            selectProduct(0); 
        } else {
            container.innerHTML = '<div class="text-tertiary" style="padding: 16px; font-size: 11px; text-align: center;">No matching products found. Add competitors to analyze.</div>';
        }
    } catch(e) {
        console.error("Terminal error:", e);
        container.innerHTML = '<div class="text-red" style="padding: 16px; font-size: 11px;">Failed to load data. Backend might be asleep.</div>';
    }
}

function renderWatchlist() {
    const container = document.getElementById('watchlist-container');
    
    container.innerHTML = allComparisons.map((c, index) => {
        const isActive = index === activeIndex ? 'active' : '';
        const bg = isActive ? 'var(--bg-elevated)' : 'var(--bg-surface)';
        const border = isActive ? 'var(--accent)' : 'var(--border)';
        
        let diff = 0;
        let diffClass = 'text-tertiary';
        
        if (c.competitor_matches && c.competitor_matches.length > 0) {
            const cheapest = c.competitor_matches.reduce((prev, curr) => (prev.comp_price < curr.comp_price) ? prev : curr);
            diff = c.my_price - cheapest.comp_price;
            diffClass = diff > 0 ? 'text-red' : (diff < 0 ? 'text-green' : 'text-tertiary');
        }
        
        const fallbackImg = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.my_product)}&background=141414&color=00E5FF`;

        return `
            <div onclick="selectProduct(${index})" style="cursor: pointer; padding: 12px; background: ${bg}; border: 1px solid ${border}; border-radius: var(--r-btn); display: flex; align-items: center; gap: 12px; transition: 0.2s;">
                <img src="${c.my_image || fallbackImg}" style="width: 36px; height: 36px; border-radius: 4px; object-fit: cover;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.my_product}</div>
                    <div class="mono ${diffClass}" style="font-size: 10px;">${diff > 0 ? '+' : ''}$${diff.toFixed(2)} vs Comp</div>
                </div>
                <div class="mono text-green" style="font-weight: 800; font-size: 13px;">$${c.my_price}</div>
            </div>
        `;
    }).join('');
}

function selectProduct(index) {
    activeIndex = index;
    const product = allComparisons[index];
    
    renderWatchlist();
    document.getElementById('chart-product-name').innerText = product.my_product.toUpperCase();
    
    // SAFE CHECK FOR IMAGE
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
    const dates = ['Oct 1', 'Oct 5', 'Oct 10', 'Oct 15', 'Oct 20', 'Oct 25'];
    const myPrice = parseFloat(product.my_price);
    const myPriceData = [myPrice, myPrice, myPrice, myPrice, myPrice, myPrice];

    let datasets = [{
        label: 'Your Price', data: myPriceData, borderColor: '#00FF88', borderWidth: 2, tension: 0, pointRadius: 0
    }];

    const colors = ['#FF2266', '#FFAA00', '#8B7FFF'];

    if (product.competitor_matches && product.competitor_matches.length > 0) {
        product.competitor_matches.slice(0, 3).forEach((match, i) => {
            const compPrice = parseFloat(match.comp_price);
            const compData = [compPrice, compPrice, compPrice, compPrice, compPrice, compPrice];
            
            datasets.push({
                label: match.competitor_name, data: compData, borderColor: colors[i % colors.length], borderWidth: 2, tension: 0.4, pointRadius: 3, pointBackgroundColor: '#000', pointBorderColor: colors[i % colors.length], pointBorderWidth: 2
            });
        });
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: dates, datasets: datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: true, labels: { color: '#BDBDBD', font: { family: 'JetBrains Mono', size: 10 } } } },
            scales: { y: { grid: { color: '#1F1F1F' }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } }, x: { grid: { display: false }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } } }
        }
    });
}

function renderSafeFloor(product) {
    const div = document.getElementById('safe-floor-content');
    if (!product.competitor_matches || product.competitor_matches.length === 0) return;
    const match = product.competitor_matches[0];

    let badgeColor = "var(--green)";
    let statusText = "SAFE TO HOLD";
    
    if (match.war_status === "DANGER") {
        badgeColor = "var(--red)";
        statusText = "DO NOT MATCH";
    } else if (match.war_status === "WARNING") {
        badgeColor = "var(--amber)";
        statusText = "PROCEED WITH CAUTION";
    }

    div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-size: 20px; font-weight: 900; color: ${badgeColor};">${statusText}</div>
            <div class="badge" style="background: ${badgeColor}; color: #000;">PRICE WAR</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: 6px;">
                <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase;">Your Cost (COGS)</div>
                <div class="mono" style="font-size: 16px; font-weight: 700;">$${product.my_cost.toFixed(2)}</div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: 6px; border: 1px solid ${badgeColor};">
                <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase;">Safe Floor</div>
                <div class="mono" style="font-size: 16px; font-weight: 700; color: ${badgeColor};">$${match.safe_floor.toFixed(2)}</div>
            </div>
        </div>

        <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px;">
            Competitor price: <b>$${match.comp_price.toFixed(2)}</b>. 
            ${match.war_status === 'DANGER' ? 'If you match them, you drop below your 15% margin floor.' : 'You can safely drop your price to match them.'}
        </div>
    `;
}

function renderSimulator(product) {
    const div = document.getElementById('simulator-content');
    
    div.innerHTML = `
        <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">
            If you lower your price, how many more units do you need to sell to maintain your <b>current profit</b>?
        </div>
        
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="flex: 1;">
                <label class="text-tertiary" style="font-size: 10px; text-transform: uppercase;">New Price ($)</label>
                <input type="number" id="sim-price" class="form-input" value="${product.my_price}" min="0" step="1" oninput="calculateSimulation(${product.my_cost}, ${product.my_price})" style="font-family: var(--font-mono);">
            </div>
        </div>

        <div id="sim-result" style="background: var(--bg-surface); padding: 12px; border-radius: 6px; font-size: 12px; color: var(--text-secondary); text-align: center;">
            Adjust the price to see the required volume.
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
        resultDiv.innerHTML = `<span class="text-red">You are selling at a loss.</span>`;
        return;
    }

    if (newPrice >= originalPrice) {
        resultDiv.innerHTML = `<span class="text-green">You are raising your price. Any volume maintains higher profit.</span>`;
        return;
    }

    const multiplier = originalMargin / newMargin;
    const percentIncrease = Math.round((multiplier - 1) * 100);

    resultDiv.innerHTML = `
        To make the same profit, you must sell <b class="text-accent">${multiplier.toFixed(2)}x</b> more units.<br>
        That is a <b class="text-amber">${percentIncrease}% increase</b> in sales volume.
    `;
}

async function fetchAIAdvice(productName) {
    const div = document.getElementById('ai-advisor-content');
    div.innerHTML = '<div class="text-tertiary" style="font-size: 12px; text-align: center; padding: 20px;"><span style="display:inline-block; width:12px; height:12px; border:2px solid var(--violet); border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></span> Analyzing strategy...</div>';
    
    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/ai/advisor?product_name=${encodeURIComponent(productName)}`);
        
        if (!res.ok) {
            const errData = await res.json();
            div.innerHTML = `<div class="text-red" style="font-size: 12px; padding: 12px;">${errData.detail || 'No AI advice available.'}</div>`;
            return;
        }

        const data = await res.json();
        
        if(data.status === "success") {
            div.innerHTML = `
                <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                    ${data.advice}
                </div>
            `;
        }
    } catch(e) {
        div.innerHTML = `<div class="text-red" style="font-size: 12px; padding: 12px;">Backend asleep. Try again.</div>`;
    }
}
