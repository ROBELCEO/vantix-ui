import os

sidebar_css = """
    <!-- GLOBAL LEFT SIDEBAR NAVIGATION -->
    <style>
        /* 1. Make the header a fixed left sidebar */
        .header {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 240px !important;
            height: 100vh !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            padding: 24px 16px !important;
            border-right: 1px solid #222222 !important;
            border-bottom: none !important;
            z-index: 1000 !important;
            background-color: #000000 !important;
        }

        /* 2. Brand Logo spacing */
        .header .brand {
            margin-bottom: 32px !important;
            width: 100% !important;
            justify-content: flex-start !important;
        }

        /* 3. Stack the navigation tabs vertically */
        .header .tabs {
            flex-direction: column !important;
            width: 100% !important;
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            gap: 8px !important;
            flex: 1 !important; /* Pushes the user profile to the bottom */
            overflow-y: auto !important;
        }
        
        .header .tab {
            width: 100% !important;
            text-align: left !important;
            padding: 12px 16px !important;
            border-radius: 6px !important;
            font-size: 13px !important;
            color: #A1A1AA !important;
            transition: all 0.2s !important;
        }
        
        .header .tab:hover {
            background-color: #111111 !important;
            color: #FFFFFF !important;
        }
        
        .header .tab.active {
            background-color: #00E5FF !important;
            color: #000000 !important;
            font-weight: 800 !important;
        }

        /* 4. User profile & Logout at the bottom */
        .header > div:last-child {
            width: 100% !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 16px !important;
            margin-top: auto !important;
        }
        
        .header > div:last-child button {
            width: 100% !important;
        }

        /* 5. Push the main page content to the right */
        .screen {
            margin-left: 240px !important;
            width: calc(100% - 240px) !important;
            padding-top: 24px !important;
        }

        /* 6. Mobile Fix: Revert to top bar on small screens */
        @media (max-width: 900px) {
            .header {
                width: 100% !important;
                height: 56px !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0 16px !important;
                border-right: none !important;
                border-bottom: 1px solid #222222 !important;
            }
            .header .brand { margin-bottom: 0 !important; width: auto !important; }
            .header .tabs { display: none !important; }
            .header > div:last-child { flex-direction: row !important; width: auto !important; margin-top: 0 !important; gap: 12px !important; }
            .header > div:last-child button { width: auto !important; }
            .screen {
                margin-left: 0 !important;
                width: 100% !important;
                margin-top: 56px !important; 
                height: calc(100vh - 56px) !important;
                padding-top: 16px !important;
            }
        }
    </style>
"""

pages = ["app.html", "index.html", "overview.html", "store.html", "competitors.html", "terminal.html", "discovery.html", "alerts.html", "inventory.html", "membership.html", "settings.html"]

for page in pages:
    if os.path.exists(page):
        with open(page, "r", encoding="utf-8") as f:
            html = f.read()
            
        if "GLOBAL LEFT SIDEBAR NAVIGATION" not in html:
            html = html.replace("</head>", sidebar_css + "\n</head>")
            with open(page, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"✅ Sidebar applied to {page}")

print("✅ All pages updated with left sidebar navigation.")
