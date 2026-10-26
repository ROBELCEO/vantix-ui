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
            const trendsHtml = group.trending_searches.map(t => `<span class="trend-pill">${t}</span>`).join('');
            
            const oppsHtml = group.opportunities.map(opp => {
                const margin = ((opp.retail - opp.wholesale) / opp.retail) * 100;
                const fallbackImg = `https://placehold.co/200x200/141414/00E5FF/png?text=Product`;
                
                let sourceBadge = '';
                if (opp.supplier.includes('AliExpress')) sourceBadge = '<span class="badge badge-green" style="font-size:9px;">ALIEXPRESS</span>';
                else if (opp.supplier === 'Competitor') sourceBadge = '<span class="badge badge-accent" style="font-size:9px;">COMPETITOR</span>';
                else sourceBadge = '<span class="badge" style="font-size:9px; background:var(--bg-elevated); color:var(--text-tertiary);">ESTIMATED</span>';

                // SHOW THE ERROR IF IT EXISTS
                const errorHtml = opp.debug_error ? `<div style="color: var(--red); font-size: 10px; margin-top: 8px;">API Error: ${opp.debug_error}</div>` : '';

                return `
                    <div class="opp-card">
                        <img src="${opp.image}" class="opp-img" onerror="this.onerror=null; this.src='${fallbackImg}';">
                        
                        <div style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div style="font-weight: 800; font-size: 15px; color: var(--text-primary);">
                                    ${opp.name} ${sourceBadge}
                                </div>
                                <div class="margin-badge">${margin.toFixed(0)}% Margin</div>
                            </div>
                            
                            <div style="margin-top: 8px; display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px;">
                                <div><span class="text-tertiary">Source:</span> <span class="text-amber">$${opp.wholesale.toFixed(2)}</span></div>
                                <div><span class="text-tertiary">Retail:</span> <span class="text-green">$${opp.retail.toFixed(2)}</span></div>
                            </div>
                            
                            <div style="margin-top: 8px; font-size: 11px; color: var(--text-secondary); line-height: 1.4;">
                                <b>Proof:</b> ${opp.reason}
                            </div>
                            ${errorHtml}
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
