let allCompetitors = [];
window.cmpAllCompetitors = [];
window.cmpAllStockouts = [];
window.cmpAllLaunches = [];
window.cmpAllGaps = [];
window.cmpAllBestSellers = [];

function cmpEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[s]));
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

function cmpPriceTag(price, priceAvailable, cls) {
    if (!priceAvailable) return '<div class="cmp-row-price cmp-text-red" style="font-size:10px;font-weight:700;">PRICE N/A</div>';
    return `<div class="cmp-row-price ${cls}">$${Number(price).toFixed(2)}</div>`;
}

function cmpBestSellerBadge(isBestSeller, rank, prevRank) {
    if (!isBestSeller) return '';
    if (rank === 1) return '<span class="cmp-badge cmp-badge-amber" style="font-size:9px; padding:2px 6px; margin-left:8px;">🔥 #1 BEST SELLER</span>';
    if (prevRank && rank < prevRank) return `<span class="cmp-badge cmp-badge-green" style="font-size:9px; padding:2px 6px; margin-left:8px;">🚀 SURGING (#${prevRank} → #${rank})</span>`;
    if (!prevRank) return '<span class="cmp-badge cmp-badge-violet" style="font-size:9px; padding:2px 6px; margin-left:8px;">✨ NEW WINNER</span>';
    return `<span class="cmp-badge cmp-badge-amber" style="font-size:9px; padding:2px 6px; margin-left:8px;">🔥 TOP #${rank}</span>`;
}

async function fetchCompetitors() {
    const list = document.getElementById('competitors-list');
    const countEl = document.getElementById('comp-count');
    const planEl = document.getElementById('cmp-plan-status');
    if (!list) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/list');
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
            <div class="cmp-product-row" style="justify-content:space-between;">
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
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${encodeURIComponent(domain)}`, { method: 'POST' });
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

async function autoDiscover() {
    const btn = document.getElementById('discover-btn');
    const results = document.getElementById('discovery-results');
    if (!btn || !results) return;

    btn.innerText = "Scanning market…"; btn.disabled = true;
    results.innerHTML = '<div class="cmp-empty" style="padding: 12px;">Searching for brands in your niche…</div>';

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/discover');
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Network error");

        const sourceLabel = data.source === "ai" ? "AI suggestion" : "Fallback list";
        if (!data.suggested_competitors || data.suggested_competitors.length === 0) {
            results.innerHTML = '<div class="cmp-empty">No competitors found. Try adding manually.</div>';
        } else {
            results.innerHTML = `
                <div class="cmp-row-meta" style="margin-bottom:8px;">Source: ${sourceLabel}</div>
                ${data.suggested_competitors.map(domain => {
                    const isTracked = allCompetitors.some(c => c.domain.toLowerCase() === domain.toLowerCase());
                    const btnHtml = isTracked 
                        ? '<div class="cmp-badge cmp-badge-green" style="font-size: 9px;">TRACKED</div>'
                        : `<button onclick="addCompetitor('${cmpEsc(domain)}')" class="cmp-btn-small">+ Add</button>`;
                    return `
                    <div class="cmp-suggestion-row">
                        <div class="cmp-row-title">${cmpEsc(domain)}</div>
                        ${btnHtml}
                    </div>
                `}).join('')}
            `;
        }
    } catch (e) {
        results.innerHTML = `<div class="cmp-empty cmp-text-red">${cmpEsc(e.message)}</div>`;
    }
    btn.innerText = "Find My Competitors →"; btn.disabled = false;
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
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${encodeURIComponent(domain)}`, { method: 'POST' });
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
        } else {
            status.className = 'cmp-status-msg cmp-text-red';
            status.innerText = data.detail || data.message || "Error adding.";
        }
    } catch (e) {
        status.className = 'cmp-status-msg cmp-text-red';
        status.innerText = "Error adding competitor. Check backend.";
    } finally {
        setTimeout(() => {
            if (status.innerText.includes("Scraping")) {
                status.style.display = 'none';
            }
        }, 5000);
    }
}

async function loadCompetitorIntel() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/opportunities');
        if (!res.ok) return;
        const data = await res.json();

        window.cmpAllStockouts = data.stock_outs || [];
        window.cmpAllLaunches = data.new_launches || [];

        const stockList = document.getElementById('stockout-list');
        if (window.cmpAllStockouts.length > 0) {
            stockList.innerHTML = window.cmpAllStockouts.slice(0, 5).map(p => `
                <div class="cmp-product-row">
                    <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(p.title)}${cmpBestSellerBadge(p.is_best_seller, p.rank, p.prev_rank)}</div>
                        <div class="cmp-row-meta">${cmpEsc(p.store)}</div>
                    </div>
                    ${cmpPriceTag(p.price, p.price_available, 'cmp-text-amber')}
                </div>
            `).join('');
        } else {
            stockList.innerHTML = '<div class="cmp-empty">No stock-outs detected.</div>';
        }

        const launchList = document.getElementById('launch-list');
        if (window.cmpAllLaunches.length > 0) {
            launchList.innerHTML = window.cmpAllLaunches.slice(0, 5).map(p => `
                <div class="cmp-product-row">
                    <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(p.title)}${cmpBestSellerBadge(p.is_best_seller, p.rank, p.prev_rank)}</div>
                        <div class="cmp-row-meta">${cmpEsc(p.store)} • ${p.date}</div>
                    </div>
                    ${cmpPriceTag(p.price, p.price_available, 'cmp-text-green')}
                </div>
            `).join('');
        } else {
            launchList.innerHTML = '<div class="cmp-empty">No new launches found.</div>';
        }
    } catch (e) { console.error(e); }
}

