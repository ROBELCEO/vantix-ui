import glob

# 1. Fix the broken paths in all HTML files
files = glob.glob("*.html")
for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Revert the bad replacement, but ONLY for the github.io path
    content = content.replace("robelceo.github.io/vantix/", "robelceo.github.io/vantix-ui/")
    content = content.replace("robelceo.github.io/vantix\"", "robelceo.github.io/vantix-ui\"")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Restored GitHub Pages paths in {file}")

# 2. Verify login.html redirect is perfectly safe now
with open("login.html", "r", encoding="utf-8") as f:
    html = f.read()

# Just to be absolutely safe, we'll set the redirect to the exact working GitHub Pages URL again
old_redirect = "options: { redirectTo: new URL('index.html', window.location.href).href }"
new_redirect = "options: { redirectTo: 'https://robelceo.github.io/vantix-ui/index.html' }"

if old_redirect in html:
    html = html.replace(old_redirect, new_redirect)
    print("✅ Restored the exact, working redirect URL in login.html.")

with open("login.html", "w", encoding="utf-8") as f:
    f.write(html)
