async function checkSubscription() {
    try {
        const statusRes = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        if (statusRes.ok) {
            const statusData = await statusRes.json();
            const upgradeBtn = document.getElementById('upgrade-btn');
            const manageBtn = document.getElementById('manage-btn');
            const trialBanner = document.getElementById('trial-banner');

            if (statusData.plan === 'pro' || statusData.plan === 'scale') {
                upgradeBtn.style.display = 'none';
                manageBtn.style.display = 'block';
                trialBanner.innerText = "⭐ You are currently subscribed to the PRO plan.";
                trialBanner.style.color = "var(--accent)";
            } else {
                upgradeBtn.style.display = 'block';
                manageBtn.style.display = 'none';
                trialBanner.innerText = "You are currently on a 7-Day Free Trial.";
                trialBanner.style.color = "var(--amber)";
            }
        }

        // Fetch ROI Data
        const roiRes = await fetch('https://vantix-my5f.onrender.com/api/billing/roi');
        if (roiRes.ok) {
            const roiData = await roiRes.json();
            document.getElementById('roi-value').innerText = '$' + roiData.value_generated.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('roi-alerts').innerText = roiData.alerts_found;
            document.getElementById('roi-products').innerText = roiData.products_tracked;
        }
    } catch(e) {
        console.error("Failed to load membership data", e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    checkSubscription();

    const upgradeBtn = document.getElementById('upgrade-btn');
    const manageBtn = document.getElementById('manage-btn');

    // 1. Upgrade Logic
    if (upgradeBtn) {
        const { data: { session } } = await window.supabaseClient.auth.getSession();
        if (session) {
            // REPLACE YOUR_CHECKOUT_ID WITH YOUR ACTUAL LEMON SQUEEZY LINK
            const checkoutUrl = `https://vantix.lemonsqueezy.com/checkout/buy/YOUR_CHECKOUT_ID?checkout[email]=${encodeURIComponent(session.user.email)}&checkout[custom][user_id]=${session.user.id}`;
            upgradeBtn.addEventListener('click', () => window.open(checkoutUrl, '_blank'));
        }
    }

    // 2. Manage/Cancel Logic
    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            // This opens the Lemon Squeezy customer portal where they can cancel/update cards
            window.open('https://vantix.lemonsqueezy.com/billing', '_blank');
        });
    }
});
