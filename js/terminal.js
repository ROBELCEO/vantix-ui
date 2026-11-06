window.getAuthToken = function() {
    try {
        const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
        if (!key) return null;
        const data = JSON.parse(localStorage.getItem(key));
        return data.access_token;
    } catch(e) {
        console.error("Token error:", e);
        return null;
    }
};

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
        const statusRes = await fetch('https://api.midra.xyz/api/auth/status');
        if (statusRes.ok) {
            const statusData = await statusRes.json();
            window.userTier = statusData.plan || 'trial';
        }

        // 2. Fetch data
        const token = window.getAuthToken();
        if (!token) throw new Error("Not logged in. Please refresh or log in again.");
        
        const res = await fetch('https://api.midra.xyz/api/competitors/price-comparison', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if(!res.ok) throw new Error("HTTP " + res.status);
        
        const data = await res.json();
        allComparisons = data.comparisons || [];
        
        if(allComparisons.length > 0) {
            if(statusEl) statusEl.innerText = "Connected";
            renderWatchlist();
            selectProduct(0); 
        } else {
            container.innerHTML = '<div class="trm-empty">No products found.</div>';
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

    let compPrice = null;
    let safeFloor = null;
    if (product.competitor_matches && product.competitor_matches.length > 0) {
        compPrice = product.competitor_matches[0].comp_price;
        safeFloor = product.competitor_matches[0].safe_floor;
    }
    fetchAIAdvice(product.my_product, product.my_price, product.my_cost, compPrice, safeFloor);
}

function renderChart(product) {
    if(chartInstance) chartInstance.destroy();
    const canvas = document.getElementById('terminalChart');
    if(!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // 1. Always start with YOUR price (Green)
    let labels = ['Your Price'];
    let data = [product.my_price || 0];
    let backgroundColors = ['#059669']; 
    
    const compColors = ['#E11D48', '#D97706', '#7C3AED', '#0284C7', '#F472B6', '#FBBF24'];

    // 2. Add Competitor prices (Red, Orange, etc.)
    if (product.competitor_matches && product.competitor_matches.length > 0) {
        // Limit to top 3 matches so the chart doesn't get too crowded
        const topMatches = product.competitor_matches.slice(0, 3);
        topMatches.forEach((match, i) => {
            // Create a short label like "Boandtee: Mini Shorts"
            const domain = match.comp_domain ? match.comp_domain : 'Competitor';
            let shortTitle = match.comp_title ? match.comp_title.substring(0, 15) + '...' : '';
            const label = shortTitle ? `${domain}: ${shortTitle}` : domain;
            
            labels.push(label);
            data.push(match.comp_price !== null ? match.comp_price : 0);
            backgroundColors.push(compColors[i % compColors.length]);
        });
    } else {
        labels.push('No Competitors');
        data.push(0);
        backgroundColors.push('#E4E4E7');
    }

    const chartWrap = document.querySelector('.trm-chart-wrap');
    if (chartWrap) chartWrap.style.height = '320px';

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
    const container = document.getElementById('safe-floor-content');
    if (!container) return;

    const cost = parseFloat(product.my_cost);
    if (!isNaN(cost) && cost > 0) {
        const safeFloor = cost / 0.85;
        container.innerHTML = `
            <div style="font-size: 28px; font-weight: 900; color: #059669; margin-bottom: 4px;">$${safeFloor.toFixed(2)}</div>
            <div style="font-size: 12px; color: #52525B; font-weight: 600;">Lowest price before losing money</div>
            <div style="margin-top: 16px; font-size: 12px; color: #71717A;">Your Cost (COGS): <b>$${cost.toFixed(2)}</b></div>
        `;
    } else {
        container.innerHTML = `
            <div style="font-size: 15px; font-weight: 900; color: #E11D48; margin-bottom: 8px;">COGS NOT SYNCED</div>
            <div style="font-size: 12px; color: #71717A;">Shopify has not provided a cost for this product. Please add a "Cost per item" in your Shopify admin and wait for the next sync.</div>
        `;
    }
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

    calculateSimulation(safeCost, product.my_price);
}

function calculateSimulation(cost, originalPrice) {
    const input = document.getElementById('sim-price');
    if (!input) return;
    const newPrice = parseFloat(input.value) || 0;
    const resultDiv = document.getElementById('sim-result');
    
    if (cost === null || cost === undefined || cost === 0) {
        resultDiv.innerHTML = `<span class="trm-text-red">COGS missing. Enter your cost in Shopify to simulate.</span>`;
        return;
    }

    if (newPrice === originalPrice) {
        resultDiv.innerHTML = `<span class="trm-text-muted">Drop the price below $${originalPrice} to see the volume required.</span>`;
        return;
    }

    if (newPrice > originalPrice) {
        resultDiv.innerHTML = `<span class="trm-text-green">You are raising your price. Any volume maintains higher profit.</span>`;
        return;
    }

    const originalMargin = originalPrice - cost;
    const newMargin = newPrice - cost;

    if (newMargin <= 0) {
        resultDiv.innerHTML = `<span class="trm-text-red">You are selling at a loss.</span>`;
        return;
    }

    const multiplier = originalMargin / newMargin;
    const percentIncrease = Math.round((multiplier - 1) * 100);

    resultDiv.innerHTML = `
        To make the same profit, you must sell <b class="trm-text-cyan">${multiplier.toFixed(2)}x</b> more units.<br>
        That is a <b class="trm-text-amber">${percentIncrease}% increase</b> in sales volume.
    `;
}

async function fetchAIAdvice(productName, myPrice, myCost, compPrice, safeFloor, compTitle, matchConfidence) {
    const div = document.getElementById('ai-advisor-content');
    if (!div) return;

    div.innerHTML = '<div class="trm-empty">Analyzing strategy…</div>';

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

    try {
        const url = new URL('https://api.midra.xyz/api/ai/advisor');
        url.searchParams.append('product_name', productName);
        if (myPrice !== undefined && myPrice !== null) url.searchParams.append('my_price', myPrice);
        if (myCost !== undefined && myCost !== null) url.searchParams.append('my_cost', myCost);
        if (compPrice !== undefined && compPrice !== null) url.searchParams.append('comp_price', compPrice);
        if (safeFloor !== undefined && safeFloor !== null) url.searchParams.append('safe_floor', safeFloor);
        if (compTitle !== undefined && compTitle !== null) url.searchParams.append('comp_title', compTitle);
        if (matchConfidence !== undefined && matchConfidence !== null) url.searchParams.append('match_confidence', matchConfidence);

        const res = await fetch(url.toString());
        
        if (!res.ok) {
            if (res.status === 400 || res.status === 404) {
                div.innerHTML = `<div class="trm-text-muted" style="font-size: 13px; line-height: 1.5;">No direct competitor found. Focus on your ad creatives and brand positioning to win this market.</div>`;
            } else {
                div.innerHTML = `<div class="trm-text-red">Failed to load advice. AI might be busy.</div>`;
            }
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