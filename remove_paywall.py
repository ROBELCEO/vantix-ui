import glob
import re

files = glob.glob("*.html")
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Remove the script tag
    if '<script src="js/paywall.js?v=1"></script>' in content:
        content = content.replace('<script src="js/paywall.js?v=1"></script>\n', '')
        content = content.replace('<script src="js/paywall.js?v=1"></script>', '')
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Removed paywall script from {file}")
