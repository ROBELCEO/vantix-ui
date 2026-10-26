// --- TELEGRAM AUTH INTERCEPTOR ---
// This wraps the native fetch() function so that EVERY request 
// automatically includes the Telegram initData header.
const originalFetch = window.fetch;
window.fetch = async function() {
    let [resource, config] = arguments;
    
    // If we are inside Telegram, get the initData
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
