let allCompetitors = [];
window.cmpAllCompetitors = [];
window.cmpAllStockouts = [];
window.cmpAllLaunches = [];
window.cmpAllGaps = [];
window.cmpAllBestSellers = [];

function cmpEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
}

function cmpFormatDate(dateStr) {
    if (!dateStr) return "";
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch(e) { return dateStr; }
}

function cmpAge(hours) {
    if (hours === null || hours === undefined) return "never";
    if (hours < 0.02) return "just now";
    if (hours < 1) return `${Math.round(hours * 60)}m ago`;
    if (hours < 24) return `${Math.round(hours)}h ago`;
    return `${Math.round(hours / 24)}d ago`;
}

function cmpFreshBadge(c) {
    if (!c.last_scraped_at) return '<div class="cmp-badge cmp-text-red">NEVER</div>';
    if (c.stale) return `<div class="cmp-badge cmp-badge-amber">STALE · ${cmpAge(c.age_hours)}</div>`;
    return `<div class="cmp-badge cmp-badge-green">LIVE · ${cmpAge(c.age_hours)}</div>`;
}

function cmpBestSellerBadge(isBestSeller, rank, prevRank) {
    if (!isBestSeller) return '';
    if (rank === 1) return '<span class="cmp-badge cmp-badge-amber" style="font-size:9px; padding:2px 6px; margin-left:8px;">🔥 #1 BEST SELLER</span>';
    if (prevRank && rank < prevRank) return `<span class="cmp-badge cmp-badge-green" style="font-size:9px; padding:2px 6px; margin-left:8px;">🚀 SURGING (#${prevRank} → #${rank})</span>`;
    if (!prevRank) return '<span class="cmp-badge cmp-badge-violet" style="font-size:9px; padding:2px 6px; margin-left:8px;">✨ NEW WINNER</span>';
    return `<span class="cmp-badge cmp-badge-amber" style="font-size:9px; padding:2px 6px; margin-left:8px;">🔥 TOP #${rank}</span>`;
}

// ==========================================
// PRODUCT DETAILS MODAL LOGIC
// ==========================================
window.showProductDetails = function(store, title, price, image, url) {
    document.getElementById('pm-store').innerText = store;
    document.getElementById('pm-title').innerText = title;
    document.getElementById('pm-price').innerText = '$' + Number(price).toFixed(2);
    document.getElementById('pm-image').src = image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(title) + '&background=F4F4F5';
    
    // Use the actual product URL if available, otherwise fallback to search
    document.getElementById('pm-link').href = url || 'https://www.google.com/search?q=' + encodeURIComponent(title + ' ' + store);
    
    document.getElementById('cmp-product-modal').style.display = 'flex';
};

window.closeProductModal = function() {
    document.getElementById('cmp-product-modal').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cmp-product-modal')?.addEventListener('click', function(e) {
        if (e.target === this) closeProductModal();
    });
});

// ==========================================
// FETCH COMPETITORS (TRACKED LIST)
// ==========================================
async function fetchCompetitors() {
    const list = document.getElementById('competitors-list');
    const countEl = document.getElementById('comp-count');
    const planEl = document.getElementById('cmp-plan-status');
    if (!list) return;

    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/list');
        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();
        allCompetitors = data.competitors || [];
        window.cmpAllCompetitors = allCompetitors;

        if (planEl) planEl.innerText = "Plan: " + (data.tier || 'TRIAL').toUpperCase();
        if (countEl) countEl.innerText = `${allCompetitors.length} / ${data.limit || 10} used`;

        if (allCompetitors.length === 0) {
            list.innerHTML = '<div class="cmp-empty">No competitors tracked yet. Add one above to begin.</div>';
            return;
        }

        list.innerHTML = allCompetitors.slice(0, 5).map(c => `
            <div class="cmp-product-row" style="justify-content:space-between; padding: 12px; border-bottom: 1px solid #F1F5F9;">
                <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                    <img class="cmp-avatar" src="https://ui-avatars.com/api/?name=${cmpEsc(c.domain)}&background=FFFFFF&color=0284C7&bold=true" alt="">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(c.domain)}</div>
                        <div class="cmp-row-meta">${c.product_count || 0} products · ${c.priced_count || 0} priced · scraped ${cmpAge(c.age_hours)}</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    ${cmpFreshBadge(c)}
                    <button onclick="refreshCompetitor('${cmpEsc(c.domain)}', this)" class="cmp-btn-small">Refresh</button>
                    <button onclick="removeCompetitor('${cmpEsc(c.domain)}', this)" class="cmp-btn-small" style="color:#E11D48; border-color:#FECDD3;" onmouseover="this.style.background='#FFF1F2'" onmouseout="this.style.background='#FFFFFF'">Remove</button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = `<div class="cmp-empty cmp-text-red">Failed: ${e.message}. Please refresh.</div>`;
    }
}

async function refreshCompetitor(domain, btn) {
    if (!domain) return;
    const original = btn.innerText;
    btn.innerText = "…";
    btn.disabled = true;
    try {
        const res = await fetch(`https://api.midra.xyz/api/competitors/add?domain=${encodeURIComponent(domain)}`, { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.status === "success") {
            fetchCompetitors();
            loadCompetitorIntel();
            loadCatalogGaps();
            loadBestSellers();
        } else {
            alert(data.detail || "Refresh failed.");
            btn.innerText = original; btn.disabled = false;
        }
    } catch (e) {
        alert("Network error refreshing competitor.");
        btn.innerText = original; btn.disabled = false;
    }
}

