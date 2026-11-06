# Update Terms
with open("terms.html", "r", encoding="utf-8") as f:
    terms = f.read()

terms = terms.replace(
    '<a href="login.html" class="back-btn">← Return to Login</a>',
    '<a href="javascript:history.back()" class="back-btn">← Go Back</a>'
)

with open("terms.html", "w", encoding="utf-8") as f:
    f.write(terms)

# Update Privacy
with open("privacy.html", "r", encoding="utf-8") as f:
    privacy = f.read()

privacy = privacy.replace(
    '<a href="login.html" class="back-btn">← Return to Login</a>',
    '<a href="javascript:history.back()" class="back-btn">← Go Back</a>'
)

with open("privacy.html", "w", encoding="utf-8") as f:
    f.write(privacy)

print("✅ 'Return to Login' replaced with a universal 'Go Back' button.")
