with open("store.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap order: Title first, then Eyebrow
old_header = """                <div class="st-monogram" id="store-monogram">··</div>
                <div>
                    <div class="st-eyebrow">MY STORE</div>
                    <h1 class="st-title" id="store-name">Loading store…</h1>
                    <div class="st-domain" id="store-domain">connecting…</div>
                </div>"""

new_header = """                <div class="st-monogram" id="store-monogram">··</div>
                <div>
                    <h1 class="st-title" id="store-name">Loading store…</h1>
                    <div class="st-eyebrow">MY STORE</div>
                    <div class="st-domain" id="store-domain">connecting…</div>
                </div>"""
html = html.replace(old_header, new_header)

# 2. Remove old top "View all" buttons
html = html.replace('<button class="st-link" style="background:none; border:none; cursor:pointer; padding:0;" onclick="openStoreModal(\'products\')">View all →</button>\n', '')
html = html.replace('<button class="st-link" style="background:none; border:none; cursor:pointer; padding:0; font-size:11px;" onclick="openStoreModal(\'carts\')">View all →</button>\n', '')
html = html.replace('<button class="st-link" style="background:none; border:none; cursor:pointer; padding:0; font-size:11px;" onclick="openStoreModal(\'dead\')">View all →</button>\n', '')
html = html.replace('<button class="st-link" style="background:none; border:none; cursor:pointer; padding:0; font-size:11px;" onclick="openStoreModal(\'low\')">View all →</button>\n', '')

# 3. Inject full-width buttons at the bottom of each list
# Top Products
html = html.replace(
    '<div id="top-products-list" class="st-list">\n                    <div class="st-empty">Loading products…</div>\n                </div>',
    '<div id="top-products-list" class="st-list" style="flex: 1;">\n                    <div class="st-empty">Loading products…</div>\n                </div>\n                <button class="st-view-all-btn" onclick="openStoreModal(\'products\')">Show All Products ↓</button>'
)
# Abandoned Carts
html = html.replace(
    '<div id="carts-list" class="st-list">\n                    <div class="st-empty">Loading abandoned carts…</div>\n                </div>',
    '<div id="carts-list" class="st-list" style="flex: 1;">\n                    <div class="st-empty">Loading abandoned carts…</div>\n                </div>\n                <button class="st-view-all-btn" onclick="openStoreModal(\'carts\')">Show All Carts ↓</button>'
)
# Dead Stock
html = html.replace(
    '<div id="dead-stock-list" class="st-list">\n                    <div class="st-empty">Analyzing inventory…</div>\n                </div>',
    '<div id="dead-stock-list" class="st-list" style="flex: 1;">\n                    <div class="st-empty">Analyzing inventory…</div>\n                </div>\n                <button class="st-view-all-btn" onclick="openStoreModal(\'dead\')">Show All Dead Stock ↓</button>'
)
# Low Stock
html = html.replace(
    '<div id="low-stock-list" class="st-list">\n                    <div class="st-empty">Loading stock…</div>\n                </div>',
    '<div id="low-stock-list" class="st-list" style="flex: 1;">\n                    <div class="st-empty">Loading stock…</div>\n                </div>\n                <button class="st-view-all-btn" onclick="openStoreModal(\'low\')">Show All Low Stock ↓</button>'
)

# 4. Inject the layout fix CSS
style_block = """
    <!-- MY STORE PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .st-screen .st-wrap { padding-top: 0 !important; }
        .st-screen .st-header-row { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Title & Eyebrow on same line (Blue Eyebrow) */
        .st-screen .st-identity > div:last-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .st-screen .st-title {
            font-size: 20px !important;
            margin: 0 !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
        }
        .st-screen .st-eyebrow {
            font-size: 10px !important;
            margin: 0 !important;
            letter-spacing: 1.4px !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            color: #0284C7 !important;
        }
        .st-screen .st-domain {
            width: 100%; /* Forces domain to next row */
            font-size: 13px !important;
            margin-top: 4px !important;
            line-height: 1.5 !important;
            color: #52525B !important;
        }

        /* 3. Status Chips */
        .st-screen .st-status-group { gap: 8px !important; }
        .st-screen .st-chip {
            font-size: 10px !important;
            padding: 4px 8px !important;
            height: 26px !important;
            display: inline-flex !important;
            align-items: center !important;
            margin-top: 4px !important;
        }

        /* 4. Panels & Flex layout to push button to bottom */
        .st-screen .st-panel { display: flex; flex-direction: column; }

        /* 5. The new full-width View All button */
        .st-screen .st-view-all-btn {
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
        .st-screen .st-view-all-btn:hover {
            background: #F4F4F5;
            color: #0369A1;
        }
    </style>
"""

if "MY STORE PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen st-screen">', '<div class="screen st-screen">' + style_block)

with open("store.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ My Store page updated: Title first, blue eyebrow, tight gap, bottom buttons.")
