async function loadOverview() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/overview/summary');
        const data = await res.json();

        if (data.status === "needs_setup") {
            document.getElementById('ai-actions-container').innerHTML = `<div class="text-red">${data.actions[0]}</div>`;
            return;
        }

        // KPIs
        document.getElementById('ov-net-profit').innerText = '$' + data.kpis.net_profit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('ov-revenue').innerText = '$' + data.kpis.gross_revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        const priceIdx = data.kpis.price_index;
        const priceEl = document.getElementById('ov-price-index');
        priceEl.innerText = (priceIdx > 0 ? '+' : '') + priceIdx + '%';
        if (priceIdx > 0) {
            priceEl.title = "You are more expensive than competitors on average.";
            priceEl.style.color = "var(--red)";
        } else if (priceIdx < 0) {
            priceEl.title = "You are cheaper than competitors on average.";
            priceEl.style.color = "var(--green)";
        }

        // Leak Detector
        document.getElementById('ov-leaks').innerText = data.kpis.leak_count;

        // AI Actions
        const container = document.getElementById('ai-actions-container');
        if (data.actions && data.actions.length > 0) {
            const icons = ['🎯', '📈', '⚠️'];
            const borders = ['var(--violet)', 'var(--green)', 'var(--amber)'];
            
            container.innerHTML = data.actions.map((action, i) => `
                <div style="display: flex; gap: 16px; align-items: center; background: var(--bg-surface); border-left: 4px solid ${borders[i % 3]}; padding: 16px; border-radius: 4px;">
                    <div style="font-size: 24px;">${icons[i % 3]}</div>
                    <div style="font-size: 13px; color: var(--text-secondary); font-weight: 600; line-height: 1.5;">${action}</div>
                </div>
            `).join('');
        }

    } catch(e) {
        console.error("Overview error:", e);
        document.getElementById('ai-actions-container').innerHTML = '<div class="text-red">Failed to load AI summary.</div>';
    }
}
