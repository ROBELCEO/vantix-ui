async function loadOverview() {
    try {
        // Fetch data from our existing backend endpoints
        const [productsRes, competitorsRes, alertsRes] = await Promise.all([
            fetch('https://vantix-my5f.onrender.com/api/products'),
            fetch('https://vantix-my5f.onrender.com/api/competitors/list'),
            fetch('https://vantix-my5f.onrender.com/api/alerts/list')
        ]);

        const productsData = await productsRes.json();
        const competitorsData = await competitorsRes.json();
        const alertsData = await alertsRes.json();

        // Populate KPIs
        document.getElementById('ov-products').innerText = productsData.products ? productsData.products.length : 0;
        document.getElementById('ov-competitors').innerText = competitorsData.competitors ? competitorsData.competitors.length : 0;
        document.getElementById('ov-alerts').innerText = alertsData.alerts ? alertsData.alerts.length : 0;

    } catch (e) {
        console.error("Failed to load overview data", e);
        // Fallbacks if backend is asleep
        document.getElementById('ov-products').innerText = "-";
        document.getElementById('ov-competitors').innerText = "-";
        document.getElementById('ov-alerts').innerText = "-";
    }
}

// Run on load
loadOverview();
