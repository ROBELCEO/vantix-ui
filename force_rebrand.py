import glob
import re

files = glob.glob("*.html")
updated_count = 0

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Aggressive Text Replacement
    content = content.replace("VANTI<span>X</span>", "MIDRA")
    content = content.replace("VANTI", "MIDRA")
    content = content.replace("VANTIX", "MIDRA")
    content = content.replace("Vantix", "Midra")
    
    # 2. Aggressive SVG Logo Replacement (Catches any polyline that looks like a V)
    new_logo = '<polyline points="6.5,24 6.5,8 16,18 25.5,8 25.5,24" fill="none" stroke="#00E5FF" stroke-width="3.2" stroke-linejoin="miter" stroke-linecap="square"/>'
    content = re.sub(r'<polyline points="[^"]*"[^>]*/>', new_logo, content)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    updated_count += 1

print(f"✅ Forced rebrand on {updated_count} HTML files.")
