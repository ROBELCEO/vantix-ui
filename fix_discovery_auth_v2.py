import re

with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Add a bulletproof token helper function at the top of the file
token_helper = """
function getAuthToken() {
    const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
    if (!key) return null;
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return data.access_token;
    } catch(e) {
        return null;
    }
}

"""

if "function getAuthToken()" not in js:
    js = token_helper + js

# 2. Rewrite loadDiscovery
new_load_discovery = """async function loadDiscovery() {
    const container = document.getElementById('discovery-results');
    const countEl = document.getElementById('dsc-count');
    if (!container) return;

    container.innerHTML = `<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center;">Loading...</div>`;

    try {
        const token = getAuthToken();
        if (!token) throw new Error("Not logged in");

        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Extract the array correctly based on the new backend structure
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
}"""

js = re.sub(r'async function loadDiscovery\(\) \{.*?\n\}', new_load_discovery, js, flags=re.DOTALL)

# 3. Rewrite loadWatchlist
new_load_watchlist = """async function loadWatchlist() {
    const container = document.getElementById('watchlist-results');
    if (!container) return;
    container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#71717A; font-weight:600;">Loading watchlist...</div>';

    try {
        const token = getAuthToken();
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

        container.innerHTML = items.map((item, index) => {
            let cleanTitle = (item.title || 'Untitled').replace(/ETB[\\d\\.]+/gi, '').replace(/\\$[\\d\\.]+/gi, '').replace(/-\\d+%/gi, '').trim();
            return `
            <div class="god-card" style="background:#FFF; border:1px solid #E4E4E7; border-radius:4px; overflow:hidden; padding:16px; display:flex; flex-direction:column; gap:12px;">
                <img src="${item.image_url || 'https://ui-avatars.com/api/?name=V&background=F4F4F5'}" style="width:100%; height:240px !important; min-height:240px !important; object-fit:cover; border-radius:4px; display:block;">
                <div style="font-size: 14px; font-weight: 800; color: #09090B; line-height: 1.3;">${cleanTitle}</div>
                <button onclick="removeWlItem('${item.id}', this)" style="width:100%; padding:10px; background:#FFF; border:1px solid #E11D48; color:#E11D48; font-weight:800; font-size:12px; border-radius:2px; cursor:pointer;">Remove</button>
            </div>`;
        }).join('');

    } catch (e) {
        console.error(e);
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:40px; color:#E11D48; font-weight:600;">Failed to load watchlist.</div>';
    }
}"""

js = re.sub(r'async function loadWatchlist\(\) \{.*?\n\}', new_load_watchlist, js, flags=re.DOTALL)

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ Rewrote loadDiscovery and loadWatchlist with robust token handling and array parsing.")
