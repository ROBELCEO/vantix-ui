with open("discovery.html", "r", encoding="utf-8") as f:
    html = f.read()

# Add the tab button override to the existing style block
target_css = """        /* 3. Adjust the Configure button alignment */
        .dsc-btn-configure { margin-top: 0px; padding: 8px 16px !important; font-size: 12px !important; }"""

new_css = """        /* 3. Adjust the Configure button alignment */
        .dsc-btn-configure { margin-top: 0px; padding: 8px 16px !important; font-size: 12px !important; }
        
        /* 4. Force Discover and Watchlist tabs to match the Configure button size exactly */
        #btn-tab-discover, #btn-tab-watchlist {
            padding: 8px 16px !important;
            font-size: 12px !important;
            line-height: 1.5 !important;
            height: auto !important;
        }"""

if "#btn-tab-discover" not in html:
    html = html.replace(target_css, new_css)
    
    with open("discovery.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("✅ Tabs resized successfully.")
else:
    print("ℹ️ Tabs already fixed.")
