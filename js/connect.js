async function checkConnectionStatus() {
    try {
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
            
            // Attach click listener to the connect button
            const btn = document.getElementById('connect-btn');
            if (btn) {
                btn.onclick = async () => {
                    let domain = document.getElementById('shopify-domain').value.trim();
                    if(!domain) return alert("Please enter your Shopify domain.");
                    
                    // Clean the domain
                    domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").strip("/");
                    if(!domain.includes(".myshopify.com")) {
                        domain = domain + ".myshopify.com";
                    }

                    const { data: { session } } = await supabaseClient.auth.getSession();
                    if (!session) return alert("You are not logged in.");

                    // Redirect to Shopify OAuth with the user's token
                    window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;
                };
            }
        }
    } catch(e) {
        console.error("Status check failed", e);
        document.getElementById('view-unconnected').style.display = 'block';
    }
}

checkConnectionStatus();
