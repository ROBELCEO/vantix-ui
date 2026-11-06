import re

# ==========================================
# 1. UPDATE CSS (masterpiece.css)
# ==========================================
with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   INVENTORY PAGE — POLARIS PRECISION
   ========================================== */

/* 1. Header & Typography */
.inv-title {
    font-size: 20px !important;
    font-weight: 900 !important;
    color: #09090B !important;
    letter-spacing: -0.5px !important;
}
.inv-eyebrow {
    font-size: 11px !important;
    font-weight: 800 !important;
    color: #0284C7 !important;
}
.inv-sub {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: #52525B !important;
}
.inv-panel-title {
    font-size: 16px !important;
    font-weight: 800 !important;
    color: #09090B !important;
}

/* 2. Status Chip */
.inv-chip {
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

/* 3. Main Panel */
.inv-panel {
    border-radius: 4px !important;
    border: 1px solid #D1D5DB !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
    background-color: #FFFFFF !important;
    padding: 24px !important;
}

/* 4. Inventory List (Floating Rows) */
.inv-list {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    margin-top: 16px !important;
}
.inv-list > div {
    background: #FFFFFF !important;
    border: 1px solid #E5E7EB !important;
    border-radius: 4px !important;
    padding: 16px !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.inv-list > div:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}
"""
if "INVENTORY PAGE — POLARIS PRECISION" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Inventory precision CSS applied.")

# ==========================================
# 2. UPDATE KPI HTML (inventory.html)
# ==========================================
with open("inventory.html", "r", encoding="utf-8") as f:
    html = f.read()

new_kpis = """        <div class="inv-kpi-grid">
            <div class="inv-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
                        <div class="kpi-refined-title">Cash Tied Up</div>
                    </div>
                    <div class="kpi-refined-time-badge">Stock Value</div>
                </div>
                <div class="kpi-refined-value inv-text-green" id="kpi-cash">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend up" id="cash-kpi-meta">↗ Total inventory value</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#059669" stroke-width="2" points="0,25 20,15 40,20 60,5 80,10 100,0"/></svg>
                </div>
            </div>
            <div class="inv-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4z"/></svg></div>
                        <div class="kpi-refined-title">Items to Restock</div>
                    </div>
                    <div class="kpi-refined-time-badge">14 Days</div>
                </div>
                <div class="kpi-refined-value inv-text-amber" id="kpi-restock">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend down">⚠ Running out soon</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#F59E0B" stroke-width="2" points="0,10 20,20 40,15 60,25 80,20 100,25"/></svg>
                </div>
            </div>
            <div class="inv-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
                        <div class="kpi-refined-title">Dead Stock</div>
                    </div>
                    <div class="kpi-refined-time-badge">60 Days</div>
                </div>
                <div class="kpi-refined-value inv-text-red" id="kpi-dead">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend down">↓ No sales velocity</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#E11D48" stroke-width="2" points="0,5 20,10 40,5 60,15 80,20 100,25"/></svg>
                </div>
            </div>
        </div>"""

pattern = re.compile(r'<div class="inv-kpi-grid">.*?</div>\s*</div>\s*<!-- MAIN TABLE', re.DOTALL)
html = pattern.sub(new_kpis + '\n\n        <!-- MAIN TABLE', html)

with open("inventory.html", "w", encoding="utf-8") as f:
    f.write(html)
print("✅ Inventory KPI HTML updated.")
