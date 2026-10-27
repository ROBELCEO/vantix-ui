async function checkConnectionStatus() {
    const unconnectedView = document.getElementById('view-unconnected');
    const connectedView = document.getElementById('view-connected');

    if (!unconnectedView || !connectedView) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        if (res.status === 401) return;

        const data = await res.json();
        
        if(data.connected) {
            unconnectedView.style.display = 'none';
            connectedView.style.display = 'block';
            document.getElementById('connected-domain').innerText = data.domain;
        } else {
            unconnectedView.style.display = 'block';
            connectedView.style.display = 'none';
        }
    } catch(e) {
        console.error("Status check failed", e);
        unconnectedView.style.display = 'block';
        connectedView.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check if connected
    checkConnectionStatus();

    // 2. Setup the direct link dynamically based on the input
    const link = document.getElementById('direct-connect-link');
    const input = document.getElementById('shopify-domain');
    const errorDiv = document.getElementById('connect-error');

    if (link && input) {
        // Function to update the href
        const updateLink = async () => {
            let domain = input.value.trim();
            if(!domain) {
                link.href = "#";
                return;
            }

            domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/$/, "");
            if(!domain.includes(".myshopify.com")) {
                domain = domain + ".myshopify.com";
            }

            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session) {
                link.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;
                errorDiv.style.display = 'none';
            } else {
                link.href = "login.html";
            }
        };

        // Update when typing
        input.addEventListener('input', updateLink);
        
        // Update on initial load
        updateLink();
    }
});
