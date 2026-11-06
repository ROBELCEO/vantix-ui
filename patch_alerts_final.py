with open("alerts.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap order: Title first, then Eyebrow
old_header = '''<div class="alrt-eyebrow">MONITORING</div>
                <h1 class="alrt-title">Alerts Feed</h1>
                <p class="alrt-sub">Automated competitor monitoring & AI insights.</p>'''

new_header = '''<h1 class="alrt-title">Alerts Feed</h1>
                <div class="alrt-eyebrow">MONITORING</div>
                <p class="alrt-sub">Automated competitor monitoring & AI insights.</p>'''

html = html.replace(old_header, new_header)

# 2. Inject the layout fix CSS
style_block = """
    <!-- ALERTS PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .alrt-screen .alrt-wrap { padding-top: 0 !important; }
        .alrt-screen .alrt-row-a { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Title & Eyebrow on same line */
        .alrt-screen .alrt-row-a > div:first-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .alrt-screen .alrt-title {
            font-size: 20px !important;
            margin: 0 !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
        }
        .alrt-screen .alrt-eyebrow {
            font-size: 10px !important;
            margin: 0 !important;
            letter-spacing: 1.4px !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            color: #52525B !important;
        }
        .alrt-screen .alrt-sub {
            width: 100%; /* Forces subtitle to next row */
            font-size: 13px !important;
            margin-top: 4px !important;
            line-height: 1.5 !important;
            color: #52525B !important;
        }

        /* 3. Status Chip */
        .alrt-screen .alrt-chip {
            font-size: 10px !important;
            padding: 4px 8px !important;
            height: 26px !important;
            display: inline-flex !important;
            align-items: center !important;
            margin-top: 4px !important;
        }
    </style>
"""

if "ALERTS PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen alrt-screen">', '<div class="screen alrt-screen">' + style_block)

with open("alerts.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Alerts page updated: Title first, 2-row header, tight gap.")
