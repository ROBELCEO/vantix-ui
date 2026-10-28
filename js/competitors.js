let allCompetitors = [];

function cmpEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
}

async function fetchCompetitors() {
    const list = document.getElementById('competitors-list');
    const countEl = document.getElementById('comp-count');
    const planEl = document.getElementById('cmp-plan-status');
    if(!list) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/list');
        if(!res.ok) throw new Error("HTTP " + res.status);
        
        const data = await res.json();
        allCompetitors = data.competitors || [];
        
        if (planEl) planEl.innerText = "Plan: " + (data.tier || 'TRIAL').toUpperCase();
        if (countEl) countEl.innerText = `${allCompetitors.length} / ${data.limit || 10} used`;

        if(allCompetitors.length === 0) { 
            list.innerHTML = '<div class="cmp-empty">No competitors tracked yet. Add one above to begin.</div>'; 
            return; 
        }
        
        list.innerHTML = allCompetitors.map(c => `
            <div class="cmp-product-row">
                <img class="cmp-avatar" src="https://ui-avatars.com/api/?name=${cmpEsc(c.domain)}&background=FFFFFF&color=0284C7&bold=true" alt="">
                <div class="cmp-row-body">
                    <div class="cmp-row-title">${cmpEsc(c.domain)}</div>
                    <div class="cmp-row-meta">Tracking active</div>
                </div>
                <div class="cmp-badge cmp-badge-green">${c.product_count || 0} Products</div>
            </div>
        `).join('');
    } catch(e) { 
        list.innerHTML = '<div class="cmp-empty cmp-text-red">Failed to load competitors. Please refresh.</div>'; 
    }
}

async function autoDiscover() {
    const btn = document.getElementById('discover-btn');
    const results = document.getElementById('discovery-results');
    if(!btn || !results) return;
    
    btn.innerText = "Scanning market…"; btn.disabled = true;
    results.innerHTML = '<div class="cmp-empty" style="padding: 12px;">Searching for brands in your niche…</div>';

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/discover');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.detail || "Network error");
        
        if (!data.suggested_competitors || data.suggested_competitors.length === 0) {
            results.innerHTML = '<div class="cmp-empty">No competitors found. Try adding manually.</div>';
        } else {
            results.innerHTML = data.suggested_competitors.map(domain => `
                <div class="cmp-suggestion-row">
                    <div class="cmp-row-title">${cmpEsc(domain)}</div>
                    <button onclick="addCompetitor('${cmpEsc(domain)}')" class="cmp-btn-small">+ Add</button>
                </div>
            `).join('');
        }
    } catch(e) {
        results.innerHTML = `<div class="cmp-empty cmp-text-red">${cmpEsc(e.message)}</div>`;
    }
    btn.innerText = "Find My Competitors →"; btn.disabled = false;
}

function handleAddKey(e) {
    if (e.key === 'Enter') addCompetitor(document.getElementById('comp-domain').value);
}

async function addCompetitor(domain) {
    if(!domain) return;
    const status = document.getElementById('comp-status');
    status.style.display = 'block'; 
    status.className = 'cmp-status-msg cmp-text-amber'; 
    status.innerText = "Scraping competitor products (takes 5-10s)…";
    
    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${encodeURIComponent(domain)}`);
        const data = await res.json();
        
        if(res.ok && data.status === "success") {
            status.className = 'cmp-status-msg cmp-text-green'; 
            status.innerText = data.message;
            document.getElementById('comp-domain').value = "";
            document.getElementById('discovery-results').innerHTML = ""; 
            fetchCompetitors(); 
            loadCompetitorIntel();
            loadCatalogGaps();
        } else { 
            status.className = 'cmp-status-msg cmp-text-red'; 
            status.innerText = data.detail || data.message || "Error adding."; 
        }
    } catch(e) { 
        status.className = 'cmp-status-msg cmp-text-red'; 
        status.innerText = "Error adding competitor. Check backend."; 
    }
}

async function loadCompetitorIntel() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/opportunities');
        if (!res.ok) return;
        const data = await res.json();

        const stockList = document.getElementById('stockout-list');
        if (data.stock_outs && data.stock_outs.length > 0) {
            stockList.innerHTML = data.stock_outs.map(p => `
                <div class="cmp-product-row">
                    <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(p.title)}</div>
                        <div class="cmp-row-meta">${cmpEsc(p.store)}</div>
                    </div>
                    <div class="cmp-row-price cmp-text-amber">${Number(p.price).toFixed(2)}</div>
                </div>
            `).join('');
        } else { 
            stockList.innerHTML = '<div class="cmp-empty">No stock-outs detected.</div>'; 
        }

        const launchList = document.getElementById('launch-list');
        if (data.new_launches && data.new_launches.length > 0) {
            launchList.innerHTML = data.new_launches.map(p => `
                <div class="cmp-product-row">
                    <img class="cmp-avatar" src="${cmpEsc(p.image || '')}" onerror="this.style.visibility='hidden'">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(p.title)}</div>
                        <div class="cmp-row-meta">${cmpEsc(p.store)} • ${p.date}</div>
                    </div>
                    <div class="cmp-row-price cmp-text-green">${Number(p.price).toFixed(2)}</div>
                </div>
            `).join('');
        } else { 
            launchList.innerHTML = '<div class="cmp-empty">No new launches found.</div>'; 
        }
    } catch(e) { console.error(e); }
}

async function loadCatalogGaps() {
    const list = document.getElementById('gap-list');
    if (!list) return;
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/gaps');
        if (!res.ok) return;
        const data = await res.json();

        if (data.gaps && data.gaps.length > 0) {
            list.innerHTML = data.gaps.map(g => `
                <div class="cmp-product-row">
                    <img class="cmp-avatar" src="${cmpEsc(g.image || '')}" onerror="this.style.visibility='hidden'">
                    <div class="cmp-row-body">
                        <div class="cmp-row-title">${cmpEsc(g.title)}</div>
                        <div class="cmp-row-meta">You sell 0 ${cmpEsc(g.keyword)}s</div>
                    </div>
                    <div class="cmp-row-price cmp-text-violet">$${Number(g.price).toFixed(2)}</div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<div class="cmp-empty cmp-text-green" style="grid-column: span 2;">✅ No catalog gaps found. Your catalog is competitive.</div>';
        }
    } catch(e) { 
        list.innerHTML = '<div class="cmp-empty cmp-text-red" style="grid-column: span 2;">Failed to load gaps.</div>'; 
    }
}


