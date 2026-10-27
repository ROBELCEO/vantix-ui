const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Store the session globally so we don't need to fetch it repeatedly
let currentSession = null;

// Listen for auth changes securely
window.supabaseClient.auth.onAuthStateChange((event, session) => {
    currentSession = session;
});

// Fetch Interceptor (ONLY intercepts our Render backend, avoiding the deadlock)
const originalFetch = window.fetch;
window.fetch = async function(resource, config) {
    config = config || {};
    config.headers = config.headers || {};
    
    // Only add the token if we are talking to our Vantix backend
    if (typeof resource === 'string' && resource.includes('vantix-my5f.onrender.com')) {
        if (currentSession?.access_token) {
            config.headers['Authorization'] = `Bearer ${currentSession.access_token}`;
        }
    }
    return originalFetch(resource, config);
};

window.addEventListener('load', async () => {
    if (window.location.pathname.includes('login.html')) return;

    // Fetch the initial session ONCE on load
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    currentSession = session;

    if (!session) {
        console.log("No session. Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    // Update UI with user email
    const emailEl = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    if (emailEl) emailEl.innerText = session.user.email;
    if (logoutBtn) logoutBtn.style.display = 'block';

    // Trigger page specific logic
    if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
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
