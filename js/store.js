let revChartInstance = null;
let custChartInstance = null;

window.stAllProducts = [];
window.stAllCarts = [];
window.stAllDeadStock = [];
window.stAllLowStock = [];

function stEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}
function stMoney(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return "—";
    return "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function loadStoreData() {
    const nameEl = document.getElementById('store-name');
    if(!nameEl) return;
    nameEl.innerText = "Loading...";

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/detailed');
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();

        nameEl.innerText = data.profile.name;
        document.getElementById('store-domain').innerText = data.profile.domain;
        document.getElementById('store-monogram').innerText = data.profile.name.substring(0,2).toUpperCase();

        document.getElementById('kpi-revenue').innerText = stMoney(data.kpis.total_revenue);
        const npEl = document.getElementById('kpi-net-profit');
        npEl.innerText = stMoney(data.kpis.net_profit);
        npEl.className = data.kpis.net_profit < 0 ? "st-kpi-value st-red" : "st-kpi-value st-green";
        
        document.getElementById('kpi-orders').innerText = data.kpis.order_count;
        document.getElementById('kpi-aov').innerText = stMoney(data.kpis.aov);
        document.getElementById('kpi-abandoned').innerText = stMoney(data.kpis.abandoned_value);

        renderRevenueChart(data.chart);
        renderTopProducts(data.top_products);
        renderCarts(data.carts);
        renderLowStock(data.low_stock);
        
        loadDeadStock();
        loadBundleSuggestion();
        loadCustomerLTV();

    } catch(e) {
        console.error("Failed to load store data", e);
        nameEl.innerText = "Error Loading Store";
    }
}

function renderRevenueChart(chartData) {
    if(revChartInstance) revChartInstance.destroy();
    const canvas = document.getElementById('revenueChart');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(2, 132, 199, 0.15)');
    gradient.addColorStop(1, 'rgba(2, 132, 199, 0)');

    revChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels.length ? chartData.labels : ['No Data'],
            datasets: [{ label: 'Profit', data: chartData.data.length ? chartData.data : [0], borderColor: '#0284C7', backgroundColor: gradient, borderWidth: 2, tension: 0.2, fill: true, pointRadius: 3, pointBackgroundColor: '#0284C7' }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#E5E7EB' }, ticks: { color: '#6B7280' } }, x: { grid: { display: false }, ticks: { color: '#6B7280' } } } }
    });
}

