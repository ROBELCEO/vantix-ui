import glob

files = glob.glob("*.html")
script_tag = '<script src="js/paywall.js?v=1"></script>'

for file in files:
    if file in ["login.html", "terms.html", "privacy.html", "logo-preview.html"]:
        continue
        
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    if "js/paywall.js" not in content:
        content = content.replace("</body>", script_tag + "\n</body>")
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Injected paywall script into {file}")
