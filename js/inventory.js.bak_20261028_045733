function invEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
}

function invMoney(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return "—";
    return "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function loadInventory() {
    const list = document.getElementById('inventory-list');
    const statusEl = document.getElementById('inv-status');
    if (!list) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/inventory/analytics');
        if (!res.ok) throw new Error("HTTP " + res.status);
        
        const data = await res.json();
        if (statusEl) statusEl.innerText = "Live Data";

        // Render KPIs
        document.getElementById('kpi-cash').innerText = invMoney(data.kpis.total_cash || 0);
        document.getElementById('kpi-restock').innerText = data.kpis.restock_alerts || 0;
        document.getElementById('kpi-dead').innerText = data.kpis.dead_stock || 0;

        if (!data.inventory || data.inventory.length === 0) {
            list.innerHTML = '<div class="inv-empty">No inventory found. Connect your Shopify store to sync products.</div>';
            return;
        }

        // Render List
        list.innerHTML = data.inventory.map(item => {
            let statusBadge = '';
            
            // Status Logic based on backend days_remaining
            if (item.days_remaining === null) {
                statusBadge = '<div class="inv-badge inv-badge-red">DEAD STOCK</div>';
            } else if (item.days_remaining <= 14) {
                statusBadge = `<div class="inv-badge inv-badge-amber">RUNS OUT IN ${item.days_remaining} DAYS</div>`;
            } else {
                statusBadge = `<div class="inv-badge inv-badge-green">${item.days_remaining} DAYS LEFT</div>`;
            }

            const restockHtml = item.restock_qty > 0 
                ? `<div class="inv-restock-text">Order ${item.restock_qty} units</div>` 
                : '';

            return `
                <div class="inv-product-row">
                    <!-- Product Info -->
                    <div class="inv-col-info">
                        <img class="inv-product-img" src="${invEsc(item.image || '')}" onerror="this.style.visibility='hidden'">
                        <div>
                            <div class="inv-product-title">${invEsc(item.title)}</div>
                            <div class="inv-product-meta">${item.sold_60d} sold in last 60 days</div>
                        </div>
                    </div>
                    
                    <!-- Stock -->
                    <div class="inv-col-stat">
                        <div class="inv-stat-label">Stock</div>
                        <div class="inv-stat-value">${item.stock}</div>
                    </div>

                    <!-- Cash Value -->
                    <div class="inv-col-stat">
                        <div class="inv-stat-label">Cash Value</div>
                        ${item.cash_value !== null 
                            ? `<div class="inv-stat-value inv-text-green">${invMoney(item.cash_value)}</div>`
                            : `<div class="inv-stat-value inv-text-red" style="font-size:12px; font-weight:bold;">MISSING COST</div>`
                        }
                    </div>

                    <!-- Status -->
                    <div class="inv-col-status">
                        ${statusBadge}
                        ${restockHtml}
                    </div>
                </div>
            `;
        }).join('');

    } catch(e) {
        console.error("Inventory error:", e);
        list.innerHTML = '<div class="inv-empty inv-text-red">Network error. Failed to load inventory data.</div>';
        if (statusEl) statusEl.innerText = "Offline";
    }
}

