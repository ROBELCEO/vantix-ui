async function checkConnectionStatus() {
    const unconnectedView = document.getElementById('view-unconnected');
    const connectedView = document.getElementById('view-connected');
    const errorDiv = document.getElementById('connect-error');

    if (!unconnectedView || !connectedView) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        
        if (res.status === 401) {
            // If the token is rejected, forcefully send them to login
            console.warn("Unauthorized. Redirecting to login...");
            window.location.href = "login.html";
            return;
        }

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
        // Fallback: Always show the unconnected UI if the network fails
        unconnectedView.style.display = 'block';
        connectedView.style.display = 'none';
    }
}

// Setup the Connect Button Logic globally
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

            window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;
        };
    }
});
