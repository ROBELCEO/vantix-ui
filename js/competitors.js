let allCompetitors = [];

async function fetchCompetitors() {
    const list = document.getElementById('competitors-list');
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/list');
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        
        allCompetitors = data.competitors || [];
        
        if (allCompetitors.length === 0) {
            list.innerHTML = '<div class="text-tertiary" style="font-size: 12px;">No competitors added yet.</div>';
            return;
        }

        // Fetch products counts by hitting the opportunities endpoint or we can just show the domain
        list.innerHTML = allCompetitors.map(c => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn); margin-bottom: 8px;">
                <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">${c.domain}</div>
                <div class="badge badge-green">Active</div>
            </div>
        `).join('');

    } catch(e) {
        list.innerHTML = '<div class="text-red" style="font-size: 12px;">Failed to load competitors.</div>';
    }
}

async function addCompetitor() {
    const input = document.getElementById('comp-domain');
    const domain = input.value.trim();
    if (!domain) return;

    try {
        input.disabled = true;
        input.placeholder = "Scraping... (takes 5s)";
        
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${encodeURIComponent(domain)}`, { method: 'POST' });
        
        if (res.ok) {
            input.value = '';
            fetchCompetitors();
            loadCompetitorIntel();
            loadCatalogGaps();
        } else {
            const d = await res.json();
            alert(d.detail || "Failed to add competitor.");
        }
    } catch(e) {
        alert("Network error.");
    } finally {
        input.disabled = false;
        input.placeholder = "competitor.com";
    }
}

async function autoDiscover() {
    const btn = event.target;
    btn.innerText = "Scanning market...";
    btn.disabled = true;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/discover');
        const data = await res.json();
        
        if (data.suggested_competitors && data.suggested_competitors.length > 0) {
            const suggested = data.suggested_competitors[0]; // Just take the top one for quick add
            const confirmAdd = confirm(`AI found a top competitor in your niche: ${suggested}\n\nAdd them now?`);
            if (confirmAdd) {
                document.getElementById('comp-domain').value = suggested;
                addCompetitor();
            }
        } else {
            alert("Could not auto-detect competitors right now.");
        }
    } catch(e) {
        alert("Error discovering competitors.");
    } finally {
        btn.innerText = "Find My Competitors →";
        btn.disabled = false;
    }
}

async function loadCompetitorIntel() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/opportunities');
        const data = await res.json();

        const stockList = document.getElementById('stockout-list');
        if (data.stock_outs && data.stock_outs.length > 0) {
            stockList.innerHTML = data.stock_outs.map(p => `
                <div style="display: flex; justify-content: space-between; padding: 10px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn); margin-bottom: 8px;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <img src="${p.image || 'https://via.placeholder.com/32'}" style="width: 32px; height: 32px; border-radius: 4px;">
                        <div style="font-size: 12px; font-weight: 700;">${p.title}</div>
                    </div>
                    <div class="mono text-amber" style="font-size: 12px;">$${p.price}</div>
                </div>
            `).join('');
        } else { stockList.innerHTML = '<div class="text-tertiary" style="font-size: 12px; text-align: center;">No stock-outs detected.</div>'; }

        const launchList = document.getElementById('launch-list');
        if (data.new_launches && data.new_launches.length > 0) {
            launchList.innerHTML = data.new_launches.map(p => `
                <div style="display: flex; justify-content: space-between; padding: 10px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn); margin-bottom: 8px;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <img src="${p.image || 'https://via.placeholder.com/32'}" style="width: 32px; height: 32px; border-radius: 4px;">
                        <div style="font-size: 12px; font-weight: 700;">${p.title}</div>
                    </div>
                    <div class="mono text-green" style="font-size: 12px;">$${p.price}</div>
                </div>
            `).join('');
        } else { launchList.innerHTML = '<div class="text-tertiary" style="font-size: 12px; text-align: center;">No new launches found.</div>'; }

    } catch(e) { console.error(e); }
}

async function loadCatalogGaps() {
    const list = document.getElementById('gap-list');
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/gaps');
        const data = await res.json();

        if (data.gaps && data.gaps.length > 0) {
            list.innerHTML = data.gaps.map(g => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${g.image || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 4px;">
                        <div>
                            <div style="font-weight: 700; font-size: 13px;">${g.title}</div>
                            <div class="text-tertiary" style="font-size: 10px;">You sell 0 ${g.keyword}s</div>
                        </div>
                    </div>
                    <div class="mono text-violet" style="font-weight: 800; font-size: 14px;">$${g.price.toFixed(2)}</div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<div class="text-green" style="font-size: 12px; text-align: center; padding: 12px; grid-column: span 2;">✅ No gaps found.</div>';
        }
    } catch(e) { list.innerHTML = '<div class="text-red" style="text-align: center;">Failed to load gaps.</div>'; }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        fetchCompetitors();
        loadCompetitorIntel();
        loadCatalogGaps();
    }, 500);
});
