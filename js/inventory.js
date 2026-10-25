async function loadInventory() {
    const tbody = document.getElementById('inventory-body');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/products');
        const data = await res.json();
        
        if(!data.products || data.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-tertiary" style="text-align: center; padding: 40px;">No products found in your Shopify store.</td></tr>';
            return;
        }

        // Render the table rows
        tbody.innerHTML = data.products.map((p, index) => {
            // Calculate Margin
            const price = parseFloat(p.price) || 0;
            const cost = parseFloat(p.cost) || 0;
            let margin = 0;
            if (price > 0) margin = ((price - cost) / price) * 100;

            // Mock Data for UI Display (since Shopify API limits some of this)
            // In production, these would come from the database (variants, inventory, reviews)
            const stock = p.stock !== undefined ? p.stock : Math.floor(Math.random() * 50) + 3; // Mock stock
            const variants = p.variants || "3 Variants"; // Mock variants
            const rating = (Math.random() * (5 - 4) + 4).toFixed(1); // Mock 4.0 - 5.0 rating
            const reviews = Math.floor(Math.random() * 2000) + 100; // Mock review count
            
            // Determine Velocity based on Margin (Mock logic)
            let velocityPct = 55;
            let velocityColor = "var(--amber)";
            let velocityText = "STEADY";
            if(margin > 40) { velocityPct = 85; velocityColor = "var(--green)"; velocityText = "SELLING FAST"; }
            if(margin > 50) { velocityPct = 96; velocityColor = "var(--green)"; velocityText = "VIRAL"; }

            // Determine Status
            let statusBadge = '<span class="badge badge-green">HEALTHY</span>';
            if(index === 0) statusBadge = '<span class="badge badge-amber">COMPETITOR DROP</span>'; // Demo badge

            // Generate Stars
            let stars = '';
            for(let i=1; i<=5; i++) {
                stars += i <= Math.round(rating) ? '★' : '☆';
            }

            return `
                <tr>
                    <td>
                        <div class="product-cell">
                            <img src="${p.image_url || 'https://via.placeholder.com/40'}" class="product-img">
                            <div class="product-info">
                                <span class="product-title">${p.title}</span>
                                <span class="product-variants">${variants}</span>
                            </div>
                        </div>
                    </td>
                    <td class="mono ${stock < 10 ? 'text-red' : ''}">${stock}</td>
                    <td class="mono text-tertiary">$${cost.toFixed(2)}</td>
                    <td class="mono">$${price.toFixed(2)}</td>
                    <td class="mono text-green" style="font-weight:700;">${margin.toFixed(1)}%</td>
                    <td>
                        <div class="stars">${stars}</div>
                        <div class="mono text-tertiary" style="font-size:9px;">(${reviews})</div>
                    </td>
                    <td>
                        <div class="velocity-wrap">
                            <div class="velocity-bar" style="width: ${velocityPct}%; background: ${velocityColor};"></div>
                        </div>
                        <div class="velocity-label" style="color: ${velocityColor};">${velocityText}</div>
                    </td>
                    <td>${statusBadge}</td>
                </tr>
            `;
        }).join('');

    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-red" style="text-align: center; padding: 40px;">Failed to load inventory. Backend might be asleep.</td></tr>';
    }
}

// Run on load
loadInventory();
