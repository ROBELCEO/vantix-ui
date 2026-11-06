import re

# ==========================================
# 1. UPDATE CSS (masterpiece.css)
# ==========================================
with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   POLARIS EXACT DESIGN REPLICATION
   ========================================== */

/* 1. Sharper Cards (12px radius, crisp borders) */
.ov-panel, .st-panel, .cmp-panel, .trm-panel, .alrt-panel, .inv-panel, .ov-kpi, .st-kpi, .inv-kpi {
    border-radius: 12px !important;
    border: 1px solid #E5E7EB !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    background-color: #FFFFFF !important;
}

/* 2. Exact KPI Layout */
.kpi-refined-card {
    display: flex !important;
    flex-direction: column !important;
    gap: 12px !important;
    padding: 20px !important;
}
.kpi-refined-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}
.kpi-refined-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
}
.kpi-refined-icon-box {
    width: 28px;
    height: 28px;
    background: #F4F4F5;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.kpi-refined-icon-box svg {
    width: 14px;
    height: 14px;
    stroke: #71717A;
    stroke-width: 2.5;
    fill: none;
}
.kpi-refined-title {
    font-size: 12px;
    font-weight: 700;
    color: #52525B;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.kpi-refined-time-badge {
    font-size: 10px;
    font-weight: 600;
    color: #A1A1AA;
    background: #F8FAFC;
    padding: 2px 6px;
    border-radius: 4px;
}
.kpi-refined-value {
    font-size: 28px !important;
    font-weight: 900 !important;
    color: #09090B !important;
    letter-spacing: -0.5px !important;
    margin-top: 4px;
}
.kpi-refined-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 8px;
}
.kpi-refined-trend {
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
}
.kpi-refined-trend.up { color: #059669; }
.kpi-refined-trend.down { color: #E11D48; }
.kpi-refined-sparkline {
    width: 60px;
    height: 24px;
}

/* 3. Sidebar SVG Icons */
.header .tab {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
}
.nav-svg-icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
}
"""
if "POLARIS EXACT DESIGN REPLICATION" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)

# ==========================================
# 2. UPDATE OVERVIEW KPI HTML
# ==========================================
with open("overview.html", "r", encoding="utf-8") as f:
    ov_html = f.read()

new_ov_kpis = """        <div class="ov-kpi-grid">
            <div class="ov-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                        <div class="kpi-refined-title">Gross Revenue</div>
                    </div>
                    <div class="kpi-refined-time-badge">30 Days</div>
                </div>
                <div class="kpi-refined-value" id="ov-revenue">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend up">↗ 10% vs last month</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#059669" stroke-width="2" points="0,25 20,15 40,20 60,5 80,10 100,0"/></svg>
                </div>
            </div>
            <div class="ov-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                        <div class="kpi-refined-title">True Net Profit</div>
                    </div>
                    <div class="kpi-refined-time-badge">30 Days</div>
                </div>
                <div class="kpi-refined-value ov-text-green" id="ov-net-profit">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend down" id="ov-net-profit-meta">↘ Revenue - COGS</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#E11D48" stroke-width="2" points="0,5 20,10 40,5 60,15 80,20 100,25"/></svg>
                </div>
            </div>
            <div class="ov-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
                        <div class="kpi-refined-title">Total Orders</div>
                    </div>
                    <div class="kpi-refined-time-badge">30 Days</div>
                </div>
                <div class="kpi-refined-value" id="ov-orders">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend up">↗ 5% vs last month</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#059669" stroke-width="2" points="0,20 20,20 40,10 60,15 80,5 100,5"/></svg>
                </div>
            </div>
            <div class="ov-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg></div>
                        <div class="kpi-refined-title">Price Index</div>
                    </div>
                    <div class="kpi-refined-time-badge">vs Comp</div>
                </div>
                <div class="kpi-refined-value" id="ov-price-index">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend up" id="ov-price-index-meta">Healthy</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#0284C7" stroke-width="2" points="0,15 20,15 40,20 60,10 80,10 100,5"/></svg>
                </div>
            </div>
            <div class="ov-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                        <div class="kpi-refined-title">Low Stock SKUs</div>
                    </div>
                    <div class="kpi-refined-time-badge">Alert</div>
                </div>
                <div class="kpi-refined-value ov-text-red" id="ov-leaks">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend down">Needs restock</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#E11D48" stroke-width="2" points="0,25 20,20 40,15 60,20 80,10 100,5"/></svg>
                </div>
            </div>
        </div>"""

pattern_ov = re.compile(r'<div class="ov-kpi-grid">.*?</div>\s*</div>\s*<div class="ov-grid-3">', re.DOTALL)
ov_html = pattern_ov.sub(new_ov_kpis + '\n\n        <div class="ov-grid-3">', ov_html)
with open("overview.html", "w", encoding="utf-8") as f:
    f.write(ov_html)

# ==========================================
# 3. UPDATE STORE KPI HTML
# ==========================================
with open("store.html", "r", encoding="utf-8") as f:
    st_html = f.read()

new_st_kpis = """        <div class="st-kpi-grid">
            <div class="st-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                        <div class="kpi-refined-title">Revenue</div>
                    </div>
                    <div class="kpi-refined-time-badge">30 Days</div>
                </div>
                <div class="kpi-refined-value" id="kpi-revenue">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend up">↗ Gross</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#059669" stroke-width="2" points="0,25 20,15 40,20 60,5 80,10 100,0"/></svg>
                </div>
            </div>
            <div class="st-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                        <div class="kpi-refined-title">Net Profit</div>
                    </div>
                    <div class="kpi-refined-time-badge">30 Days</div>
                </div>
                <div class="kpi-refined-value st-green" id="kpi-net-profit">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend down" id="kpi-net-profit-meta">↘ Rev - COGS</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#E11D48" stroke-width="2" points="0,5 20,10 40,5 60,15 80,20 100,25"/></svg>
                </div>
            </div>
            <div class="st-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
                        <div class="kpi-refined-title">Orders</div>
                    </div>
                    <div class="kpi-refined-time-badge">30 Days</div>
                </div>
                <div class="kpi-refined-value" id="kpi-orders">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend up">↗ Real count</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#059669" stroke-width="2" points="0,20 20,20 40,10 60,15 80,5 100,5"/></svg>
                </div>
            </div>
            <div class="st-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                        <div class="kpi-refined-title">Avg Order</div>
                    </div>
                    <div class="kpi-refined-time-badge">AOV</div>
                </div>
                <div class="kpi-refined-value" id="kpi-aov">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend up">↗ Per order</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#0284C7" stroke-width="2" points="0,15 20,15 40,20 60,10 80,10 100,5"/></svg>
                </div>
            </div>
            <div class="st-kpi kpi-refined-card">
                <div class="kpi-refined-header">
                    <div class="kpi-refined-title-group">
                        <div class="kpi-refined-icon-box"><svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
                        <div class="kpi-refined-title">Abandoned</div>
                    </div>
                    <div class="kpi-refined-time-badge">Carts</div>
                </div>
                <div class="kpi-refined-value st-amber" id="kpi-abandoned">—</div>
                <div class="kpi-refined-footer">
                    <div class="kpi-refined-trend down">↓ Recoverable</div>
                    <svg class="kpi-refined-sparkline" viewBox="0 0 100 30"><polyline fill="none" stroke="#F59E0B" stroke-width="2" points="0,10 20,20 40,15 60,25 80,20 100,25"/></svg>
                </div>
            </div>
        </div>"""

pattern_st = re.compile(r'<div class="st-kpi-grid">.*?</div>\s*</div>\s*<!-- ROW C', re.DOTALL)
st_html = pattern_st.sub(new_st_kpis + '\n\n        <!-- ROW C', st_html)
with open("store.html", "w", encoding="utf-8") as f:
    f.write(st_html)

print("✅ KPI Cards completely overhauled to match Polaris structure.")

# ==========================================
# 4. UPDATE SIDEBAR ICONS
# ==========================================
import glob
for page in glob.glob("*.html"):
    if page in ["terms.html", "privacy.html", "login.html"]: continue
    with open(page, "r", encoding="utf-8") as f:
        html = f.read()
    
    # We only replace once to avoid duplication
    if '<svg class="nav-svg-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' not in html:
        # Connect
        html = html.replace('<a href="index.html" class="tab">Connect</a>', '<a href="index.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Connect</a>')
        # Overview
        html = html.replace('<a href="overview.html" class="tab">Overview</a>', '<a href="overview.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Overview</a>')
        # My Store
        html = html.replace('<a href="store.html" class="tab">My Store</a>', '<a href="store.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg> My Store</a>')
        # Competitors
        html = html.replace('<a href="competitors.html" class="tab">Competitors</a>', '<a href="competitors.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Competitors</a>')
        # Terminal
        html = html.replace('<a href="terminal.html" class="tab">Terminal</a>', '<a href="terminal.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg> Terminal</a>')
        # Discovery
        html = html.replace('<a href="discovery.html" class="tab">Discovery</a>', '<a href="discovery.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> Discovery</a>')
        # Alerts
        html = html.replace('<a href="alerts.html" class="tab">Alerts</a>', '<a href="alerts.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Alerts</a>')
        # Inventory
        html = html.replace('<a href="inventory.html" class="tab">Inventory</a>', '<a href="inventory.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> Inventory</a>')
        # Membership
        html = html.replace('<a href="membership.html" class="tab">Membership</a>', '<a href="membership.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> Membership</a>')
        # Settings
        html = html.replace('<a href="settings.html" class="tab">Settings</a>', '<a href="settings.html" class="tab"><svg class="nav-svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Settings</a>')
        
        with open(page, "w", encoding="utf-8") as f:
            f.write(html)

print("✅ Sidebar SVGs added to all pages.")
