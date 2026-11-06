import re

# 1. Update overview.js to render a Doughnut Chart
with open("js/overview.js", "r", encoding="utf-8") as f:
    js = f.read()

# Find the category rendering block
old_block = """    // Render Sales by Category
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
    }"""

new_block = """    // Render Sales by Category (Donut Chart)
    if (summary && summary.categories && summary.categories.length > 0) {
        const catEl = document.getElementById("ov-category");
        if (catEl) {
            const totalCatRev = summary.categories.reduce((a, b) => a + b.revenue, 0);
            
            // Inject Chart Canvas and Legend Wrapper
            catEl.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 24px; height: 100%; width: 100%;">
                    <div style="position: relative; width: 140px; height: 140px; flex-shrink: 0;">
                        <canvas id="ov-category-donut"></canvas>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; pointer-events: none;">
                            <div style="font-size: 10px; color: #71717A; font-weight: 700; text-transform: uppercase;">Total</div>
                            <div style="font-size: 15px; font-weight: 900; color: #09090B;">${ovMoney(totalCatRev)}</div>
                        </div>
                    </div>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
                        ${summary.categories.map((c, i) => {
                            const pct = totalCatRev > 0 ? ((c.revenue / totalCatRev) * 100).toFixed(0) : 0;
                            const colors = ['#0284C7', '#8B5CF6', '#F59E0B', '#10B981', '#E11D48'];
                            return `
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
                                <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #52525B;">
                                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${colors[i % colors.length]};"></div>
                                    ${escapeHtml(c.name)}
                                </div>
                                <div style="font-weight: 800; color: #09090B;">${pct}%</div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>
            `;

            // Render Chart.js
            const ctx = document.getElementById("ov-category-donut").getContext("2d");
            if (window.ovCategoryChart) window.ovCategoryChart.destroy();
            
            const colors = ['#0284C7', '#8B5CF6', '#F59E0B', '#10B981', '#E11D48'];
            window.ovCategoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: summary.categories.map(c => c.name),
                    datasets: [{
                        data: summary.categories.map(c => c.revenue),
                        backgroundColor: colors,
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ' ' + ovMoney(context.raw);
                                }
                            }
                        }
                    }
                }
            });
        }
    } else {
        ovEmpty("ov-category", "No category data yet.");
    }"""

if old_block in js:
    js = js.replace(old_block, new_block)
    with open("js/overview.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ overview.js updated to render a Donut Chart.")
else:
    print("⚠️ Could not find the exact category block. Checking for regex...")
    # Fallback regex in case whitespace differs
    js = re.sub(r'// Render Sales by Category.*?ovEmpty\("ov-category", "No category data yet."\);\n    }', new_block, js, flags=re.DOTALL)
    with open("js/overview.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ overview.js updated via regex.")

# 2. Ensure the category container has a proper height for the chart
with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """
/* Donut Chart Container */
#ov-category {
    min-height: 160px;
    display: flex;
    align-items: center;
}
"""
if "#ov-category {" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ CSS added for chart container.")

