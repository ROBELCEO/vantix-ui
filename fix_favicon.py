import glob
import os

files = glob.glob("*.html")
updated_count = 0

# Check if the icon exists first
if not os.path.exists("midra-icon.png"):
    print("⚠️ Warning: midra-icon.png not found in this folder. Please make sure it is here.")
    exit()

# The favicon link tag
favicon_tag = '<link rel="icon" type="image/png" href="midra-icon.png?v=1">\n'

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # Only add it if it doesn't already exist
    if 'rel="icon"' not in content and 'rel="shortcut icon"' not in content:
        # Inject right before the closing </head> tag
        content = content.replace("</head>", favicon_tag + "</head>")
        
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        updated_count += 1

print(f"✅ Added the Midra Favicon to {updated_count} HTML pages.")
