async function checkSubscription() {
    const banner = document.getElementById('current-plan-banner');
    const bannerText = document.getElementById('banner-text');
    const daysLeft = document.getElementById('trial-days-left');
    
    const btnStarter = document.getElementById('btn-starter');
    const btnPro = document.getElementById('btn-pro');
    const btnScale = document.getElementById('btn-scale');

    if(!banner) return;

    try {
        let userId = '';
        if (window.currentSession && window.currentSession.user) {
            userId = window.currentSession.user.id;
        } else if (window.supabaseClient) {
            const { data: { session } } = await window.supabaseClient.auth.getSession();
            if (session) userId = session.user.id;
        }

        const suffix = userId ? `?checkout[custom][user_id]=${userId}` : '';
        const starterUrl = `https://vantix-app.lemonsqueezy.com/checkout/buy/d5f53e33-3d35-4cc5-aaca-3ca5a3236ed7${suffix}`;
        const proUrl = `https://vantix-app.lemonsqueezy.com/checkout/buy/422c4e93-6071-457c-90b6-a648c5dee4c4${suffix}`;
        const scaleUrl = `https://vantix-app.lemonsqueezy.com/checkout/buy/789d4ae0-cc01-462d-a074-78a360971168${suffix}`;

        const resetBtn = (btn, text, url) => {
            if(!btn) return;
            btn.disabled = false;
            btn.innerText = text;
            btn.onclick = () => window.open(url, '_blank');
        };

        resetBtn(btnStarter, "Select Starter", starterUrl);
        resetBtn(btnPro, "Upgrade to Pro →", proUrl);
        resetBtn(btnScale, "Select Scale", scaleUrl);

        const res = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        if (!res.ok) throw new Error("Failed to load status");

        const data = await res.json();
        banner.style.display = 'flex';

        if(data.plan === 'trial') {
            banner.style.background = '#F0F9FF';
            banner.style.borderColor = '#BAE6FD';
            banner.style.color = '#0284C7';
            bannerText.innerHTML = `🎉 You are on a <b>14-Day Free Trial of Pro</b>.`;
            daysLeft.innerText = `${data.days_left} days left`;
        } 
        else if (data.plan === 'starter') {
            banner.style.background = '#F3F4F6';
            banner.style.borderColor = '#E5E7EB';
            banner.style.color = '#09090B';
            bannerText.innerHTML = `You are subscribed to the <b>STARTER</b> plan.`;
            daysLeft.innerText = "";
            btnStarter.innerText = "Current Plan";
            btnStarter.className = "plan-btn plan-btn-disabled";
            btnStarter.disabled = true;
            btnStarter.onclick = null;
        }
        else if (data.plan === 'pro') {
            banner.style.background = '#E0F2FE';
            banner.style.borderColor = '#BAE6FD';
            banner.style.color = '#0284C7';
            bannerText.innerHTML = `⭐ You are subscribed to the <b>PRO</b> plan.`;
            daysLeft.innerText = "";
            btnPro.innerText = "Current Plan";
            btnPro.className = "plan-btn plan-btn-disabled";
            btnPro.disabled = true;
            btnPro.onclick = null;
        }
        else if (data.plan === 'scale') {
            banner.style.background = '#F3E8FF';
            banner.style.borderColor = '#E9D5FF';
            banner.style.color = '#6D28D9';
            bannerText.innerHTML = `👑 You are subscribed to the <b>SCALE</b> plan.`;
            daysLeft.innerText = "";
            btnScale.innerText = "Current Plan";
            btnScale.className = "plan-btn plan-btn-disabled";
            btnScale.disabled = true;
            btnScale.onclick = null;
        } 
    } catch(e) {
        console.error("Subscription check failed", e);
        if(banner) {
            banner.style.display = 'flex';
            bannerText.innerText = "Could not load subscription status.";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkSubscription();
});
