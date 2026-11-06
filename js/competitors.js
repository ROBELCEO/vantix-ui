window.getAuthToken = function() {
    try {
        const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
        if (!key) return null;
        const data = JSON.parse(localStorage.getItem(key));
        return data.access_token;
    } catch(e) { return null; }
};

// Global storage for modal data
window.stockoutsData = [];
window.launchesData = [];
window.bestsellersData = [];
window.gapsData = [];

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
            showStatus(`Successfully added ${domain}!`);
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
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #F1F5F9;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: #F4F4F5; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #09090B; text-transform: uppercase;">${c.domain.substring(0, 2)}</div>
                    <div>
                        <div style="font-weight: 800; color: #09090B; font-size: 14px;">${c.domain}</div>
                        <div style="font-size: 12px; color: #71717A;">${c.product_count || 0} products monitored</div>
                    </div>
                </div>
                <button onclick="removeCompetitor('${c.domain}')" class="cmp-btn-secondary" style="padding: 6px 12px; font-size: 11px;">Remove</button>
            </div>
        `).join('');
    } catch(e) {
        container.innerHTML = '<div class="cmp-empty" style="padding: 20px; text-align: center; color: #E11D48; font-size: 13px;">Failed to load competitors.</div>';
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

async function autoDiscover() {
    const btn = document.getElementById('discover-btn');
    const resultsDiv = document.getElementById('discovery-results');
    const token = window.getAuthToken();
    
    if (!token) {
        if (resultsDiv) resultsDiv.innerHTML = '<div style="color: #E11D48; font-size: 13px;">Please log in first.</div>';
        return;
    }
    
    btn.disabled = true;
    btn.innerText = "Scanning...";
    if (resultsDiv) resultsDiv.innerHTML = '<div style="color: #71717A; font-size: 13px;">Scanning database for competitors (AI filtering active)...</div>';
    
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/discover', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.detail || "Failed to fetch");
        
        const comps = data.suggested_competitors || [];
        if (comps.length === 0) {
            resultsDiv.innerHTML = '<div style="color: #71717A; font-size: 13px;">No new competitors found matching your niche.</div>';
            return;
        }
        
        resultsDiv.innerHTML = comps.map(c => `
            <div style="padding: 12px 0; border-bottom: 1px solid #E4E4E7; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 800; font-size: 14px; color: #09090B;">${c.domain}</div>
                    <div style="font-size: 12px; color: #059669; font-weight: 600;">${c.match_score}% AI Match</div>
                </div>
                <button onclick="addCompetitor('${c.domain}')" class="cmp-btn-secondary" style="padding: 6px 12px; font-size: 11px;">+ Add</button>
            </div>
        `).join('');
        
    } catch (e) {
        if (resultsDiv) resultsDiv.innerHTML = `<div style="color: #E11D48; font-size: 13px;">Error: ${e.message}</div>`;
    } finally {
        btn.disabled = false;
        btn.innerText = "Find My Competitors →";
    }
}

// 🎨 THE PERFECT DISCOVERY CARD
function createCard(p, type) {
    let badgeHtml = '';
    if (type === 'stockouts') badgeHtml = '<div style="position: absolute; top: 8px; right: 8px; background: #E11D48; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; z-index: 10;">OUT OF STOCK</div>';
    if (type === 'launches') badgeHtml = '<div style="position: absolute; top: 8px; right: 8px; background: #059669; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; z-index: 10;">NEW LAUNCH</div>';
    if (type === 'bestsellers') badgeHtml = '<div style="position: absolute; top: 8px; right: 8px; background: #F59E0B; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; z-index: 10;">TOP SELLER</div>';
    if (type === 'gaps') badgeHtml = `<div style="position: absolute; top: 8px; right: 8px; background: #7C3AED; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; z-index: 10;">GAP: ${p.keyword}</div>`;

    const price = parseFloat(p.price || 0).toFixed(2);
    const safeTitle = (p.title || '').replace(/'/g, "\\'");
    const safeStore = (p.store || '').replace(/'/g, "\\'");
    const img = p.image || 'https://via.placeholder.com/300';
    
    return `
        <div class="cmp-card" onclick="showProductDetails('${safeTitle}', '${safeStore}', ${p.price}, '${img}', '${p.url}')">
            <div class="cmp-card-img-wrap">
                <img src="${img}" alt="${safeTitle}">
                ${badgeHtml}
            </div>
            <div class="cmp-card-content">
                <div class="cmp-card-store">${p.store}</div>
                <div class="cmp-card-title">${p.title}</div>
                <div class="cmp-card-price-row">
                    <div style="font-size: 11px; color: #71717A; font-weight: 600;">Price</div>
                    <div class="cmp-card-price">$${price}</div>
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
        
        window.stockoutsData = data.stock_outs || [];
        window.launchesData = data.new_launches || [];

        const stockoutList = document.getElementById('stockout-list');
        const launchList = document.getElementById('launch-list');
        
        if (stockoutList) {
            stockoutList.innerHTML = window.stockoutsData.length > 0 
                ? window.stockoutsData.slice(0, 6).map(p => createCard(p, 'stockouts')).join('')
                : '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No relevant stock-outs found.</div>';
        }

        if (launchList) {
            launchList.innerHTML = window.launchesData.length > 0
                ? window.launchesData.slice(0, 6).map(p => createCard(p, 'launches')).join('')
                : '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No new launches found.</div>';
        }
    } catch(e) { console.error("Intel error", e); }

    // 2. Best Sellers
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/best-sellers', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        window.bestsellersData = data.best_sellers || [];
        
        const bsList = document.getElementById('bestsellers-list');
        if (bsList) {
            bsList.innerHTML = window.bestsellersData.length > 0
                ? window.bestsellersData.slice(0, 6).map(p => createCard(p, 'bestsellers')).join('')
                : '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No best sellers found.</div>';
        }
    } catch(e) { console.error("BS error", e); }

    // 3. Gaps
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/gaps', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();
        window.gapsData = data.gaps || [];
        
        const gapList = document.getElementById('gap-list');
        if (gapList) {
            gapList.innerHTML = window.gapsData.length > 0
                ? window.gapsData.slice(0, 6).map(p => createCard(p, 'gaps')).join('')
                : '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A; font-size: 13px;">No gaps found.</div>';
        }
    } catch(e) { console.error("Gap error", e); }
}

