import Alpine from "alpinejs";

Alpine.store('modal', {
    currentModal: null,
    justOpened: false,

    init() {
        // Перевірка URL при завантаженні
        const urlParams = new URLSearchParams(window.location.search);
        const modal = urlParams.get('modal');
        if (modal) this.open(modal);
    },

    open(modalName) {
        this.currentModal = modalName;
        this.justOpened = true;
        document.documentElement.classList.add('app--fix');

        // Захист від миттєвого закриття (outside click)
        setTimeout(() => { this.justOpened = false; }, 100);
    },

    isOpen(modalName) {
        return this.currentModal === modalName;
    },

    close() {
        this.currentModal = null;
        document.documentElement.classList.remove('app--fix');
        window.dispatchEvent(new CustomEvent('close-modal'));
    }
});