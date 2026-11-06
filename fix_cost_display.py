with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

# Fix the logic so 0 or null shows properly, and formats correctly
old_logic = """            let sourcePrice = item.cost ? `$${Number(item.cost).toFixed(2)}` : '—';
            let sellPrice = item.price ? `$${Number(item.price).toFixed(2)}` : '—';"""

new_logic = """            let sourcePrice = (item.cost !== null && item.cost !== undefined) ? `$${Number(item.cost).toFixed(2)}` : '—';
            let sellPrice = (item.price !== null && item.price !== undefined) ? `$${Number(item.price).toFixed(2)}` : '—';"""

if old_logic in js:
    js = js.replace(old_logic, new_logic)
    print("✅ Fixed JS display logic for empty/zero costs.")
else:
    print("⚠️ Could not find exact logic block.")

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(js)
