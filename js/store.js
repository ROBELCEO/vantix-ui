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
                label: "Net Profit",
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
                    min: -7000, 
                    max: 1000
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

        if (data.chart) renderChart(data.chart);
        if (data.top_products) renderTopProducts(data.top_products);
        renderCarts(data.carts || []);
        renderLowStock(data.low_stock || []);

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
