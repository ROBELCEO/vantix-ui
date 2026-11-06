with open("js/store.js", "r", encoding="utf-8") as f:
    js = f.read()

# Fix line 32: Change label from Net Profit to Revenue
old_label = 'label: "Net Profit",'
new_label = 'label: "Revenue",'

if old_label in js:
    js = js.replace(old_label, new_label)
    with open("js/store.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Frontend fixed: Chart label changed to Revenue.")
else:
    print("⚠️ Could not find the exact label.")
