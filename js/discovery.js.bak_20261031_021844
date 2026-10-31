let allTrends = [];

function dscEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

async function loadDiscovery() {
    console.log("VANTIX GOD EYE V3 LOADED");
    const container = document.getElementById('discovery-results');
    const statusEl = document.getElementById('dsc-status');
    const countEl = document.getElementById('dsc-count');

    if (!container) return;

    container.innerHTML = `
        <div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px;">
            <div class="dsc-spinner"></div>
            Connecting to the God Eye Engine (Cloudflare Edge)…
        </div>
    `;
    if (statusEl) statusEl.innerText = "Scanning…";
    if (countEl) countEl.innerText = "0 Results";

    try {
        const res = await fetch('https://vantix-api.vantix-trends-api.workers.dev');
        if (!res.ok) throw new Error("Failed to connect to API");

        const data = await res.json();
        allTrends = data;

        if (countEl) countEl.innerText = `${allTrends.length} Goldmines`;
        if (statusEl) statusEl.innerText = "Ready";

        renderDiscoveryCards(allTrends);

    } catch (e) {
        console.error("Fetch Error:", e);
        container.innerHTML = '<div class="dsc-empty dsc-text-red" style="grid-column: 1 / -1; padding: 60px;">Network error. Failed to fetch from Cloudflare Worker.</div>';
        if (statusEl) statusEl.innerText = "Offline";
    }
}

function renderDiscoveryCards(trends) {
    const container = document.getElementById('discovery-results');
    
    if (!trends || trends.length === 0) {
        container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px;">No goldmines found yet. Check back tomorrow.</div>';
        return;
    }

    container.innerHTML = trends.map((item, index) => {
        const score = Number(item.god_eye_score) || 0;
        const scoreColor = score >= 85 ? "#059669" : (score >= 70 ? "#D97706" : "#E11D48");
        const scoreBg = score >= 85 ? "#ECFDF5" : (score >= 70 ? "#FFFBEB" : "#FFF1F2");
        
        const title = item.ali_title || "Unknown Product";
        const supplierPrice = Number(item.ali_price_usd) ? `$${Number(item.ali_price_usd).toFixed(2)}` : "$0.00";
        const retailPrice = Number(item.shop_avg_price) ? `$${Number(item.shop_avg_price).toFixed(2)}` : "$0.00";
        const margin = Number(item.margin_pct) ? `${Number(item.margin_pct).toFixed(1)}%` : "0%";
        const demand = Number(item.orders_count) || 0;
        const competition = Number(item.unique_stores) || 1;
        
        let insight = "";
        if (score >= 85) {
            insight = `🔥 GOLDMINE. Sourced for ${supplierPrice} and retailing at ${retailPrice}. Only ${competition} Shopify stores found. Move fast.`;
        } else if (score >= 70) {
            insight = `⚡ STRONG POTENTIAL. ${demand} orders on AliExpress. Margin is solid at ${margin}.`;
        } else {
            insight = `⚠️ SATURATED. ${competition} Shopify stores found. Margin is ${margin}. Proceed with caution.`;
        }

        return `
            <div class="god-card">
                
                <!-- Top: Title & Source -->
                <div class="god-card-top">
                    <div style="width:70px; height:70px; background:#F4F4F5; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:24px; border:1px solid #E4E4E7; flex-shrink:0;">
                        👁️
                    </div>
                    <div style="flex:1; min-width:0;">
                        <div class="god-source" style="color:#0284C7;">ALIEXPRESS → SHOPIFY</div>
                        <div class="god-title">${dscEsc(title)}</div>
                        <div class="god-price-row">
                            <span class="god-retail">${retailPrice}</span>
                            <span class="god-supplier">Cost: ${supplierPrice}</span>
                        </div>
                    </div>
                </div>

                <!-- Middle: Intelligence Grid -->
                <div class="god-intel">
                    <div class="god-score-box" style="background:${scoreBg}; border-color:${scoreColor}40;">
                        <div class="god-score-label" style="color:${scoreColor};">GOD EYE SCORE</div>
                        <div class="god-score-value" style="color:${scoreColor};">${score}<span style="font-size:14px; opacity:0.5;">/100</span></div>
                    </div>
                    <div class="god-stats">
                        <div class="god-stat"><span>Margin:</span> <b style="color:#059669;">${margin}</b></div>
                        <div class="god-stat"><span>Demand:</span> <b>${demand.toLocaleString()} sold</b></div>
                        <div class="god-stat"><span>Comp:</span> <b style="color:${competition < 3 ? '#059669' : '#E11D48'};">${competition} store(s)</b></div>
                    </div>
                </div>

                <!-- AI Insight -->
                <div class="god-insight">
                    <div style="font-size:10px; font-weight:800; color:#7C3AED; margin-bottom:4px; letter-spacing:0.5px;">🧠 VANTIX ANALYSIS</div>
                    <div style="color:#3F3F46; line-height:1.4;">${dscEsc(insight)}</div>
                </div>

                <!-- Actions -->
                <div class="god-actions">
                    <button onclick="saveOpportunity(${index}, this)" class="god-btn god-btn-save">Save</button>
                    <button onclick="pushToShopify(${index}, this)" class="god-btn god-btn-push">Push to Shopify</button>
                </div>

            </div>
        `;
    }).join('');
}

function performSearch() {
    const input = document.querySelector('input[placeholder*="niche"]');
    const query = input ? input.value.trim().toLowerCase() : "";
    
    if (!query) {
        renderDiscoveryCards(allTrends);
        return;
    }

    const filtered = allTrends.filter(t => 
        t.ali_title && t.ali_title.toLowerCase().includes(query)
    );
    
    renderDiscoveryCards(filtered);
}

async function pushToShopify(index, btn) {
    alert("Push to Shopify integration coming soon!");
}

async function saveOpportunity(index, btn) {
    alert("Saved to Wishlist!");
}

document.addEventListener('DOMContentLoaded', () => {
    loadDiscovery();
});

window.performSearch = performSearch;
window.pushToShopify = pushToShopify;
window.saveOpportunity = saveOpportunity;
