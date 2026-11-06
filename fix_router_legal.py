with open("js/router.js", "r", encoding="utf-8") as f:
    js = f.read()

# Find the click interception logic and add our exception
if "terms.html" not in js:
    # We will inject an exception right at the top of the click listener
    # Usually it's something like: document.addEventListener("click", ...)
    
    # Find where the router starts intercepting links
    import re
    
    # Let's just add a global exception at the top of the file
    exception_code = """
// Exempt legal pages from SPA router
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && (link.href.includes('terms.html') || link.href.includes('privacy.html'))) {
        // Let the browser handle it normally (open in new tab)
        return;
    }
}, true);
"""
    js = exception_code + "\n\n" + js
    
    with open("js/router.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ router.js patched to allow terms/privacy pages to open normally.")
else:
    print("ℹ️ Router already patched.")
