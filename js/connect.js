async function checkConnectionStatus() {
    const unconnectedView = document.getElementById('view-unconnected');
    const connectedView = document.getElementById('view-connected');

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        
        if (!res.ok) {
            // If it fails (e.g. 401), show the unconnected view by default
            unconnectedView.style.display = 'block';
            connectedView.style.display = 'none';
            console.warn("Status check failed, defaulting to unconnected view.");
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
                    if(!domain) return alert("Please enter your Shopify domain.");
                    
                    domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/$/, "");
                    if(!domain.includes(".myshopify.com")) {
                        domain = domain + ".myshopify.com";
                    }

                    const { data: { session } } = await supabaseClient.auth.getSession();
                    if (!session) return alert("You are not logged in.");

                    window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;
                };
            }
        }
    } catch(e) {
        console.error("Status check failed", e);
        // Always show the unconnected view if the network request fails
        unconnectedView.style.display = 'block';
        connectedView.style.display = 'none';
    }
}
