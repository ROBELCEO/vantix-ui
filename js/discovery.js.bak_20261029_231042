window.dscTier = 'trial';
fetch('https://vantix-my5f.onrender.com/api/auth/status')
    .then(r => r.json())
    .then(d => {
        window.dscTier = d.plan || 'trial';
        if (window.dscTier === 'starter') applyDscLock();
    })
    .catch(() => {
        window.dscTier = 'trial';
        applyDscLock();
    });

function applyDscLock() {
    // Disable Input
    const input = document.querySelector('input[placeholder*="niche"]');
    if (input) { input.disabled = true; input.placeholder = "🔒 Pro Feature - Upgrade to unlock global search"; }
    
    // Disable Buttons
    const btns = document.querySelectorAll('button');
    btns.forEach(b => {
        if (b.innerText.includes('Search') || b.innerText.includes('Auto-Detect') || ['Jeans', 'Shorts', 'Activewear', 'Shoes', 'Bags'].includes(b.innerText)) {
            b.disabled = true;
            if (b.innerText === 'Search') {
                b.innerText = "🔒 Pro";
                b.style.background = "#A1A1AA";
            } else {
                b.style.opacity = '0.5';
            }
        }
    });
    
    // Apply Blur Overlay
    const results = document.getElementById('discovery-results');
    if (results) {
        results.style.position = 'relative';
        results.style.minHeight = '300px';
        results.innerHTML = `
            <div style="position:absolute; inset:0; z-index:10; backdrop-filter:blur(4px); background:rgba(255,255,255,0.85); display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:4px;">
                <div style="font-size:24px; margin-bottom:8px;">🔒</div>
                <div style="font-weight:800; font-size:16px; color:#09090B; margin-bottom:8px;">Pro Feature</div>
                <a href="membership.html" style="background:#0284C7; color:#FFF; padding:6px 12px; border-radius:2px; text-decoration:none; font-size:11px; font-weight:800;">Upgrade to Pro</a>
            </div>
        `;
    }
}
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
    // 1. Blur the results container if it exists
    const resultsContainer = document.getElementById('discovery-results');
    if (resultsContainer) {
        resultsContainer.style.position = 'relative';
        resultsContainer.style.minHeight = '400px';
        resultsContainer.innerHTML = `
            <div style="position:absolute; inset:0; z-index:10; backdrop-filter:blur(6px); background:rgba(255,255,255,0.85); display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:4px; text-align:center; padding: 24px;">
                <div style="font-size:32px; margin-bottom:12px;">🔒</div>
                <div style="font-weight:900; font-size:20px; color:#09090B; margin-bottom:8px;">Unlock Global Discovery</div>
                <div style="font-size:14px; color:#52525B; max-width:400px; margin-bottom:16px;">Instantly search 1,000,000+ winning products across the global Shopify catalog and push them to your store in 1-click.</div>
                <a href="membership.html" style="background:#0284C7; color:#FFF; padding:10px 20px; border-radius:2px; text-decoration:none; font-size:14px; font-weight:800;">Upgrade to Pro →</a>
            </div>
            <div style="opacity: 0.1; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; pointer-events: none;">
                <div style="height: 200px; background: #E4E4E7; border-radius: 4px;"></div>
                <div style="height: 200px; background: #E4E4E7; border-radius: 4px;"></div>
                <div style="height: 200px; background: #E4E4E7; border-radius: 4px;"></div>
            </div>
        `;
    }

    // 2. Disable the search button
    const searchBtn = document.querySelector('.dsc-search-btn') || document.querySelector('button[onclick*="performSearch"]');
    if (searchBtn) {
        searchBtn.disabled = true;
        searchBtn.innerText = "🔒 Pro Feature";
        searchBtn.style.background = "#A1A1AA";
    }
}
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
        currentDiscoveryItems = data.market_intel;

        container.innerHTML = currentDiscoveryItems.map((opp, index) => {
            const price = Number(opp.price || 0);
            const rating = Number(opp.rating || 0);
            const reviewCount = Number(opp.review_count || 0);
            const bullets = Array.isArray(opp.bullets) ? opp.bullets : ["High demand signal detected."];

            const sourceBadge = `<span class="dsc-badge dsc-badge-cyan">GLOBAL</span>`;
            const bulletSourceBadge = opp.bullet_source === 'ai'
                ? `<span class="dsc-badge dsc-badge-violet">AI ANALYZED</span>`
                : `<span class="dsc-badge dsc-badge-amber">FALLBACK SIGNALS</span>`;

            return `
                <div class="dsc-card">
                    <div class="dsc-card-top">
                        <img class="dsc-card-img" src="${dscEsc(opp.image || '')}" onerror="this.src='https://via.placeholder.com/100?text=No+Image'">
                        <div class="dsc-card-info">
                            <div class="dsc-card-title">${dscEsc(opp.name)}</div>
                            <div class="dsc-card-source">
                                ${sourceBadge}
                                ${bulletSourceBadge}
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
                            <div class="dsc-price-val" style="color: #D97706; font-size: 12px;">
                                ★ ${rating.toFixed(1)} <span style="color: #9CA3AF; font-size: 10px;">(${reviewCount})</span>
                            </div>
                        </div>
                    </div>

                    <div class="dsc-card-reason">
                        <div class="dsc-reason-label">⚡ Signals</div>
                        <ul style="margin: 0; padding-left: 16px; font-size: 11px; color: #4B5563; line-height: 1.4;">
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
            btn.style.background = "#059669";
            btn.style.color = "#FFFFFF";
        } else {
            throw new Error(data.detail || "Unknown error");
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


document.addEventListener('DOMContentLoaded', () => {
    ensureDscTier().then(tier => {
        if (tier === 'starter') applyDiscoveryLock();
    });
});

