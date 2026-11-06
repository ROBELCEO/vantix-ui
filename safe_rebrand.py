import glob

files = glob.glob("*.html")
updated_count = 0

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. SAFE Text Replacement (Vantix -> Midra)
    content = content.replace("VANTI<span>X</span>", "MIDRA")
    content = content.replace("VANTI", "MIDRA")
    content = content.replace("VANTIX", "MIDRA")
    content = content.replace("Vantix", "Midra")

    # 2. SURGICAL SVG Replacement
    # We ONLY replace the exact points of the V logo. Nothing else.
    old_points = 'points="6.5,8 14.5,24 24,8"'
    new_points = 'points="6.5,24 6.5,8 16,18 25.5,8 25.5,24"'
    
    if old_points in content:
        content = content.replace(old_points, new_points)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    updated_count += 1

print(f"✅ Safely rebranded {updated_count} HTML files.")
