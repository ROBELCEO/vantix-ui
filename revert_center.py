import glob
import re

files = glob.glob("*.html")
updated_count = 0

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Revert the inline style on the brand anchor tag back to flex-start
    old_brand_a = '<a href="index.html" class="brand" style="gap: 8px !important; justify-content: center !important; width: 100% !important; padding-left: 0 !important;">'
    new_brand_a = '<a href="index.html" class="brand" style="gap: 8px !important; justify-content: flex-start !important; width: 100% !important;">'
    
    if old_brand_a in content:
        content = content.replace(old_brand_a, new_brand_a)

    # 2. Revert the CSS block back to flex-start
    pattern = r'(\.header \.brand \{.*?)justify-content:\s*center\s*!important;(.*?\})'
    
    def replacer(match):
        return match.group(1) + 'justify-content: flex-start !important;' + match.group(2)
        
    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    updated_count += 1

print(f"✅ Restored logo to the left side in {updated_count} HTML files.")
