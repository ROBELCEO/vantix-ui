import glob
import re

files = glob.glob("*.html")
updated_count = 0

# The new HTML for the brand logo area
new_brand_html = '''<a href="index.html" class="brand" style="gap: 8px !important;">
            <div class="mark" style="background: transparent !important; border: none !important; width: auto !important; height: auto !important; padding: 0 !important; margin-right: 0 !important;">
                <img src="midra-icon.png" alt="Midra" style="width: 42px; height: 42px; object-fit: contain;">
            </div>
            <div style="font-size: 28px !important; font-weight: 900 !important; letter-spacing: 1px !important; color: #FFFFFF !important;">MIDRA</div>
        </a>'''

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the <a href="index.html" class="brand"> ... </a> block and replace it
    # We use regex to catch the whole block safely
    pattern = re.compile(r'<a href="index\.html" class="brand".*?</a>', re.DOTALL)
    
    if pattern.search(content):
        content = pattern.sub(new_brand_html, content)
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        updated_count += 1

print(f"✅ Enlarged logo and reduced gap in {updated_count} HTML files.")
