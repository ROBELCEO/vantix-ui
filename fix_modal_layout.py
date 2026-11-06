with open("competitors.html", "r", encoding="utf-8") as f:
    html = f.read()

modal_css = """
    <!-- MODAL HEIGHT AND IMAGE FIX -->
    <style>
        /* 1. Force the modal container to fill the screen */
        #cmp-modal > .cmp-panel {
            height: 90vh !important;
            max-height: 90vh !important;
            width: 95vw !important;
            max-width: 1400px !important;
            display: flex !important;
            flex-direction: column !important;
        }

        /* 2. Ensure the body takes the remaining space and scrolls */
        #cmp-modal-body {
            flex: 1 !important;
            min-height: 0 !important; /* Crucial for flexbox scrolling */
            overflow-y: auto !important;
            padding-right: 12px !important;
        }

        /* 3. Make the images much larger and more visible */
        #cmp-modal-body img {
            width: 64px !important;
            height: 64px !important;
            min-width: 64px !important;
            object-fit: cover !important;
            border-radius: 6px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
            margin-right: 8px !important;
        }

        /* 4. Clean up the rows to fit the bigger images */
        #cmp-modal-body > div {
            padding: 12px 16px !important;
            margin-bottom: 8px !important;
            background: #FFFFFF !important;
            border: 1px solid #E4E4E7 !important;
            border-radius: 4px !important;
            display: flex !important;
            align-items: center !important;
        }

        /* 5. Fix the scrollbar track to be clean light gray */
        #cmp-modal-body::-webkit-scrollbar { width: 8px !important; background: #F8FAFC !important; }
        #cmp-modal-body::-webkit-scrollbar-track { background: #F8FAFC !important; border-left: 1px solid #E4E4E7 !important; }
        #cmp-modal-body::-webkit-scrollbar-thumb { background: #D4D4D8 !important; border-radius: 4px !important; }
    </style>
"""

if "MODAL HEIGHT AND IMAGE FIX" not in html:
    html = html.replace("</head>", modal_css + "\n</head>")

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Modal height stretched to 90vh, images enlarged to 64px.")
