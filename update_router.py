with open("js/router.js", "r", encoding="utf-8") as f:
    js = f.read()
js = js.replace('connect:     { html: "index.html"', 'connect:     { html: "connect.html"')
with open("js/router.js", "w", encoding="utf-8") as f:
    f.write(js)
print("✅ Updated router.js to use connect.html")
