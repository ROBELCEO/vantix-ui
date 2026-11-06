import re

with open("js/discovery.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Replace toggleAutoDetect to force it to work
new_toggle = """function toggleAutoDetect(checkbox) {
    const tree = document.getElementById('category-tree');
    if (!tree) return;
    
    if (checkbox.checked) {
        tree.style.pointerEvents = 'none';
        tree.style.filter = 'grayscale(1)';
        tree.style.opacity = '0.6';
        document.querySelectorAll('.dsc-tree-child input, .dsc-tree-parent input').forEach(cb => { 
            cb.checked = false; 
            cb.disabled = true; 
        });
    } else {
        tree.style.pointerEvents = 'auto';
        tree.style.filter = 'none';
        tree.style.opacity = '1';
        document.querySelectorAll('.dsc-tree-child input, .dsc-tree-parent input').forEach(cb => { 
            cb.disabled = false; 
        });
    }
}"""

js = re.sub(r'function toggleAutoDetect\(checkbox\) \{.*?\n\}', new_toggle, js, flags=re.DOTALL)

# 2. Replace updateSelection to be safe
new_update = """function updateSelection() {
    const selected = [];
    document.querySelectorAll('.dsc-tree-child input:checked').forEach(cb => selected.push(cb.value));
    currentPrefs.selected_categories = selected;
}"""

js = re.sub(r'function updateSelection\(\) \{.*?\n\}', new_update, js, flags=re.DOTALL)

# 3. Patch openPreferences to always unlock the tree initially
new_open = """async function openPreferences() {
    document.getElementById('preferences-modal').style.display = 'flex';
    const toggle = document.getElementById('auto-detect-toggle');
    toggle.checked = currentPrefs.auto_detect;
    toggleAutoDetect(toggle);
    
    if (Object.keys(backendCategories).length === 0) {
        document.getElementById('category-tree').innerHTML = '<div style="text-align:center; padding:20px; color:#71717A;">Loading categories...</div>';
        await fetchCategories();
    }
    renderCategoryTree();
}"""

js = re.sub(r'async function openPreferences\(\) \{.*?\n\}', new_open, js, flags=re.DOTALL)

# 4. Fix renderCategoryTree to prevent overriding user clicks
new_render = """function renderCategoryTree() {
    const container = document.getElementById('category-tree');
    if (Object.keys(backendCategories).length === 0) return;

    container.innerHTML = Object.keys(backendCategories).map(mainCat => {
        const subCats = backendCategories[mainCat];
        const checkedSubs = subCats.filter(sub => currentPrefs.selected_categories.includes(sub));
        const isAllChecked = subCats.length === checkedSubs.length && subCats.length > 0;

        const childHtml = subCats.map(sub => {
            const isChecked = currentPrefs.selected_categories.includes(sub);
            return `
                <label class="dsc-tree-child">
                    <input type="checkbox" value="${sub}" ${isChecked ? 'checked' : ''} onchange="updateSelection()">
                    ${sub}
                </label>
            `;
        }).join('');

        return `
            <div class="dsc-tree-group">
                <label class="dsc-tree-parent">
                    <input type="checkbox" ${isAllChecked ? 'checked' : ''} onchange="toggleParent(this, '${mainCat}')">
                    ${mainCat}
                </label>
                <div class="dsc-tree-children">${childHtml}</div>
            </div>
        `;
    }).join('');
    
    // Do NOT call toggleAutoDetect here, it messes up the user's current selection state
}"""

js = re.sub(r'function renderCategoryTree\(\) \{.*?\n\}', new_render, js, flags=re.DOTALL)

with open("js/discovery.js", "w", encoding="utf-8") as f:
    f.write(js)

print("✅ Completely rewrote toggleAutoDetect, renderCategoryTree, and openPreferences.")
