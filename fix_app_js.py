import re

# 1. Fix app.js using regex to ignore spacing issues
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# This regex looks for the exact logic regardless of spaces or tabs
pattern = r'if\s*\(!session\)\s*\{\s*window\.location\.href\s*=\s*["\']login\.html["\'];\s*return;\s*\}'

replacement = """if (!session) {
            if (window.location.hash.includes('access_token')) {
                console.log("OAuth token detected. Waiting for Supabase...");
                return;
            }
            window.location.href = "login.html";
            return;
        }"""

if re.search(pattern, js):
    js = re.sub(pattern, replacement, js)
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Successfully patched app.js with regex!")
else:
    print("⚠️ Could not find the block. It might already be patched.")
