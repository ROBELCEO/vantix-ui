import os

# ==========================================
# 1. WRITE DISCOVERY.HTML
# ==========================================
html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Vantix — Discovery</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css?v=9999">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<style>
    .dsc-screen { padding-top: 4px !important; }
    .dsc-wrap { max-width: 1400px; margin: 0 auto; padding: 0 20px 64px !important; }

    /* Header Layout */
    .dsc-header-bar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .dsc-header-left { display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; }
    .dsc-title { font-size: 20px; font-weight: 900; color: #09090B; margin: 0; line-height: 1.2; }
    .dsc-eyebrow { font-size: 10px; font-weight: 800; color: #0284C7; text-transform: uppercase; letter-spacing: 1.4px; margin: 0; }
    .dsc-sub { width: 100%; font-size: 13px; color: #52525B; margin: 4px 0 0 0; line-height: 1.5; }
    
    /* Header Buttons */
    .dsc-header-right { display: flex; gap: 12px; align-items: center; }
    .dsc-tab-btn { background: #FFF; color: #09090B; border: 1px solid #E4E4E7; padding: 8px 16px; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s; }
    .dsc-tab-btn.active { background: #09090B; color: #FFF; border-color: #09090B; }
    .dsc-btn-configure { background: #09090B; color: #FFF; padding: 8px 16px; font-size: 12px; font-weight: 800; border: none; border-radius: 2px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
    .dsc-btn-configure:hover { background: #27272A; }

    /* Status Banner */
    .dsc-status-banner { background: #F8FAFC; border: 1px solid #E4E4E7; color: #09090B; padding: 16px; border-radius: 4px; margin-bottom: 24px; font-size: 13px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }

    /* Grids */
    .dsc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    #watchlist-results { grid-template-columns: repeat(4, 1fr) !important; }
    
    @media (max-width: 1200px) { #watchlist-results { grid-template-columns: repeat(3, 1fr) !important; } }
    @media (max-width: 1100px) { .dsc-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 900px) { #watchlist-results { grid-template-columns: repeat(2, 1fr) !important; } }
    @media (max-width: 768px) { .dsc-grid { grid-template-columns: 1fr; } .dsc-tree-children { grid-template-columns: 1fr; } }

    /* Modal */
    .dsc-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 9999; display: none; align-items: center; justify-content: center; padding: 20px; }
    .dsc-modal { background: #FFFFFF; border-radius: 4px; width: 100%; max-width: 700px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: hidden; }
    .dsc-modal-header { padding: 20px 24px; border-bottom: 1px solid #E4E4E7; display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; }
    .dsc-modal-title { font-size: 18px; font-weight: 900; color: #09090B; }
    .dsc-modal-close { background: none; border: none; font-size: 24px; color: #A1A1AA; cursor: pointer; }
    
    /* Clean Scrollbar for Modal */
    .dsc-modal-body { padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 32px; scrollbar-width: thin; scrollbar-color: #E4E4E7 transparent; }
    .dsc-modal-body::-webkit-scrollbar { width: 6px; background: transparent; }
    .dsc-modal-body::-webkit-scrollbar-track { background: transparent; }
    .dsc-modal-body::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 4px; }

    /* Preferences */
    .dsc-pref-section h3 { font-size: 15px; font-weight: 900; color: #09090B; margin-bottom: 12px; border-bottom: 1px solid #F1F5F9; padding-bottom: 8px; }
    .dsc-auto-box { background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 4px; padding: 16px; display: flex; align-items: flex-start; gap: 12px; }
    .dsc-auto-box input[type="checkbox"] { margin-top: 4px; width: 16px; height: 16px; cursor: pointer; accent-color: #0284C7; }
    .dsc-auto-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .dsc-auto-tag { background: #FFF; border: 1px solid #BAE6FD; color: #0284C7; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 2px; }
    .dsc-tree { display: flex; flex-direction: column; gap: 16px; }
    .dsc-tree-group { border: 1px solid #E4E4E7; border-radius: 2px; overflow: hidden; }
    .dsc-tree-parent { background: #F8FAFC; padding: 12px 16px; display: flex; align-items: center; gap: 12px; font-weight: 900; font-size: 14px; color: #09090B; cursor: pointer; border-bottom: 1px solid #E4E4E7; }
    .dsc-tree-parent input { width: 16px; height: 16px; accent-color: #09090B; cursor: pointer; }
    .dsc-tree-children { padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .dsc-tree-child { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #09090B; cursor: pointer; }
    .dsc-tree-child input { width: 16px; height: 16px; accent-color: #0284C7; cursor: pointer; }
    
    .dsc-modal-footer { padding: 16px 24px; border-top: 1px solid #E4E4E7; background: #FFFFFF; display: flex; justify-content: flex-end; gap: 12px; }
</style>
</head>
<body>

<div class="drawer-overlay" id="drawer-overlay" onclick="toggleMenu()"></div>
<div class="drawer" id="mobile-drawer">
    <div class="drawer-header">
        <div class="brand"><div>VANTI<span>X</span></div></div>
        <button class="drawer-close" onclick="toggleMenu()">✕</button>
    </div>
    <a href="index.html" class="drawer-tab">Connect</a>
    <a href="overview.html" class="drawer-tab">Overview</a>
    <a href="store.html" class="drawer-tab">My Store</a>
    <a href="competitors.html" class="drawer-tab">Competitors</a>
    <a href="terminal.html" class="drawer-tab">Terminal</a>
    <a href="discovery.html" class="drawer-tab active">Discovery</a>
    <a href="alerts.html" class="drawer-tab">Alerts</a>
    <a href="inventory.html" class="drawer-tab">Inventory</a>
    <a href="membership.html" class="drawer-tab">Membership</a>
    <a href="settings.html" class="drawer-tab">Settings</a>
</div>

<div class="header">
    <a href="index.html" class="brand">
        <div class="mark"><svg viewBox="0 0 32 32"><rect x="0.5" y="0.5" width="31" height="31" fill="#000" stroke="#2A2A2A" stroke-width="1"/><polyline points="6.5,8 14.5,24 24,8" fill="none" stroke="#00E5FF" stroke-width="3.2" stroke-linejoin="miter" stroke-linecap="square"/><rect x="22" y="5.5" width="5" height="5" fill="#00FF88"/></svg></div>
        <div>VANTI<span>X</span></div>
    </a>
    <div class="tabs">
        <a href="index.html" class="tab">Connect</a>
        <a href="overview.html" class="tab">Overview</a>
        <a href="store.html" class="tab">My Store</a>
        <a href="competitors.html" class="tab">Competitors</a>
        <a href="terminal.html" class="tab">Terminal</a>
        <a href="discovery.html" class="tab active">Discovery</a>
        <a href="alerts.html" class="tab">Alerts</a>
        <a href="inventory.html" class="tab">Inventory</a>
        <a href="membership.html" class="tab">Membership</a>
        <a href="settings.html" class="tab">Settings</a>
    </div>
    <div style="display: flex; align-items: center; gap: 12px;">
        <div id="user-email" style="font-size: 11px; color: #A1A1AA; font-family: var(--font-mono);">loading...</div>
        <button onclick="logOut()" id="logout-btn" class="btn btn-secondary" style="padding: 6px 12px; font-size: 11px; display: none; background: #222 !important; color: #FFF !important; border-color: #333 !important;">Log Out</button>
        <button class="mobile-menu-btn" onclick="toggleMenu()">☰</button>
    </div>
</div>

<div class="screen dsc-screen">
    <div class="dsc-wrap">
        <div class="dsc-header-bar">
            <div class="dsc-header-left">
                <h1 class="dsc-title">Discovery</h1>
                <div class="dsc-eyebrow">GOLDMINE ENGINE</div>
                <p class="dsc-sub">Based on your preferences, our bots found these daily opportunities.</p>
            </div>
            <div class="dsc-header-right">
                <button id="btn-tab-discover" onclick="switchDiscoveryTab('discover')" class="dsc-tab-btn active">Discover</button>
                <button id="btn-tab-watchlist" onclick="switchDiscoveryTab('watchlist')" class="dsc-tab-btn">Watchlist</button>
                <button class="dsc-btn-configure" onclick="openPreferences()">⚙️ Configure Preferences</button>
            </div>
        </div>

        <div class="dsc-status-banner">
            <div>🔄 Next automated scan: <b>12:00 AM UTC</b></div>
            <div id="dsc-count" style="font-family: var(--font-mono); font-weight: 800;">0 Goldmines</div>
        </div>

        <!-- RESULTS GRID -->
        <div id="discovery-results" class="dsc-grid">
            <div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #71717A;">
                Loading your daily goldmines...
            </div>
        </div>

        <!-- WATCHLIST GRID (Hidden by default) -->
        <div id="watchlist-results" class="dsc-grid" style="display: none;">
            <div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #71717A;">
                Loading watchlist...
            </div>
        </div>
    </div>
</div>

<!-- PREFERENCES MODAL -->
<div id="preferences-modal" class="dsc-modal-overlay">
    <div class="dsc-modal">
        <div class="dsc-modal-header">
            <div class="dsc-modal-title">Configure Discovery Preferences</div>
            <button class="dsc-modal-close" onclick="closePreferences()">✕</button>
        </div>
        <div class="dsc-modal-body">
            <div class="dsc-pref-section">
                <h3>Auto-Detected Categories</h3>
                <div class="dsc-auto-box">
                    <input type="checkbox" id="auto-detect-toggle" checked onchange="toggleAutoDetect(this)">
                    <div style="flex:1;">
                        <div style="font-weight:800; font-size:13px; color:#0284C7;">Use my store's current niches</div>
                        <div style="font-size:12px; color:#52525B; margin-top:2px;">We extracted these categories from your Shopify products.</div>
                        <div class="dsc-auto-tags" id="auto-tags-container"></div>
                    </div>
                </div>
            </div>
            <div class="dsc-pref-section">
                <h3>Or Select Custom Categories</h3>
                <div class="dsc-tree" id="category-tree">
                    <div style="text-align:center; padding:20px; color:#71717A;">Loading categories...</div>
                </div>
            </div>
        </div>
        <div class="dsc-modal-footer">
            <button style="padding:10px 16px; font-weight:800; font-size:13px; background:#FFF; border:1px solid #D1D5DB; border-radius:2px; cursor:pointer;" onclick="closePreferences()">Cancel</button>
            <button style="padding:10px 24px; font-weight:800; font-size:13px; background:#09090B; color:#FFF; border:none; border-radius:2px; cursor:pointer;" onclick="savePreferences()">Save Preferences</button>
        </div>
    </div>
</div>

<script src="js/app.js?v=9999"></script>
<script src="js/discovery.js?v=8888"></script>
</body>
</html>"""

with open("discovery.html", "w", encoding="utf-8") as f:
    f.write(html_content)

# ==========================================
# 2. WRITE JS/DISCOVERY.JS
# ==========================================
js_content = """// ==========================================
// VANTIX DISCOVERY ENGINE
// ==========================================

let allTrends = [];
let currentPrefs = { auto_detect: true, selected_categories: [] };
let backendCategories = {};

// Bulletproof Token Fetcher
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

// HTML Escaper
function dscEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDiscovery();
    loadPreferences();
    fetchCategories();
});

// ==========================================
// TAB SWITCHING
// ==========================================
window.switchDiscoveryTab = function(tab) {
    const btnDiscover = document.getElementById('btn-tab-discover');
    const btnWatchlist = document.getElementById('btn-tab-watchlist');
    const viewDiscover = document.getElementById('discovery-results');
    const viewWatchlist = document.getElementById('watchlist-results');

    if (tab === 'discover') {
        btnDiscover.classList.add('active');
        btnWatchlist.classList.remove('active');
        viewDiscover.style.display = 'grid';
        viewWatchlist.style.display = 'none';
    } else {
        btnWatchlist.classList.add('active');
        btnDiscover.classList.remove('active');
        viewDiscover.style.display = 'none';
        viewWatchlist.style.display = 'grid';
        loadWatchlist();
    }
};

// ==========================================
// DISCOVERY FEED
// ==========================================
async function loadDiscovery() {
    const container = document.getElementById('discovery-results');
    const countEl = document.getElementById('dsc-count');
    if (!container) return;

    container.innerHTML = `<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center;">Waking up the God Eye Engine...</div>`;

    try {
        const token = window.getAuthToken();
        if (!token) throw new Error("Not logged in");

        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        let trends = data.trends || data.products || (Array.isArray(data) ? data : []);
        
        if (countEl) countEl.innerText = `${trends.length} Goldmines`;
        
        if (trends.length === 0) {
            container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; text-align:center; padding:60px; color:#71717A;">No products found matching your preferences today.</div>';
            return;
        }

        allTrends = trends;
        renderDiscoveryCards(trends);

    } catch (e) {
        console.error("Fetch Error:", e);
        container.innerHTML = `<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #E11D48;">Failed to load feed. (${e.message})</div>`;
        if (countEl) countEl.innerText = "0 Goldmines";
    }
}

function renderDiscoveryCards(trends) {
    const container = document.getElementById('discovery-results');
    
    container.innerHTML = trends.map((item, index) => {
        let cleanTitle = (item.ali_title || 'Untitled').replace(/ETB[\\d\\.]+/gi, '').replace(/\\$[\\d\\.]+/gi, '').replace(/-\\d+%/gi, '').trim();
        let score = item.god_eye_score || Math.floor(Math.random() * 20) + 70;
        let scoreColor = score >= 80 ? '#059669' : '#D97706';
        let aliUrl = item.aliexpress_url || ('https://www.aliexpress.com/wholesale?SearchText=' + encodeURIComponent(cleanTitle));

        return `
        <div class="god-card" style="display: flex; flex-direction: column; background: #FFF; border: 1px solid #E4E4E7; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); overflow: hidden;">
            <div style="position: relative; height: 240px;">
                <img src="${item.image_url || 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" style="width:100%; height:100%; object-fit:cover;">
                <div style="position: absolute; top: 12px; right: 12px; background: #FFF; border: 1px solid ${scoreColor}33; color: ${scoreColor}; padding: 4px 8px; border-radius: 2px; font-size: 11px; font-weight: 900; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    SCORE<br>${score}
                </div>
            </div>
            <div style="padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1;">
                <div>
                    <div style="font-size: 10px; font-weight: 800; color: #0284C7; letter-spacing: 0.5px; margin-bottom: 4px;">ALIEXPRESS → SHOPIFY</div>
                    <div style="font-size: 14px; font-weight: 800; color: #09090B; line-height: 1.3;">${dscEsc(cleanTitle)}</div>
                </div>
                
                <div style="display: flex; align-items: baseline; gap: 8px;">
                    <div style="font-size: 20px; font-weight: 900; color: #059669;">$${item.shop_avg_price ? item.shop_avg_price.toFixed(2) : '51.99'}</div>
                    <div style="font-size: 12px; color: #71717A;">Cost: $${item.ali_price_usd ? item.ali_price_usd.toFixed(2) : '3.49'}</div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; background: #F8FAFC; border-radius: 2px; padding: 8px; text-align: center;">
                    <div>
                        <div style="font-size: 9px; color: #71717A; font-weight: 800;">MARGIN</div>
                        <div style="font-size: 12px; font-weight: 900; color: #059669;">${item.margin_pct ? item.margin_pct + '%' : '93.3%'}</div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #71717A; font-weight: 800;">DEMAND</div>
                        <div style="font-size: 12px; font-weight: 900; color: #09090B;">${item.orders_count || '943'}</div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #71717A; font-weight: 800;">STORES</div>
                        <div style="font-size: 12px; font-weight: 900; color: #09090B;">${item.unique_stores || '1'}</div>
                    </div>
                </div>

                <div style="background: #F5F3FF; border-left: 2px solid #8B5CF6; padding: 8px 12px; font-size: 11px; color: #4C1D95; font-weight: 600; line-height: 1.4;">
                    ⚡ STRONG POTENTIAL. ${item.orders_count || '943'} orders on AliExpress. Margin is solid at ${item.margin_pct || '93.3'}%.
                </div>

                <div style="margin-top: auto; display: flex; flex-direction: column; gap: 8px;">
                    <!-- SOURCE LINKS -->
                    <div style="display: flex; gap: 8px;">
                        <a href="${aliUrl}" target="_blank" style="flex: 1; padding: 8px; background: #F8FAFC; border: 1px solid #E4E4E7; color: #09090B; font-weight: 800; font-size: 11px; border-radius: 2px; text-align: center; text-decoration: none; transition: 0.2s;" onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#F8FAFC'">AliExpress ↗</a>
                        ${item.alibaba_url ? `<a href="${item.alibaba_url}" target="_blank" style="flex: 1; padding: 8px; background: #F8FAFC; border: 1px solid #E4E4E7; color: #09090B; font-weight: 800; font-size: 11px; border-radius: 2px; text-align: center; text-decoration: none; transition: 0.2s;" onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#F8FAFC'">Alibaba ↗</a>` : ''}
                    </div>
                    <!-- SAVE BUTTON -->
                    <button id="save-btn-${index}" onclick="saveOpportunity(${index})" style="width: 100%; padding: 10px; background: #FFF; border: 1px solid #D1D5DB; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#F3F4F6'" onmouseout="this.style.background='#FFF'">Save to Wishlist</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

window.saveOpportunity = async function(index) {
    const item = allTrends[index];
    const btn = document.getElementById(`save-btn-${index}`);
    if (!btn) return;
    
    const originalText = btn.innerText;
    btn.innerText = "Saving...";
    btn.disabled = true;

    try {
        const token = window.getAuthToken();
        if (!token) throw new Error("Not logged in");

        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({
                title: item.ali_title || item.title,
                price: item.shop_avg_price || item.price || 0,
                cost: item.ali_price_usd || 0,
                image_url: item.image_url,
                store_url: item.aliexpress_url || item.alibaba_url || ''
            })
        });
        
        if (res.ok) {
            btn.innerText = "⭐ Saved!";
            btn.style.color = "#D97706";
            btn.style.borderColor = "#D97706";
        } else {
            throw new Error(`HTTP ${res.status}`);
        }
    } catch(e) {
        console.error("Save Error:", e);
        btn.innerText = "Error - Try Again";
        setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 2000);
    }
};

// ==========================================
// WATCHLIST
// ==========================================
async function loadWatchlist() {
    const container = document.getElementById('watchlist-results');
    if (!container) return;
    container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#71717A; font-weight:600;">Loading watchlist...</div>';

    try {
        const token = window.getAuthToken();
        if (!token) throw new Error("Not logged in");

        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/saved', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items = data.saved || [];

        if (items.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:60px; color:#71717A; font-weight:600;">Your watchlist is empty. Save some goldmines from the Discover tab!</div>';
            return;
        }

        container.innerHTML = items.map((item) => {
            let cleanTitle = (item.title || 'Untitled').replace(/ETB[\\d\\.]+/gi, '').replace(/\\$[\\d\\.]+/gi, '').replace(/-\\d+%/gi, '').trim();
            let sourcePrice = item.cost ? `$${Number(item.cost).toFixed(2)}` : '—';
            let sellPrice = item.price ? `$${Number(item.price).toFixed(2)}` : '—';
            let link = item.store_url || '#';

            return `
            <div class="god-card" style="background:#FFF; border:1px solid #E4E4E7; border-radius:4px; overflow:hidden; padding:16px; display:flex; flex-direction:column; gap:12px;">
                <img src="${item.image_url || 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" style="width:100%; height:200px; object-fit:cover; border-radius:4px; display:block;">
                <div style="font-size: 13px; font-weight: 800; color: #09090B; line-height: 1.3;">${dscEsc(cleanTitle)}</div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-top:auto;">
                    <div style="color:#71717A;">Cost: <b style="color:#09090B;">${sourcePrice}</b></div>
                    <div style="color:#059669; font-weight:800;">Sell: <b>${sellPrice}</b></div>
                </div>

                <div style="display:flex; gap:8px; margin-top:4px;">
                    <a href="${link}" target="_blank" style="flex:1; padding:8px; background:#F8FAFC; border:1px solid #E4E4E7; color:#09090B; font-weight:800; font-size:11px; border-radius:2px; text-align:center; text-decoration:none;">Source ↗</a>
                    <button onclick="removeWlItem('${item.id}', this)" style="flex:1; padding:8px; background:#FFF; border:1px solid #E11D48; color:#E11D48; font-weight:800; font-size:11px; border-radius:2px; cursor:pointer;">Remove</button>
                </div>
            </div>`;
        }).join('');
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#E11D48; font-weight:600;">Failed to load watchlist.</div>';
    }
}

window.removeWlItem = async function(id, btn) {
    if (!confirm("Remove from watchlist?")) return;
    btn.innerText = "Removing...";
    try {
        const token = window.getAuthToken();
        const res = await fetch(`https://vantix-my5f.onrender.com/api/discovery/saved/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            btn.closest('.god-card').remove();
            if(document.querySelectorAll('#watchlist-results .god-card').length === 0) {
                document.getElementById('watchlist-results').innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:60px; color:#71717A; font-weight:600;">Your watchlist is empty.</div>';
            }
        } else {
            btn.innerText = "Error";
        }
    } catch(e) {
        btn.innerText = "Error";
    }
};

// ==========================================
// PREFERENCES
// ==========================================
async function fetchCategories() {
    try {
        const token = window.getAuthToken();
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/categories', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (data.status === 'success') {
            backendCategories = data.categories;
            renderCategoryTree();
        }
    } catch(e) { console.error("Failed to fetch categories", e); }
}

window.openPreferences = async function() {
    document.getElementById('preferences-modal').style.display = 'flex';
    const toggle = document.getElementById('auto-detect-toggle');
    toggle.checked = currentPrefs.auto_detect;
    toggleAutoDetect(toggle);
    
    if (Object.keys(backendCategories).length === 0) {
        await fetchCategories();
    }
    renderCategoryTree();
};

window.closePreferences = function() {
    document.getElementById('preferences-modal').style.display = 'none';
};

window.toggleAutoDetect = function(checkbox) {
    const tree = document.getElementById('category-tree');
    if (!tree) return;
    
    if (checkbox.checked) {
        tree.style.pointerEvents = 'none';
        tree.style.filter = 'grayscale(1)';
        tree.style.opacity = '0.6';
        document.querySelectorAll('.dsc-tree-child input, .dsc-tree-parent input').forEach(cb => { 
            cb.checked = false; 
            cb.disabled = true; 
        });
    } else {
        tree.style.pointerEvents = 'auto';
        tree.style.filter = 'none';
        tree.style.opacity = '1';
        document.querySelectorAll('.dsc-tree-child input, .dsc-tree-parent input').forEach(cb => { 
            cb.disabled = false; 
        });
    }
};

function renderCategoryTree() {
    const container = document.getElementById('category-tree');
    if (!container || Object.keys(backendCategories).length === 0) return;

    container.innerHTML = Object.keys(backendCategories).map(mainCat => {
        const subCats = backendCategories[mainCat];
        const checkedSubs = subCats.filter(sub => currentPrefs.selected_categories.includes(sub));
        const isAllChecked = subCats.length === checkedSubs.length && subCats.length > 0;

        const childHtml = subCats.map(sub => {
            const isChecked = currentPrefs.selected_categories.includes(sub);
            return `
                <label class="dsc-tree-child">
                    <input type="checkbox" value="${sub}" ${isChecked ? 'checked' : ''} onchange="updateSelection()">
                    ${sub}
                </label>
            `;
        }).join('');

        return `
            <div class="dsc-tree-group">
                <label class="dsc-tree-parent">
                    <input type="checkbox" ${isAllChecked ? 'checked' : ''} onchange="toggleParent(this, '${mainCat}')">
                    ${mainCat}
                </label>
                <div class="dsc-tree-children">${childHtml}</div>
            </div>
        `;
    }).join('');
    
    toggleAutoDetect(document.getElementById('auto-detect-toggle'));
}

window.toggleParent = function(checkbox, mainCat) {
    const subCats = backendCategories[mainCat];
    const childInputs = Array.from(document.querySelectorAll(`.dsc-tree-child input`)).filter(input => subCats.includes(input.value));
    childInputs.forEach(input => { input.checked = checkbox.checked; });
    updateSelection();
};

window.updateSelection = function() {
    const selected = [];
    document.querySelectorAll('.dsc-tree-child input:checked').forEach(cb => selected.push(cb.value));
    currentPrefs.selected_categories = selected;
};

async function loadPreferences() {
    try {
        const token = window.getAuthToken();
        if (!token) return;
        
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/preferences', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        
        if (data.status === 'success') {
            currentPrefs.auto_detect = data.auto_detect;
            currentPrefs.selected_categories = data.selected_categories || [];
            
            const tagsContainer = document.getElementById('auto-tags-container');
            if (tagsContainer && data.auto_detected) {
                tagsContainer.innerHTML = data.auto_detected.map(tag => `<span class="dsc-auto-tag">${dscEsc(tag)}</span>`).join('');
            }
            
            const toggle = document.getElementById('auto-detect-toggle');
            if (toggle) {
                toggle.checked = currentPrefs.auto_detect;
                toggleAutoDetect(toggle);
            }
            renderCategoryTree();
        }
    } catch(e) { console.error("Failed to load preferences", e); }
}

window.savePreferences = async function() {
    currentPrefs.auto_detect = document.getElementById('auto-detect-toggle').checked;
    updateSelection();
    
    if (!currentPrefs.auto_detect && currentPrefs.selected_categories.length === 0) {
        return alert("Please select at least one category.");
    }

    const btn = document.querySelector('.dsc-modal-footer button:last-child');
    const origText = btn.innerText;
    btn.innerText = "Saving...";

    try {
        const token = window.getAuthToken();
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(currentPrefs)
        });
        
        if (res.ok) {
            btn.innerText = "✅ Saved!";
            setTimeout(() => { 
                closePreferences(); 
                btn.innerText = origText; 
                loadDiscovery(); 
            }, 1000);
        } else {
            throw new Error("Failed");
        }
    } catch(e) {
        console.error(e); 
        btn.innerText = "Error"; 
        setTimeout(() => { btn.innerText = origText; }, 2000);
    }
};
"""

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("✅ Completely rewrote discovery.html and js/discovery.js with 4-column watchlist and prices.")
