with open("membership.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Fix encoding glitches
html = html.replace("â€”", "—")
html = html.replace("âœ“", "✓")
html = html.replace("âœ•", "✕")
html = html.replace("â˜°", "☰")
html = html.replace("â†’", "→")

# 2. Replace the centered inline header with the standard Title-First flex layout
old_header = """        <div style="text-align: center; margin-bottom: 40px;">
            <div class="screen-title" style="font-size: 32px; font-weight: 900; margin-bottom: 12px;">Upgrade Your Intelligence</div>
            <div class="screen-sub" style="font-size: 15px; color: #52525B;">Choose the plan that fits your store's growth stage.</div>
        </div>"""

new_header = """        <div class="mem-header" style="display: flex; flex-wrap: wrap; align-items: baseline; gap: 8px; text-align: left; margin-bottom: 16px;">
            <h1 class="screen-title" style="font-size: 20px !important; font-weight: 900; margin: 0 !important; line-height: 1.2 !important;">Upgrade Your Intelligence</h1>
            <div style="font-size: 10px; color: #0284C7; text-transform: uppercase; letter-spacing: 1.4px; font-weight: 800; margin: 0;">MEMBERSHIP</div>
            <p class="screen-sub" style="width: 100%; font-size: 13px !important; color: #52525B; margin-top: 4px !important; line-height: 1.5 !important;">Choose the plan that fits your store's growth stage.</p>
        </div>"""

html = html.replace(old_header, new_header)

# 3. Remove the huge top padding on the wrapper
html = html.replace('style="max-width: 1100px; margin: 0 auto; padding: 32px 20px 64px;"', 'style="max-width: 1100px; margin: 0 auto; padding: 0 20px 64px;"')

# 4. Inject the layout fix CSS
style_block = """
    <!-- MEMBERSHIP PAGE — COMPACT LAYOUT FIX -->
    <style>
        /* 1. Tighten the pricing grid spacing */
        .pricing-grid {
            margin-top: 16px !important;
            gap: 20px !important;
        }
        .plan-card {
            padding: 24px !important;
        }
        .plan-price {
            font-size: 32px !important;
            margin-bottom: 16px !important;
        }
        .plan-price span {
            font-size: 13px !important;
        }
        .plan-features {
            gap: 12px !important;
            margin-bottom: 24px !important;
        }
    </style>
"""

if "MEMBERSHIP PAGE — COMPACT LAYOUT FIX" not in html:
    html = html.replace("</head>", style_block + "\n</head>")

with open("membership.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Membership page updated: Title first, blue eyebrow, tight gap, encoding fixed.")
