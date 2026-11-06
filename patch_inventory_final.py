with open("inventory.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap order: Title first, then Eyebrow
old_header = '''                <div class="inv-eyebrow">SUPPLY CHAIN</div>
                <h1 class="inv-title">Smart Warehouse</h1>
                <p class="inv-sub">Track inventory velocity, restock alerts, and cash tied up in stock.</p>'''

new_header = '''                <h1 class="inv-title">Smart Warehouse</h1>
                <div class="inv-eyebrow">SUPPLY CHAIN</div>
                <p class="inv-sub">Track inventory velocity, restock alerts, and cash tied up in stock.</p>'''

html = html.replace(old_header, new_header)

# 2. Inject the layout fix CSS
style_block = """
    <!-- INVENTORY PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .inv-screen .inv-wrap { padding-top: 0 !important; }
        .inv-screen .inv-row-a { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Title & Eyebrow on same line */
        .inv-screen .inv-row-a > div:first-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .inv-screen .inv-title {
            font-size: 20px !important;
            margin: 0 !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
        }
        .inv-screen .inv-eyebrow {
            font-size: 10px !important;
            margin: 0 !important;
            letter-spacing: 1.4px !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            color: #52525B !important;
        }
        .inv-screen .inv-sub {
            width: 100%; /* Forces subtitle to next row */
            font-size: 13px !important;
            margin-top: 4px !important;
            line-height: 1.5 !important;
            color: #52525B !important;
        }

        /* 3. Status Chip */
        .inv-screen .inv-chip {
            font-size: 10px !important;
            padding: 4px 8px !important;
            height: 26px !important;
            display: inline-flex !important;
            align-items: center !important;
            margin-top: 4px !important;
        }
    </style>
"""

if "INVENTORY PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen inv-screen">', '<div class="screen inv-screen">' + style_block)

with open("inventory.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Inventory page updated: Title first, 2-row header, tight gap.")
