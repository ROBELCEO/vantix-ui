function toggleMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if(drawer && overlay) {
        if(drawer.classList.contains('open')){
            drawer.classList.remove('open');
            overlay.style.display = 'none';
        } else {
            drawer.classList.add('open');
            overlay.style.display = 'block';
        }
    }
}
