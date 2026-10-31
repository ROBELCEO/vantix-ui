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







// Stable DOM patch — no write if identical
window.vxPatch = function (elOrId, html) {
    const el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
    if (!el) return false;
    if (el.__vxLast === html) return false;
    el.__vxLast = html;
    el.innerHTML = html;
    return true;
};


// SPA Paywall Observer (Bulletproof)
const dscObserver = new MutationObserver(() => {
    const dscWrap = document.querySelector('.dsc-wrap');
    if (dscWrap && !window.dscPaywallApplied) {
        window.dscPaywallApplied = true;
        
        fetch('https://vantix-my5f.onrender.com/api/auth/status')
            .then(r => r.json())
            .then(d => {
                if (d.plan === 'starter') {
                    const overlay = document.createElement('div');
                    overlay.id = 'dsc-paywall-overlay';
                    overlay.style.cssText = "position: fixed; top: 56px; left: 0; right: 0; bottom: 0; z-index: 9999; backdrop-filter: blur(8px); background: rgba(248, 250, 252, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center;";
                    overlay.innerHTML = `
                        <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
                        <div style="font-weight: 900; font-size: 24px; color: #09090B; margin-bottom: 8px;">Unlock Global Discovery</div>
                        <div style="font-size: 15px; color: #52525B; max-width: 400px; text-align: center; margin-bottom: 24px; line-height: 1.5;">Instantly search 1,000,000+ winning products across the global Shopify catalog and push them to your store in 1-click.</div>
                        <a href="membership.html" style="background: #0284C7; color: #FFF; padding: 12px 24px; border-radius: 2px; text-decoration: none; font-size: 14px; font-weight: 800;">Upgrade to Pro →</a>
                    `;
                    document.body.appendChild(overlay);
                }
            });
    } else if (!dscWrap && window.dscPaywallApplied) {
        // Cleanup when navigating away from Discovery
        window.dscPaywallApplied = false;
        const overlay = document.getElementById('dsc-paywall-overlay');
        if (overlay) overlay.remove();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const viewRoot = document.getElementById('view-root');
    if (viewRoot) {
        dscObserver.observe(viewRoot, { childList: true, subtree: true });
    }
});
