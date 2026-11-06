with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# The catch script
catch_script = """
    <!-- OAUTH TOKEN CATCHER -->
    <script>
        // If Google just redirected us to the root with a token, forward it to the dashboard
        if (window.location.hash && window.location.hash.includes('access_token')) {
            window.location.href = '/overview.html' + window.location.hash;
        }
    </script>
</body>"""

if "OAUTH TOKEN CATCHER" not in html:
    html = html.replace("</body>", catch_script)
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("✅ Added OAuth Token Catcher to index.html")
else:
    print("ℹ️ Catcher already exists.")
