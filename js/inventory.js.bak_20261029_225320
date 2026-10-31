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

        // BULLETPROOF INLINE STYLES (Prevents image stretching)
        list.innerHTML = data.inventory.map(item => `
            <div style="display: flex !important; align-items: center !important; gap: 16px !important; padding: 16px !important; border-bottom: 1px solid #F1F5F9 !important;">
                
                <img src="${item.image || 'https://via.placeholder.com/40'}" style="width: 44px !important; height: 44px !important; max-width: 44px !important; max-height: 44px !important; min-width: 44px !important; min-height: 44px !important; border-radius: 4px !important; object-fit: cover !important; border: 1px solid #E4E4E7 !important; flex-shrink: 0 !important; display: block !important;">
                
                <div style="flex: 1 !important; min-width: 0 !important;">
                    <div style="font-weight: 800 !important; font-size: 14px !important; color: #09090B !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;">${item.title}</div>
                    <div style="font-size: 12px !important; color: #71717A !important; font-family: var(--font-mono) !important; margin-top: 2px !important;">${item.sku || 'No SKU'}</div>
                </div>
                
                <div style="display: flex !important; gap: 32px !important; text-align: right !important; flex-shrink: 0 !important;">
                    <div style="width: 60px !important;">
                        <div style="font-size: 10px !important; color: #71717A !important; text-transform: uppercase !important; font-weight: 700 !important; margin-bottom: 4px !important;">Stock</div>
                        <div style="font-weight: 800 !important; font-size: 15px !important; font-family: var(--font-mono) !important; color: ${item.stock <= 0 ? '#E11D48' : '#09090B'} !important;">${item.stock}</div>
                    </div>
                    <div style="width: 70px !important;">
                        <div style="font-size: 10px !important; color: #71717A !important; text-transform: uppercase !important; font-weight: 700 !important; margin-bottom: 4px !important;">Days Left</div>
                        <div style="font-weight: 800 !important; font-size: 15px !important; font-family: var(--font-mono) !important; color: ${item.days_remaining !== null && item.days_remaining < 7 ? '#E11D48' : '#09090B'} !important;">${item.days_remaining !== null && item.days_remaining !== undefined ? item.days_remaining : '—'}</div>
                    </div>
                    <div style="width: 60px !important;">
                        <div style="font-size: 10px !important; color: #71717A !important; text-transform: uppercase !important; font-weight: 700 !important; margin-bottom: 4px !important;">Restock</div>
                        <div style="font-weight: 800 !important; font-size: 15px !important; font-family: var(--font-mono) !important; color: #0284C7 !important;">${item.restock_qty || 0}</div>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (e) {
        console.error("Inventory error:", e);
        list.innerHTML = '<div class="inv-empty inv-text-red">Network error. Failed to load inventory data.</div>';
    }
}
