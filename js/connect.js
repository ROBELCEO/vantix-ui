async function checkConnectionStatus() {
    const unconnectedView = document.getElementById('view-unconnected');
    const connectedView = document.getElementById('view-connected');

    if (!unconnectedView || !connectedView) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        
        // If not logged in, app.js handles the redirect
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
        // Always show the form if the network fails
        unconnectedView.style.display = 'block';
        connectedView.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('connect-btn');
    if (btn) {
        btn.onclick = async () => {
            const errorDiv = document.getElementById('connect-error');
            let domain = document.getElementById('shopify-domain').value.trim();
            
            if(!domain) {
                errorDiv.style.display = 'block';
                errorDiv.innerText = "Please enter your Shopify domain.";
                return;
            }
            
            domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/$/, "");
            if(!domain.includes(".myshopify.com")) {
                domain = domain + ".myshopify.com";
            }

            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (!session) {
                window.location.href = "login.html";
                return;
            }

            errorDiv.style.display = 'none';
            btn.innerText = "Redirecting to Shopify...";
            btn.disabled = true;

            // Redirect to backend OAuth flow
            window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;
        };
    }
});
