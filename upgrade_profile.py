import glob
import re

# 1. Update the HTML for all pages
pages = glob.glob("*.html")
for page in pages:
    if page in ["terms.html", "privacy.html", "login.html", "logo-preview.html"]: continue
    
    with open(page, "r", encoding="utf-8") as f:
        html = f.read()
        
    # Find the old bottom sidebar div
    old_div = r'<div style="display: flex; align-items: center; gap: 12px;">\s*<div id="user-email"[^>]*>loading...</div>\s*<button[^>]*id="logout-btn"[^>]*>Log Out</button>\s*<button class="mobile-menu-btn"[^>]*>☰</button>\s*</div>'
    
    # Our new professional profile widget
    new_div = '''<div class="nav-profile-container">
        <div class="nav-profile-header">
            <img id="nav-avatar" src="https://ui-avatars.com/api/?name=V&background=27272A&color=FFF" alt="Profile">
            <div class="nav-profile-text">
                <span id="nav-user-name">Merchant</span>
                <span id="user-email">loading...</span>
            </div>
        </div>
        <button onclick="logOut()" id="logout-btn" class="nav-logout-btn" style="display: none;">Log Out</button>
        <button class="mobile-menu-btn" onclick="toggleMenu()">☰</button>
    </div>'''
    
    # Replace it
    if re.search(old_div, html):
        html = re.sub(old_div, new_div, html)
        with open(page, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"✅ Updated profile section in {page}")

# 2. Update app.js to fetch the Google Name and Avatar
with open("js/app.js", "r", encoding="utf-8") as f:
    js = f.read()

# Find where the email is set
old_email_js = 'document.getElementById("user-email").innerText = user.email;'
if old_email_js not in js:
    old_email_js = "document.getElementById('user-email').innerText = user.email;"

new_profile_js = """
    const emailEl = document.getElementById("user-email");
    if (emailEl) emailEl.innerText = user.email;
    
    // --- NEW PROFILE LOGIC ---
    const nameEl = document.getElementById("nav-user-name");
    if (nameEl) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "Merchant";
        // Show only the first name to keep it clean
        nameEl.innerText = fullName.split(" ")[0];
    }
    
    const avatarEl = document.getElementById("nav-avatar");
    if (avatarEl && user.user_metadata?.avatar_url) {
        avatarEl.src = user.user_metadata.avatar_url;
    }
"""

if old_email_js in js:
    js = js.replace(old_email_js, new_profile_js)
    with open("js/app.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("✅ Updated app.js to populate Name and Avatar.")

# 3. Add the CSS to masterpiece.css
with open("css/masterpiece.css", "r", encoding="utf-8") as f:
    css = f.read()

css_addition = """

/* ==========================================
   PROFESSIONAL SIDEBAR PROFILE
   ========================================== */

.nav-profile-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    margin-top: auto;
}

.nav-profile-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    border-radius: 8px;
    transition: background 0.2s;
    cursor: pointer;
}

.nav-profile-header:hover {
    background: #18181B;
}

.nav-profile-header img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #27272A;
    object-fit: cover;
}

.nav-profile-text {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.nav-profile-text span:first-child {
    font-size: 13px;
    font-weight: 700;
    color: #FFFFFF;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.nav-profile-text span:last-child {
    font-size: 11px;
    color: #A1A1AA;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.nav-logout-btn {
    background: transparent;
    border: 1px solid #27272A;
    color: #A1A1AA;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
}

.nav-logout-btn:hover {
    background: #18181B;
    color: #FFFFFF;
    border-color: #3F3F46;
}
"""
if "PROFESSIONAL SIDEBAR PROFILE" not in css:
    css += css_addition
    with open("css/masterpiece.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("✅ Added profile CSS to masterpiece.css.")

