let revChartInstance = null;

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
function stSet(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}
function stEmpty(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div class="st-empty">${text}</div>`;
}
function stEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
}

async function loadStoreData() {
    const nameEl = document.getElementById("store-name");
    if (!nameEl) return;

    nameEl.innerText = "Loading store…";

    try {
        const res = await fetch("https://vantix-my5f.onrender.com/api/store/detailed");
        if (!res.ok) {
            if (res.status === 404) {
                nameEl.innerText = "Store Not Connected";
                stSet("store-domain", "Go to Connect to link Shopify");
                stSet("st-shopify-status", "Shopify: not connected");
                stEmpty("top-products-list", "No store connected.");
                stEmpty("carts-list", "No store connected.");
                stEmpty("dead-stock-list", "No store connected.");
                stEmpty("ltv-list", "No store connected.");
                stEmpty("low-stock-list", "No store connected.");
                stEmpty("bundle-container", "No store connected.");
                stEmpty("customer-snapshot", "No store connected.");
                return;
            }
            throw new Error("HTTP " + res.status);
        }

        const data = await res.json();
        const profile = data.profile || {};
        const kpis = data.kpis || {};

        const storeName = profile.name || "My Store";
        nameEl.innerText = storeName;
        stSet("store-domain", profile.domain || "");
        stSet("store-monogram", (storeName.split(/\s+/).map(w => w[0] || "").join("").slice(0, 2) || "ST").toUpperCase());
        stSet("st-shopify-status", "Shopify: connected");
        stSet("st-last-synced", "Updated: " + new Date().toLocaleTimeString());

        const rev = Number(kpis.total_revenue ?? NaN);
        const net = Number(kpis.net_profit ?? NaN);
        const orders = Number(kpis.order_count ?? NaN);
        const aov = Number(kpis.aov ?? NaN);
        const abandoned = Number(kpis.abandoned_value ?? NaN);

        stSet("kpi-revenue", Number.isFinite(rev) ? stMoney(rev) : "—");
        stSet("kpi-net-profit", Number.isFinite(net) ? stMoney(net) : "—");
        stSet("kpi-orders", Number.isFinite(orders) ? stNum(orders) : "—");
        stSet("kpi-aov", Number.isFinite(aov) ? stMoney(aov) : "—");
        stSet("kpi-abandoned", Number.isFinite(abandoned) ? stMoney(abandoned) : "—");

        renderRevenueChart(data.chart || { labels: [], data: [] });
        renderTopProducts(Array.isArray(data.top_products) ? data.top_products : []);
        renderCarts(Array.isArray(data.carts) ? data.carts : []);
        renderLowStock(Array.isArray(data.low_stock) ? data.low_stock : []);

        // Fire the secondary panels independently so one failure does not block the rest
        loadDeadStock();
        loadBundleSuggestion();
        loadCustomerLTV();

    } catch (e) {
        console.error("Store load error", e);
        nameEl.innerText = "Error Loading Store";
        stSet("store-domain", String(e.message || e));
    }
}

function renderRevenueChart(chartData) {
    if (revChartInstance) revChartInstance.destroy();
    const canvas = document.getElementById("revenueChart");
    if (!canvas || typeof Chart === "undefined") return;

    const labels = Array.isArray(chartData.labels) && chartData.labels.length ? chartData.labels : ["No data"];
    const data = Array.isArray(chartData.data) && chartData.data.length ? chartData.data : [0];

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(2, 132, 199, 0.15)");
    gradient.addColorStop(1, "rgba(2, 132, 199, 0)");

    revChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Revenue",
                data,
                borderColor: "#0284C7",
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.35,
                fill: true,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 10 } } },
                y: { grid: { color: "#E5E7EB" }, ticks: { color: "#6B7280", font: { size: 10 } } }
            }
        }
    });
}

function renderTopProducts(products) {
    const el = document.getElementById("top-products-list");
    if (!el) return;
    if (!products.length) { el.innerHTML = '<div class="st-empty">No sales data yet.</div>'; return; }
    el.innerHTML = products.slice(0, 6).map((p, i) => `
        <div class="st-product-row">
            <div class="st-row-rank">${i + 1}</div>
            <img class="st-product-img" src="${stEsc(p.image || "")}" onerror="this.style.visibility='hidden'">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(p.title || "Product")}</div>
                <div class="st-row-meta">${stNum(p.units || 0)} sold</div>
            </div>
            <div class="st-row-amount st-green">${stMoney(p.revenue || 0)}</div>
        </div>
    `).join("");
}

function renderCarts(carts) {
    const el = document.getElementById("carts-list");
    if (!el) return;
    if (!carts.length) { el.innerHTML = '<div class="st-empty st-empty-good">No abandoned carts right now.</div>'; return; }
    el.innerHTML = carts.slice(0, 5).map(c => `
        <div class="st-product-row">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(c.item || "Cart")}</div>
                <div class="st-row-meta">${stEsc(c.email || "Guest")}</div>
            </div>
            <div class="st-row-amount st-amber">${stMoney(c.value || 0)}</div>
            ${c.url ? `<a class="st-row-action" href="${stEsc(c.url)}" target="_blank">Recover</a>` : ""}
        </div>
    `).join("");
}

function renderLowStock(stock) {
    const el = document.getElementById("low-stock-list");
    if (!el) return;
    if (!stock.length) { el.innerHTML = '<div class="st-empty st-empty-good">Stock is healthy.</div>'; return; }
    el.innerHTML = stock.slice(0, 6).map(s => `
        <div class="st-product-row">
            <img class="st-product-img" src="${stEsc(s.image || "")}" onerror="this.style.visibility='hidden'">
            <div class="st-row-body">
                <div class="st-row-title">${stEsc(s.title || "Product")}</div>
                <div class="st-row-meta">Low inventory</div>
            </div>
            <div class="st-row-amount st-red">${stNum(s.qty || 0)} left</div>
        </div>
    `).join("");
}

async function loadDeadStock() {
    const el = document.getElementById("dead-stock-list");
    if (!el) return;
    try {
        const res = await fetch("https://vantix-my5f.onrender.com/api/store/dead-stock");
        if (!res.ok) { el.innerHTML = '<div class="st-empty">Unavailable.</div>'; return; }
        const data = await res.json();
        const items = Array.isArray(data.dead_items) ? data.dead_items : [];
        if (!items.length) { el.innerHTML = '<div class="st-empty st-empty-good">No dead stock detected.</div>'; return; }
        const total = Number(data.total_cash_trapped || 0);
        el.innerHTML = `
            <div class="st-hero-amount st-red">${stMoney(total)}</div>
            <div class="st-hero-label">Cash trapped across ${items.length} items</div>
            ${items.slice(0, 4).map(item => `
                <div class="st-product-row">
                    <img class="st-product-img" src="${stEsc(item.image || "")}" onerror="this.style.visibility='hidden'">
                    <div class="st-row-body">
                        <div class="st-row-title">${stEsc(item.title || "Product")}</div>
                        <div class="st-row-meta">${stNum(item.stock || 0)} units · 60d+ no sales</div>
                    </div>
                    <div class="st-row-amount st-red">${stMoney(item.cash_trapped || 0)}</div>
                </div>
            `).join("")}
        `;
    } catch (e) {
        el.innerHTML = '<div class="st-empty">Failed to load dead stock.</div>';
    }
}

async function loadBundleSuggestion() {
    const el = document.getElementById("bundle-container");
    if (!el) return;
    try {
        const res = await fetch("https://vantix-my5f.onrender.com/api/store/bundles");
        if (!res.ok) { el.innerHTML = '<div class="st-empty">Unavailable.</div>'; return; }
        const data = await res.json();
        if (data.error) { el.innerHTML = `<div class="st-empty">${stEsc(data.error)}</div>`; return; }
        const ai = data.ai || {};
        el.innerHTML = `
            <div class="st-bundle">
                <div class="st-bundle-top">
                    <div>
                        <div class="st-bundle-title">${stEsc(ai.bundle_name || "Suggested bundle")}</div>
                        <div class="st-row-meta">Bought together ${stNum(data.frequency || 0)}×</div>
                    </div>
                    <div class="st-bundle-pricing">
                        <div class="st-bundle-orig">${stMoney(data.original_total || 0)}</div>
                        <div class="st-bundle-new">${stMoney(ai.suggested_price || 0)}</div>
                    </div>
                </div>
                <div class="st-bundle-pitch">${stEsc(ai.pitch || "")}</div>
            </div>
        `;
    } catch (e) {
        el.innerHTML = '<div class="st-empty">Failed to analyze bundles.</div>';
    }
}

async function loadCustomerLTV() {
    const ltvEl = document.getElementById("ltv-list");
    const snapEl = document.getElementById("customer-snapshot");

    try {
        const res = await fetch("https://vantix-my5f.onrender.com/api/store/customers");
        if (!res.ok) {
            if (ltvEl) ltvEl.innerHTML = '<div class="st-empty">Unavailable.</div>';
            if (snapEl) snapEl.innerHTML = '<div class="st-empty">Customer data unavailable.</div>';
            return;
        }
        const data = await res.json();
        const customers = Array.isArray(data.customers) ? data.customers : [];

        // LTV panel
        if (ltvEl) {
            if (!customers.length) {
                ltvEl.innerHTML = '<div class="st-empty">No customer data yet.</div>';
            } else {
                ltvEl.innerHTML = customers.slice(0, 5).map(c => `
                    <div class="st-product-row">
                        <div class="st-row-body">
                            <div class="st-row-title">${stEsc(c.name || "Customer")}</div>
                            <div class="st-row-meta">${stNum(c.orders || 0)} orders</div>
                        </div>
                        <div class="st-row-amount st-cyan">${stMoney(c.spent || 0)}</div>
                    </div>
                `).join("");
            }
        }

        // Snapshot panel — honest, only real stats
        if (snapEl) {
            if (!customers.length) {
                snapEl.innerHTML = '<div class="st-empty">No customer data to summarize yet.</div>';
            } else {
                const totalSpent = customers.reduce((a, c) => a + Number(c.spent || 0), 0);
                const totalOrders = customers.reduce((a, c) => a + Number(c.orders || 0), 0);
                const avgLTV = customers.length ? totalSpent / customers.length : 0;
                snapEl.innerHTML = `
                    <div class="st-cust-grid">
                        <div class="st-cust-stat">
                            <div class="st-kpi-label">Top Customers Tracked</div>
                            <div class="st-kpi-value">${customers.length}</div>
                        </div>
                        <div class="st-cust-stat">
                            <div class="st-kpi-label">Avg VIP LTV</div>
                            <div class="st-kpi-value st-cyan">${stMoney(avgLTV)}</div>
                        </div>
                        <div class="st-cust-stat">
                            <div class="st-kpi-label">Total Orders (top set)</div>
                            <div class="st-kpi-value">${stNum(totalOrders)}</div>
                        </div>
                        <div class="st-cust-stat">
                            <div class="st-kpi-label">Total Spent (top set)</div>
                            <div class="st-kpi-value st-green">${stMoney(totalSpent)}</div>
                        </div>
                    </div>
                `;
            }
        }
    } catch (e) {
        if (ltvEl) ltvEl.innerHTML = '<div class="st-empty">Failed to load VIPs.</div>';
        if (snapEl) snapEl.innerHTML = '<div class="st-empty">Failed to summarize customers.</div>';
    }
}

