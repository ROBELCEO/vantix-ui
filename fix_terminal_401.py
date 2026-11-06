import re

with open("js/terminal.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Ensure the bulletproof getAuthToken is present
if "window.getAuthToken = function" not in js:
    token_helper = """window.getAuthToken = function() {
    try {
        const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
        if (!key) return null;
        const data = JSON.parse(localStorage.getItem(key));
        return data.access_token;
    } catch(e) {
        console.error("Token error:", e);
        return null;
    }
};

"""
    js = token_helper + js

# 2. Fix the loadTerminal fetch call to include the Authorization header
# We will look for the fetch call inside loadTerminal
old_fetch = "const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');"

new_fetch = """const token = window.getAuthToken();
        if (!token) throw new Error("Not logged in. Please refresh or log in again.");
        
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison', {
            headers: { 'Authorization': 'Bearer ' + token }
        });"""

if old_fetch in js:
    js = js.replace(old_fetch, new_fetch)
    print("✅ Fixed loadTerminal to send Authorization header.")
else:
    print("⚠️ Exact fetch string not found. Trying regex...")
    # Regex to catch the fetch call inside loadTerminal
    js = re.sub(
        r"const\s+res\s*=\s*await\s+fetch\('https://vantix-my5f\.onrender\.com/api/competitors/price-comparison'\);",
        new_fetch,
        js
    )
    print("✅ Fixed loadTerminal via regex.")

with open("js/terminal.js", "w", encoding="utf-8") as f:
    f.write(js)
