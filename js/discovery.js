let allTrends = [];

function dscEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

// --- LOAD THE DAILY RESULTS ---
async function loadDiscovery() {
    const container = document.getElementById('discovery-results');
    const countEl = document.getElementById('dsc-count');
    if (!container) return;

    try {
        // Fetch from your backend proxy (which calls the Cloudflare Worker)
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends');
        if (!res.ok) throw new Error("Failed to connect to API");

        const data = await res.json();
        allTrends = data;

        if (countEl) countEl.innerText = `${allTrends.length} Goldmines`;
        renderDiscoveryCards(allTrends);

    } catch (e) {
        console.error("Fetch Error:", e);
        container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #E11D48;">Network error. Failed to load daily goldmines.</div>';
    }
}

function renderDiscoveryCards(trends) {
    const container = document.getElementById('discovery-results');
    
    if (!trends || trends.length === 0) {
        container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #71717A;">No goldmines found yet. Check back after the next scan.</div>';
        return;
    }

    container.innerHTML = trends.slice(0, 30).map((item, index) => {
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
            insight = `🔥 GOLDMINE. Sourced for ${supplierPrice} and retailing at ${retailPrice}. Only ${competition} Shopify stores found.`;
        } else if (score >= 70) {
            insight = `⚡ STRONG POTENTIAL. ${demand} orders on AliExpress. Margin is solid at ${margin}.`;
        } else {
            insight = `⚠️ SATURATED. ${competition} Shopify stores found. Margin is ${margin}.`;
        }

        return `
            <div class="god-card">
                <div class="god-card-top">
                    <div style="width:60px; height:60px; background:#F4F4F5; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:20px; border:1px solid #E4E4E7; flex-shrink:0;">👁️</div>
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:9px; font-weight:800; color:#0284C7; letter-spacing:0.5px;">ALIEXPRESS → SHOPIFY</div>
                        <div style="font-size:14px; font-weight:900; color:#09090B; line-height:1.2; margin:4px 0;">${dscEsc(title)}</div>
                        <div style="font-size:14px; font-weight:800; color:#09090B; font-family:var(--font-mono);">${retailPrice} <span style="font-size:11px; color:#A1A1AA; text-decoration:line-through;">${supplierPrice}</span></div>
                    </div>
                </div>

                <div style="display:flex; gap:12px; margin:16px 0;">
                    <div style="flex:1; background:${scoreBg}; border:1px solid ${scoreColor}40; border-radius:2px; padding:12px; text-align:center;">
                        <div style="font-size:9px; font-weight:800; color:${scoreColor};">SCORE</div>
                        <div style="font-size:24px; font-weight:900; color:${scoreColor}; font-family:var(--font-mono);">${score}</div>
                    </div>
                    <div style="flex:1.5; display:flex; flex-direction:column; justify-content:center; font-size:11px; color:#52525B; gap:6px;">
                        <div style="display:flex; justify-content:space-between;"><span>Margin:</span> <b style="color:#059669;">${margin}</b></div>
                        <div style="display:flex; justify-content:space-between;"><span>Demand:</span> <b>${demand} sold</b></div>
                        <div style="display:flex; justify-content:space-between;"><span>Comp:</span> <b style="color:${competition < 3 ? '#059669' : '#E11D48'};">${competition} stores</b></div>
                    </div>
                </div>

                <div style="background:#F5F3FF; border-left:3px solid #7C3AED; padding:10px; font-size:11px; color:#3F3F46; border-radius:2px; margin-bottom:16px;">
                    ${dscEsc(insight)}
                </div>

                <div style="display:flex; gap:8px;">
                    <button onclick="saveOpportunity(${index})" style="flex:1; padding:8px; background:#FFF; border:1px solid #D1D5DB; font-weight:800; font-size:11px; border-radius:2px; cursor:pointer;">Save</button>
                    <button onclick="pushToShopify(${index})" style="flex:1; padding:8px; background:#09090B; color:#FFF; border:none; font-weight:800; font-size:11px; border-radius:2px; cursor:pointer;">Push to Shopify</button>
                </div>
            </div>
        `;
    }).join('');
}

// --- PREFERENCES LOGIC ---
function toggleAutoDetect(el) {
    const toggle = document.getElementById('auto-detect-toggle');
    toggle.classList.toggle('active');
    
    const input = document.getElementById('custom-niches');
    if (toggle.classList.contains('active')) {
        input.disabled = true;
        input.style.opacity = '0.5';
        input.value = '';
    } else {
        input.disabled = false;
        input.style.opacity = '1';
    }
}

async function savePreferences() {
    const isAutoDetect = document.getElementById('auto-detect-toggle').classList.contains('active');
    const customNiches = document.getElementById('custom-niches').value;
    
    // In a full build, you would save this to Supabase (e.g. users table)
    console.log("Saving Preferences:", { autoDetect: isAutoDetect, niches: customNiches });
    
    const btn = document.querySelector('.dsc-save-btn');
    const originalText = btn.innerText;
    btn.innerText = "Saving...";
    
    setTimeout(() => {
        btn.innerText = "✅ Saved!";
        btn.style.background = "#059669";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "#09090B";
        }, 2000);
    }, 800);
}

async function pushToShopify(index) {
    alert("Push to Shopify integration coming soon!");
}

async function saveOpportunity(index) {
    alert("Saved to Wishlist!");
}

document.addEventListener('DOMContentLoaded', () => {
    loadDiscovery();
});
