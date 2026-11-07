async function loadProfile() {
    try {
        const res = await fetch('https://api.midra.xyz/api/auth/profile');
        if (!res.ok) return;
        const data = await res.json();

        document.getElementById('settings-email').innerText = data.email;

        const planBadge = document.getElementById('settings-plan');
        planBadge.innerText = data.plan.toUpperCase();
        planBadge.className = "set-badge";
        if (data.plan === 'pro') planBadge.classList.add('set-badge-green');
        else if (data.plan === 'scale') planBadge.classList.add('set-badge-violet');
        else planBadge.classList.add('set-badge-amber');

        const shopEl = document.getElementById('settings-shopify');
        if (data.shopify_connected) {
            shopEl.innerText = data.shopify_domain;
            shopEl.style.color = "#059669";
        } else {
            shopEl.innerText = "Not Connected";
            shopEl.style.color = "#E11D48";
        }

        const teleEl = document.getElementById('settings-telegram');
        const teleBtn = document.getElementById('telegram-action-btn');
        
        if (data.telegram_linked) {
            teleEl.innerText = "Connected & Active";
            teleEl.style.color = "#059669";
            if (teleBtn) {
                teleBtn.innerText = "Disconnect";
                teleBtn.href = "#"; // Handle disconnect later if needed
            }
        } else {
            // Show the connect link
            if (teleBtn) {
                teleBtn.innerText = "Connect Bot";
                // Replace with the actual user ID from auth data
                const uid = data.user_id || data.id || "YOUR_USER_ID"; 
                teleBtn.href = `https://t.me/Vantixshopifyv1Bot?start=${uid}`;
                teleBtn.target = "_blank";
            }
            teleEl.innerText = "Not Linked";
            teleEl.style.color = "#E11D48";
        }
    } catch(e) {
        console.error("Failed to load profile", e);
    }
}

async function confirmDelete() {
    const confirmation = prompt("WARNING: This will permanently delete your account and all data.\n\nType 'DELETE' to confirm.");

    if (confirmation !== 'DELETE') {
        return;
    }

    const btn = document.getElementById('delete-btn');
    btn.innerText = "Deleting Account...";
    btn.disabled = true;

    try {
        const res = await fetch('https://api.midra.xyz/api/auth/delete-account', {
            method: 'DELETE'
        });

        if (res.ok) {
            alert("Your account has been successfully deleted.");
            await window.supabaseClient.auth.signOut();
            window.location.href = "login.html";
        } else {
            alert("Failed to delete account. Please try again.");
            btn.innerText = "Delete Account Permanently";
            btn.disabled = false;
        }
    } catch (e) {
        alert("Network error. Try again.");
        btn.innerText = "Delete Account Permanently";
        btn.disabled = false;
    }
}


// ==========================================
// STORE FINANCIALS (SHIPPING & GATEWAY)
// ==========================================
async function loadStoreSettings() {
    try {
        const token = window.currentSession?.access_token || (await window.supabaseClient.auth.getSession()).data.session?.access_token;
        if (!token) return;
        const res = await fetch('https://api.midra.xyz/api/store/settings', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            const data = await res.json();
            const shipIn = document.getElementById('setting-shipping');
            const gateIn = document.getElementById('setting-gateway');
            if (shipIn) shipIn.value = data.avg_shipping_cost || '';
            if (gateIn) gateIn.value = data.gateway_fee || '';
        }
    } catch (e) { console.error("Failed to load store settings", e); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadStoreSettings();
    
    const saveBtn = document.getElementById('save-store-settings');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            const ship = parseFloat(document.getElementById('setting-shipping').value) || 0;
            const gate = parseFloat(document.getElementById('setting-gateway').value) || 0;
            const token = window.currentSession?.access_token || (await window.supabaseClient.auth.getSession()).data.session?.access_token;
            
            saveBtn.innerText = "Saving...";
            try {
                const res = await fetch('https://api.midra.xyz/api/store/settings', {
                    method: 'POST',
                    headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profit_goal: 0, avg_shipping_cost: ship, gateway_fee: gate })
                });
                if (res.ok) {
                    saveBtn.innerText = "Saved!";
                    saveBtn.style.background = "#059669";
                    setTimeout(() => { saveBtn.innerText = "Save Financials"; saveBtn.style.background = "#09090B"; }, 2000);
                } else {
                    saveBtn.innerText = "Error";
                }
            } catch (e) {
                saveBtn.innerText = "Error";
            }
        });
    }
});
