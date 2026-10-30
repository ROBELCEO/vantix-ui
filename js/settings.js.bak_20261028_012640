async function loadProfile() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/auth/profile');
        if (!res.ok) return;
        const data = await res.json();

        document.getElementById('settings-email').innerText = data.email;
        
        const planBadge = document.getElementById('settings-plan');
        planBadge.innerText = data.plan.toUpperCase();
        if (data.plan === 'pro') planBadge.className = "badge badge-green";
        else if (data.plan === 'scale') planBadge.className = "badge badge-violet";
        else planBadge.className = "badge badge-amber";

        const shopEl = document.getElementById('settings-shopify');
        if (data.shopify_connected) {
            shopEl.innerText = data.shopify_domain;
            shopEl.style.color = "var(--green)";
        } else {
            shopEl.innerText = "Not Connected";
            shopEl.style.color = "var(--red)";
        }

        const teleEl = document.getElementById('settings-telegram');
        if (data.telegram_linked) {
            teleEl.innerText = "Connected & Active";
            teleEl.style.color = "var(--green)";
        } else {
            teleEl.innerText = "Not Linked";
            teleEl.style.color = "var(--red)";
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
        const res = await fetch('https://vantix-my5f.onrender.com/api/auth/delete-account', {
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
