import Alpine from 'alpinejs';

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    } catch (e) {
        return true;
    }
};

Alpine.store('auth', {
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    publicPages: ['login'],

    init() {
        this.handleUrlToken();

        if (this.token && isTokenExpired(this.token)) {
            this.logout();
        } else if (this.token) {
            this.isAuthenticated = true;
        }

        Alpine.effect(() => {
            const currentPage = Alpine.store('router')?.currentPage;
            if (currentPage) {
                this.verifyAccess(currentPage);
            }
        });
    },

    handleUrlToken() {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            this.setToken(tokenFromUrl);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    },

    verifyAccess(page) {
        if (this.token && isTokenExpired(this.token)) {
            this.logout();
            return;
        }

        const isPublic = this.publicPages.includes(page);
        const hasToken = !!this.token;

        if (!isPublic && !hasToken) {
            Alpine.store('router').push('login');
            return;
        }

        if (hasToken && page === 'login') {
            Alpine.store('router').push('home');
        }
    },

    async setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
        this.isAuthenticated = true;

        if (Alpine.store('router')) {
            Alpine.store('router').push('home');
        }
    },

    loginWithGoogle() {
        const baseUrl = import.meta.env.VITE_GOOGLE_AUTH_URL;
        window.location.href = `${baseUrl}?frontendUrl=${window.location.origin}`;
    },

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');

        if (Alpine.store('router')) {
            Alpine.store('router').push('login');
        }
    }
});