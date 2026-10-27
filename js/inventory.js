async function loadInventory() {
    const tbody = document.getElementById('inventory-body');
    if(!tbody) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/products');
        
        if (!res.ok) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-red" style="text-align: center; padding: 40px;">Failed to load inventory.</td></tr>';
            return;
        }

        const data = await res.json();
        
        if(!data.products || data.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-tertiary" style="text-align: center; padding: 40px;">No products found. Sync your Shopify store to import products.</td></tr>';
            return;
        }

        let html = '';
        data.products.forEach((p, index) => {
            const price = parseFloat(p.price) || 0;
            const cost = parseFloat(p.cost) || 0;
            let margin = price > 0 ? ((price - cost) / price) * 100 : 0;
            const stock = p.stock !== undefined ? p.stock : 0;
            
            let statusBadge = '<span class="badge badge-green">HEALTHY</span>';
            if(stock === 0) statusBadge = '<span class="badge badge-red">OUT OF STOCK</span>';
            else if(stock < 10) statusBadge = '<span class="badge badge-amber">LOW STOCK</span>';

            const hasVariants = p.variants_data && p.variants_data.length > 0;
            const cursorStyle = hasVariants ? 'cursor: pointer;' : '';
            const expandIcon = hasVariants ? '<span class="expand-icon">▼</span>' : '';

            // Main Row
            html += `
                <tr onclick="toggleVariants(${index})" style="${cursorStyle}">
                    <td>
                        <div class="product-cell">
                            ${expandIcon}
                            <img src="${p.image_url || 'https://via.placeholder.com/40'}" class="product-img">
                            <div>
                                <div class="product-title">${p.title}</div>
                                <div class="product-variants">${hasVariants ? p.variants_data.length + ' Variants' : '1 Variant'}</div>
                            </div>
                        </div>
                    </td>
                    <td class="mono ${stock === 0 ? 'text-red' : (stock < 10 ? 'text-amber' : '')}">${stock}</td>
                    <td class="mono text-tertiary">$${cost.toFixed(2)}</td>
                    <td class="mono">$${price.toFixed(2)}</td>
                    <td class="mono text-green" style="font-weight:700;">${margin.toFixed(1)}%</td>
                    <td>${statusBadge}</td>
                </tr>
            `;

            // Hidden Variant Row
            if (hasVariants) {
                let variantHtml = `<div class="variant-container">`;
                p.variants_data.forEach(v => {
                    let locHtml = '';
                    if (v.locations && v.locations.length > 0) {
                        v.locations.forEach(l => {
                            locHtml += `<span class="variant-loc">${l.location}: <b>${l.qty}</b></span>`;
                        });
                    }

                    variantHtml += `
                        <div class="variant-item">
                            <div>
                                <span style="font-weight:700; color:var(--text-primary);">${v.title}</span>
                                ${locHtml}
                            </div>
                            <div style="text-align:right;">
                                <div class="mono" style="font-size:12px;">$${v.price.toFixed(2)}</div>
                                <div class="mono ${v.stock === 0 ? 'text-red' : 'text-green'}" style="font-size:10px; margin-top:2px;">${v.stock} in stock</div>
                            </div>
                        </div>
                    `;
                });
                variantHtml += `</div>`;

                html += `
                    <tr class="variant-row" id="variant-row-${index}">
                        <td colspan="6">${variantHtml}</td>
                    </tr>
                `;
            }
        });

        tbody.innerHTML = html;

    } catch(e) {
        console.error("Inventory error:", e);
        tbody.innerHTML = '<tr><td colspan="6" class="text-red" style="text-align: center; padding: 40px;">Network error. Please refresh.</td></tr>';
    }
}

function toggleVariants(index) {
    const row = document.getElementById(`variant-row-${index}`);
    if (row) {
        row.classList.toggle('open');
    }
}

if (window.location.pathname.includes('inventory.html')) {
    loadInventory();
}
