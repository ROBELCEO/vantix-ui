with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   SETTINGS PAGE — POLARIS PRECISION
   ========================================== */

/* 1. Main Panels */
.set-panel {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    background: #FFFFFF !important;
    padding: 24px !important;
}
.set-panel-title {
    font-size: 16px !important;
    font-weight: 800 !important;
    color: #09090B !important;
    margin-bottom: 16px !important;
}

/* 2. High-Contrast Typography */
.set-title {
    font-size: 20px !important;
    font-weight: 900 !important;
    color: #09090B !important;
    letter-spacing: -0.5px !important;
}
.set-eyebrow {
    font-size: 11px !important;
    font-weight: 800 !important;
    color: #0284C7 !important;
}
.set-sub {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #52525B !important;
}

/* 3. Status Chip */
.set-chip {
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

/* 4. Inner Lists (Floating Rows) */
.set-list {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
}
.set-row {
    background: #FFFFFF !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    padding: 16px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}
.set-label {
    font-size: 13px !important;
    font-weight: 800 !important;
    color: #09090B !important;
}
.set-value {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #52525B !important;
}

/* 5. Badges & Buttons */
.set-badge {
    background-color: #F3F4F6 !important;
    color: #09090B !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    font-weight: 800 !important;
    font-size: 11px !important;
    padding: 4px 10px !important;
    text-transform: uppercase !important;
}
.set-btn-secondary {
    background-color: #F3F4F6 !important;
    color: #09090B !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    padding: 8px 16px !important;
    text-decoration: none !important;
    display: inline-flex !important;
    transition: all 0.2s !important;
}
.set-btn-secondary:hover {
    background-color: #E5E7EB !important;
}

/* 6. Danger Zone */
.set-panel-danger {
    border-color: #FECDD3 !important;
    background: #FFF1F2 !important;
}
.set-btn-danger {
    background-color: #E11D48 !important;
    color: #FFFFFF !important;
    border: none !important;
    border-radius: 4px !important;
    font-weight: 800 !important;
    font-size: 13px !important;
    padding: 12px 24px !important;
    transition: all 0.2s !important;
    cursor: pointer !important;
    width: 100% !important;
}
.set-btn-danger:hover {
    background-color: #BE123C !important;
}
"""
if "SETTINGS PAGE — POLARIS PRECISION" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Settings precision CSS applied.")
else:
    print("ℹ️ Settings precision CSS already applied.")

