import re
import sys

with open("js/terminal.js", "r", encoding="utf-8") as f:
    js = f.read()

# Find the start of the function and the next function to safely replace the block
new_func = """function renderSafeFloor(product) {
    const container = document.getElementById('safe-floor-content');
    if (!container) return;

    const cost = parseFloat(product.my_cost);
    const hasCost = !isNaN(cost) && cost > 0;

    if (hasCost) {
        const safeFloor = cost / 0.85;
        container.innerHTML = `
            <div style="font-size: 28px; font-weight: 900; color: #059669; margin-bottom: 4px;">$${safeFloor.toFixed(2)}</div>
            <div style="font-size: 12px; color: #52525B; font-weight: 600;">Lowest price before losing money</div>
            <div style="margin-top: 16px; font-size: 12px; color: #71717A;">Your Cost (COGS): <b>$${cost.toFixed(2)}</b></div>
        `;
    } else {
        container.innerHTML = `
            <div style="font-size: 15px; font-weight: 900; color: #E11D48; margin-bottom: 16px;">COGS MISSING</div>
            <div style="display: flex; gap: 8px;">
                <input type="number" id="manual-cogs-input" placeholder="Enter Cost ($)" style="flex: 1; padding: 10px; border: 1px solid #D1D5DB; border-radius: 4px; font-weight: 700; outline: none;">
                <button onclick="saveManualCOGS('${product.my_product}')" style="padding: 10px 16px; background: #09090B; color: #FFF; font-weight: 800; border-radius: 4px; cursor: pointer;">Save</button>
            </div>
            <div style="margin-top: 12px; font-size: 11px; color: #71717A;">Enter your cost to calculate the safe floor.</div>
        `;
    }
}
"""

# Regex to find the whole function
pattern = re.compile(r'function renderSafeFloor\(product\) \{.*?\n\}', re.DOTALL)
js, count = pattern.subn(new_func, js)

if count == 0:
    print("❌ FAILED TO FIND renderSafeFloor. Aborting.")
    sys.exit(1)

# Ensure saveManualCOGS exists
save_cogs = """
window.saveManualCOGS = async function(productTitle) {
    const input = document.getElementById('manual-cogs-input');
    if (!input) return;
    const cost = parseFloat(input.value);
    if (isNaN(cost) || cost <= 0) return alert("Please enter a valid cost.");

    input.disabled = true;
    try {
        const token = window.getAuthToken();
        const res = await fetch('https://vantix-my5f.onrender.com/api/ai/update-cost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ product_title: productTitle, cost: cost })
        });
        
        if (res.ok) {
            const index = allComparisons.findIndex(c => c.my_product === productTitle);
            if (index !== -1) {
                allComparisons[index].my_cost = cost;
                selectProduct(index);
            }
        } else {
            alert("Failed to save COGS.");
            input.disabled = false;
        }
    } catch(e) {
        console.error(e);
        input.disabled = false;
    }
};
"""

if "saveManualCOGS" not in js:
    js += save_cogs

with open("js/terminal.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ Successfully overwrote renderSafeFloor AND added saveManualCOGS.")
