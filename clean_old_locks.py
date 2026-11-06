with open("js/terminal.js", "r", encoding="utf-8") as f:
    js = f.read()
# The global paywall will handle the AI lock, but let's keep the frontend AI lock logic to be safe.

with open("js/store.js", "r", encoding="utf-8") as f:
    js = f.read()
# Remove the paywall logic we appended earlier to avoid double locks
import re
js = re.sub(r'// ==========================================\n// MY STORE PAYWALL ENFORCEMENT\n// ==========================================\n.*?\}\);', '', js, flags=re.DOTALL)
with open("js/store.js", "w", encoding="utf-8") as f:
    f.write(js)
print("✅ Cleaned up old store.js paywall logic.")
