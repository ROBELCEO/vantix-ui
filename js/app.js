const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

// Initialize Supabase
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch Interceptor
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

// Global Auth Check
window.addEventListener('load', async () => {
    if (window.location.pathname.includes('login.html')) return;

    try {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        
        if (!session) {
            console.log("No session. Redirecting to login...");
            window.location.href = "login.html";
            return;
        }

        const emailEl = document.getElementById('user-email');
        const logoutBtn = document.getElementById('logout-btn');
        if (emailEl) emailEl.innerText = session.user.email;
        if (logoutBtn) logoutBtn.style.display = 'block';

        // Trigger page specific logic
        if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
        
    } catch(e) {
        console.error("Auth check failed:", e);
    }
});

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
