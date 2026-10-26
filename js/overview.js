async function loadOverview() {
    // 1. Fetch real store metrics for the KPIs
    try {
        const storeRes = await fetch('https://vantix-my5f.onrender.com/api/store/detailed?shop_domain=trendywear-dev.myshopify.com');
        const storeData = await storeRes.json();
        if (storeData.kpis) {
            document.getElementById('kpi-revenue').innerText = '$' + storeData.kpis.total_revenue.toLocaleString();
            document.getElementById('kpi-aov').innerText = '$' + storeData.kpis.aov.toFixed(2);
            document.getElementById('kpi-comp-revenue').innerText = '$' + (storeData.kpis.total_revenue * 3).toLocaleString(); // Estimate
        }
    } catch(e) { console.log("Store metrics asleep"); }

    // 2. Fetch AI Summary for Leaderboard, Playbook, and Briefing
    try {
        const aiRes = await fetch('https://vantix-my5f.onrender.com/api/overview/summary');
        const aiData = await aiRes.json();

        // Render Leaderboard
        const lbContainer = document.getElementById('leaderboard-container');
        // Find the highest revenue to make the bars relative
        const maxRev = Math.max(...aiData.leaderboard.map(l => l.rev));
        const colors = ['var(--red)', 'var(--amber)', 'var(--green)', 'var(--violet)', 'var(--accent)'];

        lbContainer.innerHTML = aiData.leaderboard.map((l, i) => {
            const pct = (l.rev / maxRev) * 100;
            const isUser = l.is_user ? 'style="background: rgba(0,255,136,0.05); border-radius: 4px; padding: 4px;"' : '';
            const growthColor = l.growth > 0 ? 'text-green' : 'text-red';
            const growthSign = l.growth > 0 ? '▲' : '▼';
            const color = colors[i % colors.length];
            
            // Get initials from name
            const initials = l.name.substring(0, 2).toUpperCase();
            
            return `
                <div class="lb-item" ${isUser}>
                    <div class="lb-rank">#${i+1}</div>
                    <div class="lb-logo" style="background: ${color};">${initials}</div>
                    <div class="lb-info">
                        <div class="lb-name ${l.is_user ? 'text-green' : ''}">${l.name}</div>
                        <div class="lb-growth ${growthColor}">${growthSign} ${Math.abs(l.growth)}%</div>
                    </div>
                    <div class="lb-bar-wrap">
                        <div class="lb-bar" style="width: ${pct}%; background: ${color};"></div>
                    </div>
                    <div class="lb-rev ${l.is_user ? 'text-green' : ''}">$${(l.rev/1000).toFixed(1)}K</div>
                </div>
            `;
        }).join('');

        // Render Playbook
        const playContainer = document.getElementById('playbook-container');
        playContainer.innerHTML = aiData.playbook.map(p => `
            <div class="playbook-item" style="border-left-color: ${p.color};">
                <div class="playbook-icon">${p.icon}</div>
                <div>
                    <div class="playbook-title">${p.title}</div>
                    <div class="playbook-desc">${p.desc}</div>
                </div>
            </div>
        `).join('');

        // Render Briefing
        document.getElementById('briefing-container').innerHTML = aiData.briefing;

    } catch(e) {
        console.log("AI Overview asleep");
        document.getElementById('playbook-container').innerHTML = '<div class="text-red">Failed to load AI.</div>';
    }
}

loadOverview();
