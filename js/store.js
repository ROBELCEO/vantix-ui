let revChartInstance = null;
let custChartInstance = null;

async function loadStoreData() {
    const nameEl = document.getElementById('store-name');
    const domainEl = document.getElementById('store-domain');
    const avatarEl = document.getElementById('store-avatar');
    
    if(!nameEl) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/detailed');
        
        if (!res.ok) throw new Error("HTTP Error: " + res.status);
        
        const data = await res.json();

        // Backend guarantees profile exists
        nameEl.innerText = data.profile.name;
        domainEl.innerText = data.profile.domain;
        if(avatarEl) {
            avatarEl.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.profile.name) + '&background=00E5FF&color=000&size=64&bold=true';
        }

        // Backend guarantees numbers
        document.getElementById('kpi-revenue').innerText = '$' + data.kpis.total_revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('kpi-orders').innerText = data.kpis.order_count;
        document.getElementById('kpi-aov').innerText = '$' + data.kpis.aov.toFixed(2);
        document.getElementById('kpi-abandoned').innerText = '$' + data.kpis.abandoned_value.toFixed(2);
        document.getElementById('abandoned-total').innerText = '$' + data.kpis.abandoned_value.toFixed(2);

        renderRevenueChart(data.chart);

        if (data.top_products.length === 0) {
            document.getElementById('top-products-list').innerHTML = '<div class="text-tertiary" style="padding: 20px 0; text-align: center;">No sales data yet.</div>';
        } else {
            renderTopProducts(data.top_products);
        }

        if (data.carts.length === 0) {
            document.getElementById('carts-list').innerHTML = '<div class="text-tertiary" style="padding: 10px 0; text-align: center; font-size: 11px;">No abandoned carts.</div>';
        } else {
            renderCarts(data.carts);
        }

        if (data.low_stock.length === 0) {
            document.getElementById('low-stock-list').innerHTML = '<div class="text-tertiary" style="padding: 10px 0; text-align: center; font-size: 11px;">Stock is healthy.</div>';
        } else {
            renderLowStock(data.low_stock);
        }

        renderCustomerChart();

    } catch(e) {
        console.error("Failed to load store data", e);
        nameEl.innerText = "Error Loading Store";
        domainEl.innerText = e.message;
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

    const labels = chartData.labels.length ? chartData.labels : ['No Data'];
    const data = chartData.data.length ? chartData.data : [0];

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
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#1F1F1F' }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#8A8A94', font: { family: 'JetBrains Mono', size: 10 } } }
            }
        }
    });
}

function renderTopProducts(products) {
    const list = document.getElementById('top-products-list');
    if(!list) return;
    let html = '';
    products.forEach((p, i) => {
        html += `<div style="display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border);">
            <div class="mono text-tertiary" style="font-size: 11px; width: 15px;">#${i+1}</div>
            <img src="${p.image || 'https://via.placeholder.com/40'}" class="thumb" style="width:36px; height:36px; border-radius:4px;">
            <div style="flex: 1; min-width: 0;">
                <div style="font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                <div class="mono text-tertiary" style="font-size: 10px;">${p.units} sold</div>
            </div>
            <div class="mono text-green" style="font-size: 12px; font-weight: 700;">$${p.revenue.toFixed(2)}</div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderCarts(carts) {
    const list = document.getElementById('carts-list');
    if(!list) return;
    
    let html = '';
    carts.forEach(c => {
        // If a URL exists from Shopify, show the Recover button
        const recoverBtn = c.url ? `<a href="${c.url}" target="_blank" class="btn btn-secondary" style="padding: 4px 10px; font-size: 10px; border-color: var(--amber); color: var(--amber); white-space: nowrap;">Recover →</a>` : '';
        
        html += `<div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--r-btn); margin-bottom: 8px;">
            <div style="flex: 1; min-width: 0; margin-right: 12px;">
                <div style="font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.item}</div>
                <div class="text-tertiary" style="font-size: 10px; margin-top: 2px;">${c.email || 'Guest Customer'}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="mono text-amber" style="font-weight: 800; font-size: 14px;">${c.value.toFixed(2)}</div>
                ${recoverBtn}
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderLowStock(stock) {
    const list = document.getElementById('low-stock-list');
    if(!list) return;
    let html = '';
    stock.forEach(s => {
        html += `<div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 11px;">
            <img src="${s.image || 'https://via.placeholder.com/30'}" class="thumb" style="width: 28px; height: 28px; border-radius:4px;">
            <div style="flex: 1; min-width: 0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.title}</div>
            <div class="mono text-red" style="font-weight: 700;">${s.qty} left</div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderCustomerChart() {
    if(custChartInstance) custChartInstance.destroy();
    const canvas = document.getElementById('customerChart');
    if(!canvas) return;
    const ctx2 = canvas.getContext('2d');
    custChartInstance = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Returning', 'New'],
            datasets: [{
                data: [35, 65],
                backgroundColor: ['#00FF88', '#00E5FF'],
                borderWidth: 0,
                cutout: '75%'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

