async function loadOverview() {
    try {
        // 1. Fetch basic counts
        const [productsRes, competitorsRes, alertsRes] = await Promise.all([
            fetch('https://vantix-my5f.onrender.com/api/products'),
            fetch('https://vantix-my5f.onrender.com/api/competitors/list'),
            fetch('https://vantix-my5f.onrender.com/api/alerts/list')
        ]);

        const productsData = await productsRes.json();
        const competitorsData = await competitorsRes.json();
        const alertsData = await alertsRes.json();

        document.getElementById('ov-products').innerText = productsData.products ? productsData.products.length : 0;
        document.getElementById('ov-competitors').innerText = competitorsData.competitors ? competitorsData.competitors.length : 0;
        document.getElementById('ov-alerts').innerText = alertsData.alerts ? alertsData.alerts.length : 0;

        // 2. Fetch AI Summary and Health Score
        const summaryRes = await fetch('https://vantix-my5f.onrender.com/api/overview/summary');
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
        document.getElementById('ai-actions-container').innerHTML = '<div class="text-red" style="padding: 20px;">Failed to load AI data. Please refresh.</div>';
    }
}
