with open("login.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find the current redirect line
old_redirect = "options: { redirectTo: window.location.origin + '/index.html' }"

# The bulletproof fix: resolve 'index.html' relative to the current URL
new_redirect = "options: { redirectTo: new URL('index.html', window.location.href).href }"

if old_redirect in html:
    html = html.replace(old_redirect, new_redirect)
    print("✅ Successfully updated redirect to be relative to the current folder.")
else:
    print("⚠️ Could not find the exact line. Let's force it...")
    import re
    html = re.sub(r"redirectTo:\s*window\.location\.origin\s*\+\s*'/index\.html'", "redirectTo: new URL('index.html', window.location.href).href", html)
    print("✅ Fixed via regex.")

with open("login.html", "w", encoding="utf-8") as f:
    f.write(html)
