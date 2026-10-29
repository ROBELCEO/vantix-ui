const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Synchronous Fetch Interceptor
const originalFetch = window.fetch;
window.fetch = function(resource, config) {
    config = config || {};
    config.headers = config.headers || {};
    if (window.currentSession && window.currentSession.access_token) {
        if (typeof resource === 'string' && resource.includes('vantix-my5f.onrender.com')) {
            config.headers['Authorization'] = `Bearer ${window.currentSession.access_token}`;
        }
    }
    return originalFetch(resource, config);
};

// Global Auth Check
window.addEventListener('load', async () => {
    if (window.location.pathname.includes('login.html')) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    window.currentSession = session;

    const emailEl = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    if (emailEl) emailEl.innerText = session.user.email;
    if (logoutBtn) logoutBtn.style.display = 'block';

    // SPA mode: only load the current view
    if (document.getElementById('view-root') && typeof window.routerInit === 'function') {
        window.routerInit();
        return;
    }

    // Legacy multi-page fallback
    setTimeout(() => {
        if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
        if (typeof fetchCompetitors === 'function') fetchCompetitors();
        if (typeof loadCompetitorIntel === 'function') loadCompetitorIntel();
        if (typeof loadCatalogGaps === 'function') loadCatalogGaps();
        if (typeof loadInventory === 'function') loadInventory();
        if (typeof loadStoreData === 'function') loadStoreData();
        if (typeof loadOverview === 'function') loadOverview();
        if (typeof loadTerminal === 'function') loadTerminal();
        if (typeof loadAlerts === 'function') loadAlerts();
        if (typeof checkSubscription === 'function') checkSubscription();
        if (typeof loadProfile === 'function') loadProfile();
        if (typeof fetchProducts === 'function') fetchProducts();
        if (typeof loadDiscovery === 'function') loadDiscovery();
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






