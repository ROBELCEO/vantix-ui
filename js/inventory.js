let inventoryData = []; // Store data globally

async function loadInventory() {
    const tbody = document.getElementById('inventory-body');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/products');
        const data = await res.json();
        
        if(!data.products || data.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-tertiary" style="text-align: center; padding: 40px;">No products found.</td></tr>';
            return;
        }

        inventoryData = data.products;

        let html = '';
        data.products.forEach((p, index) => {
            const price = parseFloat(p.price) || 0;
            const cost = parseFloat(p.cost) || 0;
            let margin = price > 0 ? ((price - cost) / price) * 100 : 0;
            const stock = p.stock !== undefined ? p.stock : 0;
            
            let statusBadge = '<span class="badge badge-green">HEALTHY</span>';
            if(stock === 0) statusBadge = '<span class="badge badge-red">OUT OF STOCK</span>';
            else if(stock < 10) statusBadge = '<span class="badge badge-amber">LOW STOCK</span>';

            // Check if it has variants to determine if we show the expander icon
            const hasVariants = p.variants_data && p.variants_data.length > 0;
            const cursorStyle = hasVariants ? 'cursor: pointer;' : '';
            const expandIcon = hasVariants ? '<span style="color:var(--accent); margin-right:8px; font-size:10px;">▼</span>' : '';

            // Main Row
            html += `
                <tr onclick="toggleVariants(${index})" style="${cursorStyle}">
                    <td>
                        <div class="product-cell">
                            ${expandIcon}
                            <img src="${p.image_url || 'https://via.placeholder.com/40'}" class="product-img">
                            <div class="product-info">
                                <span class="product-title">${p.title}</span>
                                <span class="product-variants">${hasVariants ? p.variants_data.length + ' Variants' : '1 Variant'}</span>
                            </div>
                        </div>
                    </td>
                    <td class="mono ${stock === 0 ? 'text-red' : (stock < 10 ? 'text-amber' : '')}">${stock}</td>
                    <td class="mono text-tertiary">$${cost.toFixed(2)}</td>
                    <td class="mono">$${price.toFixed(2)}</td>
                    <td class="mono text-green" style="font-weight:700;">${margin.toFixed(1)}%</td>
                    <td><div class="stars">★★★★★</div></td>
                    <td><div class="velocity-label text-green">SELLING FAST</div></td>
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
                        <td colspan="8">${variantHtml}</td>
                    </tr>
                `;
            }
        });

        tbody.innerHTML = html;

    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-red" style="text-align: center; padding: 40px;">Failed to load inventory.</td></tr>';
    }
}

function toggleVariants(index) {
    const row = document.getElementById(`variant-row-${index}`);
    if (row) {
        row.classList.toggle('open');
    }
}

loadInventory();
