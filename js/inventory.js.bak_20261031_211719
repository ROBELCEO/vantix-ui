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

window.toggleInvGroup = function(groupId) {
    const el = document.getElementById(groupId);
    const chevron = document.getElementById(groupId + '-chevron');
    if (!el) return;
    if (el.style.display === 'none') {
        el.style.display = 'block';
        if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
        el.style.display = 'none';
        if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
};

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

        // Group by Parent Product (using correct backend keys)
        const grouped = {};
        data.inventory.forEach(item => {
            const pTitle = item.parent_title || 'Unknown Product';
            if (!grouped[pTitle]) {
                grouped[pTitle] = {
                    title: pTitle,
                    image: item.image,
                    variants: [],
                    total_stock: 0,
                    min_days: null,
                    total_restock: 0
                };
            }
            const g = grouped[pTitle];
            g.variants.push(item);
            g.total_stock += (item.stock || 0);
            g.total_restock += (item.restock_qty || 0);
            
            if (item.days_remaining !== null && item.days_remaining !== undefined) {
                if (g.min_days === null || item.days_remaining < g.min_days) {
                    g.min_days = item.days_remaining;
                }
            }
        });

        // Render Accordion
        let html = '';
        Object.keys(grouped).forEach((key, index) => {
            const g = grouped[key];
            const groupId = 'inv-group-' + index;
            
            // Parent Row
            html += `
            <div style="border-bottom: 1px solid #F1F5F9 !important; background: #FFFFFF !important;">
                <div onclick="toggleInvGroup('${groupId}')" style="display: flex !important; align-items: center !important; gap: 16px !important; padding: 16px !important; cursor: pointer !important; transition: background 0.2s !important;" onmouseover="this.style.background='#F8FAFC'" onmouseout="this.style.background='#FFFFFF'">
                    
                    <img src="${g.image || 'https://via.placeholder.com/44'}" style="width: 44px !important; height: 44px !important; max-width: 44px !important; max-height: 44px !important; min-width: 44px !important; min-height: 44px !important; border-radius: 4px !important; object-fit: cover !important; border: 1px solid #E4E4E7 !important; flex-shrink: 0 !important; display: block !important;">
                    
                    <div style="flex: 1 !important; min-width: 0 !important;">
                        <div style="font-weight: 800 !important; font-size: 15px !important; color: #09090B !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;">${g.title}</div>
                        <div style="font-size: 12px !important; color: #71717A !important; font-weight: 600 !important; margin-top: 2px !important;">${g.variants.length} Variant${g.variants.length > 1 ? 's' : ''}</div>
                    </div>
                    
                    <div style="display: flex !important; gap: 32px !important; text-align: right !important; flex-shrink: 0 !important;">
                        <div style="width: 60px !important;">
                            <div style="font-size: 10px !important; color: #71717A !important; text-transform: uppercase !important; font-weight: 700 !important; margin-bottom: 4px !important;">Total Stock</div>
                            <div style="font-weight: 800 !important; font-size: 15px !important; font-family: var(--font-mono) !important; color: ${g.total_stock <= 0 ? '#E11D48' : '#09090B'} !important;">${g.total_stock}</div>
                        </div>
                        <div style="width: 70px !important;">
                            <div style="font-size: 10px !important; color: #71717A !important; text-transform: uppercase !important; font-weight: 700 !important; margin-bottom: 4px !important;">Days Left</div>
                            <div style="font-weight: 800 !important; font-size: 15px !important; font-family: var(--font-mono) !important; color: ${g.min_days !== null && g.min_days < 7 ? '#E11D48' : '#09090B'} !important;">${g.min_days !== null ? g.min_days : '—'}</div>
                        </div>
                        <div style="width: 60px !important;">
                            <div style="font-size: 10px !important; color: #71717A !important; text-transform: uppercase !important; font-weight: 700 !important; margin-bottom: 4px !important;">Restock</div>
                            <div style="font-weight: 800 !important; font-size: 15px !important; font-family: var(--font-mono) !important; color: #0284C7 !important;">${g.total_restock}</div>
                        </div>
                    </div>
                    
                    <div id="${groupId}-chevron" style="width: 24px !important; height: 24px !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: transform 0.2s !important; color: #A1A1AA !important; transform: rotate(0deg) !important;">
                        ▼
                    </div>
                </div>
                
                <!-- Variants Container (Hidden by default) -->
                <div id="${groupId}" style="display: none !important; background: #F8FAFC !important; padding: 8px 16px 16px 76px !important;">
            `;

            // Variant Rows
            g.variants.forEach(v => {
                const vTitle = v.variant_title || 'Default Title';
                html += `
                    <div style="display: flex !important; align-items: center !important; gap: 16px !important; padding: 12px 0 !important; border-bottom: 1px dashed #E4E4E7 !important;">
                        <div style="flex: 1 !important; min-width: 0 !important;">
                            <div style="font-weight: 700 !important; font-size: 13px !important; color: #3F3F46 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important;">${vTitle}</div>
                        </div>
                        <div style="display: flex !important; gap: 32px !important; text-align: right !important; flex-shrink: 0 !important;">
                            <div style="width: 60px !important;">
                                <div style="font-weight: 800 !important; font-size: 14px !important; font-family: var(--font-mono) !important; color: ${v.stock <= 0 ? '#E11D48' : '#09090B'} !important;">${v.stock}</div>
                            </div>
                            <div style="width: 70px !important;">
                                <div style="font-weight: 800 !important; font-size: 14px !important; font-family: var(--font-mono) !important; color: ${v.days_remaining !== null && v.days_remaining < 7 ? '#E11D48' : '#09090B'} !important;">${v.days_remaining !== null && v.days_remaining !== undefined ? v.days_remaining : '—'}</div>
                            </div>
                            <div style="width: 60px !important;">
                                <div style="font-weight: 800 !important; font-size: 14px !important; font-family: var(--font-mono) !important; color: #0284C7 !important;">${v.restock_qty || 0}</div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                </div>
            </div>`;
        });

        list.innerHTML = html;

    } catch (e) {
        console.error("Inventory error:", e);
        list.innerHTML = '<div class="inv-empty inv-text-red">Network error. Failed to load inventory data.</div>';
    }
}
