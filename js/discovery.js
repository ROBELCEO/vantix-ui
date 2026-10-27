async function loadDiscovery() {
    const container = document.getElementById('discovery-container');
    if(!container) return;

    container.innerHTML = '<div class="text-tertiary" style="text-align: center; padding: 40px;"><span style="display:inline-block; width:20px; height:20px; border:2px solid var(--accent); border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></span><div style="margin-top:12px;">Scanning Shopify Market, Google Trends & Reviews...</div></div>';

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends');
        const data = await res.json();

        if (data.error) {
            container.innerHTML = `<div class="text-red" style="text-align: center; padding: 40px;">${data.error}</div>`;
            return;
        }

        container.innerHTML = data.market_intel.map(item => `
            <div class="panel" style="margin-bottom: 24px; border-color: var(--accent);">
                <div style="display: flex; gap: 16px;">
                    <img src="${item.image}" style="width: 100px; height: 100px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border);">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="font-weight: 900; font-size: 16px; color: var(--text-primary);">${item.name}</div>
                            <div class="badge badge-green" style="font-size: 12px;">Trending Now</div>
                        </div>
                        <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 8px;">Found on: ${item.store} | Price: $${item.price}</div>
                        
                        <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.6; background: var(--bg-surface); padding: 12px; border-radius: 6px;">
                            <b style="color: var(--violet);">⚡ AI Market Strategy:</b><br>${item.ai_summary}
                        </div>
                    </div>
                </div>
                
                <div style="margin-top: 16px; border-top: 1px solid var(--border); padding-top: 12px;">
                    <div style="font-size: 10px; text-transform: uppercase; color: var(--text-tertiary); margin-bottom: 8px;">Real Customer Reviews:</div>
                    ${item.reviews.length > 0 ? item.reviews.map(r => `
                        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px; font-style: italic; padding-left: 8px; border-left: 2px solid var(--border-strong);">"${r}"</div>
                    `).join('') : '<div style="font-size: 11px; color: var(--text-tertiary);">No public reviews found for this product.</div>'}
                </div>
            </div>
        `).join('');

    } catch(e) {
        console.error("Discovery error:", e);
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load intelligence. Backend might be asleep.</div>';
    }
}
