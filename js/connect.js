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
    const btn = document.getElementById('connect-btn');
    if (btn) {
        btn.onclick = async () => {
            try {
                alert("1. Button clicked! Checking domain...");
                
                const errorDiv = document.getElementById('connect-error');
                let domain = document.getElementById('shopify-domain').value.trim();
                
                if(!domain) {
                    errorDiv.style.display = 'block';
                    errorDiv.innerText = "Please enter your Shopify domain.";
                    alert("Error: Domain input is empty.");
                    return;
                }
                
                domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/$/, "");
                if(!domain.includes(".myshopify.com")) {
                    domain = domain + ".myshopify.com";
                }
                
                alert("2. Domain cleaned: " + domain + "\nChecking Supabase session...");

                if (!window.supabaseClient) {
                    alert("Error: Supabase client not found. Did app.js load?");
                    return;
                }

                const { data: { session } } = await window.supabaseClient.auth.getSession();
                if (!session) {
                    alert("Error: No Google session found. Redirecting to login.");
                    return window.location.href = "login.html";
                }

                alert("3. Session found! Redirecting to backend OAuth...");

                errorDiv.style.display = 'none';
                btn.innerText = "Redirecting to Shopify...";
                btn.disabled = true;

                // Add ?v=3 to bypass any weird caching
                window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}&v=3`;
                
            } catch (err) {
                alert("CRITICAL JAVASCRIPT ERROR: " + err.message);
                console.error(err);
            }
        };
    } else {
        console.error("Could not find the Connect button in the DOM.");
    }
});
