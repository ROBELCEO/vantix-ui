with open("js/competitors.js", "r", encoding="utf-8") as f:
    js = f.read()

# The exact line from the audit
old_line = 'if (window.cmpAllBestSellers.length > 0) {'
new_line = '''if (window.cmpAllBestSellers.length === 0) {
            list.innerHTML = '<div class="cmp-empty" style="text-align:center; padding:20px; color:#71717A;">No best seller tags found on these stores.</div>';
        } else if (window.cmpAllBestSellers.length > 0) {'''

if old_line in js:
    js = js.replace(old_line, new_line, 1) # Only replace the first occurrence
    with open("js/competitors.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Frontend fixed successfully.")
else:
    print("❌ Could not find the line.")
