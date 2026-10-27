async function loadAlerts() {
    const container = document.getElementById('alerts-container');
    if(!container) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/alerts/list');
        
        if (!res.ok) {
            container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load alerts. Please refresh.</div>';
            return;
        }

        const data = await res.json();
        
        if(!data.alerts || data.alerts.length === 0) {
            container.innerHTML = `
                <div class="panel" style="text-align: center; padding: 40px 20px;">
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
            
            let itemClass = 'default';
            let icon = '🔔';
            
            if (a.title.includes('Price Drop') || a.title.includes('🚨')) { 
                itemClass = 'price-drop'; icon = '📉'; 
            } else if (a.title.includes('Stock') || a.title.includes('🔥')) { 
                itemClass = 'stock-out'; icon = '📦'; 
            } else if (a.title.includes('AI') || a.title.includes('Intel') || a.title.includes('💬')) { 
                itemClass = 'ai-insight'; icon = '🧠'; 
            }

            return `
                <div class="alert-card ${itemClass}">
                    <div class="alert-time">${dateString} • ${timeString}</div>
                    <div class="alert-title">${a.title}</div>
                    <div class="alert-body">${a.body.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }).join('');
        
    } catch(e) {
        console.error("Alerts error:", e);
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Backend asleep or network error. Try again in 30s.</div>';
    }
}

if (window.location.pathname.includes('alerts.html')) {
    loadAlerts();
}
