import re

with open("login.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update the CSS for the Login Box and add Legal Text styles
css_addition = """
    /* POLARIS PRECISION AUTH CARD */
    .login-box {
        border-radius: 4px !important;
        border: 1px solid #D1D5DB !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.02) !important;
        padding: 40px 32px !important;
    }
    .login-box h1 {
        font-size: 24px !important;
        font-weight: 900 !important;
        letter-spacing: -0.5px !important;
        color: #09090B !important;
    }
    .login-box p {
        font-size: 13px !important;
        font-weight: 500 !important;
        color: #52525B !important;
        margin-bottom: 24px !important;
    }
    .google-btn {
        border-radius: 4px !important;
        border: 1px solid #D1D5DB !important;
        font-weight: 700 !important;
        color: #09090B !important;
        transition: all 0.2s !important;
    }
    .google-btn:hover {
        background: #F3F4F6 !important;
        border-color: #9CA3AF !important;
    }
    .legal-text {
        margin-top: 24px;
        text-align: center;
        font-size: 11px;
        color: #71717A;
        line-height: 1.6;
        font-weight: 500;
    }
    .legal-text a {
        color: #09090B;
        font-weight: 800;
        text-decoration: none;
        transition: color 0.2s;
    }
    .legal-text a:hover {
        color: #0284C7;
        text-decoration: underline;
    }
"""

# Inject CSS before </style>
html = html.replace("</style>", css_addition + "\n</style>")

# 2. Inject the Legal Text HTML below the error message
legal_html = """
            <div class="legal-text">
                By signing up, you agree to our<br>
                <a href="terms.html" target="_blank">Terms of Service</a> and <a href="privacy.html" target="_blank">Privacy Policy</a>.
            </div>
"""

# Find the error-msg div and insert the legal text right after it
if '<div id="error-msg" class="error-msg"></div>' in html:
    html = html.replace(
        '<div id="error-msg" class="error-msg"></div>',
        '<div id="error-msg" class="error-msg"></div>\n' + legal_html
    )
    print("✅ Legal text injected below the login button.")
else:
    print("⚠️ Could not find the error-msg div.")

with open("login.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ Login page CSS and HTML updated.")
