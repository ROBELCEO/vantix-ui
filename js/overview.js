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
function ovError(id, text, retryFn) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = `<div class="vx-error-box">${text}<br><button class="vx-retry-btn" onclick="${retryFn}">Retry</button></div>`;
    }
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

    // Default state while loading
    if (!window.__vxSilent) {
        const kpiIds = ["ov-revenue", "ov-net-profit", "ov-orders", "ov-price-index", "ov-leaks"];
        kpiIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = "…";
                el.classList.add("vx-skeleton");
            }
        });
        ovEmpty("ov-opportunities", "Analyzing store data...");
        ovEmpty("ov-insights", "Loading insights...");
        ovEmpty("ov-top-products", "Loading products...");
    }

    // If we are not using cached data, show skeletons
    if (!window.__vxSilent) {
        ovSet("ov-revenue", "");
        document.getElementById("ov-revenue").classList.add("vx-skeleton");
        ovSet("ov-net-profit", "");
        document.getElementById("ov-net-profit").classList.add("vx-skeleton");
        ovSet("ov-orders", "");
        document.getElementById("ov-orders").classList.add("vx-skeleton");
        ovSet("ov-price-index", "");
        document.getElementById("ov-price-index").classList.add("vx-skeleton");
        ovSet("ov-leaks", "");
        document.getElementById("ov-leaks").classList.add("vx-skeleton");
    }

    const [summaryRes, storeStatusRes, storeDetailedRes, alertsRes] = await Promise.all([
        ovFetchJson("https://vantix-my5f.onrender.com/api/overview/summary"),
        ovFetchJson("https://vantix-my5f.onrender.com/api/shopify/status"),
        ovFetchJson("https://vantix-my5f.onrender.com/api/store/detailed"),
        ovFetchJson("https://vantix-my5f.onrender.com/api/alerts/list")
    ]);

    // Remove skeletons on success
    ["ov-revenue", "ov-net-profit", "ov-orders", "ov-price-index", "ov-leaks"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("vx-skeleton");
    });

    // If the summary fetch failed completely (e.g. Render asleep or 401)
    if (!summaryRes.ok) {
        ["ov-revenue", "ov-net-profit", "ov-orders", "ov-price-index", "ov-leaks"].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = "—";
                el.classList.remove("vx-skeleton");
            }
        });
        ovError("ov-opportunities", "Could not connect to backend. Render may be waking up.", "loadOverview()");
        ovError("ov-insights", "Could not load insights.", "loadOverview()");
        ovError("ov-top-products", "Could not load products.", "loadOverview()");
        ovSet("ov-store-status", "Store: Offline");
        return;
    }

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
        
        // Handle Missing Fees & Missing COGS
        const netEl = document.getElementById("ov-net-profit");
        const metaEl = document.getElementById("ov-net-profit-meta");
        const setupEl = document.getElementById("ov-net-profit-setup");

        if (kpis.profit_status === "MISSING_COGS") {
            if (netEl) { netEl.innerText = "MISSING"; netEl.style.color = "#E11D48"; netEl.style.fontSize = "16px"; }
            if (metaEl) metaEl.innerText = "COGS not set in Shopify";
            if (setupEl) setupEl.style.display = "none";
        } else if (kpis.profit_status === "MISSING_FEES") {
            if (netEl) { netEl.innerText = "—"; netEl.style.color = "#9CA3AF"; netEl.style.fontSize = "24px"; }
            if (metaEl) metaEl.innerText = "Fees not configured";
            if (setupEl) setupEl.style.display = "block";
        } else {
            if (netEl) { netEl.style.fontSize = "24px"; netEl.style.color = "#059669"; }
            if (metaEl) metaEl.innerText = "Revenue minus costs";
            if (setupEl) setupEl.style.display = "none";
            ovSet("ov-net-profit", Number.isFinite(net) ? ovMoney(net) : "—");
        }

        ovSet("ov-orders", Number.isFinite(orders) ? ovNum(orders) : "—");
        ovSet("ov-leaks", Number.isFinite(leaks) ? ovNum(leaks) : "—");

        const priceEl = document.getElementById("ov-price-index");
        if (priceEl) {
            if (Number.isFinite(priceIndex)) {
                priceEl.innerText = (priceIndex > 0 ? "+" : "") + priceIndex + "%";
                priceEl.className = "ov-kpi-value " + (priceIndex > 0 ? "ov-text-red" : priceIndex < 0 ? "ov-text-green" : "");
                ovSet("ov-price-index-meta", priceIndex > 0 ? "You are higher than market" : priceIndex < 0 ? "You are lower than market" : "In line with market");
            } else {
                priceEl.innerText = "—";
                priceEl.className = "ov-kpi-value";
                ovSet("ov-price-index-meta", "vs competitors");
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
        renderChart(detailed.chart || { labels: [], data: [] });
        const dk = detailed.kpis || {};
        ovSet("ov-chart-revenue", Number.isFinite(Number(dk.total_revenue)) ? ovMoney(dk.total_revenue) : "—");
        
        if (kpis && kpis.profit_status === "MISSING_COGS") {
            const cp = document.getElementById("ov-chart-profit");
            if (cp) { cp.innerText = "MISSING"; cp.style.color = "#E11D48"; }
        } else {
            ovSet("ov-chart-profit", Number.isFinite(Number(dk.net_profit)) ? ovMoney(dk.net_profit) : "—");
        }
        
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
            catEl.innerHTML = summary.categories.map(c => `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #09090B; margin-bottom: 6px;">
                        <span>${escapeHtml(c.name)}</span>
                        <span class="mono">$${c.revenue.toFixed(2)} (${c.percent}%)</span>
                    </div>
                    <div style="width: 100%; background: #F1F5F9; height: 6px; border-radius: 2px !important; overflow: hidden;">
                        <div style="width: ${c.percent}%; background: #0284C7; height: 100%;"></div>
                    </div>
                </div>
            `).join('');
        }
    } else {
        ovEmpty("ov-category", "Waiting for your first order to calculate category revenue.");
    }

    const aiNote = document.getElementById("ov-ai-assistant-note");
    if (aiNote) {
        aiNote.innerText = (summary && summary.actions && summary.actions.length)
            ? "AI status: recommendations generated from your current store data."
            : "AI status: standby. Add products and competitors to unlock recommendations.";
    }
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

