// 1. Fetch Price Comparisons
async function fetchTerminal() {
    const tbody = document.getElementById('terminal-body');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/competitors/price-comparison');
        const data = await res.json();
        
        if(!data.comparisons || data.comparisons.length === 0) { 
            tbody.innerHTML = '<tr><td colspan="4" class="text-tertiary" style="text-align: center;">No comparisons found. Add competitors first.</td></tr>'; 
            return; 
        }
        
        tbody.innerHTML = data.comparisons.map(c => {
            let diffBadge = '<span class="badge">TIED</span>';
            
            if(c.comp_product === "No match found") {
                return `<tr>
                    <td style="font-weight: 600; color: var(--text-primary);">${c.my_product}</td>
                    <td class="mono">$${parseFloat(c.my_price).toFixed(2)}</td>
                    <td class="text-tertiary">No Match</td>
                    <td>—</td>
                </tr>`;
            }

            if(c.price_diff > 0) {
                diffBadge = `<span class="badge badge-red">+$${c.price_diff.toFixed(2)}</span>`;
            } else if (c.price_diff < 0) {
                diffBadge = `<span class="badge badge-green">-$${Math.abs(c.price_diff).toFixed(2)}</span>`;
            }

            return `<tr>
                <td style="font-weight: 600; color: var(--text-primary);">${c.my_product}</td>
                <td class="mono">$${parseFloat(c.my_price).toFixed(2)}</td>
                <td class="mono text-tertiary">$${parseFloat(c.comp_price).toFixed(2)}</td>
                <td>${diffBadge}</td>
            </tr>`;
        }).join('');
    } catch(e) { 
        tbody.innerHTML = '<tr><td colspan="4" class="text-red" style="text-align: center;">Backend asleep. Try again in 30s.</td></tr>'; 
    }
}

// 2. Fetch AI Advice
async function fetchAIAdvice() {
    const div = document.getElementById('ai-advice');
    
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/ai/advisor');
        const data = await res.json();
        
        if(data.status === "success") {
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <span class="badge badge-violet">ANALYSIS COMPLETE</span>
                    <span class="mono text-tertiary" style="font-size: 10px;">Target: ${data.product}</span>
                </div>
                <div style="background: rgba(139, 127, 255, 0.05); padding: 16px; border-left: 2px solid var(--violet); border-radius: 0 var(--r-btn) var(--r-btn) 0;">
                    <div style="white-space: pre-wrap; color: var(--text-primary);">${data.advice}</div>
                </div>
                <div style="display: flex; gap: 24px; margin-top: 16px;">
                    <div>
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase;">Your Price</div>
                        <div class="mono" style="font-size: 14px; font-weight: 700;">$${data.my_price}</div>
                    </div>
                    <div>
                        <div class="text-tertiary" style="font-size: 10px; text-transform: uppercase;">Competitor</div>
                        <div class="mono text-red" style="font-size: 14px; font-weight: 700;">$${data.competitor_price}</div>
                    </div>
                </div>
            `;
        } else { 
            div.innerHTML = `<span class="text-red">${data.detail || 'AI failed to respond. Check Groq API key.'}</span>`; 
        }
    } catch(e) { 
        div.innerHTML = '<span class="text-red">Backend asleep. AI unavailable.</span>'; 
    }
}

// Run both on page load
fetchTerminal();
fetchAIAdvice();
