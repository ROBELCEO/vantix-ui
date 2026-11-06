with open("discovery.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap the order: Title first, then Eyebrow, and reduce inline font sizes
old_header = '''<div style="font-size: 10px; letter-spacing: 1.6px; font-weight: 800; color: #0284C7; text-transform: uppercase; margin-bottom: 4px;">GOLDMINE ENGINE</div>
                <h1 style="font-size: 24px; font-weight: 900; color: #09090B; margin: 0 0 8px;">Discovery</h1>
                <p style="font-size: 14px; color: #52525B; margin: 0;">Based on your preferences, our bots found these daily opportunities.</p>'''

new_header = '''<h1 style="font-size: 20px; font-weight: 900; color: #09090B; margin: 0;">Discovery</h1>
                <div style="font-size: 10px; letter-spacing: 1.6px; font-weight: 800; color: #0284C7; text-transform: uppercase; margin: 0;">GOLDMINE ENGINE</div>
                <p style="font-size: 13px; color: #52525B; margin: 0;">Based on your preferences, our bots found these daily opportunities.</p>'''

html = html.replace(old_header, new_header)

# 2. Inject the layout fix CSS
style_block = """
    <!-- DISCOVERY PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .dsc-screen { padding-top: 0 !important; }
        .dsc-header-bar { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Force Discovery & GOLDMINE ENGINE on same line, sub on next */
        .dsc-header-bar > div:first-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .dsc-header-bar p {
            width: 100%; /* Forces subtitle to next row */
            margin-top: 4px !important;
            line-height: 1.5 !important;
        }

        /* 3. Adjust the Configure button alignment */
        .dsc-btn-configure { margin-top: 0px; padding: 8px 16px !important; font-size: 12px !important; }
    </style>
"""

if "DISCOVERY PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen dsc-screen">', '<div class="screen dsc-screen">' + style_block)

with open("discovery.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Discovery page updated: Title first, tight gap, 2-row header.")
