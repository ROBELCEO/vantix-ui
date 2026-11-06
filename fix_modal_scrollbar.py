with open("store.html", "r", encoding="utf-8") as f:
    html = f.read()

scrollbar_css = """
    <!-- CLEAN MODAL SCROLLBAR -->
    <style>
        /* Clean, thin scrollbar for the modal */
        #st-modal-body {
            scrollbar-width: thin !important;
            scrollbar-color: #E4E4E7 transparent !important;
            overflow-y: auto !important;
        }
        #st-modal-body::-webkit-scrollbar {
            width: 6px !important;
            height: 6px !important;
        }
        #st-modal-body::-webkit-scrollbar-track {
            background: transparent !important;
        }
        #st-modal-body::-webkit-scrollbar-thumb {
            background: #E4E4E7 !important;
            border-radius: 4px !important;
        }
        #st-modal-body::-webkit-scrollbar-thumb:hover {
            background: #D4D4D8 !important;
        }
    </style>
"""

if "CLEAN MODAL SCROLLBAR" not in html:
    html = html.replace("</head>", scrollbar_css + "\n</head>")
    with open("store.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("✅ Modal scrollbar made clean and white.")
else:
    print("ℹ️ Modal scrollbar already fixed.")
