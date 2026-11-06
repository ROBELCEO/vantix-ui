import glob

files = glob.glob("*.html")
updated_count = 0

# If you want a different number, change it here:
new_number = "Over 150,000+"

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # Replace the old numbers
    content = content.replace("100,000+", new_number)
    content = content.replace("100,000", new_number)
    content = content.replace("Over Over", "Over") # Fix if it was already "Over 100,000"

    if content != original_content:
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        updated_count += 1
        print(f"✅ Updated number in {file}")

print(f"✅ Finished updating {updated_count} files.")
