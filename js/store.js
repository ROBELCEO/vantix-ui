let revChartInstance = null;
let custChartInstance = null;

async function loadStore() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/detailed?shop_domain=trendywear-dev.myshopify.com');
        const data = await res.json();
        if(data.error) { return; }

        const storeName = data.profile.name;
        document.getElementById('store-name').innerText = storeName;
        document.getElementById('store-domain').innerText = data.profile.domain;
        document.getElementById('store-avatar').src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(storeName) + '&background=5E8E3E&color=fff&size=64';

        document.getElementById('kpi-revenue').innerText = '$' + data.kpis.total_revenue.toLocaleString();
        document.getElementById('kpi-orders').innerText = data.kpis.order_count;
        document.getElementById('kpi-aov').innerText = '$' + data.kpis.aov.toFixed(2);
        document.getElementById('kpi-abandoned').innerText = '$' + data.kpis.abandoned_value.toFixed(2);
        document.getElementById('abandoned-total').innerText = '$' + data.kpis.abandoned_value.toFixed(2);

        if(revChartInstance) revChartInstance.destroy();
        const ctx = document.getElementById('revenueChart').getContext('2d');
        let gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0)');
        const labels = data.chart.labels.length ? data.chart.labels : ['Today'];
        const chartData = data.chart.data.length ? data.chart.data : [0];

        revChartInstance = new Chart(ctx, {
            type: 'line',
            data: { labels: labels, datasets: [{ data: chartData, borderColor: '#00E5FF', backgroundColor: gradient, borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#262626' } }, x: { grid: { display: false } } } }
        });

        if(data.top_products.length) {
            let html = '';
            data.top_products.forEach((p, i) => {
                html += '<div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border);">';
                html += '<div style="font-family:JetBrains Mono; font-size:11px; color:var(--dim); width:20px;">#' + (i+1) + '</div>';
                html += '<img src="' + (p.image || 'https://via.placeholder.com/40') + '" style="width:40px; height:40px; object-fit:cover; border-radius:6px;">';
                html += '<div style="flex:1;"><div style="font-size:12px; font-weight:700;">' + p.title + '</div><div style="font-size:10px; color:var(--dim); font-family:JetBrains Mono;">' + p.units + ' sold</div></div>';
                html += '<div style="font-family:JetBrains Mono; font-size:13px; font-weight:800; color:var(--green);">$' + p.revenue.toFixed(2) + '</div></div>';
            });
            document.getElementById('top-products-list').innerHTML = html;
        } else {
            document.getElementById('top-products-list').innerHTML = '<div style="color:var(--dim); text-align:center; padding:20px 0;">No sales data yet.</div>';
        }

        if(data.carts.length) {
            let html = '';
            data.carts.forEach(c => {
                html += '<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border); font-size:11px;">';
                html += '<div><div style="font-weight:700;">' + c.item + '</div><div style="color:var(--dim); font-size:9px;">' + c.email + '</div></div>';
                html += '<div style="font-family:JetBrains Mono; color:var(--amber); font-weight:800;">$' + c.value + '</div></div>';
            });
            document.getElementById('carts-list').innerHTML = html;
        } else {
            document.getElementById('carts-list').innerHTML = '<div style="color:var(--dim); text-align:center; padding:20px 0;">No abandoned carts.</div>';
        }

        if(data.low_stock.length) {
            let html = '';
            data.low_stock.forEach(s => {
                html += '<div style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--border); font-size:11px;">';
                html += '<img src="' + (s.image || 'https://via.placeholder.com/30') + '" style="width:30px; height:30px; object-fit:cover; border-radius:4px;">';
                html += '<div style="flex:1; font-weight:700;">' + s.title + '</div>';
                html += '<div style="font-family:JetBrains Mono; color:var(--red); font-weight:800;">' + s.qty + ' left</div></div>';
            });
            document.getElementById('low-stock-list').innerHTML = html;
        } else {
            document.getElementById('low-stock-list').innerHTML = '<div style="color:var(--dim); text-align:center; padding:20px 0;">Stock is healthy.</div>';
        }

        if(custChartInstance) custChartInstance.destroy();
        const ctx2 = document.getElementById('customerChart').getContext('2d');
        custChartInstance = new Chart(ctx2, {
            type: 'doughnut',
            data: { labels: ['Returning', 'New'], datasets: [{ data: [38, 62], backgroundColor: ['#00FF88', '#00E5FF'], borderWidth: 0, cutout: '75%' }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

    } catch(e) { console.error(e); }
}
loadStore();
