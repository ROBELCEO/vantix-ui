import re

with open("competitors.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap order: Title first, then Eyebrow
old_header = '''                <div class="cmp-eyebrow">SPY NETWORK</div>
                <h1 class="cmp-title">Competitors</h1>
                <p class="cmp-sub">Track rival stores, detect price drops, and find catalog gaps.</p>'''

new_header = '''                <h1 class="cmp-title">Competitors</h1>
                <div class="cmp-eyebrow">SPY NETWORK</div>
                <p class="cmp-sub">Track rival stores, detect price drops, and find catalog gaps.</p>'''

html = html.replace(old_header, new_header)

# 2. Remove old top "View all" buttons
html = re.sub(r'<button class="cmp-link"[^>]*onclick="openCmpModal\(\'competitors\'\)"[^>]*>View all →</button>', '', html)
html = re.sub(r'<button class="cmp-link"[^>]*onclick="openCmpModal\(\'stockouts\'\)"[^>]*>View all →</button>', '', html)
html = re.sub(r'<button class="cmp-link"[^>]*onclick="openCmpModal\(\'launches\'\)"[^>]*>View all →</button>', '', html)
html = re.sub(r'<button class="cmp-link"[^>]*onclick="openCmpModal\(\'bestsellers\'\)"[^>]*>View all →</button>', '', html)
html = re.sub(r'<button class="cmp-link"[^>]*onclick="openCmpModal\(\'gaps\'\)"[^>]*>View all →</button>', '', html)

# 3. Inject full-width buttons at the bottom of each list
# Tracked Competitors
html = html.replace(
    '<div id="competitors-list" class="cmp-list">\n                <div class="cmp-empty">Loading competitors…</div>\n            </div>',
    '<div id="competitors-list" class="cmp-list" style="flex: 1;">\n                <div class="cmp-empty">Loading competitors…</div>\n            </div>\n            <button class="cmp-view-all-btn" onclick="openCmpModal(\'competitors\')">Show All Competitors ↓</button>'
)
# Stock-Outs
html = html.replace(
    '<div id="stockout-list" class="cmp-list">\n                    <div class="cmp-empty">Scanning stock…</div>\n                </div>',
    '<div id="stockout-list" class="cmp-list" style="flex: 1;">\n                    <div class="cmp-empty">Scanning stock…</div>\n                </div>\n                <button class="cmp-view-all-btn" onclick="openCmpModal(\'stockouts\')">Show All Stock-Outs ↓</button>'
)
# New Launches
html = html.replace(
    '<div id="launch-list" class="cmp-list">\n                    <div class="cmp-empty">Scanning launches…</div>\n                </div>',
    '<div id="launch-list" class="cmp-list" style="flex: 1;">\n                    <div class="cmp-empty">Scanning launches…</div>\n                </div>\n                <button class="cmp-view-all-btn" onclick="openCmpModal(\'launches\')">Show All Launches ↓</button>'
)
# Best Sellers
html = html.replace(
    '<div id="bestsellers-list" class="cmp-list">\n                    <div class="cmp-empty">Scanning best sellers…</div>\n                </div>',
    '<div id="bestsellers-list" class="cmp-list" style="flex: 1;">\n                    <div class="cmp-empty">Scanning best sellers…</div>\n                </div>\n                <button class="cmp-view-all-btn" onclick="openCmpModal(\'bestsellers\')">Show All Best Sellers ↓</button>'
)
# Catalog Gaps
html = html.replace(
    '<div id="gap-list" class="cmp-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">\n                <div class="cmp-empty" style="grid-column: span 2;">Scanning catalogs…</div>\n            </div>',
    '<div id="gap-list" class="cmp-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1;">\n                <div class="cmp-empty" style="grid-column: span 2;">Scanning catalogs…</div>\n            </div>\n            <button class="cmp-view-all-btn" onclick="openCmpModal(\'gaps\')">Show All Gaps ↓</button>'
)

# 4. Resize Modal
html = html.replace('max-width: 650px; max-height: 80vh;', 'max-width: 900px; max-height: 85vh;')

# 5. Inject the CSS
style_block = """
    <!-- COMPETITORS PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .cmp-screen .cmp-wrap { padding-top: 0 !important; }
        .cmp-screen .cmp-row-a { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Title & Eyebrow on same line (Blue Eyebrow) */
        .cmp-screen .cmp-row-a > div:first-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .cmp-screen .cmp-title {
            font-size: 20px !important;
            margin: 0 !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
        }
        .cmp-screen .cmp-eyebrow {
            font-size: 10px !important;
            margin: 0 !important;
            letter-spacing: 1.4px !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            color: #0284C7 !important;
        }
        .cmp-screen .cmp-sub {
            width: 100%; /* Forces subtitle to next row */
            font-size: 13px !important;
            margin-top: 4px !important;
            line-height: 1.5 !important;
            color: #52525B !important;
        }

        /* 3. Panels & Flex layout to push button to bottom */
        .cmp-screen .cmp-panel { display: flex; flex-direction: column; padding: 20px !important; }
        
        /* 4. The new full-width View All button */
        .cmp-screen .cmp-view-all-btn {
            width: 100%;
            margin-top: 16px;
            padding: 10px;
            background: #FAFAFA;
            border: 1px dashed #D1D5DB;
            color: #0284C7;
            font-size: 12px;
            font-weight: 800;
            border-radius: 2px;
            cursor: pointer;
            transition: 0.2s;
        }
        .cmp-screen .cmp-view-all-btn:hover { background: #F4F4F5; color: #0369A1; }

        /* 5. Clean Scrollbars */
        .cmp-screen .cmp-list, #cmp-modal-body {
            scrollbar-width: thin !important;
            scrollbar-color: #E4E4E7 transparent !important;
        }
        .cmp-screen .cmp-list::-webkit-scrollbar, #cmp-modal-body::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        .cmp-screen .cmp-list::-webkit-scrollbar-track, #cmp-modal-body::-webkit-scrollbar-track { background: transparent !important; }
        .cmp-screen .cmp-list::-webkit-scrollbar-thumb, #cmp-modal-body::-webkit-scrollbar-thumb { background: #E4E4E7 !important; border-radius: 4px !important; }
        .cmp-screen .cmp-list::-webkit-scrollbar-thumb:hover, #cmp-modal-body::-webkit-scrollbar-thumb:hover { background: #D4D4D8 !important; }
    </style>
"""

if "COMPETITORS PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen cmp-screen">', '<div class="screen cmp-screen">' + style_block)

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Competitors page updated: Title first, blue eyebrow, tight gap, bottom buttons, modal resized.")
