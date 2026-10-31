let _invTierPromise = null;
function ensureInvTier() {
    if (window.invTier) return Promise.resolve(window.invTier);
    if (_invTierPromise) return _invTierPromise;
    _invTierPromise = fetch('https://vantix-my5f.onrender.com/api/auth/status')
        .then(r => r.ok ? r.json() : { plan: 'trial' })
        .then(d => {
            window.invTier = d.plan || 'trial';
            return window.invTier;
        })
        .catch(() => {
            window.invTier = 'trial';
            return window.invTier;
        });
    return _invTierPromise;
}

function invLockHtml() {
    return `
        <div class="lock-overlay" style="position:absolute; inset:0; z-index:10; backdrop-filter:blur(4px); background:rgba(255,255,255,0.75); display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:2px; min-height:80px;">
            <div style="font-size:16px; margin-bottom:4px;">🔒</div>
            <a href="membership.html" style="background:#0284C7; color:#FFF; padding:4px 8px; border-radius:2px; text-decoration:none; font-size:10px; font-weight:800;">Upgrade</a>
        </div>
        <div style="min-height:80px;">&nbsp;</div>
    `;
}

function applyInvStarterLocks() {
    ['kpi-cash', 'kpi-restock', 'kpi-dead'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const parent = el.parentElement;
        if (parent) {
            parent.style.position = 'relative';
            parent.innerHTML = invLockHtml();
        }
    });
}
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

