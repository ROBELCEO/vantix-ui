// --- SUPABASE AUTH GATEKEEPER ---
// Replace these with your actual Supabase keys
const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE"; 

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    // If we are on the login page, do not redirect
    if (window.location.pathname.includes('login.html')) return;

    // Check if user is logged in
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    // If NOT logged in, redirect to login.html
    if (!session) {
        window.location.href = "login.html";
        return;
    }

    // If logged in, attach JWT to all fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function() {
        let [resource, config] = arguments;
        config = config || {};
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
        return originalFetch(resource, config);
    };
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
