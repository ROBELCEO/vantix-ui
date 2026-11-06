import re

with open("js/terminal.js", "r", encoding="utf-8") as f:
    js = f.read()

# Clean renderSafeFloor (no manual input)
new_func = """function renderSafeFloor(product) {
    const container = document.getElementById('safe-floor-content');
    if (!container) return;

    const cost = parseFloat(product.my_cost);
    if (!isNaN(cost) && cost > 0) {
        const safeFloor = cost / 0.85;
        container.innerHTML = `
            <div style="font-size: 28px; font-weight: 900; color: #059669; margin-bottom: 4px;">$${safeFloor.toFixed(2)}</div>
            <div style="font-size: 12px; color: #52525B; font-weight: 600;">Lowest price before losing money</div>
            <div style="margin-top: 16px; font-size: 12px; color: #71717A;">Your Cost (COGS): <b>$${cost.toFixed(2)}</b></div>
        `;
    } else {
        container.innerHTML = `
            <div style="font-size: 15px; font-weight: 900; color: #E11D48; margin-bottom: 8px;">COGS NOT SYNCED</div>
            <div style="font-size: 12px; color: #71717A;">Shopify has not provided a cost for this product. Please add a "Cost per item" in your Shopify admin and wait for the next sync.</div>
        `;
    }
}"""

js = re.sub(r'function renderSafeFloor\(product\) \{.*?\n\}', new_func, js, flags=re.DOTALL)

# Remove manual input function if it exists
js = re.sub(r'window\.saveManualCOGS = async function.*?\n\};', '', js, flags=re.DOTALL)

with open("js/terminal.js", "w", encoding="utf-8") as f:
    f.write(js)
print("✅ Frontend cleaned. Manual input removed.")
