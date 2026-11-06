with open("competitors.html", "r", encoding="utf-8") as f:
    html = f.read()

scrollbar_fix = """
    <!-- FORCE CLEAN SCROLLBAR -->
    <style>
        /* Target the exact element that scrolls */
        #cmp-modal-body {
            scrollbar-width: thin !important;
            scrollbar-color: #D4D4D8 transparent !important;
        }
        
        /* Force webkit browsers (Chrome/Edge) to hide the black track */
        #cmp-modal-body::-webkit-scrollbar {
            width: 6px !important;
            background: transparent !important;
        }
        #cmp-modal-body::-webkit-scrollbar-track {
            background: transparent !important;
            border: none !important;
        }
        #cmp-modal-body::-webkit-scrollbar-thumb {
            background: #E4E4E7 !important;
            border-radius: 10px !important;
            border: none !important;
        }
        #cmp-modal-body::-webkit-scrollbar-thumb:hover {
            background: #D4D4D8 !important;
        }
        
        /* Sometimes the parent container gets the scrollbar instead */
        .cmp-panel[style*="max-width: 1100px"] {
            scrollbar-width: thin !important;
            scrollbar-color: #E4E4E7 transparent !important;
        }
        .cmp-panel[style*="max-width: 1100px"]::-webkit-scrollbar {
            width: 6px !important;
            background: transparent !important;
        }
        .cmp-panel[style*="max-width: 1100px"]::-webkit-scrollbar-track {
            background: transparent !important;
        }
    </style>
"""

if "FORCE CLEAN SCROLLBAR" not in html:
    html = html.replace("</body>", scrollbar_fix + "\n</body>")

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Forced clean scrollbar injection.")
