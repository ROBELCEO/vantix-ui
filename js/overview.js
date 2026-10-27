async function loadOverview() {
    alert("DEBUG: Overview script started!"); // <--- THIS WILL PROVE IF IT RUNS

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/overview/summary');
        
        alert("DEBUG: Backend responded with status: " + res.status);

        if (!res.ok) {
            throw new Error("HTTP status " + res.status);
        }

        const data = await res.json();
        
        // Update Health Score
        document.getElementById('health-score').innerText = data.health_score;
        document.getElementById('health-status').innerText = data.status;
        
        let ringColor = 'var(--green)';
        if(data.health_score < 50) ringColor = 'var(--red)';
        else if(data.health_score < 75) ringColor = 'var(--amber)';
        
        document.getElementById('health-ring').style.background = `conic-gradient(${ringColor} ${data.health_score}%, var(--bg-elevated) ${data.health_score}% 100%)`;
        document.getElementById('health-score').style.color = ringColor;

        // Update Actions
        const actionContainer = document.getElementById('ai-actions-container');
        if (data.actions && data.actions.length > 0) {
            actionContainer.innerHTML = data.actions.map((action, i) => `
                <div class="action-item" style="border-left-color: var(--violet);">
                    <div style="font-size: 20px;">🎯</div>
                    <div><div style="font-size: 12px; color: var(--text-secondary);">${action}</div></div>
                </div>
            `).join('');
        } else {
            actionContainer.innerHTML = '<div class="text-tertiary">No actions generated.</div>';
        }

        // Fetch basic counts in the background
        fetch('https://vantix-my5f.onrender.com/api/products').then(r=>r.json()).then(d=>{
            document.getElementById('ov-products').innerText = d.products ? d.products.length : 0;
        });

    } catch (e) {
        alert("DEBUG ERROR: " + e.message);
        document.getElementById('health-score').innerText = "ERR";
        document.getElementById('health-status').innerText = "Failed";
    }
}
