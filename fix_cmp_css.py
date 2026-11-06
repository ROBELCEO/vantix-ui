with open("competitors.html", "r", encoding="utf-8") as f:
    code = f.read()

# Find the CSS grid definitions and replace them with the clean Discovery-style grid
old_css = '''    /* Grid Layouts (Full Width) */
    .cmp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .cmp-product-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .cmp-product-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }'''

new_css = '''    /* Grid Layouts (Full Width) */
    .cmp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; align-items: start; }
    
    /* Clean Card Grid matching Discovery */
    .cmp-slider, .cmp-list-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); 
        gap: 20px; 
        align-items: start;
    }
    
    /* Card DNA */
    .cmp-card {
        background: #FFFFFF; 
        border: 1px solid #E4E4E7; 
        border-radius: 8px; 
        overflow: hidden; 
        display: flex; 
        flex-direction: column; 
        transition: box-shadow 0.2s;
    }
    .cmp-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .cmp-card-img-wrap { position: relative; width: 100%; padding-top: 100%; /* 1:1 Square */ }
    .cmp-card-img-wrap img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
    .cmp-card-content { padding: 16px; display: flex; flex-direction: column; flex: 1; }
    .cmp-card-store { font-size: 11px; font-weight: 800; color: #0284C7; text-transform: uppercase; margin-bottom: 4px; }
    .cmp-card-title { font-size: 14px; font-weight: 700; color: #09090B; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
    .cmp-card-price { font-size: 18px; font-weight: 900; color: #059669; }'''

if old_css in code:
    code = code.replace(old_css, new_css)
    print("✅ CSS grids updated to match Discovery.")
else:
    print("⚠️ Could not find grid CSS.")

# Update the HTML classes so they use the new grid
code = code.replace('class="cmp-list cmp-product-grid-2"', 'class="cmp-list cmp-list-grid"')
code = code.replace('class="cmp-list cmp-product-grid-4"', 'class="cmp-list cmp-list-grid"')

with open("competitors.html", "w", encoding="utf-8") as f:
    f.write(code)
