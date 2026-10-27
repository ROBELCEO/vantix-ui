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
            
            // Load saved settings from Database
            try {
                const settingsRes = await fetch('https://vantix-my5f.onrender.com/api/store/settings');
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    document.getElementById('profit-goal').value = settings.profit_goal || '';
                    document.getElementById('shipping-cost').value = settings.avg_shipping_cost || '';
                    document.getElementById('gateway-fee').value = settings.gateway_fee || '';
                }
            } catch(e) { console.error("Failed to load settings", e); }
            
            checkTelegramStatus();
            
        } else {
            unconnectedView.style.display = 'block';
            connectedView.style.display = 'none';
        }
    } catch(e) {
        console.error("Status check failed", e);
    }
}

function saveSettings() {
    // In Phase 2, this will save to Supabase. For now, we use localStorage.
    localStorage.setItem('vantix_profit_goal', document.getElementById('profit-goal').value);
    localStorage.setItem('vantix_shipping', document.getElementById('shipping-cost').value);
    localStorage.setItem('vantix_gateway', document.getElementById('gateway-fee').value);
}

// Telegram Logic (Same as before)
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
            
            if (!document.getElementById('test-briefing-btn')) {
                const testBtn = document.createElement('button');
                testBtn.id = 'test-briefing-btn';
                testBtn.className = 'btn btn-primary';
                testBtn.style = 'width: 100%; padding: 12px; margin-top: 12px; font-size: 13px; background: var(--violet); color: white; border: none;';
                testBtn.innerText = '☀️ Send Test Briefing Now';
                testBtn.onclick = sendTestBriefing;
                btn.parentNode.appendChild(testBtn);
            }
        } else {
            btn.innerText = "Activate Telegram Alerts →";
            btn.className = "btn btn-primary";
            btn.disabled = false;
            
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session) {
                btn.onclick = () => {
                    window.open(`https://t.me/VANTIXSHOPIFYV1BOT?start=${session.user.id}`, '_blank');
                    statusText.innerHTML = "Waiting for Telegram confirmation... <br><span style='font-size:10px;'>Click 'START' in the Telegram app.</span>";
                    setTimeout(checkTelegramStatus, 5000); 
                };
            }
        }
    } catch(e) {
        console.error("Telegram status error", e);
    }
}

async function sendTestBriefing() {
    const testBtn = document.getElementById('test-briefing-btn');
    testBtn.innerText = "Generating AI Briefing...";
    testBtn.disabled = true;
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/telegram/send-briefing', { method: 'POST' });
        if (res.ok) {
            testBtn.innerText = "✅ Briefing Sent! Check Telegram.";
            setTimeout(() => {
                testBtn.innerText = "☀️ Send Test Briefing Now";
                testBtn.disabled = false;
            }, 3000);
        }
    } catch (e) {
        testBtn.innerText = "Error sending. Try again.";
        testBtn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
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
});

async function matchCompetitor(domain) {
    try {
        // Change button state
        const btn = event.target;
        btn.innerText = "Scraping...";
        btn.disabled = true;

        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${domain}`);
        const data = await res.json();
        
        if (res.ok) {
            btn.innerText = "✅ Matched!";
            btn.style.color = "var(--green)";
            btn.style.borderColor = "var(--green)";
        } else {
            btn.innerText = "Failed";
            btn.style.color = "var(--red)";
            btn.disabled = false;
        }
    } catch (e) {
        console.error(e);
        event.target.innerText = "Error";
        event.target.disabled = false;
    }
}
