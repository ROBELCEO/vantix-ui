// 1. Fetch the list of competitors
async function fetchCompetitors() {
    const list = document.getElementById('comp-list');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/list');
        const data = await res.json();
        
        if(!data.competitors || data.competitors.length === 0) { 
            list.innerHTML = '<div class="text-tertiary" style="padding: 20px 0; text-align: center;">No competitors tracked yet. Add one to begin.</div>'; 
            return; 
        }
        
        list.innerHTML = data.competitors.map(c => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://ui-avatars.com/api/?name=${c.domain}&background=141414&color=00E5FF" class="thumb" style="width: 32px; height: 32px;">
                    <span style="font-weight: 600; font-size: 13px;">${c.domain}</span>
                </div>
                <span class="badge badge-accent">${c.product_count} Products</span>
            </div>
        `).join('');
    } catch(e) { 
        list.innerHTML = '<div class="text-red" style="padding: 20px 0; text-align: center;">Failed to load data.</div>'; 
    }
}

// 2. Add a new competitor
async function addCompetitor() {
    const domainInput = document.getElementById('comp-domain').value.trim();
    const btn = document.getElementById('add-btn');
    const status = document.getElementById('comp-status');
    
    if(!domainInput) {
        status.style.display = 'block';
        status.className = 'text-amber';
        status.innerText = "Please enter a domain.";
        return;
    }
    
    btn.innerText = "Scraping catalog..."; 
    btn.disabled = true; 
    status.style.display = 'none';
    
    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${domainInput}`);
        const data = await res.json();
        
        if(data.status === "success") {
            status.style.display = 'block';
            status.className = 'text-green';
            status.innerText = data.message;
            document.getElementById('comp-domain').value = "";
            fetchCompetitors(); // Reload the list
        } else { 
            status.style.display = 'block';
            status.className = 'text-red';
            status.innerText = data.detail || data.message; 
        }
    } catch(e) { 
        status.style.display = 'block';
        status.className = 'text-red';
        status.innerText = "Error: Backend asleep or invalid domain."; 
    }
    
    btn.innerText = "Scrape Competitor →"; 
    btn.disabled = false;
}

// Run on page load
fetchCompetitors();
