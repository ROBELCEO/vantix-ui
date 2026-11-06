import glob
import re

files = glob.glob("*.html")
updated_count = 0

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Fix the inline style on the brand anchor tag
    # We add justify-content: center and width: 100%
    old_brand_a = '<a href="index.html" class="brand" style="gap: 8px !important;">'
    new_brand_a = '<a href="index.html" class="brand" style="gap: 8px !important; justify-content: center !important; width: 100% !important; padding-left: 0 !important;">'
    
    if old_brand_a in content:
        content = content.replace(old_brand_a, new_brand_a)

    # 2. Fix the overarching sidebar CSS block to ensure it's centered
    # We find `.header .brand { ... }` and force `justify-content: center`
    pattern = r'(\.header \.brand \{.*?)justify-content:\s*flex-start\s*!important;(.*?\})'
    
    def replacer(match):
        return match.group(1) + 'justify-content: center !important;' + match.group(2)
        
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    updated_count += 1

print(f"✅ Centered the logo and text in the sidebar across {updated_count} HTML files.")
