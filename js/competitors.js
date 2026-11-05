window.getAuthToken = function() {
    try {
        const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
        if (!key) return null;
        const data = JSON.parse(localStorage.getItem(key));
        return data.access_token;
    } catch(e) { return null; }
};

function showStatus(msg, isError = false) {
    const el = document.getElementById('comp-status');
    if (!el) return;
    el.innerText = msg;
    el.style.display = 'block';
    el.style.color = isError ? '#E11D48' : '#059669';
    setTimeout(() => el.style.display = 'none', 4000);
}

function handleAddKey(e) {
    if (e.key === 'Enter') addCompetitor(document.getElementById('comp-domain').value);
}

async function addCompetitor(domain) {
    if (!domain || !domain.trim()) return;
    const token = window.getAuthToken();
    if (!token) return showStatus("Please log in first.", true);
    
    showStatus("Adding and scraping competitor... (This may take a moment)");
    try {
        const res = await fetch(`https://api.midra.xyz/api/competitors/add?domain=${encodeURIComponent(domain)}`, {
            method: 'POST', headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (res.ok) {
            showStatus(`Successfully added ${domain}! Loaded ${data.product_count || 'some'} products.`);
            document.getElementById('comp-domain').value = '';
            loadTrackedCompetitors();
            loadCompetitorIntel();
        } else {
            showStatus(data.detail || "Failed to add competitor.", true);
        }
    } catch(e) {
        showStatus("Network error. Try again.", true);
    }
}

async function loadTrackedCompetitors() {
    const container = document.getElementById('competitors-list');
    if (!container) return;
    const token = window.getAuthToken();
    if (!token) return;

    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/list', { headers: { 'Authorization': 'Bearer ' + token } });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const comps = data.competitors || [];
        
        document.getElementById('comp-count').innerText = `${comps.length} Tracked`;

        if (comps.length === 0) {
            container.innerHTML = '<div class="cmp-empty" style="padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No competitors tracked yet.</div>';
            return;
        }

        container.innerHTML = comps.map(c => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #F1F5F9;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: #F4F4F5; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #09090B; text-transform: uppercase;">${c.domain.substring(0, 2)}</div>
                    <div>
                        <div style="font-weight: 800; color: #09090B; font-size: 14px;">${c.domain}</div>
                        <div style="font-size: 12px; color: #71717A;">${c.product_count || 0} products found</div>
                    </div>
                </div>
                <button onclick="removeCompetitor('${c.domain}')" class="cmp-btn-secondary" style="padding: 6px 12px; font-size: 11px;">Remove</button>
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = '<div class="cmp-empty" style="padding: 20px; text-align: center; color: #E11D48; font-size: 13px;">Failed to load competitors. Server might be restarting.</div>';
    }
}

async function removeCompetitor(domain) {
    if (!confirm(`Remove ${domain}?`)) return;
    const token = window.getAuthToken();
    try {
        await fetch(`https://api.midra.xyz/api/competitors/remove?domain=${domain}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
        loadTrackedCompetitors();
        loadCompetitorIntel();
    } catch(e) { alert("Failed to remove"); }
}

// 🎨 THE DISCOVERY DNA CARD (Forced inline styles to prevent cache issues)
function createCard(p, badgeHtml = '') {
    const price = parseFloat(p.price || 0).toFixed(2);
    
    // Escape single quotes in title to prevent JS errors in the onclick attribute
    const safeTitle = (p.title || '').replace(/'/g, "\\'");
    const safeStore = (p.store || '').replace(/'/g, "\\'");
    const safeImage = p.image || 'https://via.placeholder.com/300';
    const safeUrl = p.url || '#';

    return `
        <div class="cmp-card" onclick="showProductDetails('${safeTitle}', '${safeStore}', ${p.price}, '${safeImage}', '${safeUrl}')" style="display: flex; flex-direction: column; height: 100%;">
            <div style="position: relative; width: 100%; padding-top: 100%; background: #F8FAFC; overflow: hidden; border-bottom: 1px solid #E4E4E7;">
                <img src="${safeImage}" alt="${safeTitle}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                ${badgeHtml}
            </div>
            <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
                <div style="font-size: 11px; font-weight: 800; color: #0284C7; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">${p.store}</div>
                <div style="font-size: 14px; font-weight: 700; color: #09090B; line-height: 1.4; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1;">${p.title}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <div style="font-size: 11px; color: #71717A; font-weight: 600;">Price</div>
                    <div style="font-size: 18px; font-weight: 900; color: #059669;">$${price}</div>
                </div>
            </div>
        </div>
    `;
}

async function loadCompetitorIntel() {
    const token = window.getAuthToken();
    if (!token) return;

    // 1. Stock-Outs & Launches
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/opportunities', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        
        const stockoutList = document.getElementById('stockout-list');
        const launchList = document.getElementById('launch-list');
        
        if (stockoutList) {
            stockoutList.innerHTML = data.stock_outs && data.stock_outs.length > 0 
                ? data.stock_outs.map(p => createCard(p, '<div style="position: absolute; top: 8px; right: 8px; background: #E11D48; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 2px; z-index: 10;">OUT OF STOCK</div>')).join('')
                : '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No stock-outs found.</div>';
        }

        if (launchList) {
            launchList.innerHTML = data.new_launches && data.new_launches.length > 0
                ? data.new_launches.map(p => createCard(p, '<div style="position: absolute; top: 8px; right: 8px; background: #059669; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 2px; z-index: 10;">NEW LAUNCH</div>')).join('')
                : '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No new launches in the last 30 days.</div>';
        }
    } catch(e) { console.error("Intel error", e); }

    // 2. Best Sellers
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/best-sellers', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        const bsList = document.getElementById('bestsellers-list');
        if (bsList) {
            bsList.innerHTML = data.best_sellers && data.best_sellers.length > 0
                ? data.best_sellers.map(p => createCard(p, '<div style="position: absolute; top: 8px; right: 8px; background: #F59E0B; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 2px; z-index: 10;">TOP SELLER</div>')).join('')
                : '<div style="width: 100%; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No best sellers found.</div>';
        }
    } catch(e) { console.error("BS error", e); }

    // 3. Gaps
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/gaps', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        const gapList = document.getElementById('gap-list');
        if (gapList) {
            gapList.innerHTML = data.gaps && data.gaps.length > 0
                ? data.gaps.map(p => createCard(p, `<div style="position: absolute; top: 8px; right: 8px; background: #7C3AED; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 2px; z-index: 10;">GAP: ${p.keyword}</div>`)).join('')
                : '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No gaps found. You are covering all categories.</div>';
        }
    } catch(e) { console.error("Gap error", e); }
}

function showProductDetails(title, store, price, image, url) {
    document.getElementById('pm-title').innerText = title;
    document.getElementById('pm-store').innerText = store;
    document.getElementById('pm-price').innerText = '$' + parseFloat(price || 0).toFixed(2);
    document.getElementById('pm-image').src = image || 'https://via.placeholder.com/300';
    document.getElementById('pm-link').href = url || '#';
    document.getElementById('cmp-product-modal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('cmp-product-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadTrackedCompetitors();
        loadCompetitorIntel();
    }, 500);
});