import re

with open("js/competitors.js", "r", encoding="utf-8") as f:
    js = f.read()

# Replace the autoDiscover function to handle the new response format
start_idx = js.find('async function autoDiscover()')
end_idx = js.find('function handleAddKey(e)')
if end_idx == -1: end_idx = len(js)

new_auto = '''async function autoDiscover() {
    const btn = document.getElementById('discover-btn');
    const results = document.getElementById('discovery-results');
    if (!btn || !results) return;

    btn.innerText = "Scanning 29,000 stores...";
    btn.disabled = true;
    results.innerHTML = '<div class="cmp-empty">Analyzing your catalog and querying the network...</div>';

    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/discover');
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Network error");

        const competitors = data.suggested_competitors || [];
        if (competitors.length === 0) {
            results.innerHTML = '<div class="cmp-empty">No competitors found. Try adding manually.</div>';
            return;
        }

        results.innerHTML = competitors.map(c => {
            const domain = c.domain || c;
            const isTracked = allCompetitors.some(t => t.domain.toLowerCase() === domain.toLowerCase());
            const btnHtml = isTracked
                ? '<div class="cmp-badge cmp-badge-green" style="font-size: 9px;">TRACKED</div>'
                : `<button onclick="addCompetitor('${cmpEsc(domain)}')" class="cmp-btn-small">+ Add</button>`;

            // Display matched products as chips
            let chipsHtml = '';
            if (c.matched_products && c.matched_products.length > 0) {
                chipsHtml = c.matched_products.map(p => `
                    <span style="background: #F0F9FF; color: #0284C7; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; border: 1px solid #BAE6FD;">
                        ${cmpEsc(p.title)} ($${Number(p.price).toFixed(2)})
                    </span>
                `).join(' ');
            }

            return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #E4E4E7; gap: 12px;">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 800; font-size: 14px; color: #09090B;">${cmpEsc(domain)}</div>
                        <div style="font-size: 12px; color: #71717A;">${c.category || 'Niche'} · ${c.product_count || 0} products</div>
                        ${chipsHtml ? `<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">${chipsHtml}</div>` : ''}
                    </div>
                    ${btnHtml}
                </div>
            `;
        }).join('');

    } catch (e) {
        console.error(e);
        results.innerHTML = `<div class="cmp-empty" style="color: #E11D48;">Error: ${e.message}</div>`;
    } finally {
        btn.innerText = "Find My Competitors →";
        btn.disabled = false;
    }
}

'''
js = js[:start_idx] + new_auto + js[end_idx:]

with open("js/competitors.js", "w", encoding="utf-8") as f:
    f.write(js)
print("✅ Frontend updated: autoDiscover now renders matched products as chips.")
