let allTrends = [];
let currentPrefs = { auto_detect: true, selected_categories: [] };
let backendCategories = {};

function dscEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

// --- MODAL LOGIC ---
async function openPreferences() {
    document.getElementById('preferences-modal').style.display = 'flex';
    document.getElementById('auto-detect-toggle').checked = currentPrefs.auto_detect;
    if (Object.keys(backendCategories).length === 0) {
        document.getElementById('category-tree').innerHTML = '<div style="text-align:center; padding:20px; color:#71717A;">Loading categories...</div>';
        await fetchCategories();
    }
    renderCategoryTree();
}

function closePreferences() {
    document.getElementById('preferences-modal').style.display = 'none';
}

function toggleAutoDetect(checkbox) {
    const tree = document.getElementById('category-tree');
    if (checkbox.checked) {
        tree.style.pointerEvents = 'none';
        tree.style.filter = 'grayscale(1)';
        tree.style.opacity = '0.6'; 
        document.querySelectorAll('.dsc-tree-child input, .dsc-tree-parent input').forEach(cb => { cb.checked = false; cb.disabled = true; });
    } else {
        tree.style.pointerEvents = 'auto';
        tree.style.filter = 'none';
        tree.style.opacity = '1';
        document.querySelectorAll('.dsc-tree-child input, .dsc-tree-parent input').forEach(cb => { cb.disabled = false; });
    }
}

// --- FETCH CATEGORIES ---
async function fetchCategories() {
    try {
        const token = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.includes('auth-token')))).access_token;
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/categories', { headers: { 'Authorization': 'Bearer ' + token }});
        const data = await res.json();
        if (data.status === 'success') backendCategories = data.categories;
    } catch(e) { console.error("Failed to fetch categories", e); }
}

function renderCategoryTree() {
    const container = document.getElementById('category-tree');
    if (Object.keys(backendCategories).length === 0) return;

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

function toggleParent(checkbox, mainCat) {
    const subCats = backendCategories[mainCat];
    const childInputs = Array.from(document.querySelectorAll(`.dsc-tree-child input`)).filter(input => subCats.includes(input.value));
    childInputs.forEach(input => { input.checked = checkbox.checked; });
    updateSelection();
}

function updateSelection() {
    const selected = [];
    document.querySelectorAll('.dsc-tree-child input:checked').forEach(cb => selected.push(cb.value));
    currentPrefs.selected_categories = selected;
}

async function savePreferences() {
    currentPrefs.auto_detect = document.getElementById('auto-detect-toggle').checked;
    updateSelection();
    if (!currentPrefs.auto_detect && currentPrefs.selected_categories.length === 0) return alert("Please select at least one category.");

    const btn = document.querySelector('.dsc-modal-footer button:last-child');
    btn.innerText = "Saving...";

    try {
        const token = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.includes('auth-token')))).access_token;
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify(currentPrefs)
        });
        if (res.ok) {
            btn.innerText = "✅ Saved!";
            setTimeout(() => { closePreferences(); btn.innerText = "Save Preferences"; }, 1000);
        }
    } catch(e) { console.error(e); btn.innerText = "Error"; }
}

async function loadPreferences() {
    try {
        const token = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.includes('auth-token')))).access_token;
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/preferences', { headers: { 'Authorization': 'Bearer ' + token }});
        const data = await res.json();
        if (data.status === 'success') {
            currentPrefs.auto_detect = data.auto_detect;
            currentPrefs.selected_categories = data.selected_categories;
            document.getElementById('auto-tags-container').innerHTML = data.auto_detected.map(tag => `<span class="dsc-auto-tag">${dscEsc(tag)}</span>`).join('');
            if (Object.keys(backendCategories).length > 0) renderCategoryTree();
        }
    } catch(e) { console.error("Failed to load preferences", e); }
}

// --- LOAD & RENDER CARDS ---
async function loadDiscovery() {
    const container = document.getElementById('discovery-results');
    const countEl = document.getElementById('dsc-count');
    if (!container) return;

    // 1. Show a friendly loading state
    container.innerHTML = `
        <div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
            <div class="dsc-spinner" style="border-color: #0284C7;"></div>
            <div style="font-weight: 800; color: #09090B; font-size: 15px;">Waking up the God Eye Engine...</div>
            <div style="color: #71717A; font-size: 13px;">This takes up to 30 seconds if the server was asleep.</div>
        </div>
    `;

    try {
        // 2. Add a 45-second timeout for Render cold starts
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Failed to connect to API");
        const data = await res.json();
        allTrends = data;

        if (!allTrends || allTrends.length === 0) {
            container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #71717A;">No goldmines found yet. Check back after the next scan.</div>';
            if (countEl) countEl.innerText = `0 Goldmines`;
            return;
        }

        if (countEl) countEl.innerText = `${allTrends.length} Goldmines`;
        renderDiscoveryCards(allTrends);

    } catch (e) {
        console.error("Fetch Error:", e);
        // 3. Friendly error state with a Retry button
        container.innerHTML = `
            <div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div style="color: #E11D48; font-weight: 800; font-size: 16px;">Failed to load daily goldmines.</div>
                <div style="color: #71717A; font-size: 13px;">The server took too long to respond or there is a network issue.</div>
                <button onclick="loadDiscovery()" style="padding: 10px 24px; background: #09090B; color: #FFF; font-weight: 800; border-radius: 4px; border: none; cursor: pointer;">Retry Connection</button>
            </div>
        `;
    }
}

