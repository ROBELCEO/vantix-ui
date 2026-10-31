let chartInstance = null;
let allComparisons = [];
let activeIndex = 0;
let watchlistExpanded = false;
window.userTier = 'trial';

function fmtMoney(val) {
    if (val === null || val === undefined || isNaN(val)) return "N/A";
    return "$" + Number(val).toFixed(2);
}

async function loadTerminal() {
    const container = document.getElementById('watchlist-container');
    const statusEl = document.getElementById('trm-status');
    if(!container) return;

    try {
        // 1. Get tier
        const statusRes = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        if (statusRes.ok) {
            const statusData = await statusRes.json();
            window.userTier = statusData.plan || 'trial';
        }

        // 2. Fetch data
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        if(!res.ok) throw new Error("HTTP " + res.status);
        
        const data = await res.json();
        
        if(data.comparisons && data.comparisons.length > 0) {
            allComparisons = data.comparisons;
            if(statusEl) statusEl.innerText = "Connected";
            renderWatchlist();
            selectProduct(0); 
        } else {
            container.innerHTML = '<div class="trm-empty">No matching products found.</div>';
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
    if(!container) return;
    
    const displayItems = watchlistExpanded ? allComparisons : allComparisons.slice(0, 4);
    
    let html = displayItems.map((c, index) => {
        const isActive = index === activeIndex ? 'active' : '';
        const bg = isActive ? '#E0F2FE' : '#F8FAFC';
        const border = isActive ? '#0284C7' : '#F1F5F9';
        
        let diffHtml = '<div class="mono trm-text-muted" style="font-size: 11px;">No competitor match found</div>';
        
        if (c.competitor_matches && c.competitor_matches.length > 0) {
            const validComps = c.competitor_matches.filter(m => m.comp_price !== null && m.comp_price !== undefined);
            if (validComps.length > 0) {
                const cheapest = validComps.reduce((prev, curr) => (prev.comp_price < curr.comp_price) ? prev : curr);
                const diff = c.my_price - cheapest.comp_price;
                const sign = diff > 0 ? '+' : '';
                const colorClass = diff > 0 ? 'trm-text-red' : (diff < 0 ? 'trm-text-green' : 'trm-text-muted');
                diffHtml = `<div class="mono ${colorClass}" style="font-size: 11px;">${sign}${fmtMoney(diff)} vs Best Match</div>`;
            }
        }

        return `
            <div onclick="selectProduct(${index})" style="cursor: pointer; padding: 12px; background: ${bg}; border: 1px solid ${border}; border-radius: 2px !important; display: flex; align-items: center; gap: 12px; transition: 0.2s;">
                <img src="${c.my_image || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 2px; object-fit: cover; border: 1px solid #E4E4E7;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 13px; color: #09090B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.my_product}</div>
                    ${diffHtml}
                </div>
                <div class="mono trm-text-green" style="font-weight: 800; font-size: 14px;">${fmtMoney(c.my_price)}</div>
            </div>
        `;
    }).join('');

    if (allComparisons.length > 4) {
        html += `
            <button onclick="toggleWatchlist()" style="width: 100%; padding: 10px; margin-top: 4px; background: #FFFFFF; border: 1px dashed #D1D5DB; border-radius: 2px; font-weight: 800; font-size: 11px; color: #0284C7; cursor: pointer; transition: 0.2s;">
                ${watchlistExpanded ? 'Show Less ↑' : `Show All ${allComparisons.length} Products ↓`}
            </button>
        `;
    }
    
    container.innerHTML = html;
}

function toggleWatchlist() {
    watchlistExpanded = !watchlistExpanded;
    renderWatchlist();
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
    
    let labels = ['Your Price'];
    let data = [product.my_price || 0];
    let backgroundColors = ['#059669']; 
    
    const compColors = ['#E11D48', '#D97706', '#7C3AED', '#0284C7', '#F472B6', '#FBBF24'];

    if (product.competitor_matches && product.competitor_matches.length > 0) {
        product.competitor_matches.forEach((match, i) => {
            labels.push(match.competitor_name);
            data.push(match.comp_price !== null ? match.comp_price : 0);
            backgroundColors.push(compColors[i % compColors.length]);
        });
    }

    const chartWrap = document.querySelector('.trm-chart-wrap');
    chartWrap.style.height = '320px';

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price ($)',
                data: data,
                backgroundColor: backgroundColors,
                borderRadius: 2,
                maxBarThickness: 60
            }]
        },
        options: {
            indexAxis: 'x',
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: { callbacks: { label: function(context) { return 'Price: $' + context.parsed.y.toFixed(2); } } }
            },
            scales: { 
                y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { color: '#71717A', font: { family: 'JetBrains Mono' } } }, 
                x: { grid: { display: false }, ticks: { color: '#52525B', font: { weight: 'bold' } } } 
            }
        }
    });
}

