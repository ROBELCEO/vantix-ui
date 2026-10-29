const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU";

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- BULLETPROOF ASYNC FETCH INTERCEPTOR ---
const originalFetch = window.fetch;
window.fetch = async function(resource, config) {
    config = config || {};
    
    if (typeof resource === 'string' && resource.includes('vantix-my5f.onrender.com')) {
        try {
            // Always get the absolute freshest session before sending the request
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            
            if (session && session.access_token) {
                // Convert existing headers to a Headers object to guarantee it attaches
                const headers = new Headers(config.headers || {});
                headers.set('Authorization', `Bearer ${session.access_token}`);
                config.headers = headers;
            }
        } catch (e) {
            console.error("Fetch Interceptor Auth Error:", e);
        }
    }
    
    return originalFetch(resource, config);
};

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

    // Delay page loaders slightly so everything is ready
    setTimeout(() => {
        if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
        if (typeof fetchCompetitors === 'function') fetchCompetitors();
        if (typeof loadCompetitorIntel === 'function') loadCompetitorIntel();
        if (typeof loadCatalogGaps === 'function') loadCatalogGaps();
        if (typeof loadBestSellers === 'function') loadBestSellers();
        if (typeof loadInventory === 'function') loadInventory();
        if (typeof loadStoreData === 'function') loadStoreData();
        if (typeof loadOverview === 'function') loadOverview();
        if (typeof loadTerminal === 'function') loadTerminal();
        if (typeof loadAlerts === 'function') loadAlerts();
        if (typeof checkSubscription === 'function') checkSubscription();
        if (typeof loadProfile === 'function') loadProfile();
        if (typeof fetchProducts === 'function') fetchProducts();
        if (typeof loadDiscovery === 'function') loadDiscovery();
    }, 200);
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

window.vxPatch = function (elOrId, html) {
    const el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
    if (!el) return false;
    if (el.__vxLast === html) return false;
    el.__vxLast = html;
    el.innerHTML = html;
    return true;
};
