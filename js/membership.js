// REPLACE THESE WITH YOUR EXACT LEMON SQUEEZY CHECKOUT LINKS
const LEMON_PRO_URL = "https://vantix.lemonsqueezy.com/checkout/buy/YOUR_PRO_VARIANT_ID";
const LEMON_STARTER_URL = "https://vantix.lemonsqueezy.com/checkout/buy/YOUR_STARTER_VARIANT_ID";
const LEMON_SCALE_URL = "https://vantix.lemonsqueezy.com/checkout/buy/YOUR_SCALE_VARIANT_ID";

async function checkSubscription() {
    try {
        const statusRes = await fetch('https://vantix-my5f.onrender.com/api/auth/status');
        if (statusRes.ok) {
            const statusData = await statusRes.json();
            const proBtn = document.getElementById('upgrade-btn-pro');
            
            if (statusData.plan !== 'trial') {
                if (proBtn) {
                    proBtn.innerText = "Current Plan (Active)";
                    proBtn.disabled = true;
                    proBtn.style.opacity = "0.5";
                }
            }
        }

        const roiRes = await fetch('https://vantix-my5f.onrender.com/api/billing/roi');
        if (roiRes.ok) {
            const roiData = await roiRes.json();
            document.getElementById('roi-value').innerText = '$' + roiData.value_generated.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('roi-alerts').innerText = roiData.alerts_found;
            document.getElementById('roi-products').innerText = roiData.products_tracked;
        }
    } catch(e) { console.error("Failed to load membership data", e); }
}

async function triggerCheckout(baseUrl) {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (!session) {
        alert("Please log in first.");
        return;
    }

    // Pass the email and user_id to Lemon Squeezy
    const checkoutUrl = `${baseUrl}?checkout[email]=${encodeURIComponent(session.user.email)}&checkout[custom][user_id]=${session.user.id}`;
    window.open(checkoutUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    checkSubscription();

    const proBtn = document.getElementById('upgrade-btn-pro');
    if (proBtn) {
        proBtn.addEventListener('click', () => triggerCheckout(LEMON_PRO_URL));
    }
    
    const starterBtn = document.getElementById('upgrade-btn-starter');
    if (starterBtn) {
        starterBtn.addEventListener('click', () => triggerCheckout(LEMON_STARTER_URL));
    }

    const scaleBtn = document.getElementById('upgrade-btn-scale');
    if (scaleBtn) {
        scaleBtn.addEventListener('click', () => triggerCheckout(LEMON_SCALE_URL));
    }
});
