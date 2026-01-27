import {formatDate} from "../date-fns/index.js";

document.addEventListener('alpine:init', () => {
    Alpine.store('user', {
        avatar: '',
        created_at: '',
        telegram_username: '',
        telegram_id: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        user_id: '',

        get memberSince() {
            return formatDate(this.created_at);
        },

        async getInfo() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })

                if (!response.ok) throw new Error('Unable to get user info');

                const data = await  response.json()

                this.avatar = data.image
                this.created_at = data.created_at
                this.telegram_username = data.telegram_username
                this.telegram_id = data.telegram_user_id
                this.email = data.email
                this.phone = data.phone
                this.country = data.country
                this.city = data.city
                this.user_id = data.user_id

            } catch (error) {
                console.error("Не вдалося отримати дані:", error);
            }
        }
    });

    window.sidebar = Alpine.store('user');
});