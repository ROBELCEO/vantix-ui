async function checkSubscription() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        const data = await res.json();
        
        const banner = document.getElementById('trial-banner');
        const daysLeft = document.getElementById('trial-days-left');
        const proBtn = document.getElementById('btn-pro');

        if(data.status === 'active' && data.plan === 'trial') {
            // Show trial banner
            banner.style.display = 'flex';
            daysLeft.innerText = `${data.days_left} days remaining`;
        } else if (data.plan === 'pro' || data.plan === 'scale') {
            // If they are already on a paid plan
            banner.style.display = 'flex';
            banner.style.background = 'rgba(0, 229, 255, 0.1)';
            banner.style.borderColor = 'rgba(0, 229, 255, 0.2)';
            banner.style.color = 'var(--accent)';
            banner.innerHTML = `<div>⭐ You are currently subscribed to the <b>${data.plan.toUpperCase()}</b> plan.</div>`;
            
            // Disable the buttons
            proBtn.innerText = "Current Plan";
            proBtn.className = "btn btn-secondary";
            proBtn.disabled = true;
        } else if (data.status === 'expired') {
            // If trial is over and no plan
            banner.style.display = 'flex';
            banner.style.background = 'rgba(255, 34, 102, 0.1)';
            banner.style.borderColor = 'rgba(255, 34, 102, 0.2)';
            banner.style.color = 'var(--red)';
            banner.innerHTML = `<div>⚠️ Your free trial has expired. Please upgrade to continue.</div>`;
        }
    } catch(e) {
        console.error("Failed to load subscription status", e);
    }
}

// Run on load
checkSubscription();
