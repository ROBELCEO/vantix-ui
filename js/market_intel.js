async function loadMarketIntel() {
    const container = document.getElementById('intel-container');
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/market-intel/intelligence');
        const data = await res.json();

        if (!data.market_intel || data.market_intel.length === 0) {
            container.innerHTML = '<div class="text-tertiary" style="text-align: center;">No categories found. Sync your Shopify store first.</div>';
            return;
        }

        container.innerHTML = data.market_intel.map(group => {
            // Render trends
            const trendsHtml = group.trending_searches.map(t => `<span class="trend-pill">${t}</span>`).join('');
            
            // Render opportunities
            const oppsHtml = group.opportunities.map(opp => {
                const margin = ((opp.retail - opp.wholesale) / opp.retail) * 100;
                return `
                    <div class="opp-card">
                        <img src="${opp.image}" class="opp-img">
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div style="font-weight: 800; font-size: 15px; color: var(--text-primary);">${opp.name}</div>
                                <div class="margin-badge">${margin.toFixed(0)}% Margin</div>
                            </div>
                            
                            <div style="margin-top: 8px; display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px;">
                                <div><span class="text-tertiary">Source:</span> <span class="text-amber">$${opp.wholesale.toFixed(2)}</span></div>
                                <div><span class="text-tertiary">Retail:</span> <span class="text-green">$${opp.retail.toFixed(2)}</span></div>
                            </div>
                            
                            <div style="margin-top: 8px; font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
                                <b>Proof:</b> ${opp.reason}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="category-group">
                    <div class="panel-header" style="font-size: 14px; color: var(--accent); border-bottom-color: var(--border-strong);">
                        Category: ${group.category}
                    </div>
                    
                    <div style="margin-top: 12px;">
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">Real-Time Search Demand</div>
                        ${trendsHtml}
                    </div>

                    <div style="margin-top: 16px;">
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">Winning Products to Source</div>
                        ${oppsHtml}
                    </div>
                </div>
            `;
        }).join('');

    } catch(e) {
        container.innerHTML = '<div class="text-red" style="text-align: center;">Failed to load intelligence. Backend might be asleep.</div>';
    }
}
loadMarketIntel();