function renderTopProducts(products) {
    window.stAllProducts = products || [];
    const list = document.getElementById('top-products-list');
    if(!list) return;
    if (products.length === 0) {
        list.innerHTML = '<div class="st-empty">No sales data yet.</div>';
        return;
    }
    list.innerHTML = products.slice(0, 5).map((p, i) => `
        <div class="st-product-row">
            <div class="st-row-rank">#${i+1}</div>
            <img class="st-product-img" src="${stEsc(p.image || 'https://via.placeholder.com/40')}">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(p.title)}</div>
                <div class="st-row-meta">${p.units} sold</div>
            </div>
            <div class="st-row-amount st-green">${stMoney(p.revenue)}</div>
        </div>
    `).join('');
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
                <div class="st-row-meta">${stEsc(c.email || 'Guest')}</div>
            </div>
            <div class="st-row-amount st-amber" style="margin-right: 12px;">${stMoney(c.value)}</div>
            ${c.url ? `<a href="${c.url}" target="_blank" class="st-row-action">Recover</a>` : ''}
        </div>
    `).join('');
}

function renderLowStock(stock) {
    window.stAllLowStock = stock || [];
    const list = document.getElementById('low-stock-list');
    if(!list) return;
    if (stock.length === 0) { list.innerHTML = '<div class="st-empty">✅ Stock is healthy.</div>'; return; }
    list.innerHTML = stock.slice(0, 5).map(s => `
        <div class="st-product-row">
            <img class="st-product-img" src="${stEsc(s.image || 'https://via.placeholder.com/32')}">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(s.title)}</div>
                <div class="st-row-meta">Running out soon</div>
            </div>
            <div class="st-row-amount st-red">${s.qty} left</div>
        </div>
    `).join('');
}

async function loadDeadStock() {
    const list = document.getElementById('dead-stock-list');
    if (!list) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/dead-stock');
        const data = await res.json();
        window.stAllDeadStock = data.dead_items || [];
        
        if (data.dead_items.length === 0) { list.innerHTML = '<div class="st-empty">✅ No dead stock!</div>'; return; }
        list.innerHTML = data.dead_items.slice(0, 5).map(item => `
            <div class="st-product-row">
                <img class="st-product-img" src="${stEsc(item.image || 'https://via.placeholder.com/32')}">
                <div class="st-row-body">
                    <div class="st-row-title">${stEsc(item.title)}</div>
                    <div class="st-row-meta">${item.stock} units sitting</div>
                </div>
                <div class="st-row-amount st-red">${stMoney(item.cash_trapped)}</div>
            </div>
        `).join('');
    } catch(e) { list.innerHTML = '<div class="st-empty st-red">Failed to load.</div>'; }
}

async function loadBundleSuggestion() {
    const container = document.getElementById('bundle-container');
    if (!container) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/bundles');
        const data = await res.json();
        if (data.error) { container.innerHTML = `<div class="st-empty">${data.error}</div>`; return; }
        container.innerHTML = `
            <div class="st-bundle">
                <div class="st-bundle-top">
                    <div><div class="st-bundle-title">${data.ai.bundle_name}</div><div class="st-row-meta">Bought together ${data.frequency}x</div></div>
                    <div class="st-bundle-pricing"><div class="st-bundle-orig">${stMoney(data.original_total)}</div><div class="st-bundle-new">${stMoney(data.ai.suggested_price)}</div></div>
                </div>
                <div class="st-bundle-pitch">${data.ai.pitch}</div>
            </div>
        `;
    } catch(e) { container.innerHTML = '<div class="st-empty st-red">Failed to analyze.</div>'; }
}

async function loadCustomerLTV() {
    const list = document.getElementById('ltv-list');
    if (!list) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/customers');
        const data = await res.json();
        if (data.customers.length === 0) { list.innerHTML = '<div class="st-empty">No customer data yet.</div>'; return; }
        list.innerHTML = data.customers.map(c => `
            <div class="st-product-row">
                <div class="st-row-body"><div class="st-row-title">${stEsc(c.name)}</div><div class="st-row-meta">${c.orders} orders</div></div>
                <div class="st-row-amount st-cyan">${stMoney(c.spent)}</div>
            </div>
        `).join('');
    } catch(e) { list.innerHTML = '<div class="st-empty st-red">Failed to load VIPs.</div>'; }
}

// MODAL LOGIC
function openStoreModal(type) {
    const modal = document.getElementById("st-modal");
    const list = document.getElementById("st-modal-body");
    const title = document.getElementById("st-modal-title");
    if (!modal || !list) return;

    let html = "";
    if (type === 'products') {
        title.innerText = "All Top Selling Products";
        if (window.stAllProducts.length === 0) html = '<div class="st-empty">No products found.</div>';
        else html = window.stAllProducts.map((p, i) => `
            <div class="st-product-row">
                <div class="st-row-rank">${i + 1}</div>
                <img class="st-product-img" src="${stEsc(p.image || 'https://via.placeholder.com/40')}">
                <div class="st-row-body"><div class="st-row-title">${stEsc(p.title)}</div><div class="st-row-meta">${p.units} sold</div></div>
                <div class="st-row-amount st-green">${stMoney(p.revenue)}</div>
            </div>
        `).join("");
    } 
    else if (type === 'carts') {
        title.innerText = "All Abandoned Carts";
        if (window.stAllCarts.length === 0) html = '<div class="st-empty">No abandoned carts found.</div>';
        else html = window.stAllCarts.map(c => `
            <div class="st-product-row">
                <div class="st-row-body"><div class="st-row-title">${stEsc(c.item)}</div><div class="st-row-meta">${stEsc(c.email || 'Guest')}</div></div>
                <div class="st-row-amount st-amber" style="margin-right: 12px;">${stMoney(c.value)}</div>
                ${c.url ? `<a href="${c.url}" target="_blank" class="st-row-action">Recover →</a>` : ''}
            </div>
        `).join("");
    }
    else if (type === 'dead') {
        title.innerText = "All Dead Stock Items";
        if (window.stAllDeadStock.length === 0) html = '<div class="st-empty">No dead stock detected.</div>';
        else html = window.stAllDeadStock.map(item => `
            <div class="st-product-row">
                <img class="st-product-img" src="${stEsc(item.image || 'https://via.placeholder.com/32')}">
                <div class="st-row-body"><div class="st-row-title">${stEsc(item.title)}</div><div class="st-row-meta">${item.stock} units sitting</div></div>
                <div class="st-row-amount st-red">${stMoney(item.cash_trapped)}</div>
            </div>
        `).join("");
    }
    else if (type === 'low') {
        title.innerText = "All Low Stock Items";
        if (window.stAllLowStock.length === 0) html = '<div class="st-empty">No low stock items found.</div>';
        else html = window.stAllLowStock.map(s => `
            <div class="st-product-row">
                <img class="st-product-img" src="${stEsc(s.image || 'https://via.placeholder.com/32')}">
                <div class="st-row-body"><div class="st-row-title">${stEsc(s.title)}</div><div class="st-row-meta">Running out soon</div></div>
                <div class="st-row-amount st-red">${s.qty} left</div>
            </div>
        `).join("");
    }

    list.innerHTML = html;
    modal.style.display = "flex";
}

function closeStoreModal() {
    const modal = document.getElementById("st-modal");
    if (modal) modal.style.display = "none";
}

document.getElementById("st-modal")?.addEventListener("click", function(e) {
    if (e.target === this) closeStoreModal();
});


