with open("js/terminal.js", "r", encoding="utf-8") as f:
    code = f.read()

# 1. Revert the AI fetch logic to use the first (highest similarity) match
old_logic = '''    let compPrice = null;
    let safeFloor = null;
    if (product.competitor_matches && product.competitor_matches.length > 0) {
        const validComps = product.competitor_matches.filter(m => m.comp_price !== null && m.comp_price !== undefined);
        if (validComps.length > 0) {
            // Find the cheapest competitor to anchor the AI advice
            const cheapest = validComps.reduce((prev, curr) => (prev.comp_price < curr.comp_price) ? prev : curr);
            compPrice = cheapest.comp_price;
            safeFloor = cheapest.safe_floor;
        }
    }
    fetchAIAdvice(product.my_product, product.my_price, product.my_cost, compPrice, safeFloor);'''

new_logic = '''    let compPrice = null;
    let safeFloor = null;
    let compTitle = null;
    let matchConfidence = null;
    
    if (product.competitor_matches && product.competitor_matches.length > 0) {
        // Use the #1 match (Highest Similarity)
        const topMatch = product.competitor_matches[0];
        compPrice = topMatch.comp_price;
        safeFloor = topMatch.safe_floor;
        compTitle = topMatch.comp_title;
        matchConfidence = topMatch.confidence;
    }
    // Pass the similarity confidence to the AI
    fetchAIAdvice(product.my_product, product.my_price, product.my_cost, compPrice, safeFloor, compTitle, matchConfidence);'''

if old_logic in code:
    code = code.replace(old_logic, new_logic)
else:
    print("⚠️ Could not find old logic in terminal.js")

# 2. Update the fetchAIAdvice function to send the new params
old_fetch = '''        if (compPrice !== undefined && compPrice !== null) url.searchParams.append('comp_price', compPrice);
        if (safeFloor !== undefined && safeFloor !== null) url.searchParams.append('safe_floor', safeFloor);'''

new_fetch = '''        if (compPrice !== undefined && compPrice !== null) url.searchParams.append('comp_price', compPrice);
        if (safeFloor !== undefined && safeFloor !== null) url.searchParams.append('safe_floor', safeFloor);
        if (compTitle !== undefined && compTitle !== null) url.searchParams.append('comp_title', compTitle);
        if (matchConfidence !== undefined && matchConfidence !== null) url.searchParams.append('match_confidence', matchConfidence);'''

if old_fetch in code:
    code = code.replace(old_fetch, new_fetch)

# 3. Update the function signature
old_sig = "async function fetchAIAdvice(productName, myPrice, myCost, compPrice, safeFloor) {"
new_sig = "async function fetchAIAdvice(productName, myPrice, myCost, compPrice, safeFloor, compTitle, matchConfidence) {"
code = code.replace(old_sig, new_sig)

with open("js/terminal.js", "w", encoding="utf-8") as f:
    f.write(code)
print("✅ terminal.js updated to pass similarity data to AI.")
