async function checkSubscription() {
    const banner = document.getElementById('trial-banner');
    const bannerText = document.getElementById('banner-text');
    const daysLeft = document.getElementById('trial-days-left');

    const btnStarter = document.getElementById('btn-starter');
    const btnPro = document.getElementById('btn-pro');
    const btnScale = document.getElementById('btn-scale');

    if(!banner) return;

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        if (!res.ok) throw new Error("Failed to load status");

        const data = await res.json();
        banner.style.display = 'flex';

        // The exact Lemon Squeezy Checkout URLs
        const starterUrl = 'https://vantix-app.lemonsqueezy.com/checkout/buy/d5f53e33-3d35-4cc5-aaca-3ca5a3236ed7';
        const proUrl = 'https://vantix-app.lemonsqueezy.com/checkout/buy/422c4e93-6071-457c-90b6-a648c5dee4c4';
        const scaleUrl = 'https://vantix-app.lemonsqueezy.com/checkout/buy/789d4ae0-cc01-462d-a074-78a360971168';

        // Reset all buttons to active state
        const resetBtn = (btn, text, url) => {
            btn.disabled = false;
            btn.className = "mem-btn-secondary";
            btn.innerText = text;
            btn.onclick = () => window.open(url, '_blank');
        };

        resetBtn(btnStarter, "Upgrade to Starter", starterUrl);
        resetBtn(btnPro, "Upgrade to Pro →", proUrl);
        btnPro.className = "mem-btn-primary"; // Keep Pro button cyan
        resetBtn(btnScale, "Upgrade to Scale", scaleUrl);

        // Apply Active Plan State
        if(data.plan === 'trial') {
            banner.className = 'mem-banner mem-banner-trial';
            bannerText.innerHTML = `🎉 You are currently on a <b>7-Day Free Trial</b>.`;
            daysLeft.innerText = `${data.days_left} days remaining`;
        } 
        else if (data.plan === 'starter') {
            banner.className = 'mem-banner mem-banner-active';
            bannerText.innerHTML = `⭐ You are subscribed to the <b>STARTER</b> plan.`;
            daysLeft.innerText = "";
            
            btnStarter.innerText = "Current Plan";
            btnStarter.disabled = true;
            btnStarter.className = "mem-btn-secondary mem-btn-disabled";
        }
        else if (data.plan === 'pro') {
            banner.className = 'mem-banner mem-banner-active';
            bannerText.innerHTML = `⭐ You are subscribed to the <b>PRO</b> plan.`;
            daysLeft.innerText = "";
            
            btnPro.innerText = "Current Plan";
            btnPro.disabled = true;
            btnPro.className = "mem-btn-secondary mem-btn-disabled";
        }
        else if (data.plan === 'scale') {
            banner.className = 'mem-banner mem-banner-active';
            bannerText.innerHTML = `⭐ You are subscribed to the <b>SCALE</b> plan.`;
            daysLeft.innerText = "";
            
            btnScale.innerText = "Current Plan";
            btnScale.disabled = true;
            btnScale.className = "mem-btn-secondary mem-btn-disabled";
        } 
        else if (data.plan === 'none' || data.status === 'expired') {
            banner.className = 'mem-banner mem-banner-expired';
            bannerText.innerHTML = `⚠️ Your free trial has expired. Please upgrade to continue.`;
            daysLeft.innerText = "";
        }
    } catch(e) {
        console.error("Subscription check failed", e);
        banner.style.display = 'flex';
        banner.className = 'mem-banner mem-banner-error';
        bannerText.innerText = "Could not load subscription status.";
    }
}
