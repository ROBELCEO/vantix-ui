with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   TERMINAL PAGE — POLARIS PRECISION
   ========================================== */

/* 1. Sharp Cards */
.trm-panel {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    background-color: #FFFFFF !important;
    padding: 24px !important;
}

/* 2. High-Contrast Typography */
.trm-title {
    font-size: 20px !important;
    font-weight: 900 !important;
    color: #09090B !important;
    letter-spacing: -0.5px !important;
}
.trm-eyebrow {
    font-size: 11px !important;
    font-weight: 800 !important;
    color: #0284C7 !important;
}
.trm-sub {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #52525B !important;
}
.trm-panel-title {
    font-size: 15px !important;
    font-weight: 800 !important;
    color: #09090B !important;
}
.trm-panel-sub {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #52525B !important;
    margin-top: 4px !important;
}

/* 3. Clean Grey Badges */
.trm-badge, .trm-badge-cyan, .trm-badge-green, .trm-badge-violet, .trm-badge-amber {
    background-color: #F3F4F6 !important;
    color: #4B5563 !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    font-weight: 800 !important;
    font-size: 10px !important;
    padding: 4px 8px !important;
}

/* 4. Inner Lists (Floating Rows) */
.trm-list {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
}
.trm-list > div {
    background: #FFFFFF !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    padding: 16px !important;
    margin-bottom: 8px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.trm-list > div:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

/* 5. AI Advisor and Simulator Boxes */
#ai-advisor-content {
    background: #F8FAFC !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    padding: 16px !important;
    font-weight: 600 !important;
    color: #09090B !important;
}
.trm-stat-box, #safe-floor-content > div, #simulator-content > div {
    background: #F8FAFC !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    padding: 16px !important;
}

/* 6. Inputs inside Simulator */
#sim-price {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    padding: 12px !important;
    font-size: 14px !important;
    font-weight: 800 !important;
    color: #09090B !important;
    width: 100% !important;
    margin-top: 8px !important;
}
#sim-price:focus {
    border-color: #0284C7 !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1) !important;
}

/* 7. Chart Wrap */
.trm-chart-wrap {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}
"""
if "TERMINAL PAGE — POLARIS PRECISION" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Terminal precision CSS applied.")
else:
    print("ℹ️ Terminal precision CSS already applied.")

