// ==========================================
// GLOBAL PAYWALL ENFORCEMENT
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Check if we are on the login or legal pages (no paywall needed)
    const currentPath = window.location.pathname;
    if (currentPath.includes('login.html') || currentPath.includes('terms.html') || currentPath.includes('privacy.html')) return;

    try {
        const token = window.getAuthToken ? window.getAuthToken() : null;
        if (!token) return;

        const res = await fetch('https://api.midra.xyz/api/auth/status', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) return;
        
        const data = await res.json();
        const plan = data.plan || 'trial';
        
        // If the user is Pro or Scale, do nothing
        if (plan === 'pro' || plan === 'scale') return;

        // Otherwise, apply locks to all Pro features
        const lockElement = (id, title, text) => {
            const el = document.getElementById(id);
            if (!el) return;
            
            // Find the parent panel (to make the lock look nice)
            const panel = el.closest('.ov-panel, .st-panel, .cmp-panel, .trm-panel, .dsc-grid, .inv-panel') || el.parentElement;
            if (!panel) return;
            
            // Hide the actual data
            el.style.display = 'none';
            
            // Create the lock overlay
            const lock = document.createElement('div');
            lock.style.cssText = 'display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 16px; background:#F8FAFC; border:1px dashed #D1D5DB; border-radius:8px; text-align:center; height:100%; min-height:150px;';
            lock.innerHTML = `
                <div style="font-size:24px; margin-bottom:12px;">🔒</div>
                <div style="font-weight:900; font-size:14px; color:#09090B; margin-bottom:4px;">${title}</div>
                <div style="font-size:12px; color:#52525B; margin-bottom:16px;">${text}</div>
                <a href="membership.html" style="background:#09090B; color:#FFF; padding:8px 16px; border-radius:4px; font-size:12px; font-weight:800; text-decoration:none;">Upgrade to Pro</a>
            `;
            panel.appendChild(lock);
        };

        // 1. Overview Locks
        lockElement('ov-opportunities', 'AI Top Opportunities', 'Unlock AI-driven pricing strategies based on your store data.');
        
        // 2. My Store Locks
        lockElement('dead-stock-list', 'Dead Stock Cash Trap', 'Find the cash trapped in your slow-moving inventory.');
        lockElement('carts-list', 'Abandoned Cart ROI', 'Recover lost sales from abandoned checkouts.');
        lockElement('ltv-list', 'VIP Customer LTV', 'Identify your highest-spending customers.');

        // 3. Competitors Locks
        lockElement('discovery-results', 'Auto-Discover Competitors', 'Let AI find the best competitors in the 29,000 store database.');
        lockElement('stockout-list', 'Stock-Out Radar', 'Find high-ticket competitor items that are out of stock.');
        lockElement('launch-list', 'New Launch Tracker', 'See what your competitors launched in the last 30 days.');
        lockElement('bestsellers-list', 'Competitor Best Sellers', 'Track the most popular products across your rivals.');
        lockElement('gap-list', 'Catalog Gap Analyzer', 'Discover items your competitors sell, but you don\\'t.');

        // 4. Terminal Locks
        lockElement('ai-advisor-content', 'AI Margin Advisor', 'Get ruthless, profit-driven pricing strategies.');
        lockElement('safe-floor-content', 'Price War Safe Floor', 'Know the exact lowest price you can charge without losing money.');

        // 5. Discovery Page Locks
        const discoveryResults = document.getElementById('discovery-results');
        if (discoveryResults && window.location.pathname.includes('discovery')) {
            lockElement('discovery-results', 'Goldmine Engine', 'Unlock the 29,000 store scraper network and find your next winning product.');
        }

        // 6. Inventory Page Locks
        lockElement('inventory-list', 'Inventory Intelligence', 'Track sales velocity, restock alerts, and cash tied up in stock.');

    } catch(e) {
        console.error("Paywall check failed:", e);
    }
});
