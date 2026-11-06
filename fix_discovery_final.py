with open("discovery.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Kill the inline padding forcing the gap
html = html.replace(".dsc-screen { padding-top: 12px !important; }", ".dsc-screen { padding-top: 0 !important; margin-top: 0 !important; }")
html = html.replace(".dsc-wrap { max-width: 1400px; margin: 0 auto; padding: 0 20px 64px !important; }", ".dsc-wrap { max-width: 1400px; margin: 0 auto; padding: 4px 20px 64px !important; }")

# 2. Inject the strict button sizing and gap fix
style_block = """
    <!-- DISCOVERY PAGE — FINAL LAYOUT & BUTTON FIX -->
    <style>
        /* Align all header items perfectly in the center */
        .dsc-header-bar {
            align-items: center !important;
            margin-top: 0 !important;
            margin-bottom: 16px !important;
        }

        /* Force ALL 3 buttons to be exactly the same height and size */
        .dsc-header-bar button {
            height: 34px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 16px !important;
            font-size: 12px !important;
            line-height: 1 !important;
            box-sizing: border-box !important;
        }
    </style>
"""

if "DISCOVERY PAGE — FINAL LAYOUT & BUTTON FIX" not in html:
    html = html.replace('<div class="screen dsc-screen">', '<div class="screen dsc-screen">' + style_block)

with open("discovery.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Discovery tabs resized and gap completely removed.")
