import re

path = "js/terminal.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

# 1. Fix the Simulator Logic
new_calc = """function calculateSimulation(cost, originalPrice) {
    const input = document.getElementById('sim-price');
    if (!input) return;
    const newPrice = parseFloat(input.value) || 0;
    const resultDiv = document.getElementById('sim-result');
    
    if (cost === null || cost === undefined || cost === 0) {
        resultDiv.innerHTML = `<span class="trm-text-red">COGS missing. Enter your cost in Shopify to simulate.</span>`;
        return;
    }

    if (newPrice === originalPrice) {
        resultDiv.innerHTML = `<span class="trm-text-muted">Drop the price below $${originalPrice} to see the volume required.</span>`;
        return;
    }

    if (newPrice > originalPrice) {
        resultDiv.innerHTML = `<span class="trm-text-green">You are raising your price. Any volume maintains higher profit.</span>`;
        return;
    }

    const originalMargin = originalPrice - cost;
    const newMargin = newPrice - cost;

    if (newMargin <= 0) {
        resultDiv.innerHTML = `<span class="trm-text-red">You are selling at a loss.</span>`;
        return;
    }

    const multiplier = originalMargin / newMargin;
    const percentIncrease = Math.round((multiplier - 1) * 100);

    resultDiv.innerHTML = `
        To make the same profit, you must sell <b class="trm-text-cyan">${multiplier.toFixed(2)}x</b> more units.<br>
        That is a <b class="trm-text-amber">${percentIncrease}% increase</b> in sales volume.
    `;
}"""
code = re.sub(r'function calculateSimulation\(cost, originalPrice\) \{.*?\n\}', new_calc, code, flags=re.DOTALL)

# 2. Fix fetchAIAdvice to pass the exact math to the backend
new_ai = """async function fetchAIAdvice(productName, myPrice, myCost, compPrice, safeFloor) {
    const div = document.getElementById('ai-advisor-content');
    if (!div) return;

    div.innerHTML = '<div class="trm-empty">Analyzing strategy…</div>';

    if (window.userTier === 'starter') {
        div.style.position = 'relative';
        div.innerHTML = `
            <div style="position: absolute; inset: 0; z-index: 10; backdrop-filter: blur(4px); background: rgba(255,255,255,0.7); display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 2px;">
                <div style="font-size: 24px; margin-bottom: 8px;">🔒</div>
                <div style="font-weight: 800; font-size: 14px; color: #09090B; margin-bottom: 8px;">Pro Feature</div>
                <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 6px 12px; border-radius: 2px; text-decoration: none; font-size: 11px; font-weight: 800;">Unlock AI Advisor</a>
            </div>
            <div class="trm-empty" style="min-height: 120px;">&nbsp;</div>
        `;
        return;
    }

    try {
        const url = new URL('https://vantix-my5f.onrender.com/api/ai/advisor');
        url.searchParams.append('product_name', productName);
        if (myPrice !== undefined && myPrice !== null) url.searchParams.append('my_price', myPrice);
        if (myCost !== undefined && myCost !== null) url.searchParams.append('my_cost', myCost);
        if (compPrice !== undefined && compPrice !== null) url.searchParams.append('comp_price', compPrice);
        if (safeFloor !== undefined && safeFloor !== null) url.searchParams.append('safe_floor', safeFloor);

        const res = await fetch(url.toString());
        
        if (!res.ok) {
            if (res.status === 400 || res.status === 404) {
                div.innerHTML = `<div class="trm-text-muted" style="font-size: 13px; line-height: 1.5;">No direct competitor found. Focus on your ad creatives and brand positioning to win this market.</div>`;
            } else {
                div.innerHTML = `<div class="trm-text-red">Failed to load advice. AI might be busy.</div>`;
            }
            return;
        }

        const data = await res.json();
        
        if(data.status === "success") {
            div.innerHTML = `${data.advice}`;
        }
    } catch(e) {
        div.innerHTML = `<div class="trm-text-red">Backend asleep. Try again.</div>`;
    }
}"""
code = re.sub(r'async function fetchAIAdvice\(.*?\) \{.*?\n\}', new_ai, code, flags=re.DOTALL)

# 3. Update selectProduct to pass math to fetchAIAdvice
new_select = """function selectProduct(index) {
    activeIndex = index;
    const product = allComparisons[index];
    
    renderWatchlist();
    
    const nameEl = document.getElementById('chart-product-name');
    if(nameEl) nameEl.innerText = product.my_product.toUpperCase();

    const imgEl = document.getElementById('chart-product-img');
    if (imgEl) {
        if (product.my_image) {
            imgEl.src = product.my_image;
            imgEl.style.display = 'block';
        } else {
            imgEl.style.display = 'none';
        }
    }

    renderChart(product);
    renderSafeFloor(product);
    renderSimulator(product);

    let compPrice = null;
    let safeFloor = null;
    if (product.competitor_matches && product.competitor_matches.length > 0) {
        compPrice = product.competitor_matches[0].comp_price;
        safeFloor = product.competitor_matches[0].safe_floor;
    }
    fetchAIAdvice(product.my_product, product.my_price, product.my_cost, compPrice, safeFloor);
}"""
code = re.sub(r'function selectProduct\(index\) \{.*?\n\}', new_select, code, flags=re.DOTALL)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)
print("✅ terminal.js completely patched.")
