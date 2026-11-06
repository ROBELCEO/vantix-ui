import codecs
import re

path = "membership.html"

# Read with utf-8-sig to strip any hidden BOMs
with codecs.open(path, "r", encoding="utf-8-sig") as f:
    html = f.read()

# Replace whatever is currently in the content property with the actual checkmark character
# This regex looks for: content: 'anything'; and replaces it with content: '✓';
html = re.sub(r"content:\s*'[^']*';", r"content: '✓';", html)

# Save with pure UTF-8
with codecs.open(path, "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Replaced CSS content with the actual UTF-8 checkmark character.")
