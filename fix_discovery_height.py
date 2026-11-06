import re

with open("js/discovery.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace the exact inline style height for the Discovery cards
old_style = 'height: 200px; width: 100%; background: #F4F4F5; position: relative;'
new_style = 'height: 380px; width: 100%; background: #F4F4F5; position: relative;'

if old_style in code:
    code = code.replace(old_style, new_style)
    print("✅ Successfully forced Discovery images to 380px.")
else:
    print("⚠️ Could not find the exact style string.")

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(code)

# Bump cache
with open("app.html", "r", encoding="utf-8") as f:
    app = f.read()
app = re.sub(r'js/discovery\.js\?v=\d+', 'js/discovery.js?v=3333', app)
with open("app.html", "w", encoding="utf-8") as f:
    f.write(app)
print("✅ Bumped version to 3333")
