import os

# The CSS to remove the horizontal gaps
gap_fix_css = """
    <!-- FULL WIDTH CONTENT FIX -->
    <style>
        /* 1. Reduce padding on the screen container */
        .screen {
            padding-left: 16px !important;
            padding-right: 16px !important;
        }

        /* 2. Remove max-width limits on all page wrappers so they stretch */
        .ov-wrap, .st-wrap, .cmp-wrap, .trm-wrap, .dsc-wrap, .alrt-wrap, .inv-wrap, .mem-wrap, .set-wrap, .cnx-wrap {
            max-width: 100% !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }

        /* 3. Mobile adjustments */
        @media (max-width: 900px) {
            .screen { padding-left: 12px !important; padding-right: 12px !important; }
        }
    </style>
"""

pages = ["index.html", "overview.html", "store.html", "competitors.html", "terminal.html", "discovery.html", "alerts.html", "inventory.html", "membership.html", "settings.html"]

for page in pages:
    if os.path.exists(page):
        with open(page, "r", encoding="utf-8") as f:
            html = f.read()
            
        if "FULL WIDTH CONTENT FIX" not in html:
            html = html.replace("</head>", gap_fix_css + "\n</head>")
            with open(page, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"✅ Gap fixed on {page}")

print("✅ All pages updated to stretch full width.")
