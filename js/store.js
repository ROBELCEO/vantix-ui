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

let stChartInstance = null;

function renderChart(chartData) {
    const canvas = document.getElementById('revenueChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (stChartInstance) stChartInstance.destroy();

    const labels = chartData.labels || [];
    const data = chartData.data || [];

    const ctx = canvas.getContext('2d');

    stChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Revenue",
                data: data,
                borderColor: "#0284C7",
                backgroundColor: "rgba(2, 132, 199, 0.1)",
                fill: true,
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: "#0284C7",
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 10 }, maxTicksLimit: 10 } },
                y: { 
                    grid: { color: "#E5E7EB" }, 
                    ticks: { color: "#6B7280", font: { size: 10 } },
                    beginAtZero: true
                }
            }
        }
    });
}

function renderTopProducts(products) {
    const list = document.getElementById('top-products-list');
    if (!list) return;
    if (!products || products.length === 0) {
        list.innerHTML = '<div class="st-empty">No sales data yet.</div>';
        return;
    }
    list.innerHTML = products.map((p, i) => `
        <div class="st-product-row">
            <div class="st-row-rank">${i + 1}</div>
            <img class="st-product-img" src="${stEsc(p.image || 'https://via.placeholder.com/36')}">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(p.title)}</div>
                <div class="st-row-meta">${stNum(p.units)} sold</div>
            </div>
            <div class="st-row-amount st-green">${stMoney(p.revenue)}</div>
        </div>
    `).join('');
}

