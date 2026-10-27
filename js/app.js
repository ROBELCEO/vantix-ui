// --- SUPABASE AUTH GATEKEEPER (BULLETPROOF) ---
const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kdnVzcXh2aGd5Zm9peW9va3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5Mzk3NzAsImV4cCI6MjEwODUxNTc3MH0.5LlYHzs4iHz7gQMCLLBCDT7deMveYpx-8fabCH5AljU"; 

// Initialize Supabase globally so other scripts can access it
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient; 

document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.pathname.includes('login.html')) return;

    // 1. Await the session carefully
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session) {
        console.warn("No active session found. Redirecting to login.");
        window.location.href = "login.html";
        return;
    }

    // 2. Override window.fetch to ALWAYS inject the latest token
    const originalFetch = window.fetch;
    window.fetch = async function() {
        let [resource, config] = arguments;
        config = config || {};
        config.headers = config.headers || {};
        
        // Fetch the freshest token possible
        const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
        
        if (currentSession?.access_token) {
            // Handle both Headers object and plain object
            if (config.headers instanceof Headers) {
                config.headers.set('Authorization', `Bearer ${currentSession.access_token}`);
            } else if (Array.isArray(config.headers)) {
                config.headers.push(['Authorization', `Bearer ${currentSession.access_token}`]);
            } else {
                config.headers['Authorization'] = `Bearer ${currentSession.access_token}`;
            }
        }
        
        return originalFetch(resource, config);
    };

    // 3. Trigger the connection status check once auth is ready
    if (typeof checkConnectionStatus === 'function') {
        checkConnectionStatus();
    }
});

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