async function loadCatalogGaps() {
    const list = document.getElementById('gap-list');
    if (!list) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/gaps');
        if (!res.ok) return;
        const data = await res.json();

        window.cmpAllGaps = data.gaps || [];

        if (window.cmpAllGaps.length > 0) {
            list.innerHTML = window.cmpAllGaps.slice(0, 5).map(g => `
                <div class="cmp-product-row">
                    <img class="cmp-avatar" src="${cmpEsc(g.image || '')}" onerror="this.style.visibility='hidden'">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(g.title)}${cmpBestSellerBadge(g.is_best_seller, g.rank, g.prev_rank)}</div>
                        <div class="cmp-row-meta">You sell 0 ${cmpEsc(g.keyword)}s</div>
                    </div>
                    <div class="cmp-row-price cmp-text-violet">$${Number(g.price).toFixed(2)}</div>
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
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/best-sellers');
        if (!res.ok) return;
        const data = await res.json();

        window.cmpAllBestSellers = data.best_sellers || [];
        const list = document.getElementById('bestsellers-list');
        
        if (window.cmpAllBestSellers.length > 0) {
            list.innerHTML = window.cmpAllBestSellers.slice(0, 5).map(p => `
                <div class="cmp-product-row">
                    <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(p.title)}${cmpBestSellerBadge(true, p.rank, p.prev_rank)}</div>
                        <div class="cmp-row-meta">${cmpEsc(p.store)}</div>
                    </div>
                    ${cmpPriceTag(p.price, p.price_available, 'cmp-text-cyan')}
                </div>
            `).join('');
        } else {
            list.innerHTML = '<div class="cmp-empty">No best sellers found yet. Refresh a competitor.</div>';
        }
    } catch (e) { console.error(e); }
}

function openCmpModal(type) {
    const modal = document.getElementById("cmp-modal");
    const list = document.getElementById("cmp-modal-body");
    const title = document.getElementById("cmp-modal-title");
    if (!modal || !list) return;

    let html = "";

    if (type === 'competitors') {
        title.innerText = "All Tracked Competitors";
        if (window.cmpAllCompetitors.length === 0) html = '<div class="cmp-empty">No competitors found.</div>';
        else html = window.cmpAllCompetitors.map(c => `
            <div class="cmp-product-row" style="justify-content:space-between;">
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
        if (window.cmpAllStockouts.length === 0) html = '<div class="cmp-empty">No stock-outs detected.</div>';
        else html = window.cmpAllStockouts.map(p => `
            <div class="cmp-product-row">
                <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                <div class="cmp-row-body">
                    <div class="cmp-row-title">${cmpEsc(p.title)}${cmpBestSellerBadge(p.is_best_seller, p.rank, p.prev_rank)}</div>
                    <div class="cmp-row-meta">${cmpEsc(p.store)}</div>
                </div>
                ${cmpPriceTag(p.price, p.price_available, 'cmp-text-amber')}
            </div>
        `).join("");
    }
    else if (type === 'launches') {
        title.innerText = "All New Launches";
        if (window.cmpAllLaunches.length === 0) html = '<div class="cmp-empty">No new launches detected.</div>';
        else html = window.cmpAllLaunches.map(p => `
            <div class="cmp-product-row">
                <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                <div class="cmp-row-body">
                    <div class="cmp-row-title">${cmpEsc(p.title)}${cmpBestSellerBadge(p.is_best_seller, p.rank, p.prev_rank)}</div>
                    <div class="cmp-row-meta">${cmpEsc(p.store)} • ${p.date}</div>
                </div>
                ${cmpPriceTag(p.price, p.price_available, 'cmp-text-green')}
            </div>
        `).join("");
    }
    else if (type === 'bestsellers') {
        title.innerText = "All Competitor Best Sellers";
        if (window.cmpAllBestSellers.length === 0) html = '<div class="cmp-empty">No best sellers found.</div>';
        else html = window.cmpAllBestSellers.map(p => `
            <div class="cmp-product-row">
                <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                <div class="cmp-row-body">
                    <div class="cmp-row-title">${cmpEsc(p.title)}${cmpBestSellerBadge(true, p.rank, p.prev_rank)}</div>
                    <div class="cmp-row-meta">${cmpEsc(p.store)}</div>
                </div>
                ${cmpPriceTag(p.price, p.price_available, 'cmp-text-cyan')}
            </div>
        `).join("");
    }
    else if (type === 'gaps') {
        title.innerText = "All Catalog Gaps";
        if (window.cmpAllGaps.length === 0) html = '<div class="cmp-empty">No gaps found.</div>';
        else html = window.cmpAllGaps.map(g => `
            <div class="cmp-product-row">
                <img class="cmp-avatar" src="${cmpEsc(g.image || '')}" onerror="this.style.visibility='hidden'">
                <div class="cmp-row-body">
                    <div class="cmp-row-title">${cmpEsc(g.title)}${cmpBestSellerBadge(g.is_best_seller, g.rank, g.prev_rank)}</div>
                    <div class="cmp-row-meta">You sell 0 ${cmpEsc(g.keyword)}s</div>
                </div>
                <div class="cmp-row-price cmp-text-violet">$${Number(g.price).toFixed(2)}</div>
            </div>
        `).join("");
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
