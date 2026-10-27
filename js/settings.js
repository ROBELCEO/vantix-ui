document.addEventListener('DOMContentLoaded', async () => {
    const emailInput = document.getElementById('settings-email');
    if(!emailInput) return;

    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session) {
        emailInput.value = session.user.email;
    }
});

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
