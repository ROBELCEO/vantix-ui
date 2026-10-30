async function loadAlerts() {
    const container = document.getElementById('alerts-container');
    if(!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/alerts/list');
        
        if (!res.ok) {
            container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load alerts.</div>';
            return;
        }

        const data = await res.json();
        
        if(!data.alerts || data.alerts.length === 0) {
            container.innerHTML = `
                <div class="panel" style="text-align: center; padding: 40px 20px; border-color: rgba(0, 255, 136, 0.2); background: rgba(0, 255, 136, 0.05);">
                    <div style="font-size: 32px; margin-bottom: 16px;">📈</div>
                    <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">All Prices Are Stable</div>
                    <div class="text-tertiary" style="font-size: 12px;">We'll notify you the second a competitor changes their pricing.</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = data.alerts.map(a => {
            const dateObj = new Date(a.created_at);
            const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
            
            // The red border styling matches your screenshot
            return `
                <div style="background: var(--bg-surface); border-left: 4px solid var(--red); padding: 16px; border-radius: 4px;">
                    <div class="mono text-tertiary" style="font-size: 10px; margin-bottom: 8px;">${dateString} • ${timeString}</div>
                    <div style="font-weight: 800; font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">🚨 ${a.title}</div>
                    <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${a.body}</div>
                </div>
            `;
        }).join('');
        
    } catch(e) {
        console.error("Alerts error:", e);
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Network error. Backend might be asleep.</div>';
    }
}