function renderDiscoveryCards(trends) {
    const container = document.getElementById('discovery-results');
    if (!trends || trends.length === 0) {
        container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #71717A;">No goldmines found yet.</div>';
        return;
    }

    container.innerHTML = trends.slice(0, 30).map((item, index) => {
        const score = Number(item.god_eye_score) || 0;
        const scoreColor = score >= 85 ? "#059669" : (score >= 70 ? "#D97706" : "#E11D48");
        const scoreBg = score >= 85 ? "#ECFDF5" : (score >= 70 ? "#FFFBEB" : "#FFF1F2");
        
        // Clean Title
        let rawTitle = item.ali_title || "Unknown Product";
        let title = rawTitle.replace(/ETB[\d\.]+/gi, '').replace(/\$[\d\.]+/gi, '').replace(/-\d+%/gi, '').trim();
        if (title.length > 65) title = title.substring(0, 65) + "...";
        
        const supplierPrice = Number(item.ali_price_usd) ? `$${Number(item.ali_price_usd).toFixed(2)}` : "$0.00";
        const retailPrice = Number(item.shop_avg_price) ? `$${Number(item.shop_avg_price).toFixed(2)}` : "$0.00";
        const margin = Number(item.margin_pct) ? `${Number(item.margin_pct).toFixed(1)}%` : "0%";
        const demand = Number(item.orders_count) || 0;
        const competition = Number(item.unique_stores) || 1;
        
        let insight = "";
        if (score >= 85) insight = `🔥 GOLDMINE. Sourced for ${supplierPrice} and retailing at ${retailPrice}. Only ${competition} Shopify stores found.`;
        else if (score >= 70) insight = `⚡ STRONG POTENTIAL. ${demand} orders on AliExpress. Margin is solid at ${margin}.`;
        else insight = `⚠️ SATURATED. ${competition} Shopify stores found. Margin is ${margin}.`;

        return `
            <div class="god-card" style="padding: 20px; display: flex; flex-direction: column; gap: 16px; background: #FFF; border: 1px solid #E4E4E7; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                
                <!-- TOP: Title & Score -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                    <div style="flex: 1;">
                        <div style="font-size: 10px; font-weight: 800; color: #0284C7; letter-spacing: 0.5px; margin-bottom: 4px;">ALIEXPRESS → SHOPIFY</div>
                        <div style="font-size: 14px; font-weight: 800; color: #09090B; line-height: 1.3;">${dscEsc(title)}</div>
                    </div>
                    <div style="background: ${scoreBg}; border: 1px solid ${scoreColor}40; border-radius: 2px; padding: 6px 10px; text-align: center; flex-shrink: 0;">
                        <div style="font-size: 8px; font-weight: 800; color: ${scoreColor}; letter-spacing: 0.5px;">SCORE</div>
                        <div style="font-size: 20px; font-weight: 900; color: ${scoreColor}; font-family: var(--font-mono); line-height: 1;">${score}</div>
                    </div>
                </div>

                <!-- MIDDLE: Pricing -->
                <div style="display: flex; align-items: baseline; gap: 12px; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px;">
                    <span style="font-size: 20px; font-weight: 900; color: #059669; font-family: var(--font-mono);">${retailPrice}</span>
                    <span style="font-size: 12px; font-weight: 600; color: #A1A1AA;">Cost: <span style="text-decoration: line-through;">${supplierPrice}</span></span>
                </div>

                <!-- STATS GRID -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center;">
                    <div style="background: #F8FAFC; padding: 8px; border-radius: 2px; border: 1px solid #F1F5F9;">
                        <div style="font-size: 9px; font-weight: 800; color: #71717A; text-transform: uppercase;">Margin</div>
                        <div style="font-size: 13px; font-weight: 800; color: #059669; font-family: var(--font-mono); margin-top: 2px;">${margin}</div>
                    </div>
                    <div style="background: #F8FAFC; padding: 8px; border-radius: 2px; border: 1px solid #F1F5F9;">
                        <div style="font-size: 9px; font-weight: 800; color: #71717A; text-transform: uppercase;">Demand</div>
                        <div style="font-size: 13px; font-weight: 800; color: #09090B; font-family: var(--font-mono); margin-top: 2px;">${demand.toLocaleString()}</div>
                    </div>
                    <div style="background: #F8FAFC; padding: 8px; border-radius: 2px; border: 1px solid #F1F5F9;">
                        <div style="font-size: 9px; font-weight: 800; color: #71717A; text-transform: uppercase;">Stores</div>
                        <div style="font-size: 13px; font-weight: 800; color: ${competition < 3 ? '#059669' : '#E11D48'}; font-family: var(--font-mono); margin-top: 2px;">${competition}</div>
                    </div>
                </div>

                <!-- INSIGHT -->
                <div style="background: #F5F3FF; border-left: 3px solid #7C3AED; padding: 10px; font-size: 11px; color: #3F3F46; border-radius: 2px; line-height: 1.4;">
                    ${dscEsc(insight)}
                </div>

                <!-- ACTIONS -->
                <div style="display: flex; gap: 8px; margin-top: auto;">
                    <button onclick="saveOpportunity(${index})" style="flex: 1; padding: 10px; background: #FFF; border: 1px solid #D1D5DB; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer;">Save</button>
                    <button onclick="pushToShopify(${index})" style="flex: 1; padding: 10px; background: #09090B; color: #FFF; border: none; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer;">Push</button>
                </div>
            </div>
        `;
    }).join('');
}

async function pushToShopify(index) { alert("Push to Shopify integration coming soon!"); }
async function saveOpportunity(index) { alert("Saved to Wishlist!"); }

document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    loadDiscovery();
    fetchCategories().then(() => renderCategoryTree());
});

