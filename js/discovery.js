let allTrends = [];
let currentTags = [];

// A dictionary of common e-commerce niches for the Autocomplete / Typo Fixer
const NICHE_DICTIONARY = [
    "yoga mats", "yoga blocks", "resistance bands", "dumbbells", "kettlebells",
    "gaming chairs", "gaming desks", "gaming mice", "gaming keyboards", "monitors",
    "skincare", "face masks", "serums", "moisturizers", "sunscreen",
    "pet beds", "dog toys", "cat trees", "pet grooming", "dog collars",
    "water bottles", "lunch boxes", "coffee mugs", "protein shakers",
    "phone cases", "wireless chargers", "power banks", "laptop stands",
    "hair accessories", "hair dryers", "makeup brushes", "nail polish"
];

function dscEsc(str) {
    return String(str ?? "").replace(/[&<>"']/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[s]));
}

// --- TAG INPUT LOGIC ---
const nicheInput = document.getElementById('niche-input');
const tagContainer = document.getElementById('niche-tags');
const autocompleteList = document.getElementById('autocomplete-list');

nicheInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    autocompleteList.innerHTML = '';
    
    if (!val) {
        autocompleteList.style.display = 'none';
        return;
    }

    // Find matches in the dictionary
    const matches = NICHE_DICTIONARY.filter(n => n.includes(val) && !currentTags.includes(n));
    
    if (matches.length > 0) {
        autocompleteList.style.display = 'block';
        matches.slice(0, 5).forEach(match => {
            const div = document.createElement('div');
            div.className = 'dsc-autocomplete-item';
            // Highlight the matched part
            const regex = new RegExp(`(${val})`, 'gi');
            div.innerHTML = match.replace(regex, '<b style="color:#0284C7;">$1</b>');
            
            div.onclick = () => addTag(match);
            autocompleteList.appendChild(div);
        });
    } else {
        autocompleteList.style.display = 'none';
    }
});

nicheInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = nicheInput.value.trim();
        if (val) addTag(val);
    } else if (e.key === 'Backspace' && nicheInput.value === '') {
        // Remove last tag if input is empty
        if (currentTags.length > 0) {
            currentTags.pop();
            renderTags();
        }
    }
});

function addTag(tag) {
    const cleanTag = tag.toLowerCase().trim();
    if (cleanTag && !currentTags.includes(cleanTag)) {
        currentTags.push(cleanTag);
        renderTags();
    }
    nicheInput.value = '';
    autocompleteList.style.display = 'none';
    nicheInput.focus();
}

function removeTag(tag) {
    currentTags = currentTags.filter(t => t !== tag);
    renderTags();
}

function renderTags() {
    tagContainer.innerHTML = currentTags.map(tag => `
        <div class="dsc-tag">
            ${dscEsc(tag)}
            <button onclick="removeTag('${dscEsc(tag)}')">×</button>
        </div>
    `).join('');
}

// Hide autocomplete when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dsc-input-section')) {
        autocompleteList.style.display = 'none';
    }
});

// --- PREFERENCES LOGIC ---
function toggleAutoDetect(el) {
    const toggle = document.getElementById('auto-detect-toggle');
    const section = document.getElementById('custom-niches-section');
    toggle.classList.toggle('active');
    
    if (toggle.classList.contains('active')) {
        section.style.opacity = '0.5';
        section.style.pointerEvents = 'none';
    } else {
        section.style.opacity = '1';
        section.style.pointerEvents = 'auto';
        nicheInput.focus();
    }
}

async function savePreferences() {
    const isAutoDetect = document.getElementById('auto-detect-toggle').classList.contains('active');
    
    if (!isAutoDetect && currentTags.length === 0) {
        alert("Please add at least one custom niche or enable Auto-Detect.");
        return;
    }

    console.log("Saving Preferences:", { autoDetect: isAutoDetect, niches: currentTags });
    
    // In production, this would be a POST request to your FastAPI backend
    // await fetch('/api/user/preferences', { method: 'POST', body: JSON.stringify({ niches: currentTags }) });
    
    const btn = document.querySelector('.dsc-save-btn');
    const originalText = btn.innerText;
    btn.innerText = "Saving...";
    
    setTimeout(() => {
        btn.innerText = "✅ Saved!";
        btn.style.background = "#059669";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "#09090B";
        }, 2000);
    }, 800);
}

// --- RESULTS RENDERING ---
async function loadDiscovery() {
    const container = document.getElementById('discovery-results');
    const countEl = document.getElementById('dsc-count');
    if (!container) return;

    try {
        // Fetch from your backend proxy (which calls the Cloudflare Worker)
        const res = await fetch('https://vantix-my5f.onrender.com/api/discovery/trends');
        if (!res.ok) throw new Error("Failed to connect to API");

        const data = await res.json();
        allTrends = data;

        if (countEl) countEl.innerText = `${allTrends.length} Goldmines`;
        renderDiscoveryCards(allTrends);

    } catch (e) {
        console.error("Fetch Error:", e);
        container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #E11D48;">Network error. Failed to load daily goldmines.</div>';
    }
}

