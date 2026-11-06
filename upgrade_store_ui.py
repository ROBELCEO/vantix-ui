import re

# 1. Add My Store KPI and List styles to masterpiece.css
with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   MY STORE SPECIFIC MASTERPIECE STYLES
   ========================================== */

/* KPI Cards */
.st-kpi {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
}
.st-kpi-header {
    display: flex;
    align-items: center;
    gap: 10px;
}
.st-kpi-icon {
    width: 28px;
    height: 28px;
    background: #F4F4F5;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
}
.st-kpi-label {
    font-size: 13px !important;
    color: #71717A !important;
    font-weight: 600 !important;
    margin: 0 !important;
}
.st-kpi-value {
    font-size: 28px !important;
    font-weight: 800 !important;
    color: #09090B !important;
    margin: 4px 0 !important;
    letter-spacing: -0.5px !important;
}
.st-kpi-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-top: auto;
}
.st-kpi-meta {
    font-size: 11px !important;
    color: #A1A1AA !important;
    font-weight: 500 !important;
    margin: 0 !important;
}
.st-sparkline {
    width: 60px;
    height: 24px;
    opacity: 0.8;
}

/* Floating List Items */
.st-list {
    background: transparent !important;
    padding: 0 !important;
    border: none !important;
}
.st-product-row {
    background: #FFFFFF !important;
    border-radius: 10px !important;
    border: 1px solid #F1F5F9 !important;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02) !important;
    padding: 12px !important;
    margin-bottom: 8px !important;
    transition: transform 0.2s, box-shadow 0.2s !important;
}
.st-product-row:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}
"""
if "MY STORE SPECIFIC MASTERPIECE STYLES" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Added My Store styles to masterpiece.css")

# 2. Rewrite the KPI HTML in store.html
with open("store.html", "r", encoding="utf-8") as f:
    html = f.read()

new_kpi_grid = '''        <!-- ROW B: 5 KPI CARDS -->
        <div class="st-kpi-grid">
            <div class="st-kpi">
                <div class="st-kpi-header">
                    <div class="st-kpi-icon">💰</div>
                    <div class="st-kpi-label">Revenue (30d)</div>
                </div>
                <div class="st-kpi-value" id="kpi-revenue">—</div>
                <div class="st-kpi-footer">
                    <div class="st-kpi-meta">Gross from orders</div>
                    <svg class="st-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#059669" stroke-width="2" points="0,25 20,15 40,20 60,5 80,10 100,0"/>
                    </svg>
                </div>
            </div>
            <div class="st-kpi">
                <div class="st-kpi-header">
                    <div class="st-kpi-icon">📈</div>
                    <div class="st-kpi-label">Net Profit (30d)</div>
                </div>
                <div class="st-kpi-value st-green" id="kpi-net-profit">—</div>
                <div class="st-kpi-footer">
                    <div class="st-kpi-meta" id="kpi-net-profit-meta">Revenue − COGS</div>
                    <svg class="st-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#E11D48" stroke-width="2" points="0,5 20,10 40,5 60,15 80,20 100,25"/>
                    </svg>
                </div>
            </div>
            <div class="st-kpi">
                <div class="st-kpi-header">
                    <div class="st-kpi-icon">🛍️</div>
                    <div class="st-kpi-label">Orders (30d)</div>
                </div>
                <div class="st-kpi-value" id="kpi-orders">—</div>
                <div class="st-kpi-footer">
                    <div class="st-kpi-meta">Real order count</div>
                    <svg class="st-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#059669" stroke-width="2" points="0,20 20,20 40,10 60,15 80,5 100,5"/>
                    </svg>
                </div>
            </div>
            <div class="st-kpi">
                <div class="st-kpi-header">
                    <div class="st-kpi-icon">🧾</div>
                    <div class="st-kpi-label">Avg Order Value</div>
                </div>
                <div class="st-kpi-value" id="kpi-aov">—</div>
                <div class="st-kpi-footer">
                    <div class="st-kpi-meta">Revenue / orders</div>
                    <svg class="st-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#0284C7" stroke-width="2" points="0,15 20,15 40,20 60,10 80,10 100,5"/>
                    </svg>
                </div>
            </div>
            <div class="st-kpi">
                <div class="st-kpi-header">
                    <div class="st-kpi-icon">🛒</div>
                    <div class="st-kpi-label">Abandoned Carts</div>
                </div>
                <div class="st-kpi-value st-amber" id="kpi-abandoned">—</div>
                <div class="st-kpi-footer">
                    <div class="st-kpi-meta">Recoverable value</div>
                    <svg class="st-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#F59E0B" stroke-width="2" points="0,10 20,20 40,15 60,25 80,20 100,25"/>
                    </svg>
                </div>
            </div>
        </div>'''

# Replace the old KPI grid
pattern = re.compile(r'<!-- ROW B: 5 KPI CARDS -->\s*<div class="st-kpi-grid">.*?</div>\s*</div>\s*<!-- ROW C', re.DOTALL)
html = pattern.sub(new_kpi_grid + '\n\n        <!-- ROW C', html)

with open("store.html", "w", encoding="utf-8") as f:
    f.write(html)
print("✅ My Store KPI HTML updated with icons and sparklines.")
