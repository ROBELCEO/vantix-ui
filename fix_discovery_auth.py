import re

with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Fix loadDiscovery to pass the JWT token
old_fetch = """        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends');
        if (!res.ok) throw new Error("Failed to connect to API");
        const data = await res.json();"""

new_fetch = """        const token = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.includes('auth-token')))).access_token;
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (!res.ok) throw new Error(`Failed to connect to API (Status: ${res.status})`);
        const data = await res.json();"""

if old_fetch in js:
    js = js.replace(old_fetch, new_fetch)
    print("✅ Fixed loadDiscovery to pass Authorization token.")
else:
    print("⚠️ Could not find the exact fetch block. Trying regex...")
    js = re.sub(r'const res = await fetch\(\'https://vantix-my5f\.onrender\.com/api/discovery/trends\'\);.*?const data = await res\.json\(\);', new_fetch, js, flags=re.DOTALL)

# 2. Fix renderDiscoveryCards to safely handle the array
old_render_start = """function renderDiscoveryCards(trends) {"""

new_render_start = """function renderDiscoveryCards(trends) {
    // Ensure trends is actually an array
    if (!Array.isArray(trends)) {
        trends = trends?.trends || trends?.products || [];
    }"""

if "Ensure trends is actually an array" not in js:
    js = js.replace(old_render_start, new_render_start)
    print("✅ Fixed renderDiscoveryCards to safely handle data.")

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(js)
