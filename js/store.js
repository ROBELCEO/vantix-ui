function stEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}
function stMoney(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return "—";
    return "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function stNum(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return "—";
    return v.toLocaleString();
}

function storeLockHtml() {
    return `
        <div class="lock-overlay" style="position:absolute; inset:0; z-index:10; backdrop-filter:blur(4px); background:rgba(255,255,255,0.75); display:flex; flex-direction:column; align-items:center; justify-content:center; border-radius:2px; min-height:140px;">
            <div style="font-size:22px; margin-bottom:6px;">🔒</div>
            <div style="font-weight:800; font-size:13px; color:#09090B; margin-bottom:6px;">Pro Feature</div>
            <a href="membership.html" style="background:#0284C7; color:#FFF; padding:6px 12px; border-radius:2px; text-decoration:none; font-size:11px; font-weight:800;">Upgrade to Pro</a>
        </div>
        <div style="min-height:140px;">&nbsp;</div>
    `;
}

function applyStoreStarterLocks() {
    ['carts-list', 'dead-stock-list', 'bundle-container', 'ltv-list'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.position = 'relative';
        el.innerHTML = storeLockHtml();
    });
}

function renderCarts(carts) {
    window.stAllCarts = carts || [];
    const list = document.getElementById('carts-list');
    if(!list) return;
    if (carts.length === 0) { list.innerHTML = '<div class="st-empty">No abandoned carts.</div>'; return; }
    list.innerHTML = carts.slice(0, 5).map(c => `
        <div class="st-product-row">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(c.item)}</div>
                <div class="st-row-meta">${stEsc(c.email)}</div>
            </div>
            <div class="st-row-amount st-amber">${stMoney(c.value)}</div>
            <a href="${stEsc(c.url)}" target="_blank" class="st-row-action">Recover</a>
        </div>
    `).join('');
}

function renderLowStock(lowStock) {
    const list = document.getElementById('low-stock-list');
    if(!list) return;
    if (!lowStock || lowStock.length === 0) { list.innerHTML = '<div class="st-empty st-empty-good">✅ No low stock alerts.</div>'; return; }
    list.innerHTML = lowStock.slice(0, 3).map(s => `
        <div class="st-product-row">
            <img class="st-product-img" src="${stEsc(s.image || 'https://via.placeholder.com/36')}">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(s.title)}</div>
                <div class="st-row-meta">Running out soon</div>
            </div>
            <div class="st-row-amount st-red">${stNum(s.qty)} left</div>
        </div>
    `).join('');
}

function renderCustomerChart() {
    const list = document.getElementById('customer-snapshot');
    if(!list) return;
    // Simplistic fallback for snapshot
    list.innerHTML = `
        <div class="st-cust-grid">
            <div class="st-cust-stat">
                <div class="st-kpi-label">Total Customers</div>
                <div class="st-kpi-value">—</div>
            </div>
            <div class="st-cust-stat">
                <div class="st-kpi-label">Returning Rate</div>
                <div class="st-kpi-value">—</div>
            </div>
        </div>
    `;
}

async function loadDeadStock() {
    const list = document.getElementById('dead-stock-list');
    if (!list) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/dead-stock');
        const data = await res.json();
        if (!data.dead_items || data.dead_items.length === 0) {
            list.innerHTML = '<div class="st-empty st-empty-good">✅ No dead stock!</div>';
            return;
        }
        list.innerHTML = data.dead_items.map(d => `
            <div class="st-product-row">
                <img class="st-product-img" src="${stEsc(d.image || 'https://via.placeholder.com/36')}">
                <div class="st-row-body">
                    <div class="st-row-title">${stEsc(d.title)}</div>
                    <div class="st-row-meta">${stNum(d.stock)} units</div>
                </div>
                <div class="st-row-amount st-red">${stMoney(d.cash_trapped)}</div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = '<div class="st-empty st-red">Failed to load.</div>';
    }
}

async function loadBundleSuggestion() {
    const container = document.getElementById('bundle-container');
    if (!container) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/bundles');
        const data = await res.json();
        if (data.error) { container.innerHTML = `<div class="st-empty">${stEsc(data.error)}</div>`; return; }
        container.innerHTML = `
            <div class="st-bundle">
                <div class="st-bundle-top">
                    <div>
                        <div class="st-bundle-title">${stEsc(data.ai.bundle_name)}</div>
                        <div class="st-row-meta">Bought ${data.frequency} times</div>
                    </div>
                    <div class="st-bundle-pricing">
                        <div class="st-bundle-orig">${stMoney(data.original_total)}</div>
                        <div class="st-bundle-new">${stMoney(data.ai.suggested_price)}</div>
                    </div>
                </div>
                <div class="st-bundle-pitch">${stEsc(data.ai.pitch)}</div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = '<div class="st-empty st-red">Failed to load.</div>';
    }
}

async function loadCustomerLTV() {
    const list = document.getElementById('ltv-list');
    if (!list) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/customers');
        const data = await res.json();
        if (!data.customers || data.customers.length === 0) { list.innerHTML = '<div class="st-empty">No customer data yet.</div>'; return; }
        list.innerHTML = data.customers.map(c => `
            <div class="st-product-row">
                <div class="st-row-body">
                    <div class="st-row-title">${stEsc(c.name)}</div>
                    <div class="st-row-meta">${stNum(c.orders)} orders</div>
                </div>
                <div class="st-row-amount st-cyan">${stMoney(c.spent)}</div>
            </div>
        `).join('');
    } catch (e) {
        list.innerHTML = '<div class="st-empty st-red">Failed to load.</div>';
    }
}

async function loadStoreData() {
    const nameEl = document.getElementById('store-name');
    if(!nameEl) return;
    nameEl.innerText = "Loading...";

    let tier = 'trial';
    try {
        const statusRes = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        if (statusRes.ok) {
            const statusData = await statusRes.json();
            tier = statusData.plan || 'trial';
        }
    } catch (e) { console.error("Tier check failed", e); }

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/detailed');
        const data = await res.json();

        if (data.profile) {
            nameEl.innerText = data.profile.name || "My Store";
            const dom = document.getElementById('store-domain');
            if (dom) dom.innerText = data.profile.domain || "Connected via Shopify";
        }

        if (data.kpis) {
            document.getElementById('kpi-revenue').innerText = stMoney(data.kpis.total_revenue);
            document.getElementById('kpi-orders').innerText = stNum(data.kpis.order_count);
            document.getElementById('kpi-aov').innerText = stMoney(data.kpis.aov);
            document.getElementById('kpi-abandoned').innerText = stMoney(data.kpis.abandoned_value);
            
            const npEl = document.getElementById('kpi-net-profit');
            if (data.kpis.net_profit !== null) {
                npEl.innerText = stMoney(data.kpis.net_profit);
                npEl.className = "st-kpi-value " + (data.kpis.net_profit < 0 ? "st-red" : "st-green");
            } else {
                npEl.innerText = "—";
                const setupBtn = document.getElementById('kpi-net-profit-setup');
                if (setupBtn) setupBtn.style.display = "inline-block";
            }
        }

        renderCarts(data.carts || []);
        renderLowStock(data.low_stock || []);
        renderCustomerChart();

        if (tier === 'starter') {
            applyStoreStarterLocks();
        } else {
            loadDeadStock();
            loadBundleSuggestion();
            loadCustomerLTV();
        }
    } catch(e) {
        console.error("Failed to load store data", e);
        nameEl.innerText = "Error Loading Store";
    }
}
