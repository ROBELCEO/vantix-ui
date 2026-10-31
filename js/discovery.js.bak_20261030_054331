function dscEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

function dscMoney(val) {
    if (val === null || val === undefined || isNaN(val)) return "—";
    return "$" + Number(val).toFixed(2);
}

let currentDiscoveryItems = [];

// --- PAYWALL LOGIC ---
let _dscTierPromise = null;
function ensureDscTier() {
    if (window.dscTier) return Promise.resolve(window.dscTier);
    if (_dscTierPromise) return _dscTierPromise;
    _dscTierPromise = fetch('https://vantix-my5f.onrender.com/api/auth/status')
        .then(r => r.ok ? r.json() : { plan: 'trial' })
        .then(d => {
            window.dscTier = d.plan || 'trial';
            return window.dscTier;
        })
        .catch(() => {
            window.dscTier = 'trial';
            return window.dscTier;
        });
    return _dscTierPromise;
}

function applyDiscoveryLock() {
    if (document.getElementById('dsc-paywall-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'dsc-paywall-overlay';
    overlay.style.cssText = "position: fixed; top: 56px; left: 0; right: 0; bottom: 0; z-index: 9999; backdrop-filter: blur(8px); background: rgba(248, 250, 252, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center;";
    
    overlay.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
        <div style="font-weight: 900; font-size: 24px; color: #09090B; margin-bottom: 8px;">Unlock Global Discovery</div>
        <div style="font-size: 15px; color: #52525B; max-width: 400px; text-align: center; margin-bottom: 24px; line-height: 1.5;">Instantly search 1,000,000+ winning products across the global Shopify catalog and push them to your store in 1-click.</div>
        <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 12px 24px; border-radius: 2px; text-decoration: none; font-size: 14px; font-weight: 800;">Upgrade to Pro →</a>
    `;
    
    document.body.appendChild(overlay);
}

// --- SEARCH LOGIC ---
async function performSearch() {
    const tier = await ensureDscTier();
    if (tier === 'starter') {
        applyDiscoveryLock();
        return;
    }

    const categoryInput = document.getElementById('dsc-category');
    const category = categoryInput ? categoryInput.value.trim() : "";
    const container = document.getElementById('discovery-results');
    const statusEl = document.getElementById('dsc-status');
    const countEl = document.getElementById('dsc-count');

    if (!container) return;

    container.innerHTML = `
        <div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px;">
            <div class="dsc-spinner"></div>
            Searching global Shopify catalog for <b>${dscEsc(category) || 'your niche'}</b>…
        </div>
    `;
    if (statusEl) statusEl.innerText = "Scanning…";
    if (countEl) countEl.innerText = "0 Results";

    try {
        const url = category 
            ? `https://vantix-my5f.onrender.com/api/discovery/trends?category=${encodeURIComponent(category)}`
            : `https://vantix-my5f.onrender.com/api/discovery/trends`;
            
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        const items = data.opportunities || data.market_intel || [];
        currentDiscoveryItems = items;

        if (countEl) countEl.innerText = `${items.length} Results`;
        if (statusEl) statusEl.innerText = "Ready";

        if (items.length === 0) {
            container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px;">No opportunities found for this category. Try searching another niche.</div>';
            return;
        }

        container.innerHTML = items.map((item, index) => {
            const sourceBadge = item.source === "ai" 
                ? '<div class="dsc-badge dsc-badge-violet">AI ANALYZED</div>' 
                : '<div class="dsc-badge dsc-badge-amber">FALLBACK SIGNALS</div>';
                
            return `
                <div class="dsc-card">
                    <div class="dsc-card-img-wrap">
                        <img src="${dscEsc(item.image || 'https://via.placeholder.com/200')}" class="dsc-card-img">
                    </div>
                    <div class="dsc-card-body">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                            <div>
                                <div class="dsc-card-title">${dscEsc(item.title || 'Untitled Product')}</div>
                                <div class="dsc-card-store">${dscEsc(item.store || 'Shopify Store')}</div>
                            </div>
                            ${sourceBadge}
                        </div>
                        <div class="dsc-card-price">${dscMoney(item.price)}</div>
                        <button onclick="pushToShopify(${index}, this)" class="dsc-push-btn">🚀 Push to Shopify</button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (e) {
        console.error(e);
        container.innerHTML = '<div class="dsc-empty dsc-text-red" style="grid-column: 1 / -1; padding: 60px;">Network error. Failed to fetch discovery data.</div>';
        if (statusEl) statusEl.innerText = "Offline";
    }
}

// --- PUSH TO SHOPIFY ---
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
                title: item.title,
                price: item.price,
                image: item.image,
                store_url: item.store_url || item.url
            })
        });

        if (res.ok) {
            btn.innerText = "✅ Pushed to Shopify!";
            btn.style.background = "#059669";
            btn.style.color = "#FFFFFF";
        } else {
            throw new Error("Failed to push");
        }
    } catch(e) {
        console.error("Push error:", e);
        btn.innerText = "❌ Error";
        btn.style.background = "#E11D48";
        btn.style.color = "#FFFFFF";
        setTimeout(() => {
            btn.innerText = "🚀 Push to Shopify";
            btn.style.background = "#0284C7";
            btn.style.color = "#FFFFFF";
            btn.disabled = false;
        }, 3000);
    }
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', async () => {
    const tier = await ensureDscTier();
    if (tier === 'starter') {
        applyDiscoveryLock();
    }
});

// Expose to HTML
window.performSearch = performSearch;
window.pushToShopify = pushToShopify;
