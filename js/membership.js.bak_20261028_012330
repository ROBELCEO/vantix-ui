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

        // Reset all buttons to normal state
        const resetBtn = (btn, text, url) => {
            btn.disabled = false;
            btn.className = "btn btn-secondary";
            btn.innerText = text;
            btn.onclick = () => window.open(url, '_blank');
        };

        const starterUrl = 'https://vantix-app.lemonsqueezy.com/checkout/buy/d5f53e33-3d35-4cc5-aaca-3ca5a3236ed7';
        const proUrl = 'https://vantix-app.lemonsqueezy.com/checkout/buy/422c4e93-6071-457c-90b6-a648c5dee4c4';
        const scaleUrl = 'https://vantix-app.lemonsqueezy.com/checkout/buy/789d4ae0-cc01-462d-a074-78a360971168';

        resetBtn(btnStarter, "Upgrade to Starter", starterUrl);
        resetBtn(btnPro, "Upgrade to Pro →", proUrl);
        btnPro.className = "btn btn-primary";
        resetBtn(btnScale, "Upgrade to Scale", scaleUrl);

        if(data.plan === 'trial') {
            banner.style.background = 'rgba(0, 255, 136, 0.1)';
            banner.style.borderColor = 'rgba(0, 255, 136, 0.2)';
            banner.style.color = 'var(--green)';
            bannerText.innerHTML = `🎉 You are currently on a <b>7-Day Free Trial</b>.`;
            daysLeft.innerText = `${data.days_left} days remaining`;
        } 
        else if (data.plan === 'starter') {
            banner.style.background = 'rgba(0, 255, 136, 0.1)';
            bannerText.innerHTML = `⭐ You are subscribed to the <b>STARTER</b> plan.`;
            daysLeft.innerText = "";
            
            btnStarter.innerText = "Current Plan";
            btnStarter.disabled = true;
            btnStarter.className = "btn btn-secondary";
        }
        else if (data.plan === 'pro') {
            banner.style.background = 'rgba(0, 229, 255, 0.1)';
            banner.style.borderColor = 'rgba(0, 229, 255, 0.2)';
            banner.style.color = 'var(--accent)';
            bannerText.innerHTML = `⭐ You are subscribed to the <b>PRO</b> plan.`;
            daysLeft.innerText = "";
            
            btnPro.innerText = "Current Plan";
            btnPro.disabled = true;
            btnPro.className = "btn btn-secondary";
        }
        else if (data.plan === 'scale') {
            banner.style.background = 'rgba(178, 102, 255, 0.1)';
            banner.style.borderColor = 'rgba(178, 102, 255, 0.2)';
            banner.style.color = 'var(--purple)';
            bannerText.innerHTML = `⭐ You are subscribed to the <b>SCALE</b> plan.`;
            daysLeft.innerText = "";
            
            btnScale.innerText = "Current Plan";
            btnScale.disabled = true;
            btnScale.className = "btn btn-secondary";
        } 
        else if (data.plan === 'none' || data.status === 'expired') {
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
