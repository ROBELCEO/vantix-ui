with open("membership.html", "r", encoding="utf-8") as f:
    html = f.read()

# Fix encoding glitches
html = html.replace("â€”", "—")
html = html.replace("âœ“", "✓")
html = html.replace("âœ•", "✕")
html = html.replace("â˜°", "☰")
html = html.replace("â†’", "→")

style_block = """
    <!-- MEMBERSHIP SPACING & FONT FIX -->
    <style>
        /* 1. Reduce vertical gap from header */
        .screen > div:first-child { padding-top: 12px !important; padding-bottom: 24px !important; }

        /* 2. Reduce title and subtitle font size */
        .screen-title { font-size: 24px !important; margin-bottom: 8px !important; }
        .screen-sub { font-size: 14px !important; }

        /* 3. Reduce gap between elements and sections */
        .pricing-grid { margin-top: 16px !important; gap: 20px !important; }
        .plan-card { padding: 24px !important; }
        .plan-price { font-size: 32px !important; margin-bottom: 16px !important; }
        .plan-features { gap: 12px !important; margin-bottom: 24px !important; }
        .current-plan-banner { margin-bottom: 20px !important; padding: 12px !important; }
    </style>
"""

if "MEMBERSHIP SPACING & FONT FIX" not in html:
    html = html.replace("</head>", style_block + "\n</head>")

with open("membership.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Membership fonts reduced and gaps tightened.")
