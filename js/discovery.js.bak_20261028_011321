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

        if (!data.market_intel || data.market_intel.length === 0) {
            container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1;">No opportunities found for this category. Try searching another niche.</div>';
            if (statusEl) statusEl.innerText = "0 Results";
            return;
        }

        if (statusEl) statusEl.innerText = "Global Data";

        // Flatten the opportunities from all returned categories
        let allOpps = [];
        data.market_intel.forEach(group => {
            if (group.opportunities) {
                allOpps = allOpps.concat(group.opportunities);
            }
        });

        if (allOpps.length === 0) {
            container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1;">No product data returned. Try again.</div>';
            return;
        }

        currentDiscoveryItems = allOpps;

        container.innerHTML = allOpps.map((opp, index) => {
            const margin = opp.retail > 0 ? ((opp.retail - opp.wholesale) / opp.retail) * 100 : 0;
            const sourceClass = opp.supplier && opp.supplier.includes('AliExpress') ? 'dsc-badge-green' : 'dsc-badge-cyan';
            const bullets = Array.isArray(opp.bullets) ? opp.bullets : [opp.reason || "High demand signal detected."];
            
            return `
                <div class="dsc-card">
                    <div class="dsc-card-top">
                        <img class="dsc-card-img" src="${dscEsc(opp.image || '')}" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
                        <div class="dsc-card-info">
                            <div class="dsc-card-title">${dscEsc(opp.name)}</div>
                            <div class="dsc-card-source">
                                <span class="dsc-badge ${sourceClass}">${dscEsc(opp.supplier || 'Estimated')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dsc-card-pricing">
                        <div class="dsc-price-group">
                            <div class="dsc-price-label">Wholesale</div>
                            <div class="dsc-price-val">$${Number(opp.wholesale).toFixed(2)}</div>
                        </div>
                        <div class="dsc-price-group">
                            <div class="dsc-price-label">Retail</div>
                            <div class="dsc-price-val dsc-text-green">$${Number(opp.retail).toFixed(2)}</div>
                        </div>
                        <div class="dsc-price-group" style="text-align: right;">
                            <div class="dsc-price-label">Margin</div>
                            <div class="dsc-badge dsc-badge-violet">${margin.toFixed(0)}%</div>
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
                price: item.retail,
                image_url: item.image,
                description: item.reason,
                product_type: "Apparel"
            })
        });

        const data = await res.json();

        if (res.ok) {
            btn.innerText = "✅ Pushed!";
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