async function removeCompetitor(domain, btn) {
    if (!confirm(`Are you sure you want to remove ${domain}?`)) return;
    const original = btn.innerText;
    btn.innerText = "…";
    btn.disabled = true;
    try {
        const res = await fetch(`https://api.midra.xyz/api/competitors/remove?domain=${encodeURIComponent(domain)}`, { method: 'DELETE' });
        if (res.ok) {
            fetchCompetitors();
            loadCompetitorIntel();
            loadCatalogGaps();
            loadBestSellers();
        } else {
            const data = await res.json();
            alert(data.detail || "Failed to remove competitor.");
            btn.innerText = original; btn.disabled = false;
        }
    } catch (e) {
        alert("Network error removing competitor.");
        btn.innerText = original; btn.disabled = false;
    }
}

// ==========================================
// AUTO DISCOVER
// ==========================================
async function autoDiscover() {
    const btn = document.getElementById('discover-btn');
    const results = document.getElementById('discovery-results');
    if (!btn || !results) return;

    btn.innerText = "Scanning 100,000+ stores...";
    btn.disabled = true;
    results.innerHTML = '<div class="cmp-empty">Analyzing your catalog and querying the network...</div>';

    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/discover');
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Network error");

        const competitors = data.suggested_competitors || [];
        if (competitors.length === 0) {
            results.innerHTML = '<div class="cmp-empty">No competitors found. Try adding manually.</div>';
            return;
        }

        results.innerHTML = competitors.map(c => {
            const domain = c.domain || c;
            const isTracked = allCompetitors.some(t => t.domain.toLowerCase() === domain.toLowerCase());
            const btnHtml = isTracked
                ? '<div class="cmp-badge cmp-badge-green" style="font-size: 9px;">TRACKED</div>'
                : `<button onclick="addCompetitor('${cmpEsc(domain)}')" class="cmp-btn-small">+ Add</button>`;

            let chipsHtml = '';
            if (c.matched_products && c.matched_products.length > 0) {
                chipsHtml = c.matched_products.map(p => `
                    <span style="background: #F0F9FF; color: #0284C7; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; border: 1px solid #BAE6FD; display: flex; flex-direction: column; gap: 2px;">
                        <span>${cmpEsc(p.title)} ($${Number(p.price).toFixed(2)})</span>
                        <span style="font-size: 9px; color: #64748B;">SKU: ${cmpEsc(p.sku || 'N/A')} | Barcode: ${cmpEsc(p.barcode || 'N/A')}</span>
                    </span>
                `).join(' ');
            }

            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #E4E4E7; gap: 12px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 800; font-size: 14px; color: #09090B; display: flex; align-items: center; gap: 8px;">
                            ${cmpEsc(domain)}
                            ${c.exact_matches > 0 ? `<span style="background: #DCFCE7; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 800;">🟢 ${c.exact_matches} EXACT MATCHES</span>` : ''}
                        </div>
                        <div style="font-size: 12px; color: #71717A; display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                            <span style="background: #DCFCE7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 10px;">${c.match_score || 99}% MATCH</span>
                            <span>${c.product_count || 0} products found</span>
                        </div>
                        ${chipsHtml ? `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">${chipsHtml}</div>` : ''}
                    </div>
                    ${btnHtml}
                </div>
            `;
        }).join('');

    } catch (e) {
        console.error(e);
        results.innerHTML = `<div class="cmp-empty" style="color: #E11D48;">Error: ${e.message}</div>`;
    } finally {
        btn.innerText = "Find My Competitors →";
        btn.disabled = false;
    }
}

function handleAddKey(e) {
    if (e.key === 'Enter') addCompetitor(document.getElementById('comp-domain').value);
}

async function addCompetitor(domain) {
    if (!domain) return;
    const status = document.getElementById('comp-status');
    status.style.display = 'block';
    status.className = 'cmp-status-msg cmp-text-amber';
    status.innerText = "Scraping competitor products (takes 5-10s)…";

    try {
        const res = await fetch(`https://api.midra.xyz/api/competitors/add?domain=${encodeURIComponent(domain)}`, { method: 'POST' });
        const data = await res.json();

        if (res.ok && data.status === "success") {
            status.className = 'cmp-status-msg cmp-text-green';
            status.innerText = data.message;
            document.getElementById('comp-domain').value = "";
            document.getElementById('discovery-results').innerHTML = "";
            fetchCompetitors();
            loadCompetitorIntel();
            loadCatalogGaps();
            loadBestSellers();
        } else if (res.status === 403) {
            status.className = 'cmp-status-msg cmp-text-red';
            const detail = data.detail || "Plan limit reached.";
            status.innerHTML = `🔒 ${cmpEsc(detail)} <a href="membership.html" style="margin-left:8px; font-weight:800; color:#0284C7; text-decoration:underline;">Upgrade to Pro →</a>`;
        } else if (res.status === 404) {
            status.className = 'cmp-status-msg cmp-text-red';
            status.innerHTML = `⚠️ ${cmpEsc(data.detail || "This store is not yet in our database.")}`;
        } else {
            status.className = 'cmp-status-msg cmp-text-red';
            if (res.status >= 500) {
                status.innerHTML = `⚠️ Server error. Please try again later.`;
            } else {
                status.innerText = data.detail || data.message || "Error adding competitor.";
            }
        }
    } catch (e) {
        status.className = 'cmp-status-msg cmp-text-red';
        status.innerText = "Network error adding competitor. Check backend.";
    } finally {
        setTimeout(() => {
            if (status.innerText.includes("Scraping")) {
                status.style.display = 'none';
            }
        }, 5000);
    }
}

// ==========================================
// SPY NETWORK (GRID RENDERING)
// ==========================================
async function loadCompetitorIntel() {
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/opportunities');
        if (!res.ok) return;
        const data = await res.json();

        window.cmpAllStockouts = data.stock_outs || [];
        window.cmpAllLaunches = data.new_launches || [];

        // --- STOCK OUTS (2-Column Grid) ---
        const stockList = document.getElementById('stockout-list');
        if (window.cmpAllStockouts.length > 0) {
            stockList.innerHTML = window.cmpAllStockouts.slice(0, 4).map(p => `
                <div onclick="showProductDetails('${cmpEsc(p.store)}', '${cmpEsc(p.title)}', ${p.price}, '${cmpEsc(p.image)}', '${cmpEsc(p.url)}')" style="cursor: pointer; background: #FFF; border: 1px solid #E4E4E7; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                    <div style="position: relative; height: 180px; padding: 12px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #F1F5F9;">
                        <img src="${cmpEsc(p.image || '')}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='https://placehold.co/300x180?text=No+Image'">
                        <div style="position: absolute; top: 8px; right: 8px; background: #E11D48; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">Out of Stock</div>
                    </div>
                    <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                        <div style="font-size: 10px; font-weight: 800; color: #E11D48; text-transform: uppercase; margin-bottom: 6px;">${cmpEsc(p.store)}</div>
                        <div style="font-size: 13px; font-weight: 800; color: #09090B; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${cmpEsc(p.title)}</div>
                        <div style="margin-top: auto; font-size: 16px; font-weight: 900; color: #09090B;">$${Number(p.price).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            stockList.innerHTML = '<div class="cmp-empty" style="grid-column: span 2;">No stock-outs detected.</div>';
        }

        // --- NEW LAUNCHES (2-Column Grid) ---
        const launchList = document.getElementById('launch-list');
        if (window.cmpAllLaunches.length > 0) {
            launchList.innerHTML = window.cmpAllLaunches.slice(0, 4).map(p => `
                <div onclick="showProductDetails('${cmpEsc(p.store)}', '${cmpEsc(p.title)}', ${p.price}, '${cmpEsc(p.image)}', '${cmpEsc(p.url)}')" style="cursor: pointer; background: #FFF; border: 1px solid #E4E4E7; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                    <div style="position: relative; height: 180px; padding: 12px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #F1F5F9;">
                        <img src="${cmpEsc(p.image || '')}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='https://placehold.co/300x180?text=No+Image'">
                        <div style="position: absolute; top: 8px; right: 8px; background: #10B981; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">New Launch</div>
                    </div>
                    <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                        <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase; margin-bottom: 6px;">${cmpEsc(p.store)} • ${cmpFormatDate(p.date)}</div>
                        <div style="font-size: 13px; font-weight: 800; color: #09090B; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${cmpEsc(p.title)}</div>
                        <div style="margin-top: auto; font-size: 16px; font-weight: 900; color: #09090B;">$${Number(p.price).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            launchList.innerHTML = '<div class="cmp-empty" style="grid-column: span 2;">No new launches found.</div>';
        }
    } catch (e) { console.error(e); }
}

async function loadCatalogGaps() {
    const list = document.getElementById('gap-list');
    if (!list) return;

    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/gaps');
        if (!res.ok) return;
        const data = await res.json();

        window.cmpAllGaps = data.gaps || [];

        if (window.cmpAllGaps.length > 0) {
            list.innerHTML = window.cmpAllGaps.slice(0, 4).map(g => `
                <div onclick="showProductDetails('${cmpEsc(g.store || 'Competitor')}', '${cmpEsc(g.title)}', ${g.price}, '${cmpEsc(g.image)}', '${cmpEsc(g.url)}')" style="cursor: pointer; background: #FFF; border: 1px solid #E4E4E7; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                    <div style="position: relative; height: 180px; padding: 12px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #F1F5F9;">
                        <img src="${cmpEsc(g.image || '')}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='https://placehold.co/300x180?text=No+Image'">
                        <div style="position: absolute; top: 8px; right: 8px; background: #8B5CF6; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">GAP</div>
                    </div>
                    <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                        <div style="font-size: 10px; font-weight: 800; color: #8B5CF6; text-transform: uppercase; margin-bottom: 6px;">You sell 0 ${cmpEsc(g.keyword)}s</div>
                        <div style="font-size: 13px; font-weight: 800; color: #09090B; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${cmpEsc(g.title)}</div>
                        <div style="margin-top: auto; font-size: 16px; font-weight: 900; color: #09090B;">$${Number(g.price).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<div class="cmp-empty cmp-text-green" style="grid-column: span 2;">✅ No catalog gaps found. Your catalog is competitive.</div>';
        }
    } catch (e) {
        list.innerHTML = '<div class="cmp-empty cmp-text-red" style="grid-column: span 2;">Failed to load gaps.</div>';
    }
}

async function loadBestSellers() {
    try {
        const res = await fetch('https://api.midra.xyz/api/competitors/best-sellers');
        if (!res.ok) return;
        const data = await res.json();

        window.cmpAllBestSellers = data.best_sellers || [];
        const list = document.getElementById('bestsellers-list');
        
        if (window.cmpAllBestSellers.length === 0) {
            list.innerHTML = '<div class="cmp-empty" style="grid-column: span 4; text-align:center; padding:20px; color:#71717A;">No best seller tags found on these stores.</div>';
        } else {
            list.innerHTML = window.cmpAllBestSellers.slice(0, 4).map(p => `
                <div onclick="showProductDetails('${cmpEsc(p.store)}', '${cmpEsc(p.title)}', ${p.price}, '${cmpEsc(p.image)}', '${cmpEsc(p.url)}')" style="cursor: pointer; background: #FFF; border: 1px solid #F59E0B; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
                    <div style="position: relative; height: 180px; padding: 12px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #F1F5F9;">
                        <img src="${cmpEsc(p.image || '')}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='https://placehold.co/300x180?text=No+Image'">
                        <div style="position: absolute; top: 8px; right: 8px; background: #F59E0B; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px;">#${p.rank || 1} BEST SELLER</div>
                    </div>
                    <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                        <div style="font-size: 10px; font-weight: 800; color: #B45309; text-transform: uppercase; margin-bottom: 6px;">${cmpEsc(p.store)}</div>
                        <div style="font-size: 13px; font-weight: 800; color: #09090B; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${cmpEsc(p.title)}</div>
                        <div style="margin-top: auto; font-size: 16px; font-weight: 900; color: #B45309;">$${Number(p.price).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

// ==========================================
// SHOW ALL MODALS (Grid Layouts)
// ==========================================
function openCmpModal(type) {
    const modal = document.getElementById("cmp-modal");
    const list = document.getElementById("cmp-modal-body");
    const title = document.getElementById("cmp-modal-title");
    if (!modal || !list) return;

    let html = "";
    list.style.display = "grid";
    list.style.gridTemplateColumns = "1fr 1fr";
    list.style.gap = "16px";

    const createCard = (store, title, price, image, badgeText, badgeColor, extraText = "", url = "") => `
        <div onclick="showProductDetails('${cmpEsc(store)}', '${cmpEsc(title)}', ${price}, '${cmpEsc(image)}', '${cmpEsc(url)}')" style="cursor: pointer; background: #FFF; border: 1px solid #E4E4E7; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
            <div style="position: relative; height: 200px; padding: 12px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #F1F5F9;">
                <img src="${cmpEsc(image || '')}" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.src='https://placehold.co/300x200?text=No+Image'">
                ${badgeText ? `<div style="position: absolute; top: 8px; right: 8px; background: ${badgeColor}; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">${badgeText}</div>` : ''}
            </div>
            <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
                <div style="font-size: 10px; font-weight: 800; color: #71717A; text-transform: uppercase; margin-bottom: 6px;">${cmpEsc(store)} ${extraText}</div>
                <div style="font-size: 13px; font-weight: 800; color: #09090B; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${cmpEsc(title)}</div>
                <div style="margin-top: auto; font-size: 16px; font-weight: 900; color: #09090B;">$${Number(price).toFixed(2)}</div>
            </div>
        </div>
    `;

    if (type === 'competitors') {
        title.innerText = "All Tracked Competitors";
        list.style.gridTemplateColumns = "1fr";
        if (window.cmpAllCompetitors.length === 0) html = '<div class="cmp-empty">No competitors found.</div>';
        else html = window.cmpAllCompetitors.map(c => `
            <div class="cmp-product-row" style="justify-content:space-between; padding: 12px; border-bottom: 1px solid #F1F5F9;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img class="cmp-avatar" src="https://ui-avatars.com/api/?name=${cmpEsc(c.domain)}&background=FFFFFF&color=0284C7&bold=true">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(c.domain)}</div>
                        <div class="cmp-row-meta">${c.product_count} products • scraped ${cmpAge(c.age_hours)}</div>
                    </div>
                </div>
                ${cmpFreshBadge(c)}
            </div>
        `).join("");
    }
    else if (type === 'stockouts') {
        title.innerText = "All Stock-Out Opportunities";
        if (window.cmpAllStockouts.length === 0) html = '<div class="cmp-empty" style="grid-column: span 2;">No stock-outs detected.</div>';
        else html = window.cmpAllStockouts.map(p => createCard(p.store, p.title, p.price, p.image, 'Out of Stock', '#E11D48', '', p.url)).join("");
    }
    else if (type === 'launches') {
        title.innerText = "All New Launches";
        if (window.cmpAllLaunches.length === 0) html = '<div class="cmp-empty" style="grid-column: span 2;">No new launches detected.</div>';
        else html = window.cmpAllLaunches.map(p => createCard(p.store, p.title, p.price, p.image, 'New Launch', '#10B981', '• ' + cmpFormatDate(p.date), p.url)).join("");
    }
    else if (type === 'bestsellers') {
        title.innerText = "All Competitor Best Sellers";
        if (window.cmpAllBestSellers.length === 0) html = '<div class="cmp-empty" style="grid-column: span 2;">No best sellers found.</div>';
        else html = window.cmpAllBestSellers.map(p => createCard(p.store, p.title, p.price, p.image, `#${p.rank || 1} Best Seller`, '#F59E0B', '', p.url)).join("");
    }
    else if (type === 'gaps') {
        title.innerText = "All Catalog Gaps";
        if (window.cmpAllGaps.length === 0) html = '<div class="cmp-empty" style="grid-column: span 2;">No gaps found.</div>';
        else html = window.cmpAllGaps.map(g => createCard(g.store || 'Competitor', g.title, g.price, g.image, 'Gap', '#8B5CF6', `• You sell 0 ${g.keyword}s`, g.url)).join("");
    }

    list.innerHTML = html;
    modal.style.display = "flex";
}

function closeCmpModal() {
    const modal = document.getElementById("cmp-modal");
    if (modal) modal.style.display = "none";
}

document.getElementById("cmp-modal")?.addEventListener("click", function(e) {
    if (e.target === this) closeCmpModal();
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        fetchCompetitors();
        loadCompetitorIntel();
        loadCatalogGaps();
        loadBestSellers();
    }, 500);
});