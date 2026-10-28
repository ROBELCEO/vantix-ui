function alrtEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
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

        if (!data.alerts || data.alerts.length === 0) {
            container.innerHTML = `
                <div class="alrt-stable">
                    <div style="font-size: 32px; margin-bottom: 12px;">📈</div>
                    <div class="alrt-stable-title">All Prices Are Stable</div>
                    <div class="alrt-stable-sub">We will notify you the second a competitor changes their pricing.</div>
                </div>
            `;
            if (statusEl) statusEl.innerText = "0 Alerts";
            return;
        }

        if (statusEl) statusEl.innerText = `${data.alerts.length} Alert${data.alerts.length > 1 ? "s" : ""}`;

        container.innerHTML = data.alerts.map(a => {
            const dateObj = new Date(a.created_at);
            const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

            const title = alrtEsc(a.title || "Alert");
            const body = alrtEsc(a.body || "");

            // Severity detection based on title keywords (same as Overview page)
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
                <div class="alrt-alert ${severityClass}">
                    <div class="alrt-alert-meta">${icon} ${dateString} • ${timeString}</div>
                    <div class="alrt-alert-title">${title}</div>
                    <div class="alrt-alert-body">${body}</div>
                </div>
            `;
        }).join('');

    } catch(e) {
        console.error("Alerts error:", e);
        container.innerHTML = '<div class="alrt-empty alrt-text-red">Network error. Backend might be asleep.</div>';
        if (statusEl) statusEl.innerText = "Offline";
    }
}
