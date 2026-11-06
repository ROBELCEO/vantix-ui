with open("login.html", "r", encoding="utf-8") as f:
    html = f.read()
html = html.replace("https://midra.xyz/index.html", "https://midra.xyz/overview.html")
with open("login.html", "w", encoding="utf-8") as f:
    f.write(html)
print("✅ Updated login redirect to overview.html")
