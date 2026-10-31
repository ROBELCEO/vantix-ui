path = "js/competitors.js"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

old_block = """        } else {
            status.className = 'cmp-status-msg cmp-text-red';
            status.innerText = data.detail || data.message || "Error adding.";
        }"""

new_block = """        } else if (res.status === 403) {
            status.className = 'cmp-status-msg cmp-text-red';
            const detail = data.detail || "Plan limit reached.";
            status.innerHTML = `${cmpEsc(detail)} <a href="membership.html" style="margin-left:8px; font-weight:800; color:#0284C7; text-decoration:underline;">Upgrade to Pro →</a>`;
        } else {
            status.className = 'cmp-status-msg cmp-text-red';
            status.innerText = data.detail || data.message || "Error adding.";
        }"""

if old_block not in code:
    print("❌ Could not find addCompetitor else block. Aborting.")
    raise SystemExit(1)

code = code.replace(old_block, new_block, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print("✅ addCompetitor now shows Upgrade to Pro link on 403.")
