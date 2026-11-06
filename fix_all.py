import glob

# 1. Fix the GitHub redirect in login.html
with open("login.html", "r", encoding="utf-8") as f:
    html = f.read()

old_redirect = "options: { redirectTo: 'https://robelceo.github.io/vantix-ui/index.html' }"
new_redirect = "options: { redirectTo: window.location.origin + '/index.html' }"

if old_redirect in html:
    html = html.replace(old_redirect, new_redirect)
    print("✅ Successfully replaced the GitHub redirect!")
else:
    print("⚠️ Could not find the exact redirect string. Checking manually...")

with open("login.html", "w", encoding="utf-8") as f:
    f.write(html)

# 2. Remove "UI" from all HTML titles and text
print("\nCleaning up 'ui' from project names...")
files = glob.glob("*.html")
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace "Vantix UI" with "Vantix" and "vantix-ui" with "vantix"
    content = content.replace("Vantix UI", "Vantix")
    content = content.replace("vantix-ui", "vantix")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Cleaned naming in {file}")

print("\n✅ All done!")
