import re

with open("js/competitors.js", "r", encoding="utf-8") as f:
    js = f.read()

# Add the empty state check right before it tries to render
old = "if (window.cmpAllBestSellers && window.cmpAllBestSellers.length > 0) {"
new = """if (window.cmpAllBestSellers && window.cmpAllBestSellers.length === 0) {
            bestsellersList.innerHTML = '<div class="cmp-empty" style="text-align:center; padding:20px; color:#71717A;">No best seller tags found on these stores.</div>';
        } else if (window.cmpAllBestSellers && window.cmpAllBestSellers.length > 0) {"""

if old in js:
    js = js.replace(old, new)
    with open("js/competitors.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Frontend JS fixed successfully.")
else:
    print("⚠️ Could not find the exact line. Checking for variations...")
    # Try regex fallback just in case
    pattern = r'if \(window\.cmpAllBestSellers && window\.cmpAllBestSellers\.length > 0\) \{'
    if re.search(pattern, js):
        js = re.sub(pattern, new, js)
        with open("js/competitors.js", "w", encoding="utf-8") as f:
            f.write(js)
        print("✅ Frontend JS fixed via regex.")
    else:
        print("❌ Still could not find it.")
