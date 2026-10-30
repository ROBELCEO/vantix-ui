import re

file_path = "js/overview.js"
with open(file_path, "r", encoding="utf-8") as f:
    code = f.read()

# The exact new chart function
new_func = """function renderChart(chart) {
    const canvas = document.getElementById("ov-profit-chart");
    if (!canvas || typeof Chart === "undefined") return;
    if (ovChartInstance) ovChartInstance.destroy();

    let labels = Array.isArray(chart.labels) && chart.labels.length ? chart.labels : ["No data"];
    let data = Array.isArray(chart.data) && chart.data.length ? chart.data : [0];

    const ctx = canvas.getContext("2d");

    ovChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Net Profit",
                data: data,
                backgroundColor: data.map(v => v < 0 ? "#E11D48" : "#059669"),
                borderRadius: 2,
                barPercentage: 0.9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let v = context.parsed.y;
                            return "Profit: " + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: "#6B7280", font: { size: 9 }, maxTicksLimit: 8 } },
                y: { 
                    grid: { color: "#E5E7EB" }, 
                    ticks: { color: "#6B7280", font: { size: 10 } },
                    min: -8000,
                    max: 1000
                }
            }
        }
    });
}
"""

# Use regex to find the function and replace it completely
# It matches from 'function renderChart' up to the start of the next function
pattern = re.compile(r'function renderChart\(chart\) \{.*?(?=function |\Z)', re.DOTALL)
code = pattern.sub(new_func, code)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(code)

print("✅ SUCCESS: Completely replaced renderChart with a red/green Bar Chart.")
