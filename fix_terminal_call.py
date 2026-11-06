with open("js/terminal.js", "r", encoding="utf-8") as f:
    code = f.read()

old_call = "    fetchAIAdvice(product.my_product, product.my_price, product.my_cost, compPrice, safeFloor);"

new_call = '''    let compTitle = null;
    let matchConfidence = null;
    if (product.competitor_matches && product.competitor_matches.length > 0) {
        compTitle = product.competitor_matches[0].comp_title;
        matchConfidence = product.competitor_matches[0].confidence;
    }
    fetchAIAdvice(product.my_product, product.my_price, product.my_cost, compPrice, safeFloor, compTitle, matchConfidence);'''

if old_call in code:
    code = code.replace(old_call, new_call)
    with open("js/terminal.js", "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ terminal.js: Updated fetchAIAdvice call with similarity data.")
else:
    print("⚠️ Could not find the exact old call string.")
