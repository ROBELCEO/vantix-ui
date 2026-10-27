let planLimit = 10;

async function fetchCompetitors() {
    const list = document.getElementById('comp-list');
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/list');
        if(!res.ok) throw new Error("Network error");
        
        const data = await res.json();
        planLimit = data.limit || 10;
        
        document.getElementById('plan-status').innerText = `You are on the ${(data.tier || 'trial').toUpperCase()} plan. You can track up to ${planLimit} competitors.`;
        document.getElementById('comp-count').innerText = `${(data.competitors || []).length} / ${planLimit} used`;

        if(!data.competitors || data.competitors.length === 0) { 
            list.innerHTML = '<div class="text-tertiary" style="padding: 20px 0; text-align: center;">No competitors tracked yet. Add one to begin.</div>'; 
            return; 
        }
        
        list.innerHTML = data.competitors.map(c => `
            <div class="competitor-row">
                <div>
                    <div style="font-weight: 800; font-size: 15px; color: var(--text-primary);">${c.domain}</div>
                </div>
                <span class="badge badge-green">${c.product_count} Products</span>
            </div>
        `).join('');
    } catch(e) { 
        list.innerHTML = '<div class="text-red" style="text-align: center; padding: 20px;">Failed to load competitors. Please refresh.</div>'; 
    }
}

async function discoverCompetitors() {
    const btn = document.getElementById('discover-btn');
    const results = document.getElementById('discovery-results');
    
    btn.innerText = "Scanning..."; btn.disabled = true;
    results.innerHTML = '<div class="text-tertiary" style="text-align: center; font-size: 12px;">Searching for brands...</div>';

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/discover');
        if(!res.ok) throw new Error("Network error");
        const data = await res.json();
        
        if (!data.suggested_competitors || data.suggested_competitors.length === 0) {
            results.innerHTML = '<div class="text-tertiary" style="text-align: center; font-size: 12px;">No competitors found. Try adding manually.</div>';
        } else {
            results.innerHTML = data.suggested_competitors.map(domain => `
                <div class="suggestion-row">
                    <div style="font-weight: 700; font-size: 13px;">${domain}</div>
                    <button onclick="addCompetitor('${domain}')" class="btn btn-primary" style="padding: 4px 12px; font-size: 11px;">+ Add</button>
                </div>
            `).join('');
        }
    } catch(e) {
        results.innerHTML = '<div class="text-red" style="text-align: center; font-size: 12px;">Discovery failed. Try again.</div>';
    }
    btn.innerText = "Find More Competitors →"; btn.disabled = false;
}

async function addCompetitor(domain) {
    if(!domain) return;
    const status = document.getElementById('comp-status');
    status.style.display = 'block'; status.className = 'text-amber'; status.innerText = "Scraping...";
    
    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${domain}`);
        const data = await res.json();
        
        if(data.status === "success") {
            status.className = 'text-green'; status.innerText = data.message;
            document.getElementById('comp-domain').value = "";
            document.getElementById('discovery-results').innerHTML = ""; 
            fetchCompetitors(); 
        } else { 
            status.className = 'text-red'; status.innerText = data.detail || data.message; 
        }
    } catch(e) { 
        status.className = 'text-red'; status.innerText = "Error adding competitor."; 
    }
}
