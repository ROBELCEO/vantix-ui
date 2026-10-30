import os

css_content = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap');

:root {
    --font-sans: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --bg-base: #F4F4F5;
    --bg-panel: #FFFFFF;
    --bg-surface: #F8FAFC;
    --border: #E4E4E7;
    --text-primary: #09090B;
    --text-secondary: #52525B;
    --text-tertiary: #A1A1AA;
    --accent: #0284C7;
    --green: #059669;
    --red: #E11D48;
    --amber: #D97706;
    --violet: #7C3AED;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border-radius: 2px !important; /* Sharp Corners */
}

body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: var(--bg-base);
    font-family: var(--font-sans);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
}

/* Perfect Scroll Fix */
.screen {
    flex: 1 1 0%;
    min-height: 0;
    overflow: auto;
    background-color: var(--bg-base);
}

.ov-wrap, .st-wrap, .cmp-wrap, .trm-wrap, .dsc-wrap, .alrt-wrap, .inv-wrap, .mem-wrap, .set-wrap, .cnx-wrap {
    margin: 0 auto;
    padding: 24px 20px 64px;
    min-width: 1000px;
    box-sizing: border-box;
}
.ov-wrap, .st-wrap, .trm-wrap, .dsc-wrap, .inv-wrap { max-width: 1400px; }
.cmp-wrap { max-width: 1200px; }
.alrt-wrap { max-width: 1100px; }
.mem-wrap, .set-wrap { max-width: 1000px; }
.cnx-wrap { max-width: 900px; }

