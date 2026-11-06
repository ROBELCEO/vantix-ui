import re

# --- FIX 1: app.js ---
with open("js/app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

target_app = """        if (!session) {
            window.location.href = "login.html";
            return;
        }"""

replacement_app = """        if (!session) {
            // If Google just redirected us with a token, wait for Supabase to process it
            if (window.location.hash.includes('access_token')) {
                console.log("OAuth token detected. Waiting for Supabase to process...");
                return;
            }
            window.location.href = "login.html";
            return;
        }"""

if target_app in app_js:
    app_js = app_js.replace(target_app, replacement_app)
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(app_js)
    print("✅ Patched app.js (Added OAuth hash check)")
else:
    print("⚠️ Could not find exact app.js block. The file might already be patched.")

# --- FIX 2: login.html ---
with open("login.html", "r", encoding="utf-8") as f:
    login_html = f.read()

# We will inject a new script block right before </body> that checks if the user is already logged in
redirect_script = """
    <!-- AUTO-REDIRECT IF ALREADY LOGGED IN -->
    <script>
        document.addEventListener('DOMContentLoaded', async () => {
            // Wait for Supabase client to be available
            const client = window.supabaseClient || (typeof supabase !== 'undefined' ? supabase : null);
            if (!client) return;
            
            const { data: { session } } = await client.auth.getSession();
            if (session) {
                // If a session exists, immediately send them to the dashboard
                window.location.href = 'overview.html';
            }
        });
    </script>
</body>"""

if "AUTO-REDIRECT IF ALREADY LOGGED IN" not in login_html:
    login_html = login_html.replace("</body>", redirect_script)
    with open("login.html", "w", encoding="utf-8") as f:
        f.write(login_html)
    print("✅ Patched login.html (Added auto-redirect if logged in)")
else:
    print("ℹ️ login.html already has the redirect logic.")
