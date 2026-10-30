file_path = "js/overview.js"
with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

old_logic = """    const aiNote = document.getElementById("ov-ai-assistant-note");"""
new_logic = """    // Render Sales by Category
    if (summary && summary.categories && summary.categories.length > 0) {
        const catEl = document.getElementById("ov-category");
        if (catEl) {
            const totalCatRev = summary.categories.reduce((a, b) => a + b.revenue, 0);
            catEl.innerHTML = summary.categories.map(c => {
                const pct = totalCatRev > 0 ? ((c.revenue / totalCatRev) * 100).toFixed(1) : 0;
                return `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 6px;">
                        <span>${escapeHtml(c.name)}</span>
                        <span style="font-family: var(--font-mono);">${ovMoney(c.revenue)} (${pct}%)</span>
                    </div>
                    <div style="width: 100%; background: #F1F5F9; height: 6px; border-radius: 2px; overflow: hidden;">
                        <div style="width: ${pct}%; background: #0284C7; height: 100%;"></div>
                    </div>
                </div>`;
            }).join('');
        }
    } else {
        ovEmpty("ov-category", "No category data yet.");
    }

    const aiNote = document.getElementById("ov-ai-assistant-note");"""
code = code.replace(old_logic, new_logic)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("✅ Frontend patched: Renders Category progress bars!")
