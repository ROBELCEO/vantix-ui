async function fetchCompetitors() {
    const list = document.getElementById('comp-list');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/list');
        const data = await res.json();
        
        if(!data.competitors || data.competitors.length === 0) { 
            list.innerHTML = '<div class="text-tertiary" style="padding: 20px 0; text-align: center;">No competitors tracked yet. Add one above to begin.</div>'; 
            return; 
        }
        
        list.innerHTML = data.competitors.map(c => `
            <div class="competitor-row">
                <div class="comp-info">
                    <div class="comp-logo">${c.domain.substring(0, 2).toUpperCase()}</div>
                    <div>
                        <div class="comp-domain">${c.domain}</div>
                        <div class="comp-date">Last synced: Just now</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <span class="badge badge-green">${c.product_count} Products</span>
                </div>
            </div>
        `).join('');
    } catch(e) { 
        list.innerHTML = '<div class="text-red" style="padding: 20px 0; text-align: center;">Failed to load competitors.</div>'; 
    }
}

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
    
    // Clean the domain (remove https://, www., etc)
    const cleanDomain = domainInput.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    
    btn.innerText = "Scraping catalog..."; 
    btn.disabled = true; 
    status.style.display = 'none';
    
    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${cleanDomain}`);
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
        status.innerText = "Error: Backend might be asleep. Try again."; 
    }
    
    btn.innerText = "Scrape Competitor →"; 
    btn.disabled = false;
}

// Run on page load
fetchCompetitors();
