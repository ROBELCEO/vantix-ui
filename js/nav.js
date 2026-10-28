// Master Navigation Header for Vantix
function renderMasterHeader() {
    const path = window.location.pathname;
    
    // Helper to set active class
    const isActive = (page) => path.includes(page) ? 'active' : '';
    
    // 1. Desktop Navigation Tabs
    const tabs = [
        { name: 'Connect', file: 'index.html' },
        { name: 'Overview', file: 'overview.html' },
        { name: 'My Store', file: 'store.html' },
        { name: 'Competitors', file: 'competitors.html' },
        { name: 'Terminal', file: 'terminal.html' },
        { name: 'Discovery', file: 'discovery.html' },
        { name: 'Alerts', file: 'alerts.html' },
        { name: 'Inventory', file: 'inventory.html' },
        { name: 'Membership', file: 'membership.html' },
        { name: 'Settings', file: 'settings.html' }
    ];

    let desktopTabsHTML = '';
    let mobileTabsHTML = '';

    tabs.forEach(tab => {
        const activeClass = isActive(tab.file);
        desktopTabsHTML += `<a href="${tab.file}" class="tab ${activeClass}">${tab.name}</a>`;
        mobileTabsHTML += `<a href="${tab.file}" class="drawer-tab ${activeClass}">${tab.name}</a>`;
    });

    // 2. Build the Header HTML
    const headerHTML = `
        <div class="drawer-overlay" id="drawer-overlay" onclick="toggleMenu()"></div>
        <div class="drawer" id="mobile-drawer">
            <div class="drawer-header">
                <div class="brand"><div>VANTI<span>X</span></div></div>
                <button class="drawer-close" onclick="toggleMenu()">✕</button>
            </div>
            ${mobileTabsHTML}
        </div>

        <div class="header">
            <a href="index.html" class="brand">
                <div class="mark"><svg viewBox="0 0 32 32"><rect x="0.5" y="0.5" width="31" height="31" fill="#000" stroke="#2A2A2A" stroke-width="1"/><polyline points="6.5,8 14.5,24 24,8" fill="none" stroke="#00E5FF" stroke-width="3.2" stroke-linejoin="miter" stroke-linecap="square"/><rect x="22" y="5.5" width="5" height="5" fill="#00FF88"/></svg></div>
                <div>VANTI<span>X</span></div>
            </a>
            <div class="tabs">
                ${desktopTabsHTML}
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div id="user-email" style="font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono);">loading...</div>
                <button onclick="logOut()" id="logout-btn" class="btn btn-secondary" style="padding: 6px 12px; font-size: 11px; display: none;">Log Out</button>
                <button class="mobile-menu-btn" onclick="toggleMenu()">☰</button>
            </div>
        </div>
    `;

    // 3. Inject into the page
    const container = document.getElementById('master-nav-container');
    if (container) {
        container.innerHTML = headerHTML;
    }
}

// Run immediately when script loads
renderMasterHeader();
