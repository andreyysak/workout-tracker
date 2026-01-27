document.addEventListener('alpine:init', () => {
    Alpine.store('router', {
        currentPage: 'home',

        push(page) {
            this.currentPage = page;

            const url = page === 'home' ? '/' : `/${page}`;
            window.history.pushState({ page }, '', url);
        },

        init() {
            window.addEventListener('popstate', (event) => {
                if (event.state && event.state.page) {
                    this.currentPage = event.state.page;
                } else {
                    this.currentPage = 'home';
                }
            });
        }
    });
});