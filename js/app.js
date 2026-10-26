// --- TELEGRAM SECURITY GATEKEEPER ---
// If we are not inside Telegram, hide the app and show a lock screen.
document.addEventListener("DOMContentLoaded", () => {
    if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.initData) {
        document.body.innerHTML = `
            <div style="display:flex; justify-content:center; align-items:center; height:100vh; background:#000; color:#fff; text-align:center; font-family:'Inter',sans-serif;">
                <div style="padding: 40px; border: 1px solid #262626; border-radius: 8px; background: #0A0A0A;">
                    <h1 style="font-size: 24px; font-weight: 900; margin-bottom: 12px;">🔒 Access Restricted</h1>
                    <p style="color: #8b949e; font-size: 14px; margin-bottom: 24px; max-width: 300px;">
                        This application is a secure Mini App. Please open it directly through the Vantix Telegram Bot.
                    </p>
                    <a href="https://t.me/VANTIXSHOPIFYV1BOT" style="display: inline-block; background: #00E5FF; color: #000; padding: 12px 24px; text-decoration: none; font-weight: 800; border-radius: 6px;">
                        Open Telegram Bot →
                    </a>
                </div>
            </div>
        `;
        return; // Stop executing the rest of the script
    }

    // If we ARE inside Telegram, expand the app to full screen
    window.Telegram.WebApp.expand();
});

// --- TELEGRAM AUTH INTERCEPTOR ---
// This wraps the native fetch() function so that EVERY request 
// automatically includes the Telegram initData header.
const originalFetch = window.fetch;
window.fetch = async function() {
    let [resource, config] = arguments;
    
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
        config = config || {};
        config.headers = config.headers || {};
        config.headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData;
    }
    
    return originalFetch(resource, config);
};

function toggleMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if(drawer && overlay) {
        if(drawer.classList.contains('open')){
            drawer.classList.remove('open');
            overlay.style.display = 'none';
        } else {
            drawer.classList.add('open');
            overlay.style.display = 'block';
        }
    }
}
