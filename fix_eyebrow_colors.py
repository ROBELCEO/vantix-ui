# 1. Fix Alerts
with open("alerts.html", "r", encoding="utf-8") as f:
    alerts_html = f.read()

alerts_old = """            font-weight: 800 !important;
            color: #52525B !important;
        }
        .alrt-screen .alrt-sub {"""
alerts_new = """            font-weight: 800 !important;
            color: #0284C7 !important;
        }
        .alrt-screen .alrt-sub {"""

alerts_html = alerts_html.replace(alerts_old, alerts_new)
with open("alerts.html", "w", encoding="utf-8") as f:
    f.write(alerts_html)

# 2. Fix Inventory
with open("inventory.html", "r", encoding="utf-8") as f:
    inv_html = f.read()

inv_old = """            font-weight: 800 !important;
            color: #52525B !important;
        }
        .inv-screen .inv-sub {"""
inv_new = """            font-weight: 800 !important;
            color: #0284C7 !important;
        }
        .inv-screen .inv-sub {"""

inv_html = inv_html.replace(inv_old, inv_new)
with open("inventory.html", "w", encoding="utf-8") as f:
    f.write(inv_html)

print("✅ Eyebrows updated to Blue (#0284C7) on Alerts and Inventory.")
