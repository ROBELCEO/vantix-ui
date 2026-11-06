with open("js/store.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Save the fetched data globally in loadStoreData
if "window.stData = data;" not in js:
    js = js.replace(
        "if (data.chart) renderChart(data.chart);",
        "window.stData = data;\n        if (data.chart) renderChart(data.chart);"
    )

# 2. Append the modal functions
modal_logic = """

// ==========================================
// MODAL LOGIC FOR "VIEW ALL" BUTTONS
// ==========================================
window.openStoreModal = function(type) {
    const modal = document.getElementById('st-modal');
    const title = document.getElementById('st-modal-title');
    const body = document.getElementById('st-modal-body');
    if (!modal || !title || !body) return;

    const data = window.stData || {};
    
    if (type === 'products') {
        title.innerText = "All Top Products";
        if (!data.top_products || data.top_products.length === 0) {
            body.innerHTML = '<div class="st-empty">No products found.</div>';
        } else {
            body.innerHTML = data.top_products.map((p, i) => `
                <div class="st-product-row">
                    <div class="st-row-rank">${i + 1}</div>
                    <img class="st-product-img" src="${stEsc(p.image || 'https://via.placeholder.com/36')}">
                    <div class="st-row-body">
                        <div class="st-row-title">${stEsc(p.title)}</div>
                        <div class="st-row-meta">${stNum(p.units)} sold</div>
                    </div>
                    <div class="st-row-amount st-green">${stMoney(p.revenue)}</div>
                </div>
            `).join('');
        }
    } else if (type === 'carts') {
        title.innerText = "All Abandoned Carts";
        if (!data.carts || data.carts.length === 0) {
            body.innerHTML = '<div class="st-empty">No abandoned carts.</div>';
        } else {
            body.innerHTML = data.carts.map(c => `
                <div class="st-product-row">
                    <div class="st-row-body">
                        <div class="st-row-title">${stEsc(c.item)}</div>
                        <div class="st-row-meta">${stEsc(c.email)}</div>
                    </div>
                    <div class="st-row-amount st-amber">${stMoney(c.value)}</div>
                    <a href="${stEsc(c.url)}" target="_blank" class="st-row-action">Recover</a>
                </div>
            `).join('');
        }
    } else if (type === 'low') {
        title.innerText = "All Low Stock Alerts";
        if (!data.low_stock || data.low_stock.length === 0) {
            body.innerHTML = '<div class="st-empty st-empty-good">✅ No low stock alerts.</div>';
        } else {
            body.innerHTML = data.low_stock.map(s => `
                <div class="st-product-row">
                    <img class="st-product-img" src="${stEsc(s.image || 'https://via.placeholder.com/36')}">
                    <div class="st-row-body">
                        <div class="st-row-title">${stEsc(s.title)}</div>
                        <div class="st-row-meta">Running out soon</div>
                    </div>
                    <div class="st-row-amount st-red">${stNum(s.qty)} left</div>
                </div>
            `).join('');
        }
    } else if (type === 'dead') {
        title.innerText = "All Dead Stock";
        body.innerHTML = '<div class="st-empty">Dead stock analysis requires Shopify Analytics access or is still loading.</div>';
    }

    modal.style.display = 'flex';
};

window.closeStoreModal = function() {
    const modal = document.getElementById('st-modal');
    if (modal) modal.style.display = 'none';
};
"""

if "window.openStoreModal" not in js:
    js += modal_logic

with open("js/store.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ store.js updated with modal logic!")
