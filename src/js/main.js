import Alpine from 'alpinejs'

window.Alpine = Alpine

import './auth/index.js'
import './sidebar/index.js'
import './modal/index.js'
import './route/index.js'
import './user/index.js'
import './workout/index.js'

Alpine.start()

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        Alpine.store('user').getInfo();
    }
});