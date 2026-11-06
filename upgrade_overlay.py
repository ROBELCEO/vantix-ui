with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   MODAL OVERLAY UPGRADE & GREY BADGES
   ========================================== */

/* 1. Top-tier modern font stack globally */
body, .screen, .st-modal-body, * {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
}

/* 2. Sleek Grey Badges (No colors) */
.ov-badge, .st-badge, .cmp-badge, .trm-badge, .dsc-badge,
.st-badge-amber, .ov-badge-amber,
.st-badge-red, .ov-badge-red,
.st-badge-green, .ov-badge-green,
.st-badge-cyan, .ov-badge-cyan,
.st-badge-violet, .ov-badge-violet {
    background-color: #F3F4F6 !important; 
    color: #4B5563 !important; 
    border: 1px solid #E5E7EB !important;
    font-weight: 800 !important;
    border-radius: 4px !important;
    padding: 4px 10px !important;
    letter-spacing: 0.5px !important;
}

/* 3. Overlay Modal List Enhancements */
#st-modal-body {
    padding: 16px !important;
}

#st-modal-body .st-product-row {
    padding: 16px 20px !important;
    border-radius: 8px !important;
    margin-bottom: 16px !important;
    border: 1px solid #E5E7EB !important;
    background: #FFFFFF !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02) !important;
    display: flex !important;
    align-items: center !important;
    gap: 20px !important;
}

/* Make the image much larger */
#st-modal-body .st-product-img {
    width: 80px !important;
    height: 80px !important;
    border-radius: 8px !important;
    object-fit: cover !important;
    flex-shrink: 0 !important;
}

/* Make the title larger and bolder */
#st-modal-body .st-row-title {
    font-size: 16px !important;
    font-weight: 800 !important;
    color: #09090B !important;
    line-height: 1.3 !important;
}

/* Make the meta text (e.g., 7 sold) larger */
#st-modal-body .st-row-meta {
    font-size: 13px !important;
    color: #6B7280 !important;
    margin-top: 6px !important;
    font-weight: 600 !important;
}

/* Make the price larger */
#st-modal-body .st-row-amount {
    font-size: 18px !important;
    font-weight: 900 !important;
    letter-spacing: -0.5px !important;
}

/* Rank number styling */
#st-modal-body .st-row-rank {
    font-size: 18px !important;
    font-weight: 900 !important;
    color: #D1D5DB !important;
    width: 30px !important;
    text-align: center !important;
}
"""
if "MODAL OVERLAY UPGRADE" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Overlay enlarged, font upgraded, and badges turned grey.")
else:
    print("ℹ️ Overlay upgrade already applied.")

