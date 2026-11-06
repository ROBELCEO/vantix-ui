with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   VANTIX STANDARD: SHARP EDGES & BOLD CONTRAST
   ========================================== */

/* 1. Sharper Cards (4px curve instead of 12px/20px) */
.ov-panel, .st-panel, .cmp-panel, .trm-panel, .alrt-panel, .inv-panel, 
.ov-kpi, .st-kpi, .inv-kpi, .kpi-refined-card, 
.st-product-row, .ov-list-row {
    border-radius: 4px !important; 
}

/* Sharper inner elements */
.ov-kpi-icon-box, .st-kpi-icon, .st-view-all-btn, .ov-view-all-btn, .ov-badge, .st-badge {
    border-radius: 4px !important;
}

/* 2. Kill all weak grey text — Make everything dark and bold */
.ov-kpi-label, .st-kpi-label, .kpi-refined-title, 
.ov-kpi-meta, .st-kpi-meta, .kpi-refined-time-badge {
    color: #09090B !important; /* Solid black */
    font-weight: 800 !important; /* Extra bold */
    opacity: 1 !important; 
}

/* Increase size of small labels slightly so they aren't tiny */
.ov-kpi-label, .st-kpi-label, .kpi-refined-title {
    font-size: 12px !important;
    letter-spacing: 0px !important; /* Remove the stretched uppercase look */
    text-transform: none !important; /* Use standard casing */
}

/* 3. Solid High-Contrast Badges (No grey, no soft pastels) */
.ov-badge, .st-badge, .cmp-badge, .trm-badge, .dsc-badge,
.st-badge-amber, .ov-badge-amber,
.st-badge-red, .ov-badge-red,
.st-badge-green, .ov-badge-green,
.st-badge-cyan, .ov-badge-cyan,
.st-badge-violet, .ov-badge-violet {
    background-color: #09090B !important; /* Solid Black */
    color: #FFFFFF !important; /* Pure White text */
    border: none !important;
    font-weight: 800 !important;
    padding: 4px 8px !important;
    letter-spacing: 0.5px !important;
    font-size: 10px !important;
}

/* 4. Remove the grey background from the time badges inside KPIs */
.kpi-refined-time-badge {
    background: transparent !important;
    border: 1px solid #E5E7EB !important;
    padding: 2px 6px !important;
    font-size: 10px !important;
}

/* 5. Darken the card borders to make the sharpness stand out */
.ov-panel, .st-panel, .cmp-panel, .trm-panel, .alrt-panel, .inv-panel, 
.ov-kpi, .st-kpi, .inv-kpi {
    border: 1px solid #D1D5DB !important; /* Slightly darker border */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important; /* Tighter shadow */
}
"""
if "VANTIX STANDARD: SHARP EDGES" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Sharp corners and solid bold text applied.")
else:
    print("ℹ️ Standard tuning already applied.")

