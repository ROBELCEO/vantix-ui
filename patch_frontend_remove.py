with open("js/competitors.js", "r", encoding="utf-8") as f:
    js = f.read()

# Find the exact block with the Refresh button
old_block = """                <div style="display:flex; align-items:center; gap:8px;">
                    ${cmpFreshBadge(c)}
                    <button onclick="refreshCompetitor('${cmpEsc(c.domain)}', this)" class="cmp-btn-small">Refresh</button>
                </div>"""

new_block = """                <div style="display:flex; align-items:center; gap:8px;">
                    ${cmpFreshBadge(c)}
                    <button onclick="refreshCompetitor('${cmpEsc(c.domain)}', this)" class="cmp-btn-small">Refresh</button>
                    <button onclick="removeCompetitor('${cmpEsc(c.domain)}', this)" class="cmp-btn-small" style="color:#E11D48; border-color:#FECDD3;" onmouseover="this.style.background='#FFF1F2'" onmouseout="this.style.background='#FFFFFF'">Remove</button>
                </div>"""

if old_block in js:
    js = js.replace(old_block, new_block)
    print("✅ Frontend: Added Remove button to UI.")
else:
    print("⚠️ Frontend: Could not find exact button block. It may already be patched.")

remove_function = """
async function removeCompetitor(domain, btn) {
    if (!confirm(`Are you sure you want to remove ${domain}?`)) return;
    
    const original = btn.innerText;
    btn.innerText = "…";
    btn.disabled = true;
    
    try {
        const res = await fetch(`https://api.midra.xyz/api/competitors/remove?domain=${encodeURIComponent(domain)}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            fetchCompetitors();
            loadCompetitorIntel();
            loadCatalogGaps();
            loadBestSellers();
        } else {
            const data = await res.json();
            alert(data.detail || "Failed to remove competitor.");
            btn.innerText = original;
            btn.disabled = false;
        }
    } catch (e) {
        alert("Network error removing competitor.");
        btn.innerText = original;
        btn.disabled = false;
    }
}
"""

if "async function removeCompetitor" not in js:
    js += remove_function
    print("✅ Frontend: Added removeCompetitor logic.")

with open("js/competitors.js", "w", encoding="utf-8") as f:
    f.write(js)
