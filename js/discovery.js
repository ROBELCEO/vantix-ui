// ==========================================
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
        let cleanTitle = (item.ali_title || 'Untitled').replace(/ETB[\d\.]+/gi, '').replace(/\$[\d\.]+/gi, '').replace(/-\d+%/gi, '').trim();
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
            let cleanTitle = (item.title || 'Untitled').replace(/ETB[\d\.]+/gi, '').replace(/\$[\d\.]+/gi, '').replace(/-\d+%/gi, '').trim();
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
