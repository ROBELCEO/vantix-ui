async function loadDiscovery(category = '') {
    const container = document.getElementById('discovery-container');
    if(!container) return;

    container.innerHTML = '<div class="text-tertiary" style="text-align: center; padding: 40px;"><span style="display:inline-block; width:20px; height:20px; border:2px solid var(--accent); border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></span><div style="margin-top:12px;">Searching global Shopify catalog...</div></div>';

    try {
        const url = category 
            ? `https://vantix-my5f.onrender.com/api/discovery/trends?category=${category}`
            : 'https://vantix-my5f.onrender.com/api/discovery/trends';
            
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            container.innerHTML = `<div class="text-red" style="text-align: center; padding: 40px;">${data.error}</div>`;
            return;
        }

        container.innerHTML = data.market_intel.map(item => `
            <div class="panel" style="margin-bottom: 24px; padding: 20px;">
                <div style="display: flex; gap: 20px; align-items: flex-start;">
                    <div style="width: 120px; height: 120px; background: var(--bg-elevated); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-tertiary); font-size: 10px;">No Image</div>
                    
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div>
                                <div style="font-weight: 900; font-size: 18px; color: var(--text-primary);">${item.name}</div>
                                <div style="font-size: 12px; color: var(--text-tertiary);">Found on: <b>${item.store}</b></div>
                            </div>
                            <div class="badge badge-green" style="font-size: 12px;">GLOBAL CATALOG</div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 16px;">
                            <div>
                                <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: var(--green);">$${item.price}</span>
                            </div>
                        </div>

                        <div style="background: var(--bg-surface); border-left: 3px solid var(--violet); padding: 12px; border-radius: 4px;">
                            <div style="font-size: 10px; font-weight: 800; color: var(--violet); margin-bottom: 8px; text-transform: uppercase;">⚡ AI Goldmine Signals</div>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                ${item.bullets.map(b => `<li>${b}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch(e) {
        console.error("Discovery error:", e);
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load intelligence.</div>';
    }
}

// Load default on page load
if (window.location.pathname.includes('discovery.html')) {
    setTimeout(() => {
        const firstPill = document.querySelector('.pill');
        if (firstPill) loadDiscoveryWithPill('', firstPill);
    }, 200);
}

function loadDiscoveryWithPill(category, pillElement) {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    if (pillElement) pillElement.classList.add('active');
    fetchData(category);
}

async function loadDiscovery(category) {
    const event = window.event;
    loadDiscoveryWithPill(category, event.target);
}

async function fetchData(category) {
    const container = document.getElementById('discovery-container');
    try {
        const url = category 
            ? `https://vantix-my5f.onrender.com/api/discovery/trends?category=${category}`
            : 'https://vantix-my5f.onrender.com/api/discovery/trends';
            
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            container.innerHTML = `<div class="text-red" style="text-align: center; padding: 40px;">${data.error}</div>`;
            return;
        }

        container.innerHTML = data.market_intel.map(item => `
            <div class="panel" style="margin-bottom: 24px; padding: 20px;">
                <div style="display: flex; gap: 20px; align-items: flex-start;">
                    <div style="width: 120px; height: 120px; background: var(--bg-elevated); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-tertiary); font-size: 10px;">No Image</div>
                    
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div>
                                <div style="font-weight: 900; font-size: 18px; color: var(--text-primary);">${item.name}</div>
                                <div style="font-size: 12px; color: var(--text-tertiary);">Found on: <b>${item.store}</b></div>
                            </div>
                            <div class="badge badge-green" style="font-size: 12px;">GLOBAL CATALOG</div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 16px;">
                            <div>
                                <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: var(--green);">$${item.price}</span>
                            </div>
                        </div>

                        <div style="background: var(--bg-surface); border-left: 3px solid var(--violet); padding: 12px; border-radius: 4px;">
                            <div style="font-size: 10px; font-weight: 800; color: var(--violet); margin-bottom: 8px; text-transform: uppercase;">⚡ AI Goldmine Signals</div>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                ${item.bullets.map(b => `<li>${b}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch(e) {
        console.error("Discovery error:", e);
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load intelligence.</div>';
    }
}
