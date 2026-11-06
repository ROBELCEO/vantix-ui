import re

with open("js/discovery.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Remove the old watchlist logic safely
marker = "// ==========================================\n// WATCHLIST TAB LOGIC INSIDE DISCOVERY\n// =========================================="
if marker in code:
    code = code.split(marker)[0]
    print("✅ Removed old watchlist injection.")

# 2. Force Discovery cards to be taller
code = code.replace(
    '<div class="god-card-top">',
    '<div class="god-card-top" style="height: 400px !important; min-height: 400px !important;">'
)

# 3. Append the new logic with hardcoded 4 columns and 400px images
addition = """

// ==========================================
// WATCHLIST TAB LOGIC INSIDE DISCOVERY
// ==========================================

function injectWishlistTabs() {
    if (document.getElementById('wl-tabs-container')) return;
    
    const headerBar = document.querySelector('.dsc-header-bar');
    const configBtn = headerBar ? headerBar.querySelector('.dsc-btn-configure') : null;
    const container = document.getElementById('discovery-results');
    
    if (!headerBar || !configBtn || !container) return;

    // Create the tab bar
    const tabBar = document.createElement('div');
    tabBar.id = 'wl-tabs-container';
    tabBar.style.cssText = 'display:flex; gap:8px; align-items:center;';
    tabBar.innerHTML = `
        <button id="btn-tab-discover" onclick="switchDiscoveryTab('discover')" style="background:#09090B; color:#FFF; border:1px solid #09090B; padding:10px 16px; font-weight:800; font-size:13px; border-radius:2px; cursor:pointer; transition:0.2s;">Discover</button>
        <button id="btn-tab-watchlist" onclick="switchDiscoveryTab('watchlist')" style="background:#FFF; color:#09090B; border:1px solid #E4E4E7; padding:10px 16px; font-weight:800; font-size:13px; border-radius:2px; cursor:pointer; transition:0.2s;">Watchlist</button>
    `;

    // Group them tightly with the Configure Preferences button
    const rightWrap = document.createElement('div');
    rightWrap.style.cssText = 'display:flex; gap:12px; align-items:center;';
    configBtn.parentNode.insertBefore(rightWrap, configBtn);
    rightWrap.appendChild(tabBar);
    rightWrap.appendChild(configBtn);

    // Create the watchlist container with hardcoded 4 columns
    const wlContainer = document.createElement('div');
    wlContainer.id = 'watchlist-results';
    wlContainer.style.cssText = 'display: none; grid-template-columns: repeat(4, 1fr) !important; gap: 20px; grid-column: 1 / -1; width: 100%; margin-top: 20px;';
    
    container.parentNode.insertBefore(wlContainer, container.nextSibling);
}

window.switchDiscoveryTab = function(tab) {
    const btnDiscover = document.getElementById('btn-tab-discover');
    const btnWatchlist = document.getElementById('btn-tab-watchlist');
    const viewDiscover = document.getElementById('discovery-results');
    const viewWatchlist = document.getElementById('watchlist-results');

    if (tab === 'discover') {
        btnDiscover.style.background = '#09090B'; btnDiscover.style.color = '#FFF';
        btnWatchlist.style.background = '#FFF'; btnWatchlist.style.color = '#09090B';
        viewDiscover.style.display = 'grid'; viewWatchlist.style.display = 'none';
    } else {
        btnWatchlist.style.background = '#09090B'; btnWatchlist.style.color = '#FFF';
        btnDiscover.style.background = '#FFF'; btnDiscover.style.color = '#09090B';
        viewDiscover.style.display = 'none'; viewWatchlist.style.display = 'grid';
        loadWatchlist();
    }
};

async function loadWatchlist() {
    const container = document.getElementById('watchlist-results');
    container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#71717A; font-weight:600;">Loading watchlist...</div>';
    
    try {
        const authKey = Object.keys(localStorage).find(k => k.includes('auth-token'));
        if (!authKey) throw new Error("Not logged in");
        const token = JSON.parse(localStorage.getItem(authKey)).access_token;

        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/saved', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        const items = data.saved || [];

        if (items.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:60px; color:#71717A; font-weight:600;">Your watchlist is empty. Save some goldmines from the Discover tab!</div>';
            return;
        }

        container.innerHTML = items.map(item => {
            let cleanTitle = (item.title || 'Untitled').replace(/ETB[\\d\\.]+/gi, '').replace(/\\$[\\d\\.]+/gi, '').replace(/-\\d+%/gi, '').trim();
            return `
            <div class="god-card" style="background:#FFF; border:1px solid #E4E4E7; border-radius:4px; overflow:hidden; padding:16px; display:flex; flex-direction:column; gap:12px;">
                <!-- FORCED 400PX HEIGHT -->
                <img src="${item.image_url || 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" style="width:100%; height:400px !important; min-height:400px !important; object-fit:cover; border-radius:4px; display:block;">
                <div style="font-weight:800; font-size:14px; color:#09090B; height:38px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${cleanTitle}</div>
                <div style="font-weight:900; font-size:18px; color:#059669; font-family:var(--font-mono);">$${Number(item.price || 0).toFixed(2)}</div>
                <div style="display:flex; gap:8px; margin-top:auto;">
                    ${item.store_url ? `<a href="${item.store_url}" target="_blank" style="flex:1; text-align:center; background:#09090B; color:#FFF; padding:10px; text-decoration:none; border-radius:2px; font-size:12px; font-weight:800;">View Source</a>` : ''}
                    <button onclick="removeWlItem('${item.id}', this)" style="flex:1; background:#FFF; color:#E11D48; border:1px solid #FECDD3; padding:10px; border-radius:2px; font-size:12px; font-weight:800; cursor:pointer;">Remove</button>
                </div>
            </div>`;
        }).join('');
    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#E11D48; font-weight:600;">Failed to load watchlist.</div>';
    }
}

window.removeWlItem = async function(id, btn) {
    if(!confirm("Remove from watchlist?")) return;
    btn.innerText = "...";
    try {
        const authKey = Object.keys(localStorage).find(k => k.includes('auth-token'));
        const token = JSON.parse(localStorage.getItem(authKey)).access_token;
        const res = await fetch(`https://vantix-my5f.onrender.com/api/discovery/saved/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if(res.ok) {
            const card = btn.closest('.god-card');
            if(card) card.remove();
            if(document.querySelectorAll('#watchlist-results .god-card').length === 0) {
                document.getElementById('watchlist-results').innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:60px; color:#71717A; font-weight:600;">Your watchlist is empty.</div>';
            }
        }
    } catch(e) { btn.innerText = "Err"; }
};

const _originalLoadDiscovery = window.loadDiscovery;
window.loadDiscovery = function() {
    if (_originalLoadDiscovery) _originalLoadDiscovery();
    setTimeout(injectWishlistTabs, 100);
};
"""

code += addition
with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(code)
print("✅ Updated js/discovery.js successfully.")

# Bump cache in app.html safely
with open("app.html", "r", encoding="utf-8") as f:
    app = f.read()
app = re.sub(r'js/discovery\.js\?v=\d+', 'js/discovery.js?v=6666', app)
with open("app.html", "w", encoding="utf-8") as f:
    f.write(app)
print("✅ Bumped discovery.js version in app.html")
