import re

with open("overview.html", "r", encoding="utf-8") as f:
    html = f.read()

new_kpi_grid = '''        <div class="ov-kpi-grid">
            <div class="ov-kpi">
                <div class="ov-kpi-header">
                    <div class="ov-kpi-icon">💰</div>
                    <div class="ov-kpi-label">Gross Revenue</div>
                </div>
                <div class="ov-kpi-value" id="ov-revenue">—</div>
                <div class="ov-kpi-footer">
                    <div class="ov-kpi-meta">Last 30 days</div>
                    <svg class="ov-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#059669" stroke-width="2" points="0,25 20,15 40,20 60,5 80,10 100,0"/>
                    </svg>
                </div>
            </div>
            <div class="ov-kpi">
                <div class="ov-kpi-header">
                    <div class="ov-kpi-icon">📈</div>
                    <div class="ov-kpi-label">True Net Profit</div>
                </div>
                <div class="ov-kpi-value ov-text-green" id="ov-net-profit">—</div>
                <div class="ov-kpi-footer">
                    <div class="ov-kpi-meta" id="ov-net-profit-meta">Revenue minus costs</div>
                    <svg class="ov-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#E11D48" stroke-width="2" points="0,5 20,10 40,5 60,15 80,20 100,25"/>
                    </svg>
                </div>
                <a href="index.html?setup=fees" id="ov-net-profit-setup" style="display: none; margin-top: 8px; padding: 4px 8px; font-size: 10px; background: #E11D48; color: #FFF; text-align: center; border-radius: 6px !important; text-decoration: none; font-weight: 800;">Setup Fees →</a>
            </div>
            <div class="ov-kpi">
                <div class="ov-kpi-header">
                    <div class="ov-kpi-icon">🛍️</div>
                    <div class="ov-kpi-label">Total Orders</div>
                </div>
                <div class="ov-kpi-value" id="ov-orders">—</div>
                <div class="ov-kpi-footer">
                    <div class="ov-kpi-meta">Last 30 days</div>
                    <svg class="ov-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#059669" stroke-width="2" points="0,20 20,20 40,10 60,15 80,5 100,5"/>
                    </svg>
                </div>
            </div>
            <div class="ov-kpi">
                <div class="ov-kpi-header">
                    <div class="ov-kpi-icon">🏷️</div>
                    <div class="ov-kpi-label">Price Index</div>
                </div>
                <div class="ov-kpi-value" id="ov-price-index">—</div>
                <div class="ov-kpi-footer">
                    <div class="ov-kpi-meta" id="ov-price-index-meta">vs competitors</div>
                    <svg class="ov-sparkline" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <polyline fill="none" stroke="#0284C7" stroke-width="2" points="0,15 20,15 40,20 60,10 80,10 100,5"/>
                    </svg>
                </div>
            </div>
            <div class="ov-kpi">
                <div class="ov-kpi-header">
                    <div class="ov-kpi-icon">⚠️</div>
                    <div class="ov-kpi-label">Low Stock SKUs</div>
                </div>
                <div class="ov-kpi-value ov-text-red" id="ov-leaks">—</div>
                <div class="ov-kpi-footer">
                    <div class="ov-kpi-meta">Out of stock</div>
                    <div class="ov-trend-down">↑ 12%</div>
                </div>
            </div>
        </div>'''

# Replace the old grid
pattern = re.compile(r'<div class="ov-kpi-grid">.*?</div>\s*</div>\s*<div class="ov-grid-3">', re.DOTALL)
html = pattern.sub(new_kpi_grid + '\n\n        <div class="ov-grid-3">', html)

with open("overview.html", "w", encoding="utf-8") as f:
    f.write(html)
print("✅ Overview KPI HTML updated with icons and sparklines.")
