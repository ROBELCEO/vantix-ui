with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

old_load = """        if (data.status === 'success') {
            currentPrefs.auto_detect = data.auto_detect;
            currentPrefs.selected_categories = data.selected_categories;
            document.getElementById('auto-tags-container').innerHTML = data.auto_detected.map(tag => `<span class="dsc-auto-tag">${dscEsc(tag)}</span>`).join('');
            if (Object.keys(backendCategories).length > 0) renderCategoryTree();
        }"""

new_load = """        if (data.status === 'success') {
            currentPrefs.auto_detect = data.auto_detect;
            currentPrefs.selected_categories = data.selected_categories || [];
            
            const tagsContainer = document.getElementById('auto-tags-container');
            if (tagsContainer && data.auto_detected) {
                tagsContainer.innerHTML = data.auto_detected.map(tag => `<span class="dsc-auto-tag">${dscEsc(tag)}</span>`).join('');
            }
            
            // Sync the toggle UI with the saved state so it doesn't lock the tree
            const toggle = document.getElementById('auto-detect-toggle');
            if (toggle) {
                toggle.checked = currentPrefs.auto_detect;
                toggleAutoDetect(toggle);
            }
            
            if (Object.keys(backendCategories).length > 0) renderCategoryTree();
        }"""

if old_load in js:
    js = js.replace(old_load, new_load)
    with open("js/discovery.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Fixed UI sync for preferences toggle.")
else:
    print("⚠️ Could not find loadPreferences block to replace.")
