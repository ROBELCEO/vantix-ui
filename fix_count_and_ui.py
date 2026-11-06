import re

# 1. Fix the scraper numbers
files_to_fix = {
    "competitors.html": [
        ("Scan the 29,000+ store database", "Scan the 100,000+ store database")
    ],
    "discovery.html": [
        ("scans 29,000+ stores", "scans 100,000+ stores")
    ],
    "index.html": [
        ("Scan 29,000+ Shopify stores", "Scan 100,000+ Shopify stores")
    ],
    "js/competitors.js": [
        ('"Scanning 29,000 stores..."', '"Scanning 100,000+ stores..."')
    ]
}

for file, replacements in files_to_fix.items():
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
        
        for old, new in replacements:
            content = content.replace(old, new)
            
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Fixed scraper count in {file}")
    except Exception as e:
        print(f"⚠️ Error in {file}: {e}")

# 2. Polish the Landing Page UI (index.html)
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Ensure the premium typography is fully applied
ui_polish = """
    /* MIDRA PREMIUM UI POLISH */
    h1, h2, h3, h4, h5, h6 { letter-spacing: -0.03em; color: var(--text-main); font-weight: 800; }
    p { color: var(--text-muted); line-height: 1.6; }
    .hero h1 { font-size: 56px; font-weight: 900; letter-spacing: -2px; margin-bottom: 24px; }
    .hero p.lede { font-size: 18px; font-weight: 500; color: #A1A1AA; max-width: 650px; }
    
    /* Buttons */
    .btn-primary, .btn-outline { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: 0.2px; }
    .btn-large { padding: 14px 28px; font-size: 15px; }
    
    /* Cards */
    .feature-card h3 { font-size: 16px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; }
    .feature-card p { font-size: 13px; line-height: 1.6; }
    
    /* Pricing */
    .price-amount { font-size: 42px; font-weight: 900; letter-spacing: -1.5px; }
    .price-features li { font-size: 13px; font-weight: 500; color: #E4E4E7; }
    
    /* Nav */
    .nav-links a.navlink { font-weight: 600; font-size: 14px; }
    .logo-container { font-family: 'Inter', sans-serif; font-weight: 900; font-size: 20px; }
"""

# Inject the polish into the <style> block
if "/* MIDRA PREMIUM UI POLISH */" not in html:
    html = html.replace("</style>", ui_polish + "\n</style>")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)
print("✅ Applied UI polish to index.html")