function renderChart(chart) {
    const canvas = document.getElementById("ov-profit-chart");
    if (!canvas || typeof Chart === "undefined") return;
    const sig = JSON.stringify({ labels: chart.labels || [], data: chart.data || [] });
        if (window.__ovChartSig === sig && ovChartInstance) return;
        window.__ovChartSig = sig;
        if (ovChartInstance) ovChartInstance.destroy();

    const labels = Array.isArray(chart.labels) && chart.labels.length ? chart.labels : ["No data"];
    const data = Array.isArray(chart.data) && chart.data.length ? chart.data : [0];

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(2, 132, 199, 0.15)");
    gradient.addColorStop(1, "rgba(2, 132, 199, 0)");

    ovChartInstance = new Chart(ctx, {
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

function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[s]));
}
function escapeAttr(str) {
    return escapeHtml(str).replace(/`/g, "&#96;");
}







// ==========================================
// MASTER OVERVIEW REALTIME LISTENER
// Listens to Shopify Webhooks AND Competitor Alerts
// ==========================================
let ovChannel = null;
let ovDebounceTimer = null;

function initOverviewRealtime() {
    if (!window.supabaseClient || !window.currentSession) return;
    const userId = window.currentSession.user.id;
    
    if (ovChannel) {
        window.supabaseClient.removeChannel(ovChannel);
        ovChannel = null;
    }

    console.log("🎧 Attaching Master Overview Realtime Listener for user:", userId);

    ovChannel = window.supabaseClient.channel('overview-master-' + userId)
        // 1. Listen for Shopify Webhooks (Orders, Inventory)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'shopify_events', filter: `user_id=eq.${userId}` }, (payload) => {
            console.log("🔴 Live Shopify Event:", payload.new.topic);
            triggerSilentOverviewReload();
        })
        // 2. Listen for Competitor Alerts (Price Drops)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts', filter: `user_id=eq.${userId}` }, (payload) => {
            console.log("🔴 Live Alert Received:", payload.new.title);
            triggerSilentOverviewReload();
        })
        .subscribe((status) => {
            console.log("Master Overview Realtime Status:", status);
        });
}

function triggerSilentOverviewReload() {
    // Debounce: If multiple webhooks hit at once, wait 500ms and only refresh once
    if (ovDebounceTimer) clearTimeout(ovDebounceTimer);
    ovDebounceTimer = setTimeout(() => {
        window.__vxSilent = true;
        loadOverview().then(() => window.__vxSilent = false);
    }, 500);
}

// Override the original loadOverview to attach the listener
const originalLoadOverview = loadOverview;
window.loadOverview = async function() {
    await originalLoadOverview();
    initOverviewRealtime();
};
