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
            <div style="font-weight:800; font-size:11px; color:#09090B; margin-bottom:4px;">Pro Feature</div>
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

async function loadInventory() {
    const list = document.getElementById('inventory-list');
    if (!list) return;

    // 1. Check tier and apply locks IMMEDIATELY
    const tier = await ensureInvTier();
    if (tier === 'starter') {
        applyInvStarterLocks();
    }

    // 2. Fetch data
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/inventory/analytics');
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();

        // Update KPIs only if not locked
        if (tier !== 'starter') {
            const cashEl = document.getElementById('kpi-cash');
            if (cashEl) {
                if (data.kpis.has_missing_costs) {
                    cashEl.innerText = invMoney(data.kpis.total_cash || 0) + "*";
                    cashEl.classList.add("inv-text-red");
                } else {
                    cashEl.innerText = invMoney(data.kpis.total_cash || 0);
                    cashEl.classList.add("inv-text-green");
                }
            }
            const restockEl = document.getElementById('kpi-restock');
            if (restockEl) restockEl.innerText = data.kpis.restock_alerts || 0;
            
            const deadEl = document.getElementById('kpi-dead');
            if (deadEl) deadEl.innerText = data.kpis.dead_stock || 0;
        }

        // Render the list
        if (!data.inventory || data.inventory.length === 0) {
            list.innerHTML = '<div class="inv-empty">No inventory found. Sync your Shopify store to populate.</div>';
            return;
        }

        list.innerHTML = data.inventory.map(item => `
            <div class="inv-row">
                <img class="inv-img" src="${item.image || 'https://via.placeholder.com/40'}">
                <div class="inv-row-body">
                    <div class="inv-row-title">${item.title}</div>
                    <div class="inv-row-meta">${item.sku || 'No SKU'}</div>
                </div>
                <div class="inv-row-stats">
                    <div class="inv-stat"><span>Stock:</span> <b>${item.stock}</b></div>
                    <div class="inv-stat"><span>Days Left:</span> <b>${item.days_remaining || '—'}</b></div>
                    <div class="inv-stat"><span>Restock:</span> <b>${item.restock_qty || 0}</b></div>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Inventory error:", e);
        list.innerHTML = '<div class="inv-empty inv-text-red">Network error. Failed to load inventory data.</div>';
    }
}
