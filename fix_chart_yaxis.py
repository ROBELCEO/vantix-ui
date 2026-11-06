with open("js/store.js", "r", encoding="utf-8") as f:
    js = f.read()

# Remove the hardcoded -7000 to 1000 limits and let it auto-scale
old_y_axis = """                y: {
                    grid: { color: "#E5E7EB" },
                    ticks: { color: "#6B7280", font: { size: 10 } },
                    min: -7000,
                    max: 1000
                }"""

new_y_axis = """                y: {
                    grid: { color: "#E5E7EB" },
                    ticks: { color: "#6B7280", font: { size: 10 } },
                    beginAtZero: true
                }"""

if old_y_axis in js:
    js = js.replace(old_y_axis, new_y_axis)
    with open("js/store.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Chart Y-axis fixed! It will now auto-scale from 0.")
else:
    print("⚠️ Could not find the exact Y-axis config. Checking for variations...")
    import re
    js = re.sub(r'min: -7000,\s*max: 1000', 'beginAtZero: true', js)
    with open("js/store.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Chart Y-axis fixed via regex.")
