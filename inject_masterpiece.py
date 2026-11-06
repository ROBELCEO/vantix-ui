import os

pages = ["index.html", "overview.html", "store.html", "competitors.html", "terminal.html", "discovery.html", "alerts.html", "inventory.html", "membership.html", "settings.html"]
link_tag = '<link rel="stylesheet" href="css/masterpiece.css?v=1">'

for page in pages:
    if os.path.exists(page):
        with open(page, "r", encoding="utf-8") as f:
            html = f.read()
        
        if "masterpiece.css" not in html:
            html = html.replace("</head>", link_tag + "\n</head>")
            with open(page, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"✅ Linked masterpiece.css in {page}")
