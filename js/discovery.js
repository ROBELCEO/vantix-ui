async function loadDiscovery(category = '') {
    // 1. Handle Pill Highlighting (No window.event needed)
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    const pills = document.querySelectorAll('.pill');
    
    if (category === '') {
        if (pills[0]) pills[0].classList.add('active');
    } else {
        pills.forEach(p => {
            if (p.innerText.toLowerCase().includes(category.toLowerCase())) {
                p.classList.add('active');
            }
        });
    }

    // 2. Show Loading State
    const container = document.getElementById('discovery-container');
    if(!container) return;
    container.innerHTML = '<div class="text-tertiary" style="text-align: center; padding: 40px;"><span style="display:inline-block; width:20px; height:20px; border:2px solid var(--accent); border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></span><div style="margin-top:12px;">Searching global Shopify catalog...</div></div>';

    // 3. Fetch Data
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

        // 4. Render UI
        container.innerHTML = data.market_intel.map(item => `
            <div class="panel" style="margin-bottom: 24px; padding: 20px;">
                <div style="display: flex; gap: 20px; align-items: flex-start;">
                    <img src="${item.image}" style="width: 120px; height: 120px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); background: var(--bg-surface);">
                    
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
                                <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: var(--green);">$${item.price.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <div style="color: var(--amber); font-size: 14px;">★★★★★</div>
                                <div style="font-size: 12px; color: var(--text-tertiary);">${item.rating} (${item.review_count} reviews)</div>
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
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load intelligence. Backend might be asleep.</div>';
    }
}
