import glob

# ==========================================
# 1. INJECT LOCK UI INTO DISCOVERY.HTML
# ==========================================
with open("discovery.html", "r", encoding="utf-8") as f:
    html = f.read()

lock_html = '''
        <!-- HIDDEN PAYWALL LOCK (SHOWN VIA CSS) -->
        <div id="dsc-paywall-css" style="display: none; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; background: #FFFFFF; border: 1px dashed #D1D5DB; border-radius: 4px; text-align: center; width: 100%; margin-top: 24px;">
            <div style="font-size: 32px; margin-bottom: 16px;">🔒</div>
            <div style="font-weight: 900; font-size: 20px; color: #09090B; margin-bottom: 8px;">Pro Feature</div>
            <div style="font-size: 14px; color: #52525B; margin-bottom: 24px; max-width: 400px;">
                The Global Discovery Engine scans 29,000+ stores to find your next winning product. Upgrade to Pro to unlock the Goldmines.
            </div>
            <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 12px 24px; border-radius: 4px; font-size: 14px; font-weight: 800; text-decoration: none;">Upgrade to Pro</a>
        </div>
'''

if 'id="dsc-paywall-css"' not in html:
    # Insert right after the status banner
    html = html.replace('<div class="dsc-status-banner">', lock_html + '\n        <div class="dsc-status-banner">')
    with open("discovery.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("✅ Injected Lock UI into discovery.html")

# ==========================================
# 2. ADD CSS RULES TO MASTERPIECE.CSS
# ==========================================
css_addition = """
/* ==========================================
   DISCOVERY PAYWALL (CSS ONLY)
   ========================================== */
body.is-locked-tier #discovery-results,
body.is-locked-tier #watchlist-results,
body.is-locked-tier .dsc-status-banner,
body.is-locked-tier .dsc-header-right {
    display: none !important;
}
body.is-locked-tier #dsc-paywall-css {
    display: flex !important;
}
"""
with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()
if "DISCOVERY PAYWALL (CSS ONLY)" not in css:
    with open("css/masterpiece.css", "a", encoding="utf-8") as f:
        f.write(css_addition)
    print("✅ Added paywall CSS to masterpiece.css")

# ==========================================
# 3. ADD BODY CLASS TOGGLE IN APP.JS
# ==========================================
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Find where the plan is evaluated
target = "if (d.plan === 'starter') {"
replacement = """if (d.plan !== 'pro' && d.plan !== 'scale') { document.body.classList.add('is-locked-tier'); }
        if (d.plan === 'starter') {"""

if "is-locked-tier" not in js:
    if target in js:
        js = js.replace(target, replacement)
        with open("js/app.js", "w", encoding="utf-8") as f:
            f.write(js)
        print("✅ Added class toggle to app.js")
    else:
        print("⚠️ Could not find the target line in app.js. Checking for alternative...")
        # Try finding where d.plan is first used
        import re
        js = re.sub(r'(\.then\(d => \{)', r"\1\n        if (d.plan !== 'pro' && d.plan !== 'scale') { document.body.classList.add('is-locked-tier'); }", js, count=1)
        with open("js/app.js", "w", encoding="utf-8") as f:
            f.write(js)
        print("✅ Added class toggle via regex.")

print("Done!")
