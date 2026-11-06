import glob
import os

# 1. Forcefully fix the GitHub redirect in login.html
with open("login.html", "r", encoding="utf-8") as f:
    html = f.read()

html = html.replace(
    "options: { redirectTo: 'https://robelceo.github.io/vantix-ui/index.html' }",
    "options: { redirectTo: 'https://midra.xyz/index.html' }"
)
# Fallback in case of double quotes or slight spacing differences
html = html.replace(
    'options: { redirectTo: "https://robelceo.github.io/vantix-ui/index.html" }',
    'options: { redirectTo: "https://midra.xyz/index.html" }'
)

with open("login.html", "w", encoding="utf-8") as f:
    f.write(html)
print("✅ Fixed GitHub redirect in login.html")

# 2. Forcefully fix the API URLs in ALL JS files
js_files = glob.glob("js/*.js")
for file in js_files:
    with open(file, "r", encoding="utf-8") as f:
        js = f.read()
    
    if "vantix-my5f.onrender.com" in js:
        js = js.replace("https://vantix-my5f.onrender.com", "https://api.midra.xyz")
        js = js.replace("vantix-my5f.onrender.com", "api.midra.xyz")
        with open(file, "w", encoding="utf-8") as f:
            f.write(js)
        print(f"✅ Fixed API URLs in {file}")

# 3. Create a 404.html fallback for GitHub Pages
# If someone goes to a wrong URL, this will redirect them to the index
if not os.path.exists("404.html"):
    with open("404.html", "w", encoding="utf-8") as f:
        f.write("""<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=/index.html">
    <script>window.location.href = "/index.html";</script>
</head>
<body>
    <p>Redirecting to Vantix...</p>
</body>
</html>""")
    print("✅ Created 404.html fallback for GitHub Pages")
