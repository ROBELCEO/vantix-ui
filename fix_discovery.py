import re

# 1. Fix discovery.html
with open('discovery.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the ghost functions with the real ones
html = html.replace('onkeypress="handleSearch(event)"', 'onkeypress="if(event.key === \'Enter\') performSearch()"')
html = html.replace('onclick="triggerSearch()"', 'onclick="performSearch()"')

# Force the cache version to 2201
html = re.sub(r'js/discovery\.js\?v=\d+', 'js/discovery.js?v=2201', html)
html = html.replace('js/discovery.js"', 'js/discovery.js?v=2201"')

with open('discovery.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("✅ discovery.html fixed and cache bumped to 2201.")

# 2. Verify the fixes in discovery.html
with open('discovery.html', 'r', encoding='utf-8') as f:
    html_check = f.read()
    if 'handleSearch' in html_check or 'triggerSearch' in html_check:
        print("❌ Warning: Ghost functions still present in HTML.")
    else:
        print("✅ Ghost functions removed from HTML.")
    if 'v=2201' in html_check:
        print("✅ Cache version is 2201.")
