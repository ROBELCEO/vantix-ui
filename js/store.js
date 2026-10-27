let revChartInstance = null;

async function loadStoreData() {
    const nameEl = document.getElementById('store-name');
    if(!nameEl) return;

    nameEl.innerText = "Loading...";

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/detailed');
        if (!res.ok) throw new Error("API Error");
        
        const data = await res.json();

        // Banner
        nameEl.innerText = data.profile.name;
        document.getElementById('store-domain').innerText = data.profile.domain;
        document.getElementById('store-avatar').src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.profile.name) + '&background=00E5FF&color=000&size=64&bold=true';

        // KPIs
        document.getElementById('kpi-revenue').innerText = '$' + data.kpis.total_revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('kpi-orders').innerText = data.kpis.order_count;
        document.getElementById('kpi-aov').innerText = '$' + data.kpis.aov.toFixed(2);
        document.getElementById('kpi-abandoned').innerText = '$' + data.kpis.abandoned_value.toFixed(2);

        // Charts
        renderRevenueChart(data.chart);

        // Top Products
        if (data.top_products.length === 0) {
            document.getElementById('top-products-list').innerHTML = '<div class="text-tertiary" style="padding: 20px 0; text-align: center;">No sales data yet.</div>';
        } else {
            document.getElementById('top-products-list').innerHTML = data.top_products.map((p, i) => `
                <div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border);">
                    <div class="mono text-tertiary" style="font-size: 11px; width: 15px;">#${i+1}</div>
                    <img src="${p.image || 'https://via.placeholder.com/40'}" class="thumb" style="width:36px; height:36px; border-radius:4px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                        <div class="mono text-tertiary" style="font-size: 10px;">${p.units} sold</div>
                    </div>
                    <div class="mono text-green" style="font-size: 12px; font-weight: 700;">$${p.revenue.toFixed(2)}</div>
                </div>
            `).join('');
        }

        // Render Feature Panels
        renderCarts(data.carts);
        loadDeadStock();
        loadBundleSuggestion();
        loadCustomerLTV();

    } catch(e) {
        console.error("Failed to load store data", e);
        nameEl.innerText = "Error Loading Store";
    }
}

function renderRevenueChart(chartData) {
    if(revChartInstance) revChartInstance.destroy();
    const canvas = document.getElementById('revenueChart');
    if(!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 229, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');

    const labels = chartData.labels && chartData.labels.length ? chartData.labels : ['No Data'];
    const data = chartData.data && chartData.data.length ? chartData.data : [0];

    revChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: data,
                borderColor: '#00E5FF',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointBackgroundColor: '#000',
                pointBorderColor: '#00E5FF',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#1F1F1F' }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } }
            }
        }
    });
}

function renderCarts(carts) {
    const list = document.getElementById('carts-list');
    if(!list) return;
    if (carts.length === 0) {
        list.innerHTML = '<div class="text-tertiary" style="font-size: 12px; text-align: center; padding: 12px;">No abandoned carts.</div>';
        return;
    }
    list.innerHTML = carts.map(c => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn); margin-bottom: 8px;">
            <div style="flex: 1; min-width: 0; margin-right: 12px;">
                <div style="font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.item}</div>
                <div class="text-tertiary" style="font-size: 10px; margin-top: 2px;">${c.email || 'Guest'}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="mono text-amber" style="font-weight: 800; font-size: 14px;">$${c.value.toFixed(2)}</div>
                ${c.url ? `<a href="${c.url}" target="_blank" class="btn btn-secondary" style="padding: 4px 10px; font-size: 10px; border-color: var(--amber); color: var(--amber);">Recover</a>` : ''}
            </div>
        </div>
    `).join('');
}

async function loadDeadStock() {
    const list = document.getElementById('dead-stock-list');
    if (!list) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/dead-stock');
        const data = await res.json();
        if (data.dead_items.length === 0) {
            list.innerHTML = '<div class="text-green" style="font-size: 12px; text-align: center; padding: 12px;">✅ No dead stock! Inventory is healthy.</div>';
            return;
        }
        list.innerHTML = data.dead_items.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn); margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0;">
                    <img src="${item.image || 'https://via.placeholder.com/32'}" style="width: 32px; height: 32px; border-radius: 4px;">
                    <div style="min-width: 0;">
                        <div style="font-weight: 700; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</div>
                        <div class="text-tertiary" style="font-size: 10px;">${item.stock} units</div>
                    </div>
                </div>
                <div class="mono text-red" style="font-weight: 800; font-size: 14px;">$${item.cash_trapped.toFixed(2)}</div>
            </div>
        `).join('');
    } catch(e) { list.innerHTML = '<div class="text-red" style="text-align: center;">Failed to load.</div>'; }
}

async function loadBundleSuggestion() {
    const container = document.getElementById('bundle-container');
    if (!container) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/bundles');
        const data = await res.json();
        if (data.error) {
            container.innerHTML = `<div class="text-tertiary" style="font-size: 12px; text-align: center; padding: 12px;">${data.error}</div>`;
            return;
        }
        container.innerHTML = `
            <div style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-card); padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                        <div style="font-size: 14px; font-weight: 900; color: var(--violet); margin-bottom: 4px;">${data.ai.bundle_name}</div>
                        <div style="font-size: 10px; color: var(--text-tertiary);">Bought together ${data.frequency}x</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 11px; text-decoration: line-through; color: var(--text-tertiary);">$${data.original_total.toFixed(2)}</div>
                        <div style="font-size: 16px; font-weight: 900; color: var(--green);">$${data.ai.suggested_price.toFixed(2)}</div>
                    </div>
                </div>
                <div style="background: rgba(139, 127, 255, 0.1); border-left: 3px solid var(--violet); padding: 10px; border-radius: 4px;">
                    <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.4;">${data.ai.pitch}</div>
                </div>
            </div>
        `;
    } catch(e) { container.innerHTML = '<div class="text-red" style="text-align: center;">Failed to analyze.</div>'; }
}

async function loadCustomerLTV() {
    const list = document.getElementById('ltv-list');
    if (!list) return;
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/customers');
        const data = await res.json();
        if (data.customers.length === 0) {
            list.innerHTML = '<div class="text-tertiary" style="font-size: 12px; text-align: center; padding: 12px;">No customer data yet.</div>';
            return;
        }
        list.innerHTML = data.customers.map(c => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn); margin-bottom: 8px;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</div>
                    <div class="text-tertiary" style="font-size: 10px;">${c.orders} orders</div>
                </div>
                <div class="mono text-accent" style="font-weight: 800; font-size: 14px;">$${c.spent.toFixed(2)}</div>
            </div>
        `).join('');
    } catch(e) { list.innerHTML = '<div class="text-red" style="text-align: center;">Failed to load VIPs.</div>'; }
}
