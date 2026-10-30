let ovChartInstance = null;

function ovMoney(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return "—";
    return "$" + v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function ovNum(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return "—";
    return v.toLocaleString();
}
function ovSet(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}
function ovEmpty(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div class="ov-empty">${text}</div>`;
}
async function ovFetchJson(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return { ok: false, status: res.status, data: null };
        const data = await res.json();
        return { ok: true, status: res.status, data };
    } catch (e) {
        clearTimeout(timeoutId);
        return { ok: false, status: 0, data: null, error: e };
    }
}

async function loadOverview() {
    ovSet("ov-last-updated", "Updated: " + new Date().toLocaleTimeString());

    const [summaryRes, storeStatusRes, storeDetailedRes, alertsRes] = await Promise.all([
        ovFetchJson("https://vantix-my5f.onrender.com/api/overview/summary"),
        ovFetchJson("https://vantix-my5f.onrender.com/api/shopify/status"),
        ovFetchJson("https://vantix-my5f.onrender.com/api/store/detailed?t=" + Date.now()), // Cache buster
        ovFetchJson("https://vantix-my5f.onrender.com/api/alerts/list")
    ]);

    if (storeStatusRes.ok && storeStatusRes.data && storeStatusRes.data.connected) {
        ovSet("ov-store-status", "Store: " + (storeStatusRes.data.domain || "connected"));
    } else if (storeStatusRes.ok) {
        ovSet("ov-store-status", "Store: not connected");
    } else {
        ovSet("ov-store-status", "Store: status unavailable");
    }

    let summary = summaryRes.ok ? summaryRes.data : null;
    let kpis = (summary && summary.kpis) ? summary.kpis : {};

    if (summary && summary.status === "needs_setup") {
        ovSet("ov-revenue", "—"); ovSet("ov-net-profit", "—"); ovSet("ov-orders", "—"); ovSet("ov-price-index", "—"); ovSet("ov-leaks", "—");
        ovSet("ov-ai-status", "AI: setup needed");
        const actions = summary.actions || ["Connect a store and sync products to get started."];
        renderOpportunities(actions, "Setup required");
    } else {
        const gross = Number(kpis.gross_revenue ?? kpis.total_revenue ?? NaN);
        const net = Number(kpis.net_profit ?? NaN);
        const orders = Number(kpis.order_count ?? NaN);
        const priceIndex = Number(kpis.price_index ?? NaN);
        const leaks = Number(kpis.leak_count ?? NaN);

        ovSet("ov-revenue", Number.isFinite(gross) ? ovMoney(gross) : "—");
        
        const netEl = document.getElementById("ov-net-profit");
        if (netEl) {
            if (Number.isFinite(net)) {
                netEl.innerText = ovMoney(net);
                if (net < 0) { netEl.classList.remove("ov-text-green"); netEl.classList.add("ov-text-red"); } 
                else { netEl.classList.remove("ov-text-red"); netEl.classList.add("ov-text-green"); }
            } else { netEl.innerText = "—"; }
        }

        ovSet("ov-orders", Number.isFinite(orders) ? ovNum(orders) : "—");
        ovSet("ov-leaks", Number.isFinite(leaks) ? ovNum(leaks) : "—");

        const priceEl = document.getElementById("ov-price-index");
        if (priceEl) {
            if (Number.isFinite(priceIndex)) {
                priceEl.innerText = (priceIndex > 0 ? "+" : "") + priceIndex + "%";
                priceEl.className = "ov-kpi-value " + (priceIndex > 0 ? "ov-text-red" : priceIndex < 0 ? "ov-text-green" : "");
            } else {
                priceEl.innerText = "—";
                priceEl.className = "ov-kpi-value";
            }
        }

        if (summary && Array.isArray(summary.actions) && summary.actions.length) {
            ovSet("ov-ai-status", "AI: ready");
            renderOpportunities(summary.actions, "AI recommendation");
        } else {
            ovSet("ov-ai-status", "AI: no actions yet");
            ovEmpty("ov-opportunities", "No AI opportunities yet. Sync your store and check back.");
        }
    }

    let detailed = storeDetailedRes.ok ? storeDetailedRes.data : null;
    if (detailed) {
        console.log("CHART DATA RECEIVED:", detailed.chart);
        renderChart(detailed.chart || { labels: [], data: [] });
        const dk = detailed.kpis || {};
        ovSet("ov-chart-revenue", Number.isFinite(Number(dk.total_revenue)) ? ovMoney(dk.total_revenue) : "—");
        ovSet("ov-chart-profit", Number.isFinite(Number(dk.net_profit)) ? ovMoney(dk.net_profit) : "—");
        ovSet("ov-chart-orders", Number.isFinite(Number(dk.order_count)) ? ovNum(dk.order_count) : "—");
        renderTopProducts(detailed.top_products || []);
    } else {
        renderChart({ labels: [], data: [] });
        ovSet("ov-chart-revenue", "—"); ovSet("ov-chart-profit", "—"); ovSet("ov-chart-orders", "—");
        ovEmpty("ov-top-products", "Product data unavailable. Connect Shopify and sync products.");
    }

    if (alertsRes.ok && alertsRes.data && Array.isArray(alertsRes.data.alerts)) {
        renderInsights(alertsRes.data.alerts);
    } else {
        ovEmpty("ov-insights", "No insights available yet.");
    }

    // Render Sales by Category
    if (summary && summary.categories && summary.categories.length > 0) {
        const catEl = document.getElementById("ov-category");
        if (catEl) {
            const totalCatRev = summary.categories.reduce((a, b) => a + b.revenue, 0);
            catEl.innerHTML = summary.categories.map(c => {
                const pct = totalCatRev > 0 ? ((c.revenue / totalCatRev) * 100).toFixed(1) : 0;
                return `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 6px;">
                        <span>${escapeHtml(c.name)}</span>
                        <span style="font-family: var(--font-mono);">${ovMoney(c.revenue)} (${pct}%)</span>
                    </div>
                    <div style="width: 100%; background: #F1F5F9; height: 6px; border-radius: 2px; overflow: hidden;">
                        <div style="width: ${pct}%; background: #0284C7; height: 100%;"></div>
                    </div>
                </div>`;
            }).join('');
        }
    } else {
        ovEmpty("ov-category", "No category data yet.");
    }

    const aiNote = document.getElementById("ov-ai-assistant-note");
    if (aiNote) {
        aiNote.innerText = (summary && summary.actions && summary.actions.length)
            ? "AI status: recommendations generated from your current store data."
            : "AI status: standby. Add products and competitors to unlock recommendations.";
    }

    initOverviewRealtime();
}

function renderChart(chart) {
    const canvas = document.getElementById("ov-profit-chart");
    if (!canvas || typeof Chart === "undefined") return;
    if (ovChartInstance) ovChartInstance.destroy();

    let labels = Array.isArray(chart.labels) && chart.labels.length ? chart.labels : ["No data"];
    let data = Array.isArray(chart.data) && chart.data.length ? chart.data : [0];

    const ctx = canvas.getContext("2d");

    ovChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Net Profit",
                data: data,
                backgroundColor: data.map(v => v < 0 ? "#E11D48" : "#059669"),
                borderRadius: 2,
                barPercentage: 0.9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let v = context.parsed.y;
                            return "Profit: " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 9 }, maxTicksLimit: 8 } },
                y: { 
                    grid: { color: "#E5E7EB" }, 
                    ticks: { color: "#6B7280", font: { size: 10 } },
                    min: -8000,
                    max: 1000
                }
            }
        }
    });
}

function renderOpportunities(actions, badgeText) {
    const el = document.getElementById("ov-opportunities");
    if (!el) return;
    if (!Array.isArray(actions) || actions.length === 0) {
        el.innerHTML = '<div class="ov-empty">No opportunities yet.</div>';
        return;
    }
    el.innerHTML = actions.slice(0, 3).map((action, i) => `
        <div class="ov-opportunity">
            <div class="ov-opportunity-rank">${i + 1}</div>
            <div class="ov-opportunity-body">
                <div class="ov-opportunity-text">${escapeHtml(action)}</div>
                <div class="ov-opportunity-meta">${badgeText}</div>
            </div>
        </div>
    `).join("");
}

function renderInsights(alerts) {
    const el = document.getElementById("ov-insights");
    if (!el) return;
    if (!Array.isArray(alerts) || alerts.length === 0) {
        el.innerHTML = '<div class="ov-empty">No recent insights.</div>';
        return;
    }
    el.innerHTML = alerts.slice(0, 5).map(a => {
        const title = escapeHtml(a.title || "Alert");
        const body = escapeHtml((a.body || "").slice(0, 110));
        const time = a.created_at ? new Date(a.created_at).toLocaleString() : "";
        const severity = title.includes("Price Drop") ? "ov-insight-red" : "ov-insight-amber";
        return `
            <div class="ov-insight ${severity}">
                <div class="ov-insight-title">${title}</div>
                <div class="ov-insight-body">${body}${(a.body || "").length > 110 ? "…" : ""}</div>
                <div class="ov-insight-time">${time}</div>
            </div>
        `;
    }).join("");
}

function renderTopProducts(products) {
    window.ovAllProducts = products || [];
    const el = document.getElementById("ov-top-products");
    if (!el) return;
    if (!Array.isArray(products) || products.length === 0) {
        el.innerHTML = '<div class="ov-empty">No sales data yet.</div>';
        return;
    }
    el.innerHTML = products.slice(0, 5).map((p, i) => `
        <div class="ov-product-row">
            <div class="ov-product-rank">${i + 1}</div>
            <img class="ov-product-img" src="${escapeAttr(p.image || 'https://via.placeholder.com/40')}" alt="">
            <div class="ov-product-info">
                <div class="ov-product-title">${escapeHtml(p.title || "Product")}</div>
                <div class="ov-product-meta">${ovNum(p.units || 0)} sold</div>
            </div>
            <div class="ov-product-revenue">${ovMoney(p.revenue || 0)}</div>
        </div>
    `).join("");
}

function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[s]));
}
function escapeAttr(str) {
    return escapeHtml(str).replace(/`/g, "&#96;");
}

