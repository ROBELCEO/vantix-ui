with open("membership.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

# 1. Replace the broken text inside the CSS content property with the Unicode escape for a checkmark
# This targets: content: 'âœ“';
html = re.sub(r"content:\s*'[^']*';", r"content: '\2713';", html)

# 2. Double check the HTML body just in case
html = html.replace("âœ“", "✓")
html = html.replace("âœ”", "✓")

with open("membership.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Fixed the checkmark encoding in the CSS!")
