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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('direct-connect-link');
    const input = document.getElementById('shopify-domain');

    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 

            try {
                let domain = input.value.trim();
                if(!domain) {
                    alert("⚠️ Please enter your Shopify domain first.");
                    return;
                }
                
                domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/$/, "");
                if(!domain.includes(".myshopify.com")) {
                    domain = domain + ".myshopify.com";
                }

                // Read from the global session securely (no localStorage, no deadlock)
                if (!currentSession || !currentSession.access_token) {
                    alert("⚠️ No login session found. Please log in again.");
                    window.location.href = "login.html";
                    return;
                }

                btn.innerText = "Redirecting to Shopify...";
                
                // Direct Redirect using the secure token
                window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${currentSession.access_token}`;

            } catch (err) {
                alert("❌ Error: " + err.message);
                btn.innerText = "Connect Shopify Store";
            }
        });
    }
});

