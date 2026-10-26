// --- SUPABASE AUTH GATEKEEPER ---
const SUPABASE_URL = "https://odvusqxvhgyfoiyooktl.supabase.co";
const SUPABASE_ANON_KEY = "PASTE_YOUR_SUPABASE_ANON_KEY_HERE"; 

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", async () => {
    if (window.location.pathname.includes('login.html')) return;

    const { data: { session } } = await supabaseClient.auth.getSession();
    
    if (!session) {
        window.location.href = "login.html";
        return;
    }

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
