import re

with open("js/competitors.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace Stockouts/Launches/Gaps card HTML
old_card_regex = r'`\s*<div style="background: #FFF; border: 1px solid #E4E4E7;.*?</div>\s*</div>\s*`'
new_card_html = '''`
            <div class="cmp-card" onclick="showProductDetails('${p.title}', '${p.store}', ${p.price}, '${p.image}', '${p.url}')">
                <div class="cmp-card-img-wrap">
                    <img src="${p.image || 'https://via.placeholder.com/300'}" alt="">
                    ${badgeHtml}
                </div>
                <div class="cmp-card-content">
                    <div class="cmp-card-store">${p.store}</div>
                    <div class="cmp-card-title">${p.title}</div>
                    <div class="cmp-card-price-row">
                        <div style="font-size: 12px; color: #71717A; font-weight: 600;">Price</div>
                        <div class="cmp-card-price">$${parseFloat(p.price).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `'''

# If the regex finds the old template, replace it
if re.search(old_card_regex, code, flags=re.DOTALL):
    code = re.sub(old_card_regex, new_card_html, code, flags=re.DOTALL)
    print("✅ Cards replaced with Discovery DNA.")

with open("js/competitors.js", "w", encoding="utf-8") as f:
    f.write(code)
