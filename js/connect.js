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

// Telegram Activation Logic
async function checkTelegramStatus() {
    const btn = document.getElementById('telegram-btn');
    const statusText = document.getElementById('telegram-status-text');
    if(!btn) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/telegram/status');
        if (!res.ok) return;
        
        const data = await res.json();
        
        if (data.linked) {
            btn.innerText = "✅ Telegram Connected";
            btn.className = "btn btn-secondary";
            btn.disabled = true;
            btn.style.borderColor = "var(--green)";
            btn.style.color = "var(--green)";
            statusText.innerHTML = "Your account is linked. You will receive daily briefings at 8:00 AM.";
        } else {
            btn.innerText = "Activate Telegram Alerts →";
            btn.className = "btn btn-primary";
            btn.disabled = false;
            
            // Generate deep link with user ID
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session) {
                // Deep link format: https://t.me/BOT_USERNAME?start=USER_ID
                btn.onclick = () => {
                    window.open(`https://t.me/VANTIXSHOPIFYV1BOT?start=${session.user.id}`, '_blank');
                    statusText.innerHTML = "Waiting for Telegram confirmation... <br><span style='font-size:10px;'>Click 'START' in the Telegram app.</span>";
                };
            }
        }
    } catch(e) {
        console.error("Telegram status error", e);
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only run if on the connect page and store is connected
    if (document.getElementById('telegram-btn')) {
        setTimeout(checkTelegramStatus, 1000); // Wait for app.js to load session
    }
});
