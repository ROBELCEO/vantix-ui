async function fetchAlerts() {
    const list = document.getElementById('alerts-list');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/alerts/list');
        const data = await res.json();
        
        if(!data.alerts || data.alerts.length === 0) {
            list.innerHTML = `
                <div class="panel" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 32px; margin-bottom: 16px;">📈</div>
                    <div style="font-weight: 700; margin-bottom: 4px;">All Prices Are Stable</div>
                    <div class="text-tertiary" style="font-size: 12px;">We'll notify you the second a competitor changes their pricing.</div>
                </div>
            `;
            return;
        }
        
        list.innerHTML = data.alerts.map(a => {
            // Format the date/time nicely
            const dateObj = new Date(a.created_at);
            const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateString = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
            
            // Determine the style based on the title content
            let cardClass = 'default';
            if (a.title.includes('Price Drop') || a.title.includes('🚨')) cardClass = 'price-drop';
            else if (a.title.includes('Stock') || a.title.includes('🔥')) cardClass = 'stock-out';
            else if (a.title.includes('AI') || a.title.includes('Intel') || a.title.includes('💬')) cardClass = 'ai-insight';

            return `
                <div class="alert-card ${cardClass}">
                    <div class="alert-time">${dateString} • ${timeString}</div>
                    <div class="alert-title">${a.title}</div>
                    <div class="alert-body">${a.body.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }).join('');
        
    } catch(e) {
        list.innerHTML = `
            <div class="panel" style="text-align: center; padding: 40px 20px;">
                <div class="text-red" style="margin-bottom: 8px;">Failed to load alerts.</div>
                <div class="text-tertiary" style="font-size: 12px;">The backend might be asleep. Try refreshing in 30 seconds.</div>
            </div>
        `;
    }
}

// Run on load
fetchAlerts();