let ovChannel = null;
function initOverviewRealtime() {
    if (!window.supabaseClient || !window.currentSession) return;
    if (ovChannel) { window.supabaseClient.removeChannel(ovChannel); ovChannel = null; }
    const userId = window.currentSession.user.id;
    const statusEl = document.getElementById("ov-ai-status");
    if (statusEl) statusEl.innerHTML = '<span style="color: #D97706;">● Connecting…</span>';

    ovChannel = window.supabaseClient.channel('overview-master-' + userId)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shopify_events', filter: `user_id=eq.${userId}` }, () => {
            window.__vxSilent = true; loadOverview().then(() => window.__vxSilent = false);
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts', filter: `user_id=eq.${userId}` }, () => {
            window.__vxSilent = true; loadOverview().then(() => window.__vxSilent = false);
        })
        .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                if (statusEl) statusEl.innerHTML = '<span style="color: #059669;">● Live Sync Active</span>';
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
                if (statusEl) statusEl.innerHTML = '<span style="color: #E11D48;">● Disconnected</span>';
            }
        });
}

// ==========================================
// TOP PRODUCTS MODAL LOGIC
// ==========================================
function showTopProductsModal() {
    const modal = document.getElementById("ov-modal");
    const list = document.getElementById("ov-modal-product-list");
    if (!modal || !list) return;

    if (!window.ovAllProducts || window.ovAllProducts.length === 0) {
        list.innerHTML = '<div class="ov-empty">No products found.</div>';
    } else {
        list.innerHTML = window.ovAllProducts.map((p, i) => `
            <div class="ov-product-row">
                <div class="ov-product-rank">${i + 1}</div>
                <img class="ov-product-img" src="${escapeAttr(p.image || 'https://via.placeholder.com/40')}" alt="">
                <div class="ov-product-info">
                    <div class="ov-product-title">${escapeHtml(p.title || "Product")}</div>
                    <div class="ov-product-meta">${ovNum(p.units || 0)} sold</div>
                </div>
                <div class="ov-product-revenue">${ovMoney(p.revenue || 0)}</div>
            </div>
        `).join("");
    }
    modal.style.display = "flex";
}

function closeTopProductsModal() {
    const modal = document.getElementById("ov-modal");
    if (modal) modal.style.display = "none";
}

// Close modal when clicking outside the panel
document.getElementById("ov-modal")?.addEventListener("click", function(e) {
    if (e.target === this) {
        closeTopProductsModal();
    }
});
