with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Add the getAuthToken helper right at the top of the file
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

# Only add if it doesn't exist
if "window.getAuthToken = function" not in js:
    js = token_helper + js
    print("✅ Injected window.getAuthToken into discovery.js")
else:
    print("ℹ️ getAuthToken already exists.")

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(js)
