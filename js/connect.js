function cnxEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[s]));
}

async function checkConnectionStatus() {
    const unconnectedView = document.getElementById('view-unconnected');
    const connectedView = document.getElementById('view-connected');
    const statusEl = document.getElementById('cnx-status');

    if (!unconnectedView || !connectedView) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        if (res.status === 401) {
            if (statusEl) statusEl.innerText = "Unauthorized";
            return;
        }

        const data = await res.json();
        
        if (data.connected) {
            unconnectedView.style.display = 'none';
            connectedView.style.display = 'block';
            if (statusEl) statusEl.innerText = "Connected";
            document.getElementById('connected-domain').innerText = data.domain;
            
            // Load saved settings
            try {
                const settingsRes = await fetch('https://vantix-my5f.onrender.com/api/store/settings');
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    document.getElementById('profit-goal').value = settings.profit_goal || '';
                    document.getElementById('shipping-cost').value = settings.avg_shipping_cost || '';
                    document.getElementById('gateway-fee').value = settings.gateway_fee || '';
                }
            } catch(e) { console.error("Settings load error", e); }
            
            discoverRealCompetitors();
            checkTelegramStatus();
            
        } else {
            unconnectedView.style.display = 'block';
            connectedView.style.display = 'none';
            if (statusEl) statusEl.innerText = "Not Connected";
        }
    } catch(e) {
        console.error("Status check failed", e);
        unconnectedView.style.display = 'block';
        connectedView.style.display = 'none';
        if (statusEl) statusEl.innerText = "Offline";
    }
}

async function saveSettings() {
    const goal = parseFloat(document.getElementById('profit-goal').value) || 0;
    const shipping = parseFloat(document.getElementById('shipping-cost').value) || 0;
    const gateway = parseFloat(document.getElementById('gateway-fee').value) || 0;
    const btn = document.getElementById('save-settings-btn');
    const status = document.getElementById('settings-status');

    btn.innerText = "Saving...";
    btn.disabled = true;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profit_goal: goal, avg_shipping_cost: shipping, gateway_fee: gateway })
        });
        
        if (res.ok) {
            status.style.display = 'block';
            setTimeout(() => status.style.display = 'none', 3000);
        } else {
            throw new Error("Failed to save");
        }
    } catch(e) { 
        alert("Error saving settings. Check your connection.");
    } finally {
        btn.innerText = "Save Profit Settings";
        btn.disabled = false;
    }
}

async function discoverRealCompetitors() {
    const container = document.getElementById('suggested-competitors-container');
    if (!container) return;
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/discover');
        const data = await res.json();
        
        if (data.suggested_competitors && data.suggested_competitors.length > 0) {
            container.innerHTML = data.suggested_competitors.map(domain => `
                <div class="cnx-product-row">
                    <div class="cnx-product-title">${cnxEsc(domain)}</div>
                    <button class="cnx-btn-small" onclick="matchCompetitor('${cnxEsc(domain)}', this)">+ Match</button>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div class="cnx-empty">No competitors found. Try adding manually on the Competitors page.</div>';
        }
    } catch(e) {
        container.innerHTML = '<div class="cnx-empty cnx-error">Failed to scan market.</div>';
    }
}

async function matchCompetitor(domain, btn) {
    btn.innerText = "Scraping...";
    btn.disabled = true;

    try {
        const res = await fetch(`https://vantix-my5f.onrender.com/api/competitors/add?domain=${encodeURIComponent(domain)}`);
        const data = await res.json();
        
        if (res.ok) {
            btn.innerText = "✅ Matched";
            btn.style.color = "var(--ov-green)";
            btn.style.borderColor = "var(--ov-green)";
        } else {
            throw new Error(data.detail || "Failed");
        }
    } catch(e) {
        btn.innerText = "Error";
        btn.disabled = false;
    }
}

async function checkTelegramStatus() {
    const btn = document.getElementById('telegram-btn');
    const statusText = document.getElementById('telegram-status-text');
    if(!btn || !statusText) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/telegram/status');
        if (!res.ok) return;
        const data = await res.json();
        
        if (data.linked) {
            btn.innerText = "✅ Telegram Connected";
            btn.className = "cnx-btn-secondary";
            btn.disabled = true;
            btn.style.borderColor = "var(--ov-green)";
            btn.style.color = "var(--ov-green)";
            statusText.innerHTML = "Your account is linked. You will receive daily briefings at 8:00 AM.";
        } else {
            btn.innerText = "Activate Telegram →";
            btn.className = "cnx-btn-primary";
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

document.addEventListener('DOMContentLoaded', () => {
    const link = document.getElementById('direct-connect-link');
    const input = document.getElementById('shopify-domain');
    const errorDiv = document.getElementById('connect-error');

    if (link && input) {
        const updateLink = async () => {
            let domain = input.value.trim();
            if(!domain) {
                link.onclick = () => {};
                return;
            }
            domain = domain.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/$/, "");
            if(!domain.includes(".myshopify.com")) {
                domain = domain + ".myshopify.com";
            }

            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session) {
                link.onclick = () => {
                    window.location.href = `https://vantix-my5f.onrender.com/api/shopify/install?shop=${domain}&token=${session.access_token}`;
                };
                if(errorDiv) errorDiv.style.display = 'none';
            }
        };
        input.addEventListener('input', updateLink);
        updateLink();
    }
});
