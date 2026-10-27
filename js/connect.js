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
    // 1. Setup Connect Link
    const link = document.getElementById('direct-connect-link');
    const input = document.getElementById('shopify-domain');
    const errorDiv = document.getElementById('connect-error');

    if (link && input) {
        const updateLink = async () => {
            let domain = input.value.trim();
            if(!domain) {
                link.href = "#";
                return;
            }
            domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/$/, "");
            if(!domain.includes(".myshopify.com")) {
                domain = domain + ".myshopify.com";
            }

            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session) {
                link.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;
                errorDiv.style.display = 'none';
            } else {
                link.href = "login.html";
            }
        };
        input.addEventListener('input', updateLink);
        updateLink();
    }

    // 2. Setup Briefing Button
    const briefingBtn = document.getElementById('briefing-btn');
    if (briefingBtn) {
        briefingBtn.addEventListener('click', async () => {
            const statusDiv = document.getElementById('briefing-status');
            briefingBtn.innerText = "Generating AI Briefing...";
            briefingBtn.disabled = true;
            statusDiv.style.color = "var(--text-tertiary)";
            statusDiv.innerText = "Asking Groq AI to analyze your store...";

            try {
                const res = await fetch('https://vantix-my5f.onrender.com/api/telegram/send-briefing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    briefingBtn.innerText = "✅ Briefing Sent!";
                    statusDiv.innerText = "Check your Telegram app!";
                    statusDiv.style.color = "var(--green)";
                } else {
                    throw new Error(data.detail || data.error || "Failed");
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
