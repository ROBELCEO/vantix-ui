with open("js/competitors.js", "r", encoding="utf-8") as f:
    js = f.read()

# Update the Best Seller Badge to just say "TOP SELLER" instead of a rank number
old_badge = '''<div style="position: absolute; top: 8px; right: 8px; background: #F59E0B; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px;">#${p.rank || 1} BEST SELLER</div>'''
new_badge = '''<div style="position: absolute; top: 8px; right: 8px; background: #F59E0B; color: #FFF; font-size: 9px; font-weight: 900; padding: 4px 8px; border-radius: 4px;">TOP SELLER</div>'''
if old_badge in js:
    js = js.replace(old_badge, new_badge)

with open("js/competitors.js", "w", encoding="utf-8") as f:
    f.write(js)
print("✅ Frontend patched: Replaced rank badge with TOP SELLER.")
