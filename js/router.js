const VIEW_ROUTES = {
    connect:     { html: "index.html",       init: ["checkConnectionStatus"] },
    overview:    { html: "overview.html",    init: ["loadOverview"] },
    store:       { html: "store.html",       init: ["loadStoreData"] },
    competitors: { html: "competitors.html", init: ["fetchCompetitors", "loadCompetitorIntel", "loadCatalogGaps"] },
    terminal:    { html: "terminal.html",    init: ["loadTerminal"] },
    discovery:   { html: "discovery.html",   init: ["loadDiscovery"] },
    alerts:      { html: "alerts.html",      init: ["loadAlerts"] },
    inventory:   { html: "inventory.html",   init: ["loadInventory"] },
    membership:  { html: "membership.html",  init: ["checkSubscription"] },
    settings:    { html: "settings.html",    init: ["loadProfile"] }
};

const viewRenderedCache = {};
const viewHTMLCache = {};
let currentRoute = null;

function cleanupPreviousView() {
    if (currentRoute) {
        const root = document.getElementById("view-root");
        if (root) viewRenderedCache[currentRoute] = root.innerHTML;
    }
    if (window.supabaseClient && typeof window.supabaseClient.getChannels === "function") {
        try {
            window.supabaseClient.getChannels().forEach(ch => {
                if (ch.topic && ch.topic.startsWith("alerts-live-")) {
                    window.supabaseClient.removeChannel(ch);
                }
            });
        } catch (e) {}
    }
    ["ovChartInstance", "revChartInstance", "chartInstance", "stChartInstance"].forEach(k => {
        if (window[k] && typeof window[k].destroy === "function") {
            try { window[k].destroy(); } catch (e) {}
            window[k] = null;
        }
    });
    
    // Cleanup Discovery Paywall
    const paywall = document.getElementById('dsc-paywall-overlay');
    if (paywall) paywall.remove();
}

function setActiveTab(routeName) {
    document.querySelectorAll(".tab, .drawer-tab").forEach(a => {
        a.classList.remove("active");
        if (a.getAttribute("data-route") === routeName) a.classList.add("active");
    });
}

function getRouteFromHash() {
    const hash = (location.hash || "").replace(/^#\/?/, "").toLowerCase();
    return VIEW_ROUTES[hash] ? hash : "connect";
}

function runInits(routeName) {
    for (const fn of VIEW_ROUTES[routeName].init) {
        if (typeof window[fn] === "function") {
            try { window[fn](); } catch (err) { console.error("View init error:", fn, err); }
        }
    }
}

async function fetchShellHTML(routeName) {
    const cfg = VIEW_ROUTES[routeName];
    if (viewHTMLCache[routeName]) return viewHTMLCache[routeName];
    const res = await fetch(cfg.html, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status + " loading " + cfg.html);
    const text = await res.text();
    viewHTMLCache[routeName] = text;
    return text;
}

async function prefetchShells(exceptRoute) {
    for (const routeName of Object.keys(VIEW_ROUTES)) {
        if (routeName === exceptRoute) continue;
        if (viewHTMLCache[routeName]) continue;
        try { await fetchShellHTML(routeName); } catch (e) { /* ignore */ }
    }
}

async function loadView(routeName) {
    if (!VIEW_ROUTES[routeName]) routeName = "connect";
    if (currentRoute === routeName) return;

    const root = document.getElementById("view-root");
    if (!root) return;

    cleanupPreviousView();
    setActiveTab(routeName);
    document.title = "Vantix — " + routeName.charAt(0).toUpperCase() + routeName.slice(1);
    window.__vxRoute = routeName;

    // 1. Instant restore from last rendered snapshot
    if (viewRenderedCache[routeName]) {
        root.innerHTML = viewRenderedCache[routeName];
        currentRoute = routeName;
        window.__vxSilent = true;
        runInits(routeName);
        window.__vxSilent = false;
        applyDiscoveryPaywall(routeName);
        return;
    }

    // 2. First-ever mount
    root.innerHTML = '<div style="padding:60px;text-align:center;color:#6B7280;font-family:Inter,sans-serif;">Loading…</div>';

    try {
        const text = await fetchShellHTML(routeName);
        const doc = new DOMParser().parseFromString(text, "text/html");
        const screenEl = doc.querySelector(".screen");
        if (!screenEl) throw new Error("No .screen in " + VIEW_ROUTES[routeName].html);

        root.innerHTML = "";
        root.appendChild(screenEl);
        currentRoute = routeName;
        window.__vxSilent = false;
        runInits(routeName);

        applyDiscoveryPaywall(routeName);
        prefetchShells(routeName);
    } catch (e) {
        console.error("Route load error:", e);
        root.innerHTML = '<div style="padding:60px;text-align:center;color:#E11D48;font-family:Inter,sans-serif;">Failed to load view: ' + e.message + '</div>';
    }
}

function applyDiscoveryPaywall(routeName) {
    const existing = document.getElementById('dsc-paywall-overlay');
    if (existing) existing.remove();

    if (routeName !== 'discovery') return;

    fetch('https://vantix-my5f.onrender.com/api/auth/status')
        .then(r => r.json())
        .then(d => {
            if (d.plan === 'starter') {
                const overlay = document.createElement('div');
                overlay.id = 'dsc-paywall-overlay';
                overlay.style.cssText = "position: fixed; top: 56px; left: 0; right: 0; bottom: 0; z-index: 9999; backdrop-filter: blur(8px); background: rgba(248, 250, 252, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center;";
                overlay.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
                    <div style="font-weight: 900; font-size: 24px; color: #09090B; margin-bottom: 8px;">Unlock Global Discovery</div>
                    <div style="font-size: 15px; color: #52525B; max-width: 400px; text-align: center; margin-bottom: 24px; line-height: 1.5;">Instantly search 1,000,000+ winning products across the global Shopify catalog and push them to your store in 1-click.</div>
                    <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 12px 24px; border-radius: 2px; text-decoration: none; font-size: 14px; font-weight: 800;">Upgrade to Pro →</a>
                `;
                document.body.appendChild(overlay);
            }
        })
        .catch(e => console.error("Paywall error:", e));
}

function navigate(routeName) {
    const target = "#" + routeName;
    if (location.hash !== target) history.pushState(null, "", target);
    loadView(routeName);
}

window.routerInit = function () {
    document.querySelectorAll("a[data-route]").forEach(a => {
        a.addEventListener("click", e => {
            const route = a.getAttribute("data-route");
            if (!route) return;
            e.preventDefault();
            const drawer = document.getElementById("mobile-drawer");
            const overlay = document.getElementById("drawer-overlay");
            if (drawer) drawer.classList.remove("open");
            if (overlay) overlay.style.display = "none";
            navigate(route);
        });
    });
    window.addEventListener("hashchange", () => loadView(getRouteFromHash()));
    loadView(getRouteFromHash());
};
