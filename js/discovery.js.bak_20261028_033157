let currentDiscoveryItems = [];

function dscEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
}

async function loadDiscovery(category = '') {
    const container = document.getElementById('discovery-container');
    const statusEl = document.getElementById('dsc-status');
    if (!container) return;

    container.innerHTML = `
        <div class="dsc-empty" style="grid-column: 1 / -1;">
            <div class="dsc-spinner"></div>
            Searching global Shopify catalog for <b>${dscEsc(category) || 'your niche'}</b>…
        </div>
    `;
    if (statusEl) statusEl.innerText = "Scanning…";

    try {
        const url = category 
            ? `https://vantix-my5f.onrender.com/api/discovery/trends?category=${encodeURIComponent(category)}`
            : 'https://vantix-my5f.onrender.com/api/discovery/trends';
            
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            container.innerHTML = `<div class="dsc-empty dsc-text-red" style="grid-column: 1 / -1;">${dscEsc(data.error)}</div>`;
            if (statusEl) statusEl.innerText = "Error";
            return;
        }

        // The backend returns a flat array inside data.market_intel
        if (!data.market_intel || data.market_intel.length === 0) {
            container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1;">No opportunities found for this category. Try searching another niche.</div>';
            if (statusEl) statusEl.innerText = "0 Results";
            return;
        }

        if (statusEl) statusEl.innerText = "Global Data";
        currentDiscoveryItems = data.market_intel;

        container.innerHTML = currentDiscoveryItems.map((opp, index) => {
            // Map exactly to the backend fields
            const price = Number(opp.price || 0);
            const rating = Number(opp.rating || 0);
            const reviewCount = Number(opp.review_count || 0);
            const bullets = Array.isArray(opp.bullets) ? opp.bullets : ["High demand signal detected."];
            
            // Since the backend doesn't send "supplier", we default to "GLOBAL CATALOG"
            const sourceBadge = `<span class="dsc-badge dsc-badge-cyan">GLOBAL CATALOG</span>`;
            
            return `
                <div class="dsc-card">
                    <div class="dsc-card-top">
                        <img class="dsc-card-img" src="${dscEsc(opp.image || '')}" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
                        <div class="dsc-card-info">
                            <div class="dsc-card-title">${dscEsc(opp.name)}</div>
                            <div class="dsc-card-source">
                                ${sourceBadge}
                            </div>
                        </div>
                    </div>
                    
                    <div class="dsc-card-pricing" style="justify-content: space-between; align-items: center;">
                        <div class="dsc-price-group">
                            <div class="dsc-price-label">Price</div>
                            <div class="dsc-price-val dsc-text-green">$${price.toFixed(2)}</div>
                        </div>
                        <div class="dsc-price-group" style="text-align: right;">
                            <div class="dsc-price-label">Rating</div>
                            <div class="dsc-price-val" style="color: var(--ov-amber); font-size: 12px;">
                                ★ ${rating.toFixed(1)} <span style="color: var(--ov-muted); font-size: 10px;">(${reviewCount})</span>
                            </div>
                        </div>
                    </div>

                    <div class="dsc-card-reason">
                        <div class="dsc-reason-label">⚡ AI Goldmine Signals</div>
                        <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: var(--ov-text2); line-height: 1.4;">
                            ${bullets.map(b => `<li>${dscEsc(b)}</li>`).join('')}
                        </ul>
                    </div>

                    <button onclick="pushToShopify(${index}, this)" class="dsc-push-btn">
                        🚀 Push to Shopify
                    </button>
                </div>
            `;
        }).join('');

    } catch(e) {
        console.error(e);
        container.innerHTML = '<div class="dsc-empty dsc-text-red" style="grid-column: 1 / -1;">Network error. Failed to fetch discovery data.</div>';
        if (statusEl) statusEl.innerText = "Offline";
    }
}

function switchCategory(category, pillEl) {
    document.querySelectorAll('.dsc-pill').forEach(p => p.classList.remove('active'));
    if (pillEl) pillEl.classList.add('active');
    loadDiscovery(category);
}

function triggerSearch() {
    const input = document.getElementById('dsc-search-input');
    if (!input) return;
    const query = input.value.trim();
    if (!query) return;
    
    document.querySelectorAll('.dsc-pill').forEach(p => p.classList.remove('active'));
    loadDiscovery(query);
}

function handleSearch(e) {
    if (e.key === 'Enter') triggerSearch();
}

async function pushToShopify(index, btn) {
    const item = currentDiscoveryItems[index];
    if (!item) return;

    btn.innerText = "Pushing...";
    btn.disabled = true;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/push-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: item.name,
                price: Number(item.price),
                image_url: item.image,
                description: item.bullets ? item.bullets.join(". ") : "",
                product_type: "Apparel"
            })
        });

        const data = await res.json();

        if (res.ok) {
            btn.innerText = "✅ Pushed to Shopify!";
            btn.style.background = "var(--ov-green)";
            btn.style.color = "#000";
        } else {
            throw new Error(data.detail || "Unknown error");
        }
    } catch(e) {
        console.error("Push error:", e);
        btn.innerText = "❌ Error";
        btn.style.background = "var(--ov-red)";
        btn.style.color = "#fff";

        setTimeout(() => {
            btn.innerText = "🚀 Push to Shopify";
            btn.style.background = "var(--ov-cyan)";
            btn.style.color = "#000";
            btn.disabled = false;
        }, 3000);
    }
}
