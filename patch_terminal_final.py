with open("terminal.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Swap order: Title first, then Eyebrow
old_header = '''                <div class="trm-eyebrow">TACTICAL PRICING</div>
                <h1 class="trm-title">Terminal</h1>
                <p class="trm-sub">Analyze margins, simulate price drops, and consult the AI advisor.</p>'''

new_header = '''                <h1 class="trm-title">Terminal</h1>
                <div class="trm-eyebrow">TACTICAL PRICING</div>
                <p class="trm-sub">Analyze margins, simulate price drops, and consult the AI advisor.</p>'''

html = html.replace(old_header, new_header)

# 2. Inject the layout fix CSS
style_block = """
    <!-- TERMINAL PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Remove vertical gap */
        .trm-screen .trm-wrap { padding-top: 0 !important; }
        .trm-screen .trm-row-a { margin-bottom: 16px !important; align-items: flex-start !important; }

        /* 2. Title & Eyebrow on same line (Blue Eyebrow) */
        .trm-screen .trm-row-a > div:first-child {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 8px;
        }
        .trm-screen .trm-title {
            font-size: 20px !important;
            margin: 0 !important;
            line-height: 1.2 !important;
            font-weight: 900 !important;
        }
        .trm-screen .trm-eyebrow {
            font-size: 10px !important;
            margin: 0 !important;
            letter-spacing: 1.4px !important;
            text-transform: uppercase !important;
            font-weight: 800 !important;
            color: #0284C7 !important;
        }
        .trm-screen .trm-sub {
            width: 100%; /* Forces subtitle to next row */
            font-size: 13px !important;
            margin-top: 4px !important;
            line-height: 1.5 !important;
            color: #52525B !important;
        }

        /* 3. Status Chip */
        .trm-screen .trm-status-group { gap: 8px !important; }
        .trm-screen .trm-chip {
            font-size: 10px !important;
            padding: 4px 8px !important;
            height: 26px !important;
            display: inline-flex !important;
            align-items: center !important;
            margin-top: 4px !important;
        }

        /* 4. Clean Scrollbars for the Watchlist */
        .trm-screen .trm-list {
            scrollbar-width: thin !important;
            scrollbar-color: #E4E4E7 transparent !important;
            overflow-y: auto !important;
        }
        .trm-screen .trm-list::-webkit-scrollbar { width: 6px !important; height: 6px !important; }
        .trm-screen .trm-list::-webkit-scrollbar-track { background: transparent !important; }
        .trm-screen .trm-list::-webkit-scrollbar-thumb { background: #E4E4E7 !important; border-radius: 4px !important; }
        .trm-screen .trm-list::-webkit-scrollbar-thumb:hover { background: #D4D4D8 !important; }
    </style>
"""

if "TERMINAL PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace('<div class="screen trm-screen">', '<div class="screen trm-screen">' + style_block)

with open("terminal.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Terminal page updated: Title first, blue eyebrow, tight gap, clean scrollbars.")
