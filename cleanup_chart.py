with open("js/terminal.js", "r", encoding="utf-8") as f:
    code = f.read()

old_chart = '''    if (product.competitor_matches && product.competitor_matches.length > 0) {
        product.competitor_matches.forEach((match, i) => {
            // Use comp_domain (e.g., "Boandtee") for the label, fallback to "Competitor"
            const label = match.comp_domain ? match.comp_domain : 'Competitor';
            labels.push(label);
            data.push(match.comp_price !== null ? match.comp_price : 0);
            backgroundColors.push(compColors[i % compColors.length]);
        });
    } else {'''

new_chart = '''    if (product.competitor_matches && product.competitor_matches.length > 0) {
        // Limit to top 3 matches so the chart doesn't get too crowded
        const topMatches = product.competitor_matches.slice(0, 3);
        topMatches.forEach((match, i) => {
            // Create a short label like "Boandtee: Mini Shorts"
            const domain = match.comp_domain ? match.comp_domain : 'Competitor';
            let shortTitle = match.comp_title ? match.comp_title.substring(0, 15) + '...' : '';
            const label = shortTitle ? `${domain}: ${shortTitle}` : domain;
            
            labels.push(label);
            data.push(match.comp_price !== null ? match.comp_price : 0);
            backgroundColors.push(compColors[i % compColors.length]);
        });
    } else {'''

if old_chart in code:
    code = code.replace(old_chart, new_chart)
    with open("js/terminal.js", "w", encoding="utf-8") as f:
        f.write(code)
    print("✅ Chart labels cleaned up (Top 3 matches, shorter titles).")
else:
    print("⚠️ Could not find chart logic.")
