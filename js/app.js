const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient; 

// IMMEDIATELY override fetch so no page can miss the token
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
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    // Trigger page-specific fetches now that auth is 100% ready
    if (typeof checkConnectionStatus === 'function') checkConnectionStatus();
    if (typeof fetchCompetitors === 'function') fetchCompetitors();
    if (typeof loadInventory === 'function') loadInventory();
    if (typeof loadTerminal === 'function') loadTerminal();
});

function toggleMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if(drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
    }
}
