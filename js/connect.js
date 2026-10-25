async function checkConnectionStatus() {
    try {
        const res = await fetch('https://vantix-my5f.onrender.com/api/shopify/status');
        const data = await res.json();
        
        const unconnectedView = document.getElementById('view-unconnected');
        const connectedView = document.getElementById('view-connected');
        
        if(data.connected) {
            unconnectedView.style.display = 'none';
            connectedView.style.display = 'block';
            document.getElementById('connected-domain').innerText = data.domain;
        } else {
            unconnectedView.style.display = 'block';
            connectedView.style.display = 'none';
        }
    } catch(e) {
        console.error("Status check failed", e);
        document.getElementById('view-unconnected').style.display = 'block';
    }
}

checkConnectionStatus();
