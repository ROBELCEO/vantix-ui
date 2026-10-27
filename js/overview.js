async function loadOverview() {
    try {
        // 1. Fetch basic counts independently so one failure doesn't break everything
        const [productsRes, competitorsRes, alertsRes] = await Promise.allSettled([
            fetch('https://vantix-my5f.onrender.com/api/products'),
            fetch('https://vantix-my5f.onrender.com/api/competitors/list'),
            fetch('https://vantix-my5f.onrender.com/api/alerts/list')
        ]);

        let productCount = 0;
        if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
            const pData = await productsRes.value.json();
            productCount = pData.products ? pData.products.length : 0;
        }

        let competitorCount = 0;
        if (competitorsRes.status === 'fulfilled' && competitorsRes.value.ok) {
            const cData = await competitorsRes.value.json();
            competitorCount = cData.competitors ? cData.competitors.length : 0;
        }

        let alertCount = 0;
        if (alertsRes.status === 'fulfilled' && alertsRes.value.ok) {
            const aData = await alertsRes.value.json();
            alertCount = aData.alerts ? aData.alerts.length : 0;
        }

        document.getElementById('ov-products').innerText = productCount;
        document.getElementById('ov-competitors').innerText = competitorCount;
        document.getElementById('ov-alerts').innerText = alertCount;

        // 2. Fetch AI Summary and Health Score
        const summaryRes = await fetch('https://vantix-my5f.onrender.com/api/overview/summary');
        
        if (!summaryRes.ok) {
            throw new Error("Failed to load summary");
        }

        const summaryData = await summaryRes.json();

        const healthRing = document.getElementById('health-ring');
        const healthScore = document.getElementById('health-score');
        const healthStatus = document.getElementById('health-status');
        
        healthScore.innerText = summaryData.health_score;
        healthStatus.innerText = summaryData.status;
        
        let ringColor = 'var(--green)';
        if(summaryData.health_score < 50) ringColor = 'var(--red)';
        else if(summaryData.health_score < 75) ringColor = 'var(--amber)';
        
        healthRing.style.background = `conic-gradient(${ringColor} ${summaryData.health_score}%, var(--bg-elevated) ${summaryData.health_score}% 100%)`;
        healthScore.style.color = ringColor;

        // 3. Render AI Actions
        const actionContainer = document.getElementById('ai-actions-container');
        const icons = ['🎯', '📈', '⚠️'];
        const borders = ['var(--violet)', 'var(--green)', 'var(--amber)'];
        
        if (summaryData.actions && summaryData.actions.length > 0) {
            actionContainer.innerHTML = summaryData.actions.map((action, i) => `
                <div class="action-item" style="border-left-color: ${borders[i % 3]};">
                    <div style="font-size: 20px;">${icons[i % 3]}</div>
                    <div>
                        <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">${action}</div>
                    </div>
                </div>
            `).join('');
        } else {
            actionContainer.innerHTML = '<div class="text-tertiary">No actions generated. Add products to your store.</div>';
        }

    } catch (e) {
        console.error("Failed to load overview data", e);
        document.getElementById('ov-products').innerText = "-";
        document.getElementById('ov-competitors').innerText = "-";
        document.getElementById('ov-alerts').innerText = "-";
        document.getElementById('ai-actions-container').innerHTML = '<div class="text-red" style="padding: 20px;">Failed to load AI summary. Please refresh.</div>';
        document.getElementById('health-status').innerText = "ERROR";
    }
}
