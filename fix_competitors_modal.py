with open("competitors.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Enlarge the modal inline styles
# Catching both the old 650px (if the previous patch missed) and the 900px
html = html.replace('max-width: 650px; max-height: 80vh;', 'max-width: 1100px; max-height: 90vh;')
html = html.replace('max-width: 900px; max-height: 85vh;', 'max-width: 1100px; max-height: 90vh;')

# 2. Inject the clean scrollbar CSS specifically for the modal body
scrollbar_css = """
    <!-- CLEAN MODAL SCROLLBAR (COMPETITORS) -->
    <style>
        #cmp-modal-body {
            scrollbar-width: thin !important;
            scrollbar-color: #E4E4E7 transparent !important;
            overflow-y: auto !important;
        }
        #cmp-modal-body::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        #cmp-modal-body::-webkit-scrollbar-track { background: transparent !important; }
        #cmp-modal-body::-webkit-scrollbar-thumb { background: #E4E4E7 !important; border-radius: 4px !important; }
        #cmp-modal-body::-webkit-scrollbar-thumb:hover { background: #D4D4D8 !important; }
    </style>
"""

if "CLEAN MODAL SCROLLBAR (COMPETITORS)" not in html:
    html = html.replace("</head>", scrollbar_css + "\n</head>")

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Competitors modal enlarged to 1100px and scrollbar cleaned.")
