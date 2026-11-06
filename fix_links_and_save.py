import re

with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Fix the Save function to use the reliable token and handle errors
new_save = """async function saveOpportunity(index) {
    const item = allTrends[index];
    const btn = document.getElementById(`save-btn-${index}`);
    const originalText = btn.innerText;
    
    btn.innerText = "Saving...";
    btn.disabled = true;

    try {
        const token = getAuthToken();
        if (!token) throw new Error("Not logged in");

        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({
                title: item.ali_title || item.title,
                price: item.shop_avg_price || item.price || 0,
                image_url: item.image_url,
                store_url: item.aliexpress_url || item.alibaba_url || ''
            })
        });
        
        if (res.ok) {
            btn.innerText = "⭐ Saved!";
            btn.style.color = "#D97706";
            btn.style.borderColor = "#D97706";
        } else {
            throw new Error(`HTTP ${res.status}`);
        }
    } catch(e) {
        console.error(e);
        btn.innerText = "Error - Try Again";
        setTimeout(() => { btn.innerText = originalText; btn.disabled = false; }, 2000);
    }
}"""

js = re.sub(r'async function saveOpportunity\(index\) \{.*?\n\}', new_save, js, flags=re.DOTALL)

# 2. Inject the Source Links with a smart fallback (Search URL)
old_actions = """                    <!-- ACTIONS -->
                    <div style="display: flex; gap: 8px;">
                        <button id="save-btn-${index}" onclick="saveOpportunity(${index})" style="flex: 1; padding: 10px; background: #FFF; border: 1px solid #D1D5DB; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#F3F4F6'" onmouseout="this.style.background='#FFF'">Save to Wishlist</button>
                        ${item.description ? `<button id="push-btn-${index}" onclick="pushToShopify(${index})" style="flex: 1; padding: 10px; background: #09090B; color: #FFF; border: none; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#27272A'" onmouseout="this.style.background='#09090B'">Push to Shopify</button>` : ''}
                    </div>"""

new_actions = """                    <!-- ACTIONS -->
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <!-- SOURCE LINKS -->
                        <div style="display: flex; gap: 8px;">
                            <a href="${item.aliexpress_url || 'https://www.aliexpress.com/wholesale?SearchText=' + encodeURIComponent(item.ali_title || '')}" target="_blank" style="flex: 1; padding: 8px; background: #F8FAFC; border: 1px solid #E4E4E7; color: #09090B; font-weight: 800; font-size: 11px; border-radius: 2px; text-align: center; text-decoration: none; transition: 0.2s;" onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#F8FAFC'">AliExpress ↗</a>
                            ${item.alibaba_url ? `<a href="${item.alibaba_url}" target="_blank" style="flex: 1; padding: 8px; background: #F8FAFC; border: 1px solid #E4E4E7; color: #09090B; font-weight: 800; font-size: 11px; border-radius: 2px; text-align: center; text-decoration: none; transition: 0.2s;" onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#F8FAFC'">Alibaba ↗</a>` : ''}
                        </div>
                        
                        <!-- MAIN BUTTONS -->
                        <div style="display: flex; gap: 8px;">
                            <button id="save-btn-${index}" onclick="saveOpportunity(${index})" style="flex: 1; padding: 10px; background: #FFF; border: 1px solid #D1D5DB; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#F3F4F6'" onmouseout="this.style.background='#FFF'">Save to Wishlist</button>
                            ${item.description ? `<button id="push-btn-${index}" onclick="pushToShopify(${index})" style="flex: 1; padding: 10px; background: #09090B; color: #FFF; border: none; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#27272A'" onmouseout="this.style.background='#09090B'">Push to Shopify</button>` : ''}
                        </div>
                    </div>"""

if old_actions in js:
    js = js.replace(old_actions, new_actions)
    with open("js/discovery.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Fixed save function and added smart source links.")
else:
    print("⚠️ Could not find the exact action block. Checking for regex...")
    pattern = re.compile(r'<!-- ACTIONS -->\s*<div style="display: flex; gap: 8px;">.*?</div>\s*</div>', re.DOTALL)
    js = pattern.sub(new_actions, js)
    with open("js/discovery.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Fixed via regex fallback.")

