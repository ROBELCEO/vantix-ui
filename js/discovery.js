async function switchCategory(category) {
    // Update Pills
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    const pills = document.querySelectorAll('.pill');
    if (category === '') {
        pills[0].classList.add('active');
    } else {
        pills.forEach(p => {
            if (p.innerText.toLowerCase().includes(category.toLowerCase())) {
                p.classList.add('active');
            }
        });
    }

    await loadDiscovery(category);
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        triggerSearch();
    }
}

function triggerSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;
    
    // Remove active state from pills since we are doing a custom search
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    
    loadDiscovery(query);
}

async function loadDiscovery(category = '') {
    const container = document.getElementById('discovery-container');
    if(!container) return;

    container.innerHTML = '<div class="text-tertiary" style="text-align: center; padding: 40px;"><span style="display:inline-block; width:20px; height:20px; border:2px solid var(--accent); border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></span><div style="margin-top:12px;">Searching global Shopify catalog...</div></div>';

    try {
        const url = category 
            ? `https://vantix-my5f.onrender.com/api/discovery/trends?category=${encodeURIComponent(category)}`
            : 'https://vantix-my5f.onrender.com/api/discovery/trends';
            
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            container.innerHTML = `<div class="text-red" style="text-align: center; padding: 40px;">${data.error}</div>`;
            return;
        }

        container.innerHTML = data.market_intel.map((item, index) => {
            // Calculate estimated profit (Assume wholesale is 35% of retail)
            const estWholesale = item.price * 0.35;
            const estProfit = item.price - estWholesale;
            const margin = ((estProfit / item.price) * 100).toFixed(0);

            return `
            <div class="panel" style="margin-bottom: 24px; padding: 20px;">
                <div style="display: flex; gap: 20px; align-items: flex-start;">
                    <img src="${item.image}" style="width: 120px; height: 120px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); background: var(--bg-surface);">
                    
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div>
                                <div style="font-weight: 900; font-size: 18px; color: var(--text-primary);">${item.name}</div>
                                <div style="font-size: 12px; color: var(--text-tertiary);">Found on: <b>${item.store}</b></div>
                            </div>
                            <div class="badge badge-green" style="font-size: 12px;">GLOBAL CATALOG</div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 16px;">
                            <div>
                                <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 800; color: var(--text-primary);">${item.price.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <div style="color: var(--amber); font-size: 14px;">★★★★★</div>
                                <div style="font-size: 12px; color: var(--text-tertiary);">${item.rating} (${item.review_count} reviews)</div>
                            </div>
                            <div>
                                <span class="badge badge-violet" style="font-size: 11px;">Est. Margin: ${margin}%</span>
                            </div>
                        </div>

                        <div style="background: var(--bg-surface); border-left: 3px solid var(--violet); padding: 12px; border-radius: 4px; margin-bottom: 16px;">
                            <div style="font-size: 10px; font-weight: 800; color: var(--violet); margin-bottom: 8px; text-transform: uppercase;">⚡ AI Goldmine Signals</div>
                            <ul style="margin: 0; padding-left: 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                                ${item.bullets.map(b => `<li>${b}</li>`).join('')}
                            </ul>
                        </div>

                        <!-- THE 1-CLICK PUSH BUTTON -->
                        <button onclick="pushToShopify('${item.name.replace(/'/g, "\\'")}', ${item.price}, '${item.image}', this)" class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 13px;">
                            🚀 Push to Shopify as Draft
                        </button>
                    </div>
                </div>
            </div>
        `}).join('');

    } catch(e) {
        console.error("Discovery error:", e);
        container.innerHTML = '<div class="text-red" style="text-align: center; padding: 40px;">Failed to load intelligence.</div>';
    }
}

async function pushToShopify(title, price, imageUrl, btn) {
    btn.innerText = "Pushing to Shopify...";
    btn.disabled = true;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/push-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, price: price, image_url: imageUrl })
        });
        
        const data = await res.json();

        if (res.ok) {
            btn.innerText = "✅ Pushed to Shopify Drafts!";
            btn.style.background = "var(--green)";
            btn.style.color = "#000";
        } else {
            // Show the EXACT error from Shopify
            throw new Error(data.detail || "Unknown error");
        }
    } catch(e) {
        console.error("Push error:", e);
        // Print the error on the button so you can read it
        btn.innerText = "❌ " + e.message;
        btn.style.background = "var(--red)";
        btn.style.color = "#fff";
        
        // Reset after 5 seconds
        setTimeout(() => {
            btn.innerText = "🚀 Push to Shopify as Draft";
            btn.style.background = "var(--accent)";
            btn.style.color = "#000";
            btn.disabled = false;
        }, 5000);
    }
}

// Initial load
window.addEventListener('load', () => {
    if (window.location.pathname.includes('discovery.html')) {
        setTimeout(() => loadDiscovery(''), 500);
    }
});


