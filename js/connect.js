async function checkConnectionStatus() {
    const unconnectedView = document.getElementById('view-unconnected');
    const connectedView = document.getElementById('view-connected');
    const errorDiv = document.getElementById('connect-error');

    if (!unconnectedView || !connectedView) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        
        if (res.status === 401) {
            // Token invalid or missing, app.js should handle redirect to login
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
            
            const btn = document.getElementById('connect-btn');
            if (btn) {
                btn.onclick = async () => {
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

                    const { data: { session } } = await supabaseClient.auth.getSession();
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
        }
    } catch(e) {
        console.error("Status check failed", e);
        unconnectedView.style.display = 'block';
        connectedView.style.display = 'none';
    }
}
