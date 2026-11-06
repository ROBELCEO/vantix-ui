import re

with open("competitors.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update the modal inline style to match My Store (900px / 85vh)
# We replace whatever the current max-width and max-height are.
html = re.sub(r'max-width: \d+px; max-height: \d+vh;', 'max-width: 900px; max-height: 85vh;', html)
html = re.sub(r'width: 95vw; max-width: \d+px; height: \d+vh;', 'width: 100%; max-width: 900px; max-height: 85vh;', html)

# 2. Remove the inner box styling from the modal body
modal_fix = """
    <!-- EXACT MATCH TO MY STORE MODAL -->
    <style>
        /* Strip the inner box from cmp-list so it looks like st-list */
        #cmp-modal-body.cmp-list {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            max-height: none !important;
            height: 100% !important;
            padding: 0 8px 0 0 !important;
            margin: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            overflow-y: auto !important;
        }

        /* Clean rows */
        #cmp-modal-body > div {
            width: 100% !important;
            box-sizing: border-box !important;
        }

        /* Clean scrollbar to match My Store */
        #cmp-modal-body {
            scrollbar-width: thin !important;
            scrollbar-color: #E4E4E7 transparent !important;
        }
        #cmp-modal-body::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        #cmp-modal-body::-webkit-scrollbar-track { background: transparent !important; }
        #cmp-modal-body::-webkit-scrollbar-thumb { background: #E4E4E7 !important; border-radius: 4px !important; }
        #cmp-modal-body::-webkit-scrollbar-thumb:hover { background: #D4D4D8 !important; }
    </style>
"""

# Remove previous overrides
html = re.sub(r'\s*<!-- (MODAL HEIGHT AND IMAGE FIX|FIX INNER MODAL AND STRETCH LIST|ULTIMATE SCROLLBAR FIX|FORCE CLEAN SCROLLBAR) -->\s*<style>.*?</style>', '', html, flags=re.DOTALL)

# Inject the new exact match
if "EXACT MATCH TO MY STORE MODAL" not in html:
    html = html.replace("</head>", modal_fix + "\n</head>")

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Competitors modal resized to exactly match My Store (900px / 85vh) and inner box removed.")
