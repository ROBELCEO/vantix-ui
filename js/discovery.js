async function loadDiscovery() {
    const container = document.getElementById('discovery-container');
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/category-intel');
        const data = await res.json();

        if (!data.trending_products || data.trending_products.length === 0) {
            container.innerHTML = '<div class="text-tertiary" style="text-align: center; padding: 40px;">No competitor data found. Add a competitor first.</div>';
            return;
        }

        // 1. Rising Queries
        const queriesHtml = data.rising_queries.map(q => `
            <span class="tag-praise" style="background: var(--bg-elevated); color: var(--text-primary); border-color: var(--border-strong);">${q}</span>
        `).join('');

        // 2. Trending Products (with images & prices)
        const productsHtml = data.trending_products.map(p => `
            <div class="product-card">
                <img src="${p.image || 'https://via.placeholder.com/64'}" class="product-img">
                <div class="product-info">
                    <div class="product-title">${p.title}</div>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                </div>
            </div>
        `).join('');

        // 3. New Launches
        const launchesHtml = data.new_launches.map(p => `
            <div class="product-card">
                <img src="${p.image || 'https://via.placeholder.com/64'}" class="product-img">
                <div class="product-info">
                    <div class="product-title">${p.title} <span class="new-launch">NEW</span></div>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="panel" style="border-color: var(--violet); background: linear-gradient(180deg, rgba(139,127,255,0.05), var(--bg-panel));">
                <div class="panel-header" style="color: var(--violet); border-bottom-color: rgba(139,127,255,0.2);">🔥 Trending in ${data.category}</div>
                <div style="margin-bottom: 16px;">${queriesHtml}</div>
                <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">${data.insight}</div>
            </div>

            <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
                <div class="panel">
                    <div class="panel-header">📈 Top Products in Demand</div>
                    ${productsHtml}
                </div>
                <div class="panel">
                    <div class="panel-header">🆕 New Launches from Competitors</div>
                    ${launchesHtml || '<div class="text-tertiary">No new launches this week.</div>'}
                </div>
            </div>
        `;

    } catch(e) {
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Backend asleep. Try again in 30s.</div>';
    }
}
loadDiscovery();
