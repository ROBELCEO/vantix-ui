async function checkSubscription() {
    const banner = document.getElementById('trial-banner');
    const bannerText = document.getElementById('banner-text');
    const daysLeft = document.getElementById('trial-days-left');
    const proBtn = document.getElementById('btn-pro');

    if(!banner) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        
        if (!res.ok) throw new Error("Failed to load status");

        const data = await res.json();
        
        banner.style.display = 'flex';

        if(data.status === 'active' && data.plan === 'trial') {
            banner.style.background = 'rgba(0, 255, 136, 0.1)';
            banner.style.borderColor = 'rgba(0, 255, 136, 0.2)';
            banner.style.color = 'var(--green)';
            bannerText.innerHTML = `🎉 You are currently on a <b>7-Day Free Trial</b>.`;
            daysLeft.innerText = `${data.days_left} days remaining`;
        } 
        else if (data.plan === 'pro' || data.plan === 'scale') {
            banner.style.background = 'rgba(0, 229, 255, 0.1)';
            banner.style.borderColor = 'rgba(0, 229, 255, 0.2)';
            banner.style.color = 'var(--accent)';
            bannerText.innerHTML = `⭐ You are currently subscribed to the <b>${data.plan.toUpperCase()}</b> plan.`;
            daysLeft.innerText = "";
            
            if (data.plan === 'pro') {
                proBtn.innerText = "Current Plan";
                proBtn.className = "btn btn-secondary";
                proBtn.disabled = true;
            }
        } 
        else if (data.status === 'expired') {
            banner.style.background = 'rgba(255, 34, 102, 0.1)';
            banner.style.borderColor = 'rgba(255, 34, 102, 0.2)';
            banner.style.color = 'var(--red)';
            bannerText.innerHTML = `⚠️ Your free trial has expired. Please upgrade to continue.`;
            daysLeft.innerText = "";
        }
    } catch(e) {
        console.error("Subscription check failed", e);
        banner.style.display = 'flex';
        bannerText.innerText = "Could not load subscription status.";
    }
}

if (window.location.pathname.includes('membership.html')) {
    checkSubscription();
}
