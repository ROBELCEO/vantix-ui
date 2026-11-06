with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   SOLID VIBRANT BADGES (Masterpiece)
   ========================================== */

/* 1. Base Badge Style */
.ov-badge, .st-badge, .cmp-badge, .trm-badge, .dsc-badge {
    border-radius: 6px !important;
    font-weight: 800 !important;
    padding: 4px 10px !important;
    border: none !important; 
    color: #FFFFFF !important; /* Force white text */
    text-transform: uppercase !important;
    letter-spacing: 0.5px !important;
    font-size: 9px !important;
}

/* 2. Default / Live Data (Black) */
.ov-badge, .st-badge, .cmp-badge {
    background-color: #09090B !important;
}

/* 3. Amber / Orange (RECOVER, OPPORTUNITY) */
.st-badge-amber, .ov-badge-amber, .cmp-badge-amber {
    background-color: #F59E0B !important;
    color: #FFFFFF !important;
}

/* 4. Red / Danger (CASH TRAPPED, RESTOCK) */
.st-badge-red, .ov-badge-red, .cmp-badge-red {
    background-color: #E11D48 !important;
    color: #FFFFFF !important;
}

/* 5. Green / Success (LIVE, TRACKED) */
.st-badge-green, .ov-badge-green, .cmp-badge-green {
    background-color: #059669 !important;
    color: #FFFFFF !important;
}

/* 6. Cyan / Blue (TOP 10%, GROQ) */
.st-badge-cyan, .ov-badge-cyan, .cmp-badge-cyan {
    background-color: #0284C7 !important;
    color: #FFFFFF !important;
}

/* 7. Violet / Purple (AI) */
.st-badge-violet, .ov-badge-violet, .cmp-badge-violet {
    background-color: #8B5CF6 !important;
    color: #FFFFFF !important;
}
"""

if "SOLID VIBRANT BADGES" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Solid vibrant badges added to masterpiece.css")
else:
    print("ℹ️ Badges already styled.")

