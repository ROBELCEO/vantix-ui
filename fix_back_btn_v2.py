import re

def fix_legal_page(filename):
    with open(filename, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Add the JS function to handle going back/closing
    js_script = """
    <script>
        function handleBack() {
            // If the page was opened in a new tab, history length is 1
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Try to close the tab
                window.close();
                // If the browser blocks window.close(), fallback to index
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 100);
            }
        }
    </script>
    """
    if "function handleBack()" not in html:
        html = html.replace("</body>", js_script + "\n</body>")

    # 2. Replace the <a> tag with a <button> that uses the function
    old_btn = '<a href="javascript:history.back()" class="back-btn">← Go Back</a>'
    new_btn = '<button onclick="handleBack()" class="back-btn" style="cursor: pointer; border: none; font-family: inherit;">← Close / Go Back</button>'
    
    if old_btn in html:
        html = html.replace(old_btn, new_btn)
    elif '<a href="login.html" class="back-btn">← Return to Login</a>' in html:
        # Fallback if the previous patch didn't apply
        html = html.replace('<a href="login.html" class="back-btn">← Return to Login</a>', new_btn)

    with open(filename, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✅ Fixed back button in {filename}")

fix_legal_page("terms.html")
fix_legal_page("privacy.html")
