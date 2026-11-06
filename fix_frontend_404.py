with open("js/competitors.js", "r", encoding="utf-8") as f:
    js = f.read()

old_error = """        } else {
            // CATCH BACKEND ERRORS (like the missing database column) GRACEFULLY
            status.className = 'cmp-status-msg cmp-text-red';
            // Don't show raw JSON errors to the user
            if (res.status >= 500) {
                status.innerHTML = `⚠️ Server error. Please try again later or contact support.`;
            } else {
                status.innerText = data.detail || data.message || "Error adding.";
            }
        }"""

new_error = """        } else if (res.status === 404) {
            // Clean message for stores not yet in the database
            status.className = 'cmp-status-msg cmp-text-red';
            status.innerHTML = `⚠️ ${cmpEsc(data.detail || "This store is not yet in our database. Please try another domain.")}`;
        } else {
            // Catch actual server crashes
            status.className = 'cmp-status-msg cmp-text-red';
            if (res.status >= 500) {
                status.innerHTML = `⚠️ Server error. Please try again later.`;
            } else {
                status.innerText = data.detail || data.message || "Error adding competitor.";
            }
        }"""

if old_error in js:
    js = js.replace(old_error, new_error)
    with open("js/competitors.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Frontend patched: Added clean 404 handling.")
else:
    print("⚠️ Could not find the exact error block.")

# Bump cache
$v = Get-Date -Format "HHmm"
Get-ChildItem -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '\.js\?v=\d+', ".js?v=$v"
    $content | Out-File $_.FullName -Encoding utf8 -NoNewline
}