/* Header */
.header {
    height: 56px;
    flex-shrink: 0;
    background-color: #000000;
    border-bottom: 1px solid #27272A;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 1000;
}
.brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 900;
    letter-spacing: 1.5px;
    color: #FFFFFF;
    text-decoration: none;
}
.brand span { color: var(--accent); }
.brand .mark { width: 32px; height: 32px; }
.tabs {
    display: flex;
    gap: 4px;
    background: #09090B;
    padding: 4px;
    border: 1px solid #27272A;
}
.tab {
    font-size: 12px;
    font-weight: 600;
    color: #A1A1AA;
    text-decoration: none;
    padding: 6px 12px;
    transition: all 0.2s;
}
.tab:hover { color: #FFFFFF; background: #27272A; }
.tab.active { background: #00E5FF; color: #000000; font-weight: 800; }

/* Drawer */
.drawer-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000; }
.drawer-overlay.open { display: block; }
.drawer { position: fixed; top: 0; right: -300px; width: 300px; height: 100vh; background: #09090B; z-index: 2001; transition: right 0.3s ease; display: flex; flex-direction: column; border-left: 1px solid #27272A; }
.drawer.open { right: 0; }
.drawer-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27272A; }
.drawer-close { background: none; border: none; color: #FFF; font-size: 20px; cursor: pointer; }
.drawer-tab { padding: 14px 20px; color: #A1A1AA; text-decoration: none; font-size: 14px; border-bottom: 1px solid #18181B; }
.drawer-tab.active { color: #00E5FF; background: #111; }
.mobile-menu-btn { display: none; background: none; border: none; color: #FFF; font-size: 20px; cursor: pointer; }

@media (max-width: 1100px) {
    .tabs { display: none; }
    .mobile-menu-btn { display: block; }
}

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-secondary { background: #FFFFFF; border: 1px solid #D4D4D8; color: var(--text-primary); }
.btn-primary { background: var(--accent); color: #FFF; border: none; }

/* Connect Page */
.cnx-row-a { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 24px; }
.cnx-eyebrow { font-size: 10px; letter-spacing: 1.6px; font-weight: 800; color: var(--accent); text-transform: uppercase; margin-bottom: 6px; }
.cnx-title { font-size: 26px; line-height: 1.15; font-weight: 900; color: var(--text-primary); margin: 0 0 6px; letter-spacing: -0.5px; }
.cnx-sub { font-size: 14px; color: var(--text-secondary); margin: 0; max-width: 620px; line-height: 1.5; }
.cnx-status-group { display: flex; flex-wrap: wrap; gap: 8px; }
.cnx-chip { background: #FFFFFF; border: 1px solid var(--border); color: var(--text-secondary); font-size: 11px; font-family: var(--font-mono); padding: 6px 10px; }
.cnx-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.cnx-panel { background: #FFFFFF; border: 1px solid var(--border); padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.cnx-panel-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
.cnx-panel-title { font-size: 16px; font-weight: 800; color: var(--text-primary); }
.cnx-panel-sub { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
.cnx-badge { font-size: 9px; font-weight: 800; padding: 4px 8px; text-transform: uppercase; }
.cnx-input-group { margin-bottom: 16px; }
.cnx-label { display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #71717A; margin-bottom: 6px; }
.cnx-input { width: 100%; background: #FFFFFF; border: 1px solid #D4D4D8; color: var(--text-primary); padding: 10px 12px; font-size: 14px; outline: none; transition: all 0.2s; }
.cnx-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2); }
.cnx-btn-primary { background: var(--accent); color: #FFFFFF; font-weight: 800; font-size: 13px; padding: 12px 20px; border: none; cursor: pointer; width: 100%; transition: background 0.2s; }
@media (max-width: 820px) { .cnx-grid-2 { grid-template-columns: 1fr; } }

/* Overview Page */
.ov-row-a { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 24px; }
.ov-eyebrow { font-size: 10px; letter-spacing: 1.6px; font-weight: 800; color: var(--accent); text-transform: uppercase; margin-bottom: 6px; }
.ov-title { font-size: 26px; line-height: 1.15; font-weight: 900; color: var(--text-primary); margin: 0 0 6px; letter-spacing: -0.5px; }
.ov-sub { font-size: 14px; color: var(--text-secondary); margin: 0; max-width: 620px; line-height: 1.5; }
.ov-status-group { display: flex; flex-wrap: wrap; gap: 8px; }
.ov-status-chip { background: #FFFFFF; border: 1px solid var(--border); color: var(--text-secondary); font-size: 11px; font-family: var(--font-mono); padding: 6px 10px; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
.ov-kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
.ov-kpi { background: #FFFFFF; border: 1px solid var(--border); padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.ov-kpi-label { font-size: 11px; color: #71717A; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 8px; }
.ov-kpi-value { font-family: var(--font-mono); font-size: 24px; font-weight: 800; color: var(--text-primary); line-height: 1.1; margin-bottom: 4px; }
.ov-kpi-value.ov-text-green { color: var(--green); }
.ov-kpi-value.ov-text-red { color: var(--red); }
.ov-kpi-meta { font-size: 11px; color: var(--text-tertiary); }
.ov-grid-3 { display: grid; grid-template-columns: 1.25fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.ov-panel { background: #FFFFFF; border: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.ov-panel-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.ov-panel-title { font-size: 15px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px; }
.ov-panel-sub { font-size: 12px; color: var(--text-secondary); }
.ov-badge { font-size: 9px; font-weight: 800; padding: 4px 8px; border: 1px solid var(--border); background: #F4F4F5; color: var(--text-secondary); }
.ov-badge-violet { color: var(--violet); border-color: #DDD6FE; background: #F5F3FF; }
.ov-badge-cyan { color: var(--accent); border-color: #BAE6FD; background: #F0F9FF; }
.ov-chart-wrap { position: relative; height: 210px; flex: 1; }
.ov-list { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.ov-empty { font-size: 12px; color: var(--text-tertiary); padding: 20px; border: 1px dashed var(--border); text-align: center; }
.ov-ai-panel { border-color: #BAE6FD; background: #F0F9FF; }
.ov-btn-primary { background: var(--accent); color: #FFFFFF; font-size: 13px; font-weight: 800; padding: 12px 16px; text-decoration: none; text-align: center; border: none; cursor: pointer; }

.ov-opportunity { display: flex; gap: 12px; padding: 12px; background: #F8FAFC; border: 1px solid var(--border); }
.ov-opportunity-rank { width: 24px; height: 24px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--violet); border: 1px solid #DDD6FE; background: #F5F3FF; }
.ov-opportunity-body { min-width: 0; }
.ov-opportunity-text { font-size: 13px; color: var(--text-primary); line-height: 1.5; margin-bottom: 4px; font-weight: 500; }
.ov-opportunity-meta { font-size: 10px; color: #71717A; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; }

.ov-insight { padding: 12px; background: #F8FAFC; border: 1px solid var(--border); border-left: 3px solid var(--border); }
.ov-insight-red { border-left-color: var(--red); }
.ov-insight-amber { border-left-color: var(--amber); }
.ov-insight-title { font-size: 12px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ov-insight-body { font-size: 12px; color: var(--text-secondary); line-height: 1.45; margin-bottom: 4px; }
.ov-insight-time { font-size: 10px; color: var(--text-tertiary); font-family: var(--font-mono); }

.ov-product-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.ov-product-row:last-child { border-bottom: none; }
.ov-product-rank { font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary); width: 16px; flex-shrink: 0; }
.ov-product-img { width: 36px; height: 36px; object-fit: cover; background: #F4F4F5; border: 1px solid var(--border); flex-shrink: 0; }
.ov-product-info { flex: 1; min-width: 0; }
.ov-product-title { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ov-product-meta { font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono); }
.ov-product-revenue { font-family: var(--font-mono); font-size: 13px; font-weight: 800; color: var(--green); white-space: nowrap; }

/* My Store Page */
.st-header-row { display: flex; justify-content: space-between; align-items: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
.st-identity { display: flex; align-items: center; gap: 16px; min-width: 0; }
.st-monogram { width: 48px; height: 48px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: #FFFFFF; border: 1px solid var(--border); font-family: var(--font-mono); font-size: 16px; font-weight: 800; color: var(--accent); box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
.st-eyebrow { font-size: 10px; letter-spacing: 1.6px; font-weight: 800; color: var(--accent); text-transform: uppercase; margin-bottom: 4px; }
.st-title { font-size: 24px; line-height: 1.15; font-weight: 900; color: var(--text-primary); margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-domain { font-size: 13px; color: var(--text-secondary); font-family: var(--font-mono); }
.st-status-group { display: flex; flex-wrap: wrap; gap: 8px; }
.st-chip { background: #FFFFFF; border: 1px solid var(--border); color: var(--text-secondary); font-size: 11px; font-family: var(--font-mono); padding: 6px 10px; white-space: nowrap; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }

.st-kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
.st-kpi { background: #FFFFFF; border: 1px solid var(--border); padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.st-kpi-label { font-size: 11px; color: #71717A; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-kpi-value { font-family: var(--font-mono); font-size: 22px; font-weight: 800; color: var(--text-primary); line-height: 1.1; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-kpi-meta { font-size: 11px; color: var(--text-tertiary); }

.st-green { color: var(--green) !important; }
.st-red { color: var(--red) !important; }
.st-amber { color: var(--amber) !important; }
.st-cyan { color: var(--accent) !important; }

.st-grid-2-1 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; margin-bottom: 24px; }
.st-grid-2-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }

.st-panel { background: #FFFFFF; border: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.st-panel-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.st-panel-title { font-size: 15px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px; }
.st-panel-sub { font-size: 12px; color: var(--text-secondary); }

.st-badge { font-size: 9px; font-weight: 800; padding: 4px 8px; border: 1px solid var(--border); background: #F4F4F5; color: var(--text-secondary); }
.st-badge-red { color: var(--red); border-color: #FECDD3; background: #FFF1F2; }
.st-badge-amber { color: var(--amber); border-color: #FDE68A; background: #FFFBEB; }
.st-badge-violet { color: var(--violet); border-color: #DDD6FE; background: #F5F3FF; }
.st-badge-cyan { color: var(--accent); border-color: #BAE6FD; background: #F0F9FF; }
.st-link { font-size: 12px; color: var(--accent); text-decoration: none; font-weight: 700; }
.st-link:hover { text-decoration: underline; }

.st-chart-wrap { position: relative; height: 250px; min-height: 200px; }
.st-list { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.st-empty { font-size: 12px; color: var(--text-tertiary); line-height: 1.5; padding: 16px; border: 1px dashed var(--border); text-align: center; }
.st-empty-good { color: var(--green); border-color: #A7F3D0; }

.st-product-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.st-product-row:last-child { border-bottom: none; }
.st-row-rank { font-family: var(--font-mono); font-size: 11px; color: var(--text-tertiary); width: 16px; flex-shrink: 0; }
.st-product-img { width: 36px; height: 36px; object-fit: cover; background: #F4F4F5; border: 1px solid var(--border); flex-shrink: 0; }
.st-row-body { flex: 1; min-width: 0; }
.st-row-title { font-size: 13px; font-weight: 700; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-row-meta { font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono); }
.st-row-amount { font-family: var(--font-mono); font-size: 13px; font-weight: 800; white-space: nowrap; }
.st-row-action { font-size: 10px; font-weight: 800; color: var(--amber); border: 1px solid #FDE68A; background: #FFFBEB; padding: 4px 8px; text-decoration: none; white-space: nowrap; }

.st-hero-amount { font-family: var(--font-mono); font-size: 26px; font-weight: 900; margin-bottom: 2px; }
.st-hero-label { font-size: 11px; color: #71717A; margin-bottom: 12px; }
.st-bundle { background: #F8FAFC; border: 1px solid var(--border); padding: 16px; }
.st-bundle-top { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.st-bundle-title { font-size: 14px; font-weight: 900; color: var(--violet); margin-bottom: 4px; }
.st-bundle-pricing { text-align: right; }
.st-bundle-orig { font-size: 11px; text-decoration: line-through; color: var(--text-tertiary); font-family: var(--font-mono); }
.st-bundle-new { font-size: 16px; font-weight: 900; color: var(--green); font-family: var(--font-mono); }
.st-bundle-pitch { font-size: 12px; color: var(--text-secondary); line-height: 1.5; background: #F5F3FF; border-left: 3px solid var(--violet); padding: 10px; }
.st-cust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.st-cust-stat { background: #F8FAFC; border: 1px solid var(--border); padding: 12px; }
.st-note { margin-top: 16px; font-size: 10px; color: var(--text-tertiary); line-height: 1.5; padding-top: 12px; border-top: 1px dashed var(--border); }

/* Competitors Page */
.cmp-panel { background: #FFFFFF; border: 1px solid var(--border); padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.cmp-title { font-size: 24px; font-weight: 900; color: var(--text-primary); }
.cmp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }

/* Terminal Page */
.trm-layout { display: grid; grid-template-columns: 340px 1fr; gap: 16px; }
.trm-sidebar { background: #FFFFFF; border: 1px solid var(--border); padding: 16px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.trm-main { display: flex; flex-direction: column; gap: 16px; }
.trm-panel { background: #FFFFFF; border: 1px solid var(--border); padding: 16px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

/* Discovery Page */
.dsc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.dsc-card { background: #FFFFFF; border: 1px solid var(--border); padding: 16px; display: flex; flex-direction: column; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

/* Inventory Page */
.inv-kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
.inv-kpi { background: #FFFFFF; border: 1px solid var(--border); padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.inv-panel { background: #FFFFFF; border: 1px solid var(--border); padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D4D4D8; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #A1A1AA; }
"""

with open("css/style.css", "w", encoding="utf-8") as f:
    f.write(css_content)

print("✅ style.css completely rebuilt from Python script.")
