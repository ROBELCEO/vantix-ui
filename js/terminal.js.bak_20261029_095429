let chartInstance = null;
let allComparisons = [];
let activeIndex = 0;

async function loadTerminal() {
    const container = document.getElementById('watchlist-container');
    const statusEl = document.getElementById('trm-status');
    if(!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        if(!res.ok) throw new Error("HTTP " + res.status);
        
        const data = await res.json();
        
        if(data.comparisons && data.comparisons.length > 0) {
            allComparisons = data.comparisons;
            if(statusEl) statusEl.innerText = "Connected";
            renderWatchlist();
            selectProduct(0); 
        } else {
            container.innerHTML = '<div class="trm-empty">No matching products found. Add more competitors or ensure your products have similar names.</div>';
            if(statusEl) statusEl.innerText = "Empty";
        }
    } catch(e) {
        console.error("Terminal error:", e);
        container.innerHTML = `<div class="trm-empty trm-text-red">Failed: ${e.message}</div>`;
        if(statusEl) statusEl.innerText = "Error";
    }
}

function renderWatchlist() {
    const container = document.getElementById('watchlist-container');
    
    container.innerHTML = allComparisons.slice(0, 10).map((c, index) => {
        const isActive = index === activeIndex ? 'active' : '';
        const bg = isActive ? '#E0F2FE' : '#F8FAFC';
        const border = isActive ? '#0284C7' : '#F1F5F9';
        
        let diff = 0;
        let diffClass = 'trm-text-muted';
        
        if (c.competitor_matches && c.competitor_matches.length > 0) {
            const cheapest = c.competitor_matches.reduce((prev, curr) => (prev.comp_price < curr.comp_price) ? prev : curr);
            diff = c.my_price - cheapest.comp_price;
            diffClass = diff > 0 ? 'trm-text-red' : (diff < 0 ? 'trm-text-green' : 'trm-text-muted');
        }

        return `
            <div onclick="selectProduct(${index})" style="cursor: pointer; padding: 12px; background: ${bg}; border: 1px solid ${border}; border-radius: 2px !important; display: flex; align-items: center; gap: 12px; transition: 0.2s;">
                <img src="${c.my_image || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 2px; object-fit: cover; border: 1px solid #E4E4E7;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 13px; color: #09090B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.my_product}</div>
                    <div class="mono ${diffClass}" style="font-size: 11px;">${diff > 0 ? '+' : ''}$${diff.toFixed(2)} vs Comp</div>
                </div>
                <div class="mono trm-text-green" style="font-weight: 800; font-size: 14px;">$${c.my_price}</div>
            </div>
        `;
    }).join('');
}

function selectProduct(index) {
    activeIndex = index;
    const product = allComparisons[index];
    
    renderWatchlist();
    
    const nameEl = document.getElementById('chart-product-name');
    if(nameEl) nameEl.innerText = product.my_product.toUpperCase();

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
    const dates = ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'];
    const myPrice = parseFloat(product.my_price);
    const myPriceData = [myPrice, myPrice, myPrice, myPrice, myPrice, myPrice, myPrice];

    let datasets = [{
        label: 'Your Price', data: myPriceData, borderColor: '#059669', borderWidth: 2, tension: 0.4, pointRadius: 3
    }];

    const colors = ['#E11D48', '#D97706', '#7C3AED'];

    if (product.competitor_matches && product.competitor_matches.length > 0) {
        product.competitor_matches.slice(0, 3).forEach((match, i) => {
            const compPrice = parseFloat(match.comp_price);
            const compData = [compPrice, compPrice, compPrice, compPrice, compPrice, compPrice, compPrice];
            
            datasets.push({
                label: match.competitor_name, data: compData, borderColor: colors[i % colors.length], borderWidth: 2, tension: 0.4, pointRadius: 3
            });
        });
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels: dates, datasets: datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: true, labels: { color: '#52525B', font: { family: 'JetBrains Mono', size: 11 } } } },
            scales: { y: { grid: { color: '#F1F5F9' }, ticks: { color: '#71717A' } }, x: { grid: { display: false }, ticks: { color: '#71717A' } } }
        }
    });
}

function renderSafeFloor(product) {
    const div = document.getElementById('safe-floor-content');
    if (!product.competitor_matches || product.competitor_matches.length === 0) return;
    const match = product.competitor_matches[0];

    let badgeColor = "#059669";
    let statusText = "SAFE TO HOLD";
    
    if (match.war_status === "DANGER") {
        badgeColor = "#E11D48";
        statusText = "DO NOT MATCH";
    } else if (match.war_status === "WARNING") {
        badgeColor = "#D97706";
        statusText = "CAUTION";
    }

    div.innerHTML = `
        <div style="font-size: 20px; font-weight: 900; color: ${badgeColor}; margin-bottom: 16px;">${statusText}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div class="trm-stat-box">
                <div class="trm-stat-label">Your Cost (COGS)</div>
                <div class="trm-stat-value">$${product.my_cost.toFixed(2)}</div>
            </div>
            <div class="trm-stat-box" style="border-color: ${badgeColor};">
                <div class="trm-stat-label">Safe Floor</div>
                <div class="trm-stat-value" style="color: ${badgeColor};">$${match.safe_floor.toFixed(2)}</div>
            </div>
        </div>
        <div class="trm-advice-box">
            Competitor price: <b>$${match.comp_price.toFixed(2)}</b>. 
            ${match.war_status === 'DANGER' ? 'If you match them, you drop below your 15% margin floor.' : 'You can safely drop your price to match them.'}
        </div>
    `;
}

function renderSimulator(product) {
    const div = document.getElementById('simulator-content');
    
    div.innerHTML = `
        <div style="font-size: 12px; color: #52525B; margin-bottom: 12px;">
            If you lower your price, how many more units do you need to sell to maintain your <b>current profit</b>?
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="flex: 1;">
                <label class="trm-stat-label">New Price ($)</label>
                <input type="number" id="sim-price" class="trm-input" value="${product.my_price}" min="0" step="1" oninput="calculateSimulation(${product.my_cost}, ${product.my_price})">
            </div>
        </div>
        <div id="sim-result" class="trm-stat-box" style="text-align: center; font-size: 12px;">
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
            const errData = await res.json();
            div.innerHTML = `<div class="trm-text-red">${errData.detail || 'No AI advice available.'}</div>`;
            return;
        }

        const data = await res.json();
        
        if(data.status === "success") {
            div.innerHTML = `${data.advice}`;
        }
    } catch(e) {
        div.innerHTML = `<div class="trm-text-red">Backend asleep. Try again.</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadTerminal, 500);
});
