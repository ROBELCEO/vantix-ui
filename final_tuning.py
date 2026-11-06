with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   FINAL POLARIS TUNING (Muted Badges & Darker BG)
   ========================================== */

/* 1. Darker background so cards pop */
body, .screen {
    background-color: #F1F3F6 !important;
}

/* 2. Muted, colorless grey badges */
.ov-badge, .st-badge, .cmp-badge, .trm-badge, .dsc-badge,
.st-badge-amber, .ov-badge-amber,
.st-badge-red, .ov-badge-red,
.st-badge-green, .ov-badge-green,
.st-badge-cyan, .ov-badge-cyan,
.st-badge-violet, .ov-badge-violet {
    background-color: #F1F5F9 !important; /* Light grey background */
    color: #64748B !important; /* Muted grey text */
    border: 1px solid #E2E8F0 !important; /* Soft border */
    font-weight: 600 !important; /* Less bold than before */
    font-size: 9px !important;
    padding: 3px 10px !important;
    border-radius: 20px !important; /* Pill shape */
    box-shadow: none !important;
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
}
"""
if "FINAL POLARIS TUNING" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Background darkened and badges muted.")
else:
    print("ℹ️ Tuning already applied.")

