import glob

with open("membership.html", "r", encoding="utf-8") as f:
    html = f.read()

# Fix the broken checkmarks
html = html.replace("âœ“", "✓")
html = html.replace("âœ”", "✓")
html = html.replace("âœ", "✓")

with open("membership.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Fixed the broken checkmarks in membership.html")
