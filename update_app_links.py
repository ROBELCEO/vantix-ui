import glob

files = glob.glob("*.html")
for file in files:
    if file in ["index.html", "login.html", "privacy.html", "terms.html", "404.html"]:
        continue
        
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()

    # Update Sidebar Connect Tab
    content = content.replace('href="index.html" class="drawer-tab">Connect', 'href="connect.html" class="drawer-tab">Connect')
    content = content.replace('href="index.html" class="tab"><svg', 'href="connect.html" class="tab"><svg')
    
    # Update Brand Logo (Clicking logo inside app goes to Connect)
    content = content.replace('href="index.html" class="brand"', 'href="connect.html" class="brand"')
    
    # Update Settings Manage Buttons
    content = content.replace('href="index.html" class="set-btn-secondary"', 'href="connect.html" class="set-btn-secondary"')

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
print("✅ Updated all app pages to point to connect.html")
