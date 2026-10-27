const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient; 

// Global Auth Check & Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = async function() {
    let [resource, config] = arguments;
    config = config || {};
    config.headers = config.headers || {};
    
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.access_token) {
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return originalFetch(resource, config);
};

document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.pathname.includes('login.html')) return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    
    // If NO SESSION -> FORCE REDIRECT TO GOOGLE LOGIN
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    // If session exists, show the user's email in the header
    const emailDisplay = document.getElementById('user-email-display');
    const logoutBtn = document.getElementById('logout-btn');
    if (emailDisplay && logoutBtn) {
        emailDisplay.innerText = session.user.email;
        emailDisplay.style.display = 'block';
        logoutBtn.style.display = 'block';
    }

    // Telegram Auto-Linking (if inside Telegram)
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

    // Trigger page-specific fetches
    if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
    if (typeof fetchCompetitors === 'function') fetchCompetitors();
    if (typeof loadInventory === 'function') loadInventory();
});

async function logOut() {
    await supabaseClient.auth.signOut();
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
