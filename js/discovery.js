async function loadDiscovery() {
    const container = document.getElementById('discovery-container');
    if(!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends');
        
        if (!res.ok) {
            container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load discovery data. Please refresh.</div>';
            return;
        }

        const data = await res.json();

        if (!data.market_intel || data.market_intel.length === 0) {
            container.innerHTML = '<div class="text-tertiary" style="text-align: center; padding: 40px;">No competitor data found. Add a competitor first.</div>';
            return;
        }

        container.innerHTML = data.market_intel.map(group => {
            const trendsHtml = group.trending_searches.map(t => `<span class="tag-praise" style="background: var(--bg-elevated); color: var(--text-primary); border-color: var(--border-strong); display:inline-block; padding: 4px 8px; border-radius: 4px; font-size:10px; margin: 0 4px 4px 0;">${t}</span>`).join('');
            
            const oppsHtml = group.opportunities.map(opp => {
                const margin = ((opp.retail - opp.wholesale) / opp.retail) * 100;
                const fallbackImg = `https://placehold.co/200x200/141414/00E5FF/png?text=Product`;
                
                let sourceBadge = '';
                if (opp.supplier.includes('AliExpress')) sourceBadge = '<span class="badge badge-green" style="font-size:9px; margin-left:6px;">ALIEXPRESS</span>';
                else if (opp.supplier === 'Competitor') sourceBadge = '<span class="badge badge-accent" style="font-size:9px; margin-left:6px;">COMPETITOR</span>';
                else sourceBadge = '<span class="badge" style="font-size:9px; background:var(--bg-elevated); color:var(--text-tertiary); margin-left:6px;">ESTIMATED</span>';

                return `
                    <div class="product-card">
                        <img src="${opp.image}" class="product-img" onerror="this.onerror=null; this.src='${fallbackImg}';">
                        <div class="product-info">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <div class="product-title">${opp.name} ${sourceBadge}</div>
                                <div class="badge badge-violet">${margin.toFixed(0)}% Margin</div>
                            </div>
                            <div style="margin-top: 8px; display: flex; gap: 16px; font-family: var(--font-mono); font-size: 11px;">
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
                <div class="panel" style="margin-bottom: 24px;">
                    <div class="panel-header" style="font-size: 14px; color: var(--accent); border-bottom-color: var(--border-strong);">
                        Category: ${group.category}
                    </div>
                    <div style="margin-top: 12px; margin-bottom: 16px;">
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">Real-Time Search Demand</div>
                        ${trendsHtml}
                    </div>
                    <div>
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase; margin-bottom: 8px;">Winning Products to Source</div>
                        ${oppsHtml}
                    </div>
                </div>
            `;
        }).join('');

    } catch(e) {
        console.error("Discovery error:", e);
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Backend asleep or network error. Try again in 30s.</div>';
    }
}

if (window.location.pathname.includes('discovery.html')) {
    loadDiscovery();
}
