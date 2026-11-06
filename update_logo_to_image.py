import glob
import re

files = glob.glob("*.html")
updated_count = 0

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Replace the SVG in the main sidebar header
    # We use regex to find <div class="mark">...</div> and replace it with the img tag
    # We also force the background to be transparent so the old black box disappears
    new_sidebar_mark = '''<div class="mark" style="background: transparent !important; border: none !important; width: auto !important; height: auto !important; padding: 0 !important; margin-right: 8px !important;">
                <img src="midra-icon.png" alt="Midra" style="width: 32px; height: 32px; object-fit: contain;">
            </div>'''
    
    content = re.sub(r'<div class="mark"[^>]*>.*?</div>', new_sidebar_mark, content, flags=re.DOTALL)

    # 2. Replace the SVG in the Login Page brand header
    new_login_brand = '''<div class="brand">
            <img src="midra-icon.png" alt="Midra" style="width: 40px; height: 40px; object-fit: contain;">
            MIDRA
        </div>'''
    
    content = re.sub(r'<div class="brand">\s*<svg.*?</svg>\s*MIDRA\s*</div>', new_login_brand, content, flags=re.DOTALL)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    updated_count += 1

print(f"✅ Successfully replaced the logo with midra-icon.png in {updated_count} files.")
