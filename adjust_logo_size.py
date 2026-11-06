import glob

files = glob.glob("*.html")
updated_count = 0

# The old strings we injected previously
old_icon = 'style="width: 42px; height: 42px; object-fit: contain;"'
new_icon = 'style="width: 36px; height: 36px; object-fit: contain;"'

old_text = 'style="font-size: 28px !important; font-weight: 900 !important; letter-spacing: 1px !important; color: #FFFFFF !important;"'
new_text = 'style="font-size: 24px !important; font-weight: 900 !important; letter-spacing: 1px !important; color: #FFFFFF !important;"'

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace the sizes
    content = content.replace(old_icon, new_icon)
    content = content.replace(old_text, new_text)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    updated_count += 1

print(f"✅ Reduced icon to 36px and text to 24px in {updated_count} HTML files.")
