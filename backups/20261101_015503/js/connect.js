let isChecking = false;

async function checkConnectionStatus() {
    if (isChecking) return;
    isChecking = true;

    const loadingView = document.getElementById('view-loading');
    const unconnectedView = document.getElementById('view-unconnected');
    const connectedView = document.getElementById('view-connected');
    const statusEl = document.getElementById('cnx-status');

    if (!loadingView || !unconnectedView || !connectedView) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        if (res.status === 401) {
            if (statusEl) statusEl.innerText = "Unauthorized";
            return;
        }

        const data = await res.json();
        
        // Hide skeleton, show real view
        loadingView.style.display = 'none';

        if (data.connected) {
            unconnectedView.style.display = 'none';
            connectedView.style.display = 'block';
            if (statusEl) statusEl.innerText = "Connected";
            document.getElementById('connected-domain').innerText = data.domain;
            
            // FETCH STORE LOGO
            const logoUrl = `https://www.google.com/s2/favicons?domain=${data.domain}&sz=128`;
            const logoImg = document.getElementById('store-logo');
            const logoFallback = document.getElementById('store-logo-fallback');
            
            if (logoImg && logoFallback) {
                logoImg.src = logoUrl;
                logoImg.style.display = 'block';
                logoFallback.style.display = 'none';
                
                // If image fails to load, fallback to the checkmark
                logoImg.onerror = () => {
                    logoImg.style.display = 'none';
                    logoFallback.style.display = 'flex';
                };
            }

            // AUTO-SYNC IN THE BACKGROUND
            fetch('https://vantix-my5f.onrender.com/api/shopify/sync')
                .then(r => r.json())
                .then(syncData => console.log("Background sync complete:", syncData))
                .catch(err => console.error("Background sync failed:", err));
            
            // Load saved settings without flashing
            try {
                const settingsRes = await fetch('https://vantix-my5f.onrender.com/api/store/settings');
                if (settingsRes.ok) {
                    const settings = await settingsRes.json();
                    document.getElementById('profit-goal').value = settings.profit_goal || '';
                    document.getElementById('shipping-cost').value = settings.avg_shipping_cost || '';
                    document.getElementById('gateway-fee').value = settings.gateway_fee || '';
                }
            } catch(e) { console.error("Settings load error", e); }
            
            checkTelegramStatus();
            
        } else {
            unconnectedView.style.display = 'block';
            connectedView.style.display = 'none';
            if (statusEl) statusEl.innerText = "Not Connected";
        }
    } catch(e) {
        console.error("Status check failed", e);
        loadingView.style.display = 'none';
        unconnectedView.style.display = 'block';
        if (statusEl) statusEl.innerText = "Offline";
    } finally {
        isChecking = false;
    }
}

async function saveSettings(btn) {
    const goalVal = document.getElementById('profit-goal').value;
    const shipVal = document.getElementById('shipping-cost').value;
    const gateVal = document.getElementById('gateway-fee').value;

    // Send null if empty, otherwise parse the float
    const goal = goalVal ? parseFloat(goalVal) : null;
    const shipping = shipVal ? parseFloat(shipVal) : null;
    const gateway = gateVal ? parseFloat(gateVal) : null;
    const status = document.getElementById('settings-status');

    const originalText = btn.innerText;
    btn.innerText = "Saving...";
    btn.disabled = true;
    status.style.display = 'none';

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/store/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profit_goal: goal, avg_shipping_cost: shipping, gateway_fee: gateway })
        });
        
        if (res.ok) {
            btn.innerText = "✅ Saved";
            status.style.display = 'block';
            setTimeout(() => { status.style.display = 'none'; }, 3000);
        } else {
            throw new Error("Failed to save");
        }
    } catch(e) { 
        alert("Error saving settings. Check your connection.");
    } finally {
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 1000);
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
            btn.style.borderColor = "#22C55E";
            btn.style.color = "#16A34A";
            btn.style.background = "#F0FDF4";
            statusText.innerHTML = "Your account is linked. You will receive daily briefings at 8:00 AM.";
        } else {
            btn.innerText = "Activate Telegram →";
            btn.className = "cnx-btn-primary";
            btn.disabled = false;
            statusText.innerHTML = "Click to link your Telegram account.";
            
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

// Add the direct connect link logic
document.addEventListener('DOMContentLoaded', () => {
    const link = document.getElementById('direct-connect-link');
    const input = document.getElementById('shopify-domain');

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
            }
        };
        input.addEventListener('input', updateLink);
        updateLink();
    }
});


// Add this inside DOMContentLoaded or at the bottom of the file
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('setup') === 'fees') {
        // Wait for the UI to load, then highlight the fields
        setTimeout(() => {
            const shippingInput = document.getElementById('shipping-cost');
            const gatewayInput = document.getElementById('gateway-fee');
            
            if (shippingInput && gatewayInput) {
                // Add glowing red borders
                shippingInput.style.border = "2px solid #E11D48";
                shippingInput.style.boxShadow = "0 0 0 3px rgba(225, 29, 72, 0.2)";
                gatewayInput.style.border = "2px solid #E11D48";
                gatewayInput.style.boxShadow = "0 0 0 3px rgba(225, 29, 72, 0.2)";
                
                // Scroll to them and focus
                shippingInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                shippingInput.focus();
            }
        }, 800);
    }
});




