with open("discovery.html", "r", encoding="utf-8") as f:
    html = f.read()

scrollbar_fix = """
    <!-- CLEAN MODAL SCROLLBAR (DISCOVERY) -->
    <style>
        /* Force the modal body to use a clean, thin scrollbar */
        .dsc-modal-body {
            scrollbar-width: thin !important;
            scrollbar-color: #E4E4E7 transparent !important;
            overflow-y: auto !important;
        }
        .dsc-modal-body::-webkit-scrollbar { 
            width: 6px !important; 
            height: 6px !important; 
        }
        .dsc-modal-body::-webkit-scrollbar-track { 
            background: transparent !important; 
        }
        .dsc-modal-body::-webkit-scrollbar-thumb { 
            background: #E4E4E7 !important; 
            border-radius: 4px !important; 
        }
        .dsc-modal-body::-webkit-scrollbar-thumb:hover { 
            background: #D4D4D8 !important; 
        }
    </style>
"""

if "CLEAN MODAL SCROLLBAR (DISCOVERY)" not in html:
    html = html.replace("</head>", scrollbar_fix + "\n</head>")
    
    with open("discovery.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("✅ Discovery modal scrollbar cleaned.")
else:
    print("ℹ️ Scrollbar already fixed.")
