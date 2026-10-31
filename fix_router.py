import re

# 1. Fix discovery.js
with open("js/discovery.js", "r", encoding="utf-8") as f:
    dsc = f.read()

paywall_func = """
window.initDiscoveryPaywall = async function() {
    const existing = document.getElementById('dsc-paywall-overlay');
    if (existing) existing.remove();

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        const data = await res.json();
        if (data.plan === 'starter') {
            const overlay = document.createElement('div');
            overlay.id = 'dsc-paywall-overlay';
            overlay.style.cssText = "position: fixed; top: 56px; left: 0; right: 0; bottom: 0; z-index: 9999; backdrop-filter: blur(8px); background: rgba(248, 250, 252, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center;";
            overlay.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
                <div style="font-weight: 900; font-size: 24px; color: #09090B; margin-bottom: 8px;">Unlock Global Discovery</div>
                <div style="font-size: 15px; color: #52525B; max-width: 400px; text-align: center; margin-bottom: 24px; line-height: 1.5;">Instantly search 1,000,000+ winning products across the global Shopify catalog and push them to your store in 1-click.</div>
                <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 12px 24px; border-radius: 2px; text-decoration: none; font-size: 14px; font-weight: 800;">Upgrade to Pro →</a>
            `;
            document.body.appendChild(overlay);
        }
    } catch(e) {
        console.error("Paywall error:", e);
    }
};
"""

if "window.initDiscoveryPaywall" not in dsc:
    dsc = dsc + "\n" + paywall_func
    with open("js/discovery.js", "w", encoding="utf-8") as f:
        f.write(dsc)
    print("✅ Added paywall function to discovery.js")

# 2. Fix router.js
with open("js/router.js", "r", encoding="utf-8") as f:
    rt = f.read()

# Add initDiscoveryPaywall to the discovery route
rt = re.sub(r'discovery:\s*\{\s*html:\s*"discovery.html",\s*init:\s*\["loadDiscovery"\]\s*\}', 'discovery:   { html: "discovery.html",   init: ["initDiscoveryPaywall", "loadDiscovery"] }', rt)

# Add cleanup logic
cleanup_anchor = 'function cleanupPreviousView() {'
cleanup_code = '''function cleanupPreviousView() {
    const paywall = document.getElementById('dsc-paywall-overlay');
    if (paywall) paywall.remove();
'''
if "dsc-paywall-overlay" not in rt:
    rt = rt.replace(cleanup_anchor, cleanup_code)

with open("js/router.js", "w", encoding="utf-8") as f:
    f.write(rt)
print("✅ Updated router.js to trigger paywall and clean up")
