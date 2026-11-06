import re

# ==========================================
# 1. UPDATE CSS (masterpiece.css)
# ==========================================
with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   CONNECT PAGE — POLARIS PRECISION
   ========================================== */

/* 1. Header & Typography */
.cnx-title {
    font-size: 20px !important;
    font-weight: 900 !important;
    color: #09090B !important;
    letter-spacing: -0.5px !important;
}
.cnx-eyebrow {
    font-size: 11px !important;
    font-weight: 800 !important;
    color: #0284C7 !important;
}
.cnx-sub {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #52525B !important;
}

/* 2. Status Chip */
.cnx-chip {
    background-color: #F3F4F6 !important;
    color: #4B5563 !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    font-weight: 800 !important;
    font-size: 11px !important;
    padding: 6px 12px !important;
    height: 28px !important;
    display: inline-flex !important;
    align-items: center !important;
}

/* 3. Panels */
.cnx-panel {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    background: #FFFFFF !important;
    padding: 24px !important;
}
/* Override the green inline style on the connected banner */
.cnx-panel[style*="background: #F0FDF4"] {
    background: #FFFFFF !important;
    border: 1px solid #D1D5DB !important;
}
.cnx-panel-title {
    font-size: 16px !important;
    font-weight: 800 !important;
    color: #09090B !important;
}
.cnx-panel-sub {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #52525B !important;
}

/* 4. Badges (Force override inline styles) */
.cnx-badge {
    background-color: #F3F4F6 !important;
    color: #4B5563 !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    font-weight: 800 !important;
    font-size: 10px !important;
    padding: 4px 8px !important;
}

/* 5. Form Inputs */
.cnx-label {
    font-size: 12px !important;
    font-weight: 800 !important;
    color: #09090B !important;
    margin-bottom: 6px !important;
}
.cnx-input {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    padding: 12px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #09090B !important;
}
.cnx-input:focus {
    border-color: #0284C7 !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1) !important;
}

/* 6. Buttons */
.cnx-btn-primary {
    border-radius: 4px !important;
    background-color: #09090B !important;
    color: #FFFFFF !important;
    font-weight: 800 !important;
    font-size: 14px !important;
    padding: 12px 16px !important;
    transition: all 0.2s !important;
}
.cnx-btn-primary:hover {
    background-color: #27272A !important;
}

/* 7. Connected Banner Icon */
#store-logo-fallback {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    background: #F8FAFC !important;
    color: #09090B !important;
}
#store-logo {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
}
"""
if "CONNECT PAGE — POLARIS PRECISION" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Connect precision CSS applied.")

# ==========================================
# 2. CLEAN UP HTML (index.html)
# ==========================================
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace the giant emoji with a clean SVG box
old_emoji = '<div style="font-size: 48px; margin-bottom: 16px;">🛍️</div>'
new_svg = '''<div style="width: 56px; height: 56px; background: #F3F4F6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
    <svg viewBox="0 0 24 24" style="width: 28px; height: 28px; stroke: #09090B; stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round;">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
</div>'''

html = html.replace(old_emoji, new_svg)

# Clean up inline styles on badges to let CSS take over completely
html = html.replace('<div class="cnx-badge" style="background: #F4F4F5; color: #52525B; border: 1px solid #E4E4E7;">REQUIRED</div>', '<div class="cnx-badge">REQUIRED</div>')
html = html.replace('<div class="cnx-badge" style="background: #E0F2FE; color: #0284C7; border: 1px solid #BAE6FD;">RECOMMENDED</div>', '<div class="cnx-badge">RECOMMENDED</div>')

# Clean up the green banner text colors to match the high contrast theme
html = html.replace('style="color: #059669 !important;"', 'style="color: #09090B !important;"')
html = html.replace('style="color: #047857 !important;"', 'style="color: #52525B !important;"')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("✅ Connect HTML cleaned up.")