function toggleVariants(id) {
    const el = document.getElementById(`group-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    if (el.style.display === 'none') {
        el.style.display = 'block';
        icon.innerText = '▼';
    } else {
        el.style.display = 'none';
        icon.innerText = '▶';
    }
}

async function loadInventory() {
    const list = document.getElementById('inventory-list');
    if (!list) return;

    const tier = await ensureInvTier();

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/inventory/analytics');
        if (!res.ok) throw new Error("HTTP " + res.status);
        
        const data = await res.json();
        if (statusEl) statusEl.innerText = "Live Data";

        if (window.invTier !== 'starter') {
            const cashEl = document.getElementById('kpi-cash');
            if (data.kpis.has_missing_costs) {
                cashEl.innerText = invMoney(data.kpis.total_cash || 0) + "*";
                cashEl.classList.add("inv-text-red");
            } else {
                cashEl.innerText = invMoney(data.kpis.total_cash || 0);
                cashEl.classList.add("inv-text-green");
            }
            document.getElementById('kpi-restock').innerText = data.kpis.restock_alerts || 0;
            document.getElementById('kpi-dead').innerText = data.kpis.dead_stock || 0;
        }

        if (tier === 'starter') {
            applyInvStarterLocks();
        }

        if (!data.inventory || data.inventory.length === 0) {
            list.innerHTML = '<div class="inv-empty">No inventory found. Sync your Shopify store to populate.</div>';
            return;
        }

        // Group by product_id
        const grouped = {};
        data.inventory.forEach(v => {
            if (!grouped[v.product_id]) {
                grouped[v.product_id] = {
                    id: v.product_id,
                    parent_title: v.parent_title,
                    image: v.image,
                    variants: []
                };
            }
            grouped[v.product_id].variants.push(v);
        });

        list.innerHTML = Object.values(grouped).map(group => {
            let totalStock = 0;
            let totalCash = 0;
            let cashMissing = false;
            let totalSold = 0;
            let minDays = Infinity;
            let hasOutOfStock = false;
            let hasDeadStock = false;

            group.variants.forEach(v => {
                totalStock += v.stock;
                if (v.cash_value !== null) totalCash += v.cash_value;
                else cashMissing = true;
                totalSold += v.sold_60d;
                
                if (v.stock === 0) hasOutOfStock = true;
                else if (v.days_remaining === null) hasDeadStock = true;
                else if (v.days_remaining < minDays) minDays = v.days_remaining;
            });

            // Parent Status Logic
            let statusBadge = '';
            if (hasOutOfStock) {
                statusBadge = '<div class="inv-badge inv-badge-red">OUT OF STOCK</div>';
            } else if (minDays <= 14) {
                statusBadge = `<div class="inv-badge inv-badge-amber">RUNS OUT SOON</div>`;
            } else if (hasDeadStock) {
                statusBadge = '<div class="inv-badge inv-badge-red">DEAD STOCK</div>';
            } else {
                statusBadge = '<div class="inv-badge inv-badge-green">HEALTHY</div>';
            }

            // Render Parent Row
            const parentHtml = `
                <div class="inv-product-row" style="cursor: pointer; background: var(--bg-surface); border: 1px solid var(--ov-border); margin-bottom: 4px;" onclick="toggleVariants('${group.id}')">
                    <div class="inv-col-info">
                        <div id="icon-${group.id}" style="width: 20px; color: var(--ov-muted); font-size: 10px;">▶</div>
                        <img class="inv-product-img" src="${invEsc(group.image || '')}" onerror="this.style.visibility='hidden'">
                        <div>
                            <div class="inv-product-title" style="font-size: 14px; font-weight: 800;">${invEsc(group.parent_title)}</div>
                            <div class="inv-product-meta">${group.variants.length} variants</div>
                        </div>
                    </div>
                    
                    <div class="inv-col-stat">
                        <div class="inv-stat-label">Total Stock</div>
                        <div class="inv-stat-value">${totalStock}</div>
                    </div>

                    <div class="inv-col-stat">
                        <div class="inv-stat-label">Total Cash</div>
                        ${cashMissing 
                            ? `<div class="inv-stat-value inv-text-red" style="font-size:12px; font-weight:bold;">MISSING COST</div>`
                            : `<div class="inv-stat-value inv-text-green">${invMoney(totalCash)}</div>`
                        }
                    </div>

                    <div class="inv-col-status">
                        ${statusBadge}
                    </div>
                </div>
            `;

            // Render Child Rows
            const childrenHtml = group.variants.map(item => {
                let childBadge = '';
                if (item.stock === 0) childBadge = '<div class="inv-badge inv-badge-red">OUT OF STOCK</div>';
                else if (item.days_remaining === null) childBadge = '<div class="inv-badge inv-badge-red">DEAD STOCK</div>';
                else if (item.days_remaining <= 14) childBadge = `<div class="inv-badge inv-badge-amber">RUNS OUT IN ${item.days_remaining} DAYS</div>`;
                else childBadge = `<div class="inv-badge inv-badge-green">${item.days_remaining} DAYS LEFT</div>`;

                const restockHtml = item.restock_qty > 0 
                    ? `<div class="inv-restock-text">Order ${item.restock_qty} units</div>` 
                    : '';

                return `
                    <div class="inv-product-row" style="background: #FFFFFF; border-left: 3px solid var(--ov-border); border-bottom: 1px dashed var(--ov-border); padding: 10px 16px; margin-bottom: 2px;">
                        <div class="inv-col-info" style="padding-left: 32px;">
                            <div>
                                <div class="inv-product-title" style="color: var(--ov-text2);">${invEsc(item.variant_title)}</div>
                                <div class="inv-product-meta">${item.sold_60d} sold in 60 days</div>
                            </div>
                        </div>
                        
                        <div class="inv-col-stat">
                            <div class="inv-stat-value" style="font-size: 12px;">${item.stock}</div>
                        </div>

                        <div class="inv-col-stat">
                            ${item.cash_value !== null 
                                ? `<div class="inv-stat-value inv-text-green" style="font-size: 12px;">${invMoney(item.cash_value)}</div>`
                                : `<div class="inv-stat-value inv-text-red" style="font-size: 11px;">MISSING</div>`
                            }
                        </div>

                        <div class="inv-col-status">
                            ${childBadge}
                            ${restockHtml}
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div style="margin-bottom: 12px;">
                    ${parentHtml}
                    <div id="group-${group.id}" style="display: none; padding-left: 16px;">
                        ${childrenHtml}
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


