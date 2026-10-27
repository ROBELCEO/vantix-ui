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



document.addEventListener('DOMContentLoaded', () => {
    const briefingBtn = document.getElementById('briefing-btn');
    if (briefingBtn) {
        briefingBtn.addEventListener('click', async () => {
            const statusDiv = document.getElementById('briefing-status');
            briefingBtn.innerText = "Generating AI Briefing...";
            briefingBtn.disabled = true;
            statusDiv.innerText = "Asking Groq AI to analyze your store...";

            try {
                // 1. Get the user's Telegram Chat ID from the DB
                // Wait, the backend needs to know WHO to send it to. 
                // For the MVP, let's pass the chat_id that we linked earlier.
                const res = await fetch('https://vantix-my5f.onrender.com/api/telegram/send-briefing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: "5993737811" }) // Use your actual Chat ID here
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    briefingBtn.innerText = "✅ Briefing Sent!";
                    statusDiv.innerText = "Check your Telegram app!";
                    statusDiv.style.color = "var(--green)";
                } else {
                    throw new Error(data.detail || "Failed");
                }
            } catch (e) {
                briefingBtn.innerText = "☀️ Send Test Daily Briefing to Telegram";
                briefingBtn.disabled = false;
                statusDiv.innerText = "Error: " + e.message;
                statusDiv.style.color = "var(--red)";
            }
        });
    }
});
