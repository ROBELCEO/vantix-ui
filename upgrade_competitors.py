with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   COMPETITORS PAGE — POLARIS PRECISION
   ========================================== */

/* 1. Sharp Cards */
.cmp-panel {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    background-color: #FFFFFF !important;
    padding: 24px !important;
}

/* 2. High-Contrast Typography */
.cmp-title {
    font-size: 20px !important;
    font-weight: 900 !important;
    color: #09090B !important;
    letter-spacing: -0.5px !important;
}
.cmp-eyebrow {
    font-size: 11px !important;
    font-weight: 800 !important;
    color: #0284C7 !important;
}
.cmp-sub {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #52525B !important;
}
.cmp-panel-title {
    font-size: 15px !important;
    font-weight: 800 !important;
    color: #09090B !important;
}
.cmp-panel-sub {
    font-size: 12px !important;
    font-weight: 600 !important;
    color: #52525B !important;
    margin-top: 4px !important;
}

/* 3. Clean Grey Badges */
.cmp-badge, .cmp-badge-cyan, .cmp-badge-amber, .cmp-badge-green, .cmp-badge-violet {
    background-color: #F3F4F6 !important;
    color: #4B5563 !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    font-weight: 800 !important;
    font-size: 10px !important;
    padding: 4px 8px !important;
}

/* 4. Form Inputs & Buttons */
.cmp-input {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    padding: 12px !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.02) !important;
}
.cmp-input:focus {
    border-color: #0284C7 !important;
    outline: none !important;
    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1) !important;
}
.cmp-btn-primary {
    border-radius: 4px !important;
    background-color: #09090B !important;
    color: #FFFFFF !important;
    font-weight: 800 !important;
    font-size: 13px !important;
    padding: 12px 16px !important;
    transition: all 0.2s !important;
}
.cmp-btn-primary:hover {
    background-color: #27272A !important;
}
.cmp-btn-secondary {
    border-radius: 4px !important;
    background-color: #F3F4F6 !important;
    color: #09090B !important;
    border: 1px solid #E5E7EB !important;
    font-weight: 800 !important;
    font-size: 13px !important;
    padding: 12px 16px !important;
}
.cmp-btn-secondary:hover {
    background-color: #E5E7EB !important;
}

/* 5. Inner Lists (Floating Rows) */
.cmp-list {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
}
.cmp-list > div {
    background: #FFFFFF !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    padding: 16px !important;
    margin-bottom: 8px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.cmp-list > div:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

/* 6. Clean view all button */
.cmp-view-all-btn {
    background-color: #F8FAFC !important;
    border: 1px solid #F1F5F9 !important;
    border-radius: 4px !important;
    color: #0284C7 !important;
    font-weight: 800 !important;
    padding: 12px !important;
    transition: all 0.2s !important;
}
.cmp-view-all-btn:hover {
    background-color: #F1F5F9 !important;
    color: #09090B !important;
}

/* 7. Modal Overrides */
#cmp-modal-body {
    background: transparent !important;
    border: none !important;
    padding: 0 8px 0 0 !important;
}
#cmp-modal-body > div {
    background: #FFFFFF !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    padding: 16px !important;
    margin-bottom: 8px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
}
"""
if "COMPETITORS PAGE — POLARIS PRECISION" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Competitors page precision CSS applied.")
else:
    print("ℹ️ Competitors precision CSS already applied.")

