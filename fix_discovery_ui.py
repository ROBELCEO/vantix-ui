with open("discovery.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Fix the broken emojis (Encoding glitches)
html = html.replace("ðŸ”„", "🔄")
html = html.replace("âš¡ï¸", "⚡")
html = html.replace("âš™ï¸", "⚙️")
html = html.replace("ðŸ•µï¸", "🕵️")
html = html.replace("ðŸ”¥", "🔥")

# 2. Fix the Mobile UI for the header buttons
mobile_css = """
    <!-- Mobile Fix for Discovery Header -->
    <style>
        @media (max-width: 900px) {
            .dsc-header-bar {
                flex-direction: column !important;
                gap: 16px !important;
                align-items: flex-start !important;
            }
            .dsc-header-right {
                width: 100% !important;
                flex-wrap: wrap !important;
                gap: 8px !important;
            }
            .dsc-header-right button {
                flex: 1 !important;
                min-width: 120px !important;
                justify-content: center !important;
            }
        }
    </style>
"""
if "Mobile Fix for Discovery Header" not in html:
    html = html.replace("</head>", mobile_css + "\n</head>")

with open("discovery.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Fixed emoji encoding and mobile header layout.")
