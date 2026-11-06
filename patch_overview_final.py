with open("overview.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap order: Title first, then Eyebrow
old_header = '''                <div class="ov-eyebrow">OVERVIEW</div>
                <h1 class="ov-title">Command Center</h1>
                <p class="ov-sub">A real-time read on profit, risk, and the next move worth making.</p>'''

new_header = '''                <h1 class="ov-title">Command Center</h1>
                <div class="ov-eyebrow">OVERVIEW</div>
                <p class="ov-sub">A real-time read on profit, risk, and the next move worth making.</p>'''

html = html.replace(old_header, new_header)

# 2. Remove the top-right "View all" button from Top Products
html = html.replace('<a href="#" onclick="showTopProductsModal(); return false;" class="ov-link">View all →</a>', '')

# 3. Inject the full-width bottom button for Top Products
old_top_products = '''                <div id="ov-top-products" class="ov-list">
                    <div class="ov-empty">Loading products…</div>
                </div>'''

new_top_products = '''                <div id="ov-top-products" class="ov-list">
                    <div class="ov-empty">Loading products…</div>
                </div>
                <button class="ov-view-all-btn" onclick="showTopProductsModal()">Show All Products ↓</button>'''

html = html.replace(old_top_products, new_top_products)

# 4. Inject the layout fix CSS
style_block = """
    <!-- OVERVIEW PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .ov-screen .ov-wrap { padding-top: 0 !important; }
        .ov-screen .ov-row-a { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Title & Eyebrow on same line (Blue Eyebrow) */
        .ov-screen .ov-row-a > div:first-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .ov-screen .ov-title {
            font-size: 20px !important;
            margin: 0 !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
        }
        .ov-screen .ov-eyebrow {
            font-size: 10px !important;
            margin: 0 !important;
            letter-spacing: 1.4px !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            color: #0284C7 !important;
        }
        .ov-screen .ov-sub {
            width: 100%; /* Forces subtitle to next row */
            font-size: 13px !important;
            margin-top: 4px !important;
            line-height: 1.5 !important;
            color: #52525B !important;
        }

        /* 3. Status Chips */
        .ov-screen .ov-status-group { gap: 8px !important; }
        .ov-screen .ov-status-chip {
            font-size: 10px !important;
            padding: 4px 8px !important;
            height: 26px !important;
            display: inline-flex !important;
            align-items: center !important;
            margin-top: 4px !important;
        }

        /* 4. Panels & Flex layout to push button to bottom */
        .ov-screen .ov-panel { display: flex; flex-direction: column; padding: 20px !important; }
        .ov-screen .ov-list { flex: 1; }

        /* 5. The new full-width View All button */
        .ov-screen .ov-view-all-btn {
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
        .ov-screen .ov-view-all-btn:hover {
            background: #F4F4F5;
            color: #0369A1;
        }
    </style>
"""

if "OVERVIEW PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen ov-screen">', '<div class="screen ov-screen">' + style_block)

with open("overview.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Overview page updated: Title first, blue eyebrow, tight gap, bottom button.")
