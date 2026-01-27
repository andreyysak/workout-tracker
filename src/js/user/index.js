document.addEventListener('alpine:init', () => {
    Alpine.store('user', {
        avatar: '/src/assets/images/avatar.jpeg',
        created_at: '10.11.2025',
        telegram_username: 'andreyysak',
        telegram_id: 63890176,
        email: 'andreyysak17@gmail.com',
        phone: '0678481657',
        country: 'Ukraine',
        city: 'Khmelnytskyi',
    });

    window.sidebar = Alpine.store('user');
});