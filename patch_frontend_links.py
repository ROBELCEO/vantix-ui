with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

old_actions = """                    <!-- ACTIONS -->
                    <div style="display: flex; gap: 8px;">
                        <button id="save-btn-${index}" onclick="saveOpportunity(${index})" style="flex: 1; padding: 10px; background: #FFF; border: 1px solid #D1D5DB; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#F3F4F6'" onmouseout="this.style.background='#FFF'">Save to Wishlist</button>
                        ${item.description ? `<button id="push-btn-${index}" onclick="pushToShopify(${index})" style="flex: 1; padding: 10px; background: #09090B; color: #FFF; border: none; font-weight: 800; font-size: 12px; border-radius: 2px; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='#27272A'" onmouseout="this.style.background='#09090B'">Push to Shopify</button>` : ''}
                    </div>"""

new_actions = """                    <!-- ACTIONS -->
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <!-- SOURCE LINKS -->
                        <div style="display: flex; gap: 8px;">
                            ${item.aliexpress_url ? `<a href="${item.aliexpress_url}" target="_blank" style="flex: 1; padding: 8px; background: #F8FAFC; border: 1px solid #E4E4E7; color: #09090B; font-weight: 800; font-size: 11px; border-radius: 2px; text-align: center; text-decoration: none; transition: 0.2s;" onmouseover="this.style.background='#F1F5F9'" onmouseout="this.style.background='#F8FAFC'">AliExpress ↗</a>` : ''}
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
    print("✅ Added source links to the Discovery cards!")
else:
    print("⚠️ Could not find the exact action block. Checking for regex...")
    import re
    pattern = re.compile(r'<!-- ACTIONS -->\s*<div style="display: flex; gap: 8px;">.*?</div>', re.DOTALL)
    js = pattern.sub(new_actions, js)
    with open("js/discovery.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Added source links via regex fallback.")
