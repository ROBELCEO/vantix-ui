# 1. Make the modal wider in store.html
with open("store.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace(
    'max-width: 650px; max-height: 80vh;',
    'max-width: 900px; max-height: 85vh;'
)
with open("store.html", "w", encoding="utf-8") as f:
    f.write(html)

# 2. Slice to 3 ONLY for the dashboard in store.js
with open("js/store.js", "r", encoding="utf-8") as f:
    js = f.read()

if "renderLowStock((data.low_stock || []).slice(0, 3));" not in js:
    js = js.replace("renderLowStock(data.low_stock || []);", "renderLowStock((data.low_stock || []).slice(0, 3));")

with open("js/store.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ Frontend fixed: Modal resized, dashboard limited to 3.")