function renderDiscoveryCards(trends) {
    const container = document.getElementById('discovery-results');
    
    if (!trends || trends.length === 0) {
        container.innerHTML = '<div class="dsc-empty" style="grid-column: 1 / -1; padding: 60px; text-align: center; color: #71717A;">No goldmines found yet. Check back after the next scan.</div>';
        return;
    }

    container.innerHTML = trends.slice(0, 30).map((item, index) => {
        const score = Number(item.god_eye_score) || 0;
        const scoreColor = score >= 85 ? "#059669" : (score >= 70 ? "#D97706" : "#E11D48");
        const scoreBg = score >= 85 ? "#ECFDF5" : (score >= 70 ? "#FFFBEB" : "#FFF1F2");
        
        const title = item.ali_title || "Unknown Product";
        const supplierPrice = Number(item.ali_price_usd) ? `$${Number(item.ali_price_usd).toFixed(2)}` : "$0.00";
        const retailPrice = Number(item.shop_avg_price) ? `$${Number(item.shop_avg_price).toFixed(2)}` : "$0.00";
        const margin = Number(item.margin_pct) ? `${Number(item.margin_pct).toFixed(1)}%` : "0%";
        const demand = Number(item.orders_count) || 0;
        const competition = Number(item.unique_stores) || 1;
        
        let insight = "";
        if (score >= 85) {
            insight = `🔥 GOLDMINE. Sourced for ${supplierPrice} and retailing at ${retailPrice}. Only ${competition} Shopify stores found.`;
        } else if (score >= 70) {
            insight = `⚡ STRONG POTENTIAL. ${demand} orders on AliExpress. Margin is solid at ${margin}.`;
        } else {
            insight = `⚠️ SATURATED. ${competition} Shopify stores found. Margin is ${margin}.`;
        }

        return `
            <div class="god-card">
                <div class="god-card-top">
                    <div style="width:60px; height:60px; background:#F4F4F5; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:20px; border:1px solid #E4E4E7; flex-shrink:0;">👁️</div>
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:9px; font-weight:800; color:#0284C7; letter-spacing:0.5px;">ALIEXPRESS → SHOPIFY</div>
                        <div style="font-size:14px; font-weight:900; color:#09090B; line-height:1.2; margin:4px 0;">${dscEsc(title)}</div>
                        <div style="font-size:14px; font-weight:800; color:#09090B; font-family:var(--font-mono);">${retailPrice} <span style="font-size:11px; color:#A1A1AA; text-decoration:line-through;">${supplierPrice}</span></div>
                    </div>
                </div>

                <div style="display:flex; gap:12px; margin:16px 0;">
                    <div style="flex:1; background:${scoreBg}; border:1px solid ${scoreColor}40; border-radius:2px; padding:12px; text-align:center;">
                        <div style="font-size:9px; font-weight:800; color:${scoreColor};">SCORE</div>
                        <div style="font-size:24px; font-weight:900; color:${scoreColor}; font-family:var(--font-mono);">${score}</div>
                    </div>
                    <div style="flex:1.5; display:flex; flex-direction:column; justify-content:center; font-size:11px; color:#52525B; gap:6px;">
                        <div style="display:flex; justify-content:space-between;"><span>Margin:</span> <b style="color:#059669;">${margin}</b></div>
                        <div style="display:flex; justify-content:space-between;"><span>Demand:</span> <b>${demand} sold</b></div>
                        <div style="display:flex; justify-content:space-between;"><span>Comp:</span> <b style="color:${competition < 3 ? '#059669' : '#E11D48'};">${competition} stores</b></div>
                    </div>
                </div>

                <div style="background:#F5F3FF; border-left:3px solid #7C3AED; padding:10px; font-size:11px; color:#3F3F46; border-radius:2px; margin-bottom:16px;">
                    ${dscEsc(insight)}
                </div>

                <div style="display:flex; gap:8px;">
                    <button onclick="saveOpportunity(${index})" style="flex:1; padding:8px; background:#FFF; border:1px solid #D1D5DB; font-weight:800; font-size:11px; border-radius:2px; cursor:pointer;">Save</button>
                    <button onclick="pushToShopify(${index})" style="flex:1; padding:8px; background:#09090B; color:#FFF; border:none; font-weight:800; font-size:11px; border-radius:2px; cursor:pointer;">Push to Shopify</button>
                </div>
            </div>
        `;
    }).join('');
}

async function pushToShopify(index) { alert("Push to Shopify integration coming soon!"); }
async function saveOpportunity(index) { alert("Saved to Wishlist!"); }

document.addEventListener('DOMContentLoaded', () => {
    loadDiscovery();
});
