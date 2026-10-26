async function searchTrends() {
    const category = document.getElementById('category-input').value.trim();
    if(!category) return;

    const btn = document.getElementById('search-btn');
    const resultsDiv = document.getElementById('results-container');
    
    btn.innerText = "Analyzing...";
    btn.disabled = true;
    resultsDiv.style.display = 'none';

    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/discovery/trends?category=${encodeURIComponent(category)}`);
        const data = await res.json();

        // 1. Render Rising Queries
        const queriesDiv = document.getElementById('queries-container');
        queriesDiv.innerHTML = data.rising_queries.map(q => `
            <span class="tag-praise" style="background: var(--bg-elevated); color: var(--text-primary); border-color: var(--border-strong);">${q}</span>
        `).join('');

        // 2. Render Product Ideas
        const ideasDiv = document.getElementById('ideas-container');
        ideasDiv.innerHTML = data.product_ideas.map(idea => `
            <div class="panel" style="background: var(--bg-surface); border-color: var(--border-strong); margin-bottom: 12px;">
                <div style="font-weight: 800; font-size: 14px; color: var(--accent); margin-bottom: 4px;">${idea.title}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">${idea.desc}</div>
            </div>
        `).join('');

        // 3. Render AI Opportunity
        document.getElementById('opportunity-text').innerHTML = data.opportunity;

        resultsDiv.style.display = 'block';

    } catch(e) {
        alert("Backend asleep or Google Trends blocked. Try again in 30 seconds.");
    }

    btn.innerText = "Search Trends →";
    btn.disabled = false;
}

// Allow Enter key to trigger search
document.getElementById('category-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') searchTrends();
});
