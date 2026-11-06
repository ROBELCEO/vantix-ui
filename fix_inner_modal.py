with open("competitors.html", "r", encoding="utf-8") as f:
    html = f.read()

modal_fix = """
    <!-- FIX INNER MODAL AND STRETCH LIST -->
    <style>
        /* 1. Kill the inner box styling on the modal body */
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
            gap: 12px !important;
            overflow-y: auto !important;
        }

        /* 2. Ensure the rows stretch full width and look like cards */
        #cmp-modal-body > div {
            width: 100% !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            background: #FFFFFF !important;
            border: 1px solid #E4E4E7 !important;
            border-radius: 4px !important;
            padding: 16px !important;
            margin: 0 !important;
        }

        /* 3. Make sure images look great */
        #cmp-modal-body img {
            width: 64px !important;
            height: 64px !important;
            min-width: 64px !important;
            object-fit: cover !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
            margin-right: 12px !important;
        }

        /* 4. Modal parent layout constraints */
        #cmp-modal > .cmp-panel {
            height: 90vh !important;
            max-height: 90vh !important;
            display: flex !important;
            flex-direction: column !important;
        }
    </style>
"""

# Remove the previous "MODAL HEIGHT AND IMAGE FIX" block to prevent conflicts
import re
html = re.sub(r'\s*<!-- MODAL HEIGHT AND IMAGE FIX -->\s*<style>.*?</style>', '', html, flags=re.DOTALL)

# Inject the new fixed CSS right before </head>
if "FIX INNER MODAL AND STRETCH LIST" not in html:
    html = html.replace("</head>", modal_fix + "\n</head>")

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Removed inner modal box and stretched the list to fill 90vh.")