// MODAL LOGIC (View All)
function openCmpModal(type) {
    const modal = document.getElementById('cmp-modal');
    const title = document.getElementById('cmp-modal-title');
    const body = document.getElementById('cmp-modal-body');
    
    let data = [];
    if (type === 'stockouts') { data = window.stockoutsData; title.innerText = 'All Stock-Outs'; }
    if (type === 'launches') { data = window.launchesData; title.innerText = 'All New Launches'; }
    if (type === 'bestsellers') { data = window.bestsellersData; title.innerText = 'All Best Sellers'; }
    if (type === 'gaps') { data = window.gapsData; title.innerText = 'All Catalog Gaps'; }

    if (data.length === 0) {
        body.innerHTML = '<div style="grid-column: span 3; padding: 20px; text-align: center; color: #71717A;">No items to show.</div>';
    } else {
        body.innerHTML = data.map(p => createCard(p, type)).join('');
    }
    
    modal.style.display = 'flex';
}

function closeCmpModal() {
    document.getElementById('cmp-modal').style.display = 'none';
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

// Paywall Check & Init
document.addEventListener('DOMContentLoaded', async () => {
    const token = window.getAuthToken();
    if (token) {
        try {
            const res = await fetch('https://api.midra.xyz/api/auth/status', { headers: { 'Authorization': 'Bearer ' + token } });
            const data = await res.json();
            const planStatus = document.getElementById('cmp-plan-status');
            if (planStatus) planStatus.innerText = `PLAN: ${data.plan.toUpperCase()}`;

            if (data.plan !== 'pro' && data.plan !== 'scale') {
                const lockIds = ['discovery-results', 'stockout-list', 'launch-list', 'bestsellers-list', 'gap-list'];
                lockIds.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'none';
                    const lock = document.getElementById(id + '-lock');
                    if (lock) lock.style.display = 'flex';
                });
                const discoverBtn = document.getElementById('discover-btn');
                if (discoverBtn) discoverBtn.disabled = true;
            }
        } catch(e) { console.error("Paywall check failed:", e); }
    }

    setTimeout(() => {
        loadTrackedCompetitors();
        loadCompetitorIntel();
    }, 500);
});