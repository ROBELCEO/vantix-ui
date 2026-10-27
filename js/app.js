const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Intercept ALL fetch requests to attach the Google JWT
const originalFetch = window.fetch;
window.fetch = async function() {
    let [resource, config] = arguments;
    config = config || {};
    config.headers = config.headers || {};
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return originalFetch(resource, config);
};

// 2. Global Auth Check on Page Load
window.addEventListener('load', async () => {
    if (window.location.pathname.includes('login.html')) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    // If no session, redirect to login
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    // If session exists, update the header UI
    const emailEl = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    if (emailEl) emailEl.innerText = session.user.email;
    if (logoutBtn) logoutBtn.style.display = 'block';

    // Auto-link Telegram if opened inside the WebApp
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
        window.Telegram.WebApp.expand();
        try {
            await fetch('https://vantix-my5f.onrender.com/api/telegram/link-telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initData: window.Telegram.WebApp.initData })
            });
        } catch(e) { console.error("Telegram link failed", e); }
    }

    // Trigger page-specific functions (if they exist on this page)
    if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
    if (typeof fetchCompetitors === 'function') fetchCompetitors();
    if (typeof loadStoreData === 'function') loadStoreData();
});

// 3. Global Logout Function
async function logOut() {
    await window.supabaseClient.auth.signOut();
    window.location.href = "login.html";
}

function toggleMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if(drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
    }
}