function renderCarts(carts) {
    const list = document.getElementById('carts-list');
    if(!list) return;
    if (carts.length === 0) { list.innerHTML = '<div class="st-empty">No abandoned carts.</div>'; return; }
    list.innerHTML = carts.map(c => `
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
    list.innerHTML = lowStock.map(s => `
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

async function loadStoreData() {
    const nameEl = document.getElementById('store-name');
    if(!nameEl) return;
    nameEl.innerText = "Loading...";

    try {
        const res = await fetch('https://api.midra.xyz/api/store/detailed');
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

        window.stData = data;
        if (data.chart) renderChart(data.chart);
        if (data.top_products) renderTopProducts(data.top_products);
        renderCarts(data.carts || []);
        renderLowStock((data.low_stock || []).slice(0, 3));

        // Handle Dead Stock, Bundle, and LTV panels
        const bundle = document.getElementById('bundle-container');
        if (bundle) bundle.innerHTML = '<div class="st-empty">Analyzing order history…</div>';
        
        const ltv = document.getElementById('ltv-list');
        if (ltv) ltv.innerHTML = '<div class="st-empty">Loading VIP customers…</div>';
        
        const deadStock = document.getElementById('dead-stock-list');
        if (deadStock) deadStock.innerHTML = '<div class="st-empty">Analyzing inventory…</div>';

    } catch(e) {
        console.error("Failed to load store data", e);
        nameEl.innerText = "Error Loading Store";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(loadStoreData, 100);
});


// ==========================================
// MODAL LOGIC FOR "VIEW ALL" BUTTONS
// ==========================================
window.openStoreModal = function(type) {
    const modal = document.getElementById('st-modal');
    const title = document.getElementById('st-modal-title');
    const body = document.getElementById('st-modal-body');
    if (!modal || !title || !body) return;

    const data = window.stData || {};
    
    if (type === 'products') {
        title.innerText = "All Top Products";
        if (!data.top_products || data.top_products.length === 0) {
            body.innerHTML = '<div class="st-empty">No products found.</div>';
        } else {
            body.innerHTML = data.top_products.map((p, i) => `
                <div class="st-product-row">
                    <div class="st-row-rank">${i + 1}</div>
                    <img class="st-product-img" src="${stEsc(p.image || 'https://via.placeholder.com/36')}">
                    <div class="st-row-body">
                        <div class="st-row-title">${stEsc(p.title)}</div>
                        <div class="st-row-meta">${stNum(p.units)} sold</div>
                    </div>
                    <div class="st-row-amount st-green">${stMoney(p.revenue)}</div>
                </div>
            `).join('');
        }
    } else if (type === 'carts') {
        title.innerText = "All Abandoned Carts";
        if (!data.carts || data.carts.length === 0) {
            body.innerHTML = '<div class="st-empty">No abandoned carts.</div>';
        } else {
            body.innerHTML = data.carts.map(c => `
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
    } else if (type === 'low') {
        title.innerText = "All Low Stock Alerts";
        if (!data.low_stock || data.low_stock.length === 0) {
            body.innerHTML = '<div class="st-empty st-empty-good">✅ No low stock alerts.</div>';
        } else {
            body.innerHTML = data.low_stock.map(s => `
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
    } else if (type === 'dead') {
        title.innerText = "All Dead Stock";
        body.innerHTML = '<div class="st-empty">Dead stock analysis requires Shopify Analytics access or is still loading.</div>';
    }

    modal.style.display = 'flex';
};

window.closeStoreModal = function() {
    const modal = document.getElementById('st-modal');
    if (modal) modal.style.display = 'none';
};


// ============================================================
// MY STORE PRO PANELS — Parallel Fetch, Fixed Mapping
// ============================================================
const ST_API = 'https://api.midra.xyz/api';

function stGetToken() {
    try {
        const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
        if (!key) return null;
        return JSON.parse(localStorage.getItem(key)).access_token;
    } catch { return null; }
}

async function stProFetch(path, token) {
    const r = await fetch(ST_API + path, { headers: { 'Authorization': 'Bearer ' + token } });
    if (!r.ok) return { __status: r.status };
    return r.json();
}

function stReserve(id, minH) {
    const el = document.getElementById(id);
    if (el) el.style.minHeight = (minH || 260) + 'px';
}

// ---- Dead Stock (FIXED MAPPING) ----
async function stLoadDeadStock(token) {
    const list = document.getElementById('dead-stock-list');
    if (!list) return;
    stReserve('dead-stock-list', 260);
    try {
        const d = await stProFetch('/store/dead-stock', token);
        if (d.__status === 402) { list.innerHTML = '<div class="st-empty">🔒 Pro feature</div>'; return; }
        if (d.__status) { list.innerHTML = '<div class="st-empty">Could not load dead stock.</div>'; return; }
        
        const items = d.dead_items || [];
        if (!items.length) {
            list.innerHTML = '<div class="st-empty">✅ No dead stock — inventory moving.</div>';
            return;
        }
        
        list.innerHTML = items.slice(0, 4).map(x => {
            const t = x.title || 'Untitled';
            const units = x.stock || 0;
            const cash = x.cash_trapped || 0; // ✅ FIXED HERE
            return `<div class="st-row">
                <div class="st-row-body">
                    <div class="st-row-title">${stEsc(t)}</div>
                    <div class="st-row-meta">${stNum(units)} units slow-moving</div>
                </div>
                <div class="st-row-amount st-amber">${stMoney(cash)}</div>
            </div>`;
        }).join('');
    } catch (e) { 
        console.error("Dead Stock Error:", e);
        list.innerHTML = '<div class="st-empty">Dead stock unavailable.</div>'; 
    }
}

// ---- AOV Bundle ----
async function stLoadBundles(token) {
    const c = document.getElementById('bundle-container');
    if (!c) return;
    stReserve('bundle-container', 260);
    try {
        const d = await stProFetch('/store/bundles', token);
        if (d.__status === 402) { c.innerHTML = '<div class="st-empty">🔒 Pro feature</div>'; return; }
        if (d.__status || d.error) {
            c.innerHTML = `<div class="st-empty">${stEsc(d.error || 'Not enough order history yet.')}</div>`;
            return;
        }
        const a = d.ai || {};
        c.innerHTML = `
            <div style="padding: 8px 0;">
                <div style="font-size:10px;letter-spacing:1.4px;font-weight:800;color:#0284C7;text-transform:uppercase;margin-bottom:6px;">Suggested Bundle</div>
                <div style="font-size:15px;font-weight:900;color:#09090B;margin-bottom:6px;">${stEsc(a.bundle_name || '—')}</div>
                <div style="font-size:13px;color:#52525B;line-height:1.5;margin-bottom:12px;">${stEsc(a.pitch || '')}</div>
                <div style="display:flex;gap:16px;font-size:13px;">
                    <div><span style="color:#71717A;">Original</span> <b>${stMoney(d.original_total)}</b></div>
                    <div><span style="color:#71717A;">Bundled</span> <b style="color:#059669;">${stMoney(a.suggested_price)}</b></div>
                </div>
            </div>`;
    } catch (e) { 
        console.error("Bundle Error:", e);
        c.innerHTML = '<div class="st-empty">Bundle suggestion unavailable.</div>'; 
    }
}

// ---- VIP LTV + Customer Snapshot ----
async function stLoadCustomers(token) {
    const list = document.getElementById('ltv-list');
    const snapshot = document.getElementById('customer-snapshot');
    if (!list) return;
    stReserve('ltv-list', 260);
    stReserve('customer-snapshot', 260);
    
    try {
        const d = await stProFetch('/store/customers', token);
        if (d.__status === 402) { 
            list.innerHTML = '<div class="st-empty">🔒 Pro feature</div>'; 
            if(snapshot) snapshot.innerHTML = '<div class="st-empty">🔒 Pro feature</div>';
            return; 
        }
        if (d.__status) { 
            list.innerHTML = '<div class="st-empty">Could not load customers.</div>'; 
            if(snapshot) snapshot.innerHTML = '<div class="st-empty">Could not load data.</div>';
            return; 
        }
        
        const cs = d.customers || [];
        
        // Render VIP LTV
        if (!cs.length) { 
            list.innerHTML = '<div class="st-empty">No customers yet.</div>'; 
        } else {
            list.innerHTML = cs.slice(0, 3).map(x => `
                <div class="st-row">
                    <div class="st-row-body">
                        <div class="st-row-title">${stEsc(x.displayName || x.email || 'Anonymous')}</div>
                        <div class="st-row-meta">${stNum(x.numberOfOrders || 0)} orders</div>
                    </div>
                    <div class="st-row-amount st-green">${stMoney(x.amountSpent || 0)}</div>
                </div>`).join('');
        }

        // ✅ RENDER CUSTOMER SNAPSHOT (The 5th Panel)
        if (snapshot) {
            if (!cs.length) {
                snapshot.innerHTML = '<div class="st-empty">Not enough customer data yet.</div>';
            } else {
                const totalSpent = cs.reduce((sum, x) => sum + (parseFloat(x.amountSpent) || 0), 0);
                const totalOrders = cs.reduce((sum, x) => sum + (parseInt(x.numberOfOrders) || 0), 0);
                const aov = totalOrders > 0 ? (totalSpent / totalOrders) : 0;
                
                snapshot.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:12px; padding: 8px 0;">
                        <div class="st-row">
                            <div class="st-row-body"><div class="st-row-title">Total Customer Spend</div></div>
                            <div class="st-row-amount st-green">${stMoney(totalSpent)}</div>
                        </div>
                        <div class="st-row">
                            <div class="st-row-body"><div class="st-row-title">Average Order Value</div></div>
                            <div class="st-row-amount">${stMoney(aov)}</div>
                        </div>
                        <div class="st-row">
                            <div class="st-row-body"><div class="st-row-title">Repeat Customers</div></div>
                            <div class="st-row-amount">${cs.filter(x => x.numberOfOrders > 1).length}</div>
                        </div>
                    </div>`;
            }
        }
    } catch (e) { 
        console.error("Customers Error:", e);
        list.innerHTML = '<div class="st-empty">Customer data unavailable.</div>'; 
        if(snapshot) snapshot.innerHTML = '<div class="st-empty">Data unavailable.</div>';
    }
}

// Orchestrator — PARALLEL Fetch (No sequential blocking)
async function stLoadProPanels() {
    const token = stGetToken();
    if (!token) return;

    const deadLock = document.getElementById('dead-stock-list-lock');
    const bundleLock = document.getElementById('bundle-container-lock');
    const ltvLock = document.getElementById('ltv-list-lock');
    const deadVisible = deadLock && deadLock.style.display === 'flex';
    const bundleVisible = bundleLock && bundleLock.style.display === 'flex';
    const ltvVisible = ltvLock && ltvLock.style.display === 'flex';

    stReserve('dead-stock-list', 260);
    stReserve('bundle-container', 260);
    stReserve('ltv-list', 260);
    stReserve('customer-snapshot', 260);

    // 🚀 RUN IN PARALLEL
    const promises = [];
    if (!deadVisible) promises.push(stLoadDeadStock(token));
    if (!bundleVisible) promises.push(stLoadBundles(token));
    if (!ltvVisible) promises.push(stLoadCustomers(token));
    
    await Promise.all(promises);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(stLoadProPanels, 800);
});
