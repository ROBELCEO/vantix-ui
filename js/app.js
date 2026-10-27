const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 1. Synchronous Fetch Interceptor (NO getSession inside fetch!)
const originalFetch = window.fetch;
window.fetch = function(resource, config) {
    config = config || {};
    config.headers = config.headers || {};
    
    // Only add token if talking to our Render backend
    if (window.currentSession && window.currentSession.access_token) {
        if (typeof resource === 'string' && resource.includes('vantix-my5f.onrender.com')) {
            config.headers['Authorization'] = `Bearer ${window.currentSession.access_token}`;
        }
    }
    return originalFetch(resource, config);
};

// 2. Global Auth Check
window.addEventListener('load', async () => {
    if (window.location.pathname.includes('login.html')) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    if (!session) {
        console.log("No session. Redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    // Store session globally for the fetch interceptor
    window.currentSession = session;

    const emailEl = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    if (emailEl) emailEl.innerText = session.user.email;
    if (logoutBtn) logoutBtn.style.display = 'block';

    // Small delay to ensure DOM and page scripts are ready
    setTimeout(() => {
        if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
        if (typeof fetchCompetitors === 'function') fetchCompetitors();
        if (typeof loadInventory === 'function') loadInventory();
        if (typeof loadStoreData === 'function') { loadStoreData(); } else { alert('DEBUG: loadStoreData function is MISSING!'); }
        if (typeof loadOverview === 'function') { loadOverview(); } else { alert('DEBUG: loadOverview function is MISSING!'); }
    }, 100);
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

