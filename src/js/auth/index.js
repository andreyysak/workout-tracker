import Alpine from 'alpinejs';

Alpine.store('auth', {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        const isLoginSuccess = window.location.pathname.includes('login-success');

        if (tokenFromUrl && isLoginSuccess) {
            this.setToken(tokenFromUrl);
            return;
        }

        this.checkAuthStatus();
    },

    checkAuthStatus() {
        const isLoginPage = Alpine.store('router')?.currentPage === 'login';

        if (!this.token && !isLoginPage) {
            setTimeout(() => {
                Alpine.store('router').push('login');
            }, 0);
        }
    },

    async setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);

        this.isAuthenticated = true;

        window.history.replaceState({}, document.title, "/");

        if (Alpine.store('router')) {
            Alpine.store('router').push('home');
        }
    },

    loginWithGoogle() {
        const baseUrl = import.meta.env.VITE_GOOGLE_AUTH_URL;
        const currentOrigin = window.location.origin;

        window.location.href = `${baseUrl}?frontendUrl=${currentOrigin}`;
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