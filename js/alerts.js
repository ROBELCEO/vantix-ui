let alertsCache = [];
let alertsChannel = null;

function alrtEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
}

function alertHtml(a) {
    const dateObj = new Date(a.created_at || Date.now());
    const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    const title = alrtEsc(a.title || "Alert");
    const body = alrtEsc(a.body || "");
    const titleLower = (a.title || "").toLowerCase();

    let severityClass = "alrt-alert-amber";
    let icon = "⚡";
    if (titleLower.includes("price drop") || titleLower.includes("price cut") || titleLower.includes("out of stock")) {
        severityClass = "alrt-alert-red";
        icon = "🚨";
    } else if (titleLower.includes("price increase") || titleLower.includes("new launch")) {
        severityClass = "alrt-alert-green";
        icon = "📈";
    } else if (titleLower.includes("restock") || titleLower.includes("back in stock")) {
        severityClass = "alrt-alert-cyan";
        icon = "📦";
    }

    return `
        <div class="alrt-alert ${severityClass}" data-alert-id="${alrtEsc(a.id || "")}">
            <div class="alrt-alert-meta">${icon} ${dateString} • ${timeString}</div>
            <div class="alrt-alert-title">${title}</div>
            <div class="alrt-alert-body">${body}</div>
        </div>
    `;
}

function updateAlertsStatus() {
    const statusEl = document.getElementById('alrt-status');
    if (statusEl) {
        statusEl.innerText = alertsCache.length
            ? `${alertsCache.length} Alert${alertsCache.length > 1 ? "s" : ""}`
            : "0 Alerts";
    }
}

function renderAllAlerts() {
    const container = document.getElementById('alerts-container');
    if (!container) return;

    if (!alertsCache.length) {
        container.innerHTML = `
            <div class="alrt-stable">
                <div style="font-size: 32px; margin-bottom: 12px;">📈</div>
                <div class="alrt-stable-title">All Prices Are Stable</div>
                <div class="alrt-stable-sub">We will notify you the second a competitor changes their pricing.</div>
            </div>
        `;
    } else {
        container.innerHTML = alertsCache.map(alertHtml).join('');
    }
    updateAlertsStatus();
}

async function waitForSession() {
    for (let i = 0; i < 50; i++) {
        if (window.currentSession && window.currentSession.user && window.currentSession.user.id) {
            return window.currentSession;
        }
        await new Promise(r => setTimeout(r, 100));
    }
    return null;
}

async function initAlertsRealtime() {
    if (alertsChannel && alertsChannel.state === "joined") return;

    const session = await waitForSession();
    if (!session || !window.supabaseClient) return;

    const userId = session.user.id;
    const container = document.getElementById('alerts-container');
    if (!container) return;

    alertsChannel = window.supabaseClient
        .channel('alerts-live-' + userId)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'alerts', filter: `user_id=eq.${userId}` },
            payload => {
                const a = payload.new;
                if (!a || !a.id) return;
                if (alertsCache.some(x => x.id === a.id)) return;

                alertsCache.unshift(a);

                if (alertsCache.length === 1) {
                    renderAllAlerts();
                } else {
                    container.insertAdjacentHTML('afterbegin', alertHtml(a));
                    updateAlertsStatus();
                }
            }
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'alerts', filter: `user_id=eq.${userId}` },
            payload => {
                const a = payload.new;
                if (!a || !a.id) return;
                const idx = alertsCache.findIndex(x => x.id === a.id);
                if (idx === -1) return;
                alertsCache[idx] = a;

                const existing = container.querySelector(`[data-alert-id="${CSS.escape(a.id)}"]`);
                if (existing) {
                    existing.outerHTML = alertHtml(a);
                } else {
                    renderAllAlerts();
                }
            }
        )
        .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'alerts', filter: `user_id=eq.${userId}` },
            payload => {
                const oldRow = payload.old;
                if (!oldRow || !oldRow.id) return;
                alertsCache = alertsCache.filter(x => x.id !== oldRow.id);
                const existing = container.querySelector(`[data-alert-id="${CSS.escape(oldRow.id)}"]`);
                if (existing) existing.remove();
                if (!alertsCache.length) renderAllAlerts();
                updateAlertsStatus();
            }
        )
        .subscribe();
}

async function loadAlerts() {
    const container = document.getElementById('alerts-container');
    const statusEl = document.getElementById('alrt-status');
    if (!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/alerts/list');
        if (!res.ok) {
            container.innerHTML = '<div class="alrt-empty alrt-text-red">Failed to load alerts.</div>';
            if (statusEl) statusEl.innerText = "Error";
            return;
        }

        const data = await res.json();
        alertsCache = Array.isArray(data.alerts) ? data.alerts : [];
        renderAllAlerts();
        initAlertsRealtime();
    } catch (e) {
        console.error("Alerts error:", e);
        container.innerHTML = '<div class="alrt-empty alrt-text-red">Network error. Backend might be asleep.</div>';
        if (statusEl) statusEl.innerText = "Offline";
    }
}

