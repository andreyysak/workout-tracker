document.addEventListener('alpine:init', () => {
    Alpine.store('sidebar', {
        isOpen: false,
        isDark: document.body.classList.contains('dark-mode'),
        toggle() {
            this.isOpen = !this.isOpen;
        },
        toggleTheme() {
            this.isDark = !this.isDark
            document.body.classList.toggle('dark-mode', this.isDark);
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        }
    });

    window.sidebar = Alpine.store('sidebar');
});