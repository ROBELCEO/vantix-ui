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
        // Force a click event instead of using href="#" which causes the "frozen" feeling
        btn.addEventListener('click', async (e) => {
            e.preventDefault(); // Stop the page from jumping to the top

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

                // Check if Supabase is loaded
                if (!window.supabaseClient) {
                    alert("❌ Critical Error: Supabase client is not defined. Did app.js load?");
                    return;
                }

                btn.innerText = "Checking session...";
                
                const { data: { session } } = await window.supabaseClient.auth.getSession();
                
                if (!session) {
                    alert("⚠️ You are not logged in. Redirecting to login page.");
                    window.location.href = "login.html";
                    return;
                }

                btn.innerText = "Redirecting to Shopify...";
                
                // Direct Redirect
                window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;

            } catch (err) {
                alert("❌ JavaScript Error: " + err.message);
            }
        });
    }
});
