async function loadInventory() {
    const list = document.getElementById('inventory-list');
    if (!list) return;
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/inventory/analytics');
        const data = await res.json();

        if (data.error) {
            list.innerHTML = `<div class="text-red" style="text-align: center;">${data.error}</div>`;
            return;
        }

        // Render KPIs
        document.getElementById('kpi-cash').innerText = '$' + data.kpis.total_cash.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('kpi-restock').innerText = data.kpis.restock_alerts;
        document.getElementById('kpi-dead').innerText = data.kpis.dead_stock;

        if (data.inventory.length === 0) {
            list.innerHTML = '<div class="text-tertiary" style="text-align: center;">No inventory found. Sync your Shopify store first.</div>';
            return;
        }

        list.innerHTML = data.inventory.map(item => {
            let statusBadge = '';
            
            if (item.days_remaining === null) {
                statusBadge = '<div class="badge badge-red" style="margin-top: 4px;">Dead Stock (0 Sales)</div>';
            } else if (item.days_remaining <= 14) {
                statusBadge = `<div class="badge badge-amber" style="margin-top: 4px;">Runs out in ${item.days_remaining} days</div>`;
            } else {
                statusBadge = `<div class="badge badge-green" style="margin-top: 4px;">Healthy (${item.days_remaining} days left)</div>`;
            }

            const restockBtn = item.restock_qty > 0 
                ? `<div class="mono text-amber" style="font-size: 11px; font-weight: 800; margin-top: 4px;">Order ${item.restock_qty} units</div>` 
                : '';

            return `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn);">
                    
                    <div style="display: flex; align-items: center; gap: 16px; flex: 2;">
                        <img src="${item.image || 'https://via.placeholder.com/40'}" style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; border: 1px solid var(--border);">
                        <div>
                            <div style="font-weight: 800; font-size: 14px;">${item.title}</div>
                            <div class="text-tertiary" style="font-size: 11px;">${item.sold_60d} sold in last 60 days</div>
                        </div>
                    </div>

                    <div style="flex: 1; text-align: center; border-left: 1px solid var(--border); border-right: 1px solid var(--border);">
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase;">Stock</div>
                        <div class="mono" style="font-size: 16px; font-weight: 800; color: var(--text-primary);">${item.stock}</div>
                    </div>

                    <div style="flex: 1; text-align: center; border-right: 1px solid var(--border);">
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase;">Cash Value</div>
                        <div class="mono text-green" style="font-size: 16px; font-weight: 800;">$${item.cash_value.toFixed(2)}</div>
                    </div>

                    <div style="flex: 1.5; display: flex; flex-direction: column; align-items: flex-end;">
                        ${statusBadge}
                        ${restockBtn}
                    </div>
                </div>
            `;
        }).join('');

    } catch(e) {
        console.error("Inventory error:", e);
        list.innerHTML = '<div class="text-red" style="text-align: center;">Failed to load inventory. Backend might be asleep.</div>';
    }
}
