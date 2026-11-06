with open("settings.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap order: Title first, then Eyebrow
old_header = '''                <div class="set-eyebrow">ACCOUNT</div>
                <h1 class="set-title">Settings</h1>
                <p class="set-sub">Manage your profile, integrations, and account preferences.</p>'''

new_header = '''                <h1 class="set-title">Settings</h1>
                <div class="set-eyebrow">ACCOUNT</div>
                <p class="set-sub">Manage your profile, integrations, and account preferences.</p>'''

html = html.replace(old_header, new_header)

# 2. Inject the layout fix CSS
style_block = """
    <!-- SETTINGS PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .set-screen .set-wrap { padding-top: 0 !important; }
        .set-screen .set-row-a { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Title & Eyebrow on same line (Blue Eyebrow) */
        .set-screen .set-row-a > div:first-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .set-screen .set-title {
            font-size: 20px !important;
            margin: 0 !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
        }
        .set-screen .set-eyebrow {
            font-size: 10px !important;
            margin: 0 !important;
            letter-spacing: 1.4px !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            color: #0284C7 !important;
        }
        .set-screen .set-sub {
            width: 100%; /* Forces subtitle to next row */
            font-size: 13px !important;
            margin-top: 4px !important;
            line-height: 1.5 !important;
            color: #52525B !important;
        }

        /* 3. Status Chip */
        .set-screen .set-status-group { gap: 8px !important; }
        .set-screen .set-chip {
            font-size: 10px !important;
            padding: 4px 8px !important;
            height: 26px !important;
            display: inline-flex !important;
            align-items: center !important;
            margin-top: 4px !important;
        }
    </style>
"""

if "SETTINGS PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen set-screen">', '<div class="screen set-screen">' + style_block)

with open("settings.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Settings page updated: Title first, blue eyebrow, tight gap.")
