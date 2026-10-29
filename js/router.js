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

let currentRoute = null;

function cleanupPreviousView() {
    if (window.supabaseClient && typeof window.supabaseClient.getChannels === "function") {
        try {
            window.supabaseClient.getChannels().forEach(ch => {
                if (ch.topic && ch.topic.startsWith("alerts-live-")) {
                    window.supabaseClient.removeChannel(ch);
                }
            });
        } catch (e) {}
    }
    ["ovChartInstance", "revChartInstance", "chartInstance"].forEach(k => {
        if (window[k] && typeof window[k].destroy === "function") {
            try { window[k].destroy(); } catch (e) {}
            window[k] = null;
        }
    });
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

async function loadView(routeName) {
    if (!VIEW_ROUTES[routeName]) routeName = "connect";
    if (currentRoute === routeName) return;

    const root = document.getElementById("view-root");
    if (!root) return;

    cleanupPreviousView();
    root.innerHTML = '<div style="padding:60px;text-align:center;color:#6B7280;font-family:Inter,sans-serif;">Loading…</div>';

    try {
        const res = await fetch(VIEW_ROUTES[routeName].html, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status + " loading " + VIEW_ROUTES[routeName].html);
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const screenEl = doc.querySelector(".screen");
        if (!screenEl) throw new Error("No .screen in " + VIEW_ROUTES[routeName].html);

        root.innerHTML = "";
        root.appendChild(screenEl);

        setActiveTab(routeName);
        currentRoute = routeName;
        document.title = "Vantix — " + routeName.charAt(0).toUpperCase() + routeName.slice(1);

        for (const fn of VIEW_ROUTES[routeName].init) {
            if (typeof window[fn] === "function") {
                try { window[fn](); } catch (err) { console.error("View init error:", fn, err); }
            }
        }
    } catch (e) {
        console.error("Route load error:", e);
        root.innerHTML = '<div style="padding:60px;text-align:center;color:#E11D48;font-family:Inter,sans-serif;">Failed to load view: ' + e.message + '</div>';
    }
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