function renderSafeFloor(product) {
    const div = document.getElementById('safe-floor-content');
    
    if (window.userTier === 'starter' || (product.competitor_matches && product.competitor_matches.length > 0 && product.competitor_matches[0].war_status === 'LOCKED')) {
        div.style.position = 'relative';
        div.innerHTML = `
            <div style="position: absolute; inset: 0; z-index: 10; backdrop-filter: blur(4px); background: rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 2px;">
                <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
                <div style="font-weight: 800; font-size: 14px; color: #09090B; margin-bottom: 8px;">Pro Feature</div>
                <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 6px 12px; border-radius: 2px; text-decoration: none; font-size: 11px; font-weight: 800;">Unlock Safe Floor</a>
            </div>
            <div class="trm-empty" style="min-height: 120px;">&nbsp;</div>
        `;
        return;
    }

    if (!product.competitor_matches || product.competitor_matches.length === 0) {
        div.innerHTML = '<div class="trm-empty">No competitor data available.</div>';
        return;
    }
    
    const match = product.competitor_matches[0];

    let badgeColor = "#059669";
    let statusText = "SAFE TO HOLD";
    let adviceText = "You can safely drop your price to match them.";
    
    if (match.war_status === "UNKNOWN_COST") {
        badgeColor = "#71717A";
        statusText = "COGS MISSING";
        adviceText = "Enter your COGS in Shopify to calculate your safe floor.";
    } else if (match.war_status === "DANGER") {
        badgeColor = "#E11D48";
        statusText = "DO NOT MATCH";
        adviceText = "If you match them, you drop below your 15% margin floor.";
    } else if (match.war_status === "WARNING") {
        badgeColor = "#D97706";
        statusText = "CAUTION";
        adviceText = "You can safely drop your price to match them.";
    }

    div.innerHTML = `
        <div style="font-size: 20px; font-weight: 900; color: ${badgeColor}; margin-bottom: 16px;">${statusText}</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div class="trm-stat-box">
                <div class="trm-stat-label">Your Cost (COGS)</div>
                <div class="trm-stat-value">${product.my_cost !== null && product.my_cost !== undefined ? fmtMoney(product.my_cost) : 'MISSING'}</div>
            </div>
            <div class="trm-stat-box" style="border-color: ${badgeColor};">
                <div class="trm-stat-label">Safe Floor</div>
                <div class="trm-stat-value" style="color: ${badgeColor};">${match.safe_floor !== null && match.safe_floor !== undefined ? fmtMoney(match.safe_floor) : 'N/A'}</div>
            </div>
        </div>
        <div class="trm-advice-box">
            Competitor price: <b>${fmtMoney(match.comp_price)}</b>. 
            ${adviceText}
        </div>
    `;
}

function renderSimulator(product) {
    const div = document.getElementById('simulator-content');
    const safeCost = (product.my_cost !== null && product.my_cost !== undefined) ? product.my_cost : 0;
    
    div.innerHTML = `
        <div style="font-size: 12px; color: #52525B; margin-bottom: 12px;">
            If you lower your price, how many more units do you need to sell to maintain your <b>current profit</b>?
        </div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <div style="flex: 1;">
                <label class="trm-stat-label">New Price ($)</label>
                <input type="number" id="sim-price" class="trm-input" value="${product.my_price}" min="0" step="1" oninput="calculateSimulation(${safeCost}, ${product.my_price})">
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
    
    if (window.userTier === 'starter') {
        div.style.position = 'relative';
        div.innerHTML = `
            <div style="position: absolute; inset: 0; z-index: 10; backdrop-filter: blur(4px); background: rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 2px;">
                <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
                <div style="font-weight: 800; font-size: 14px; color: #09090B; margin-bottom: 8px;">Pro Feature</div>
                <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 6px 12px; border-radius: 2px; text-decoration: none; font-size: 11px; font-weight: 800;">Unlock AI Advisor</a>
            </div>
            <div class="trm-empty" style="min-height: 120px;">&nbsp;</div>
        `;
        return;
    }

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
