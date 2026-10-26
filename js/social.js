async function loadSocial() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/social/summary');
        const data = await res.json();

        // 1. Render Scorecard
        const scoreContainer = document.getElementById('scorecard-container');
        scoreContainer.innerHTML = data.scorecard.map(s => {
            let displayFollowers = s.followers;
            let textColor = "var(--text-tertiary)";
            
            // Handle Instagram Error
            if (s.platform === "Instagram" && data.raw_scraped_data.instagram.error) {
                displayFollowers = "Blocked (Requires Proxy)";
                textColor = "var(--red)";
            } 
            // Handle TikTok Error
            else if (s.platform === "TikTok" && data.raw_scraped_data.tiktok.error) {
                displayFollowers = "Blocked";
                textColor = "var(--red)";
            } 
            // Success
            else {
                displayFollowers = displayFollowers + " followers";
            }

            return `
            <div class="social-row">
                <div style="display: flex; align-items: center;">
                    <div class="social-avatar" style="background: ${s.color};">${s.initials}</div>
                    <div>
                        <div style="font-weight: 700; font-size: 13px;">${s.name}</div>
                        <div style="font-size: 10px; color: ${textColor};">${s.platform} • ${displayFollowers}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div class="text-tertiary" style="font-size: 9px; text-transform: uppercase;">Engagement</div>
                    <div class="mono text-green" style="font-size: 14px; font-weight: 700;">${s.engagement}%</div>
                </div>
            </div>
            `;
        }).join('');

        // 2. Render Complaints
        const compContainer = document.getElementById('complaints-container');
        compContainer.innerHTML = data.complaints.map(c => `
            <div class="complaint-row">
                <div class="complaint-label">${c.topic}</div>
                <div class="complaint-bar-wrap">
                    <div class="complaint-bar" style="width: ${c.percentage}%; background: ${c.color};"></div>
                </div>
                <div class="complaint-pct" style="color: ${c.color};">${c.percentage}%</div>
            </div>
        `).join('');

        // 3. Render Praises
        const praiseContainer = document.getElementById('praises-container');
        praiseContainer.innerHTML = data.praises.map(p => `
            <span class="tag-praise">${p}</span>
        `).join('');

        // 4. Render AI Opportunity
        document.getElementById('ai-opportunity').innerHTML = data.opportunity;

    } catch(e) {
        console.error("Failed to load social data", e);
    }
}

loadSocial();
