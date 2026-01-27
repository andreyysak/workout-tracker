import { Alpine } from "alpinejs";

Alpine.store('modal', {
    currentModal: null,
    justOpened: false,

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const modal = urlParams.get('modal');
        if (modal) {
            this.open(modal);
        }
    },

    open(modalName) {
        if (this.currentModal !== null) {
            this.close();
        }
        this.currentModal = modalName;
        this.justOpened = true;
        document.querySelector('html').classList.add('app--fix');

        setTimeout(() => {
            this.justOpened = false;
        }, 10);
    },

    toggle(modalName) {
        if (this.isOpen(modalName)) {
            this.close();
        } else {
            this.open(modalName);
        }
    },

    isOpen(modalName) {
        return this.currentModal === modalName;
    },

    close() {
        window.dispatchEvent(new CustomEvent('close-modal'));
        this.currentModal = null;
        document.querySelector('html').classList.remove('app--fix');
    },

    handleOutsideClick(modalName) {
        if (this.justOpened) {
            return;
        }
        if (this.isOpen(modalName)) {
            this.close();
        }
    }
});

window.modal = Alpine.store('modal');
