async function checkConnectionStatus() {
    try {
        // The fetch interceptor in app.js automatically adds the Authorization header
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        
        if (!res.ok) throw new Error("Auth failed");
        
        const data = await res.json();
        
        const unconnectedView = document.getElementById('view-unconnected');
        const connectedView = document.getElementById('view-connected');
        
        if(data.connected) {
            unconnectedView.style.display = 'none';
            connectedView.style.display = 'block';
            document.getElementById('connected-domain').innerText = data.domain;
        } else {
            unconnectedView.style.display = 'block';
            connectedView.style.display = 'none';
            
            // Attach the session token to the Connect button
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session) {
                const connectBtn = document.querySelector('a[href*="/api/shopify/install"]');
                if (connectBtn) {
                    // Update the href to include the user's token
                    connectBtn.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=trendywear-dev.myshopify.com&token=${session.access_token}`;
                }
            }
        }
    } catch(e) {
        console.error("Status check failed", e);
        document.getElementById('view-unconnected').style.display = 'block';
    }
}

checkConnectionStatus();
