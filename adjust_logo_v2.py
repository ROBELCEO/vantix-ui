import glob

files = glob.glob("*.html")
updated_count = 0

# Current sizes: 36px icon, 24px text
# New sizes: 32px icon, 20px text
old_icon = 'style="width: 36px; height: 36px; object-fit: contain;"'
new_icon = 'style="width: 32px; height: 32px; object-fit: contain;"'

old_text = 'style="font-size: 24px !important; font-weight: 900 !important; letter-spacing: 1px !important; color: #FFFFFF !important;"'
new_text = 'style="font-size: 20px !important; font-weight: 900 !important; letter-spacing: 0.5px !important; color: #FFFFFF !important;"'

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace(old_icon, new_icon)
    content = content.replace(old_text, new_text)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    updated_count += 1

print(f"✅ Adjusted logo to 32px and text to 20px in {updated_count} files.")
