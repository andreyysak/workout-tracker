import Alpine from 'alpinejs';

Alpine.store('workout', {
    workouts: [],
    exercises: [],
    formData: {
        workout_id: null,
        name: '',
        sets: []
    },
    editMode: false,
    isLoading: false,

    async loadAllData(userId) {
        this.isLoading = true;
        await Promise.all([
            this.loadWorkouts(userId),
            this.loadExercises(userId)
        ]);
        this.isLoading = false;
    },

    async loadWorkouts(userId) {
        try {
            // Маршрут згідно з таблицею: /api/workout/user/:userId
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/workout/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) this.workouts = await res.json();
        } catch (err) { console.error("Помилка завантаження тренувань:", err); }
    },

    async loadExercises(userId) {
        try {
            // Маршрут згідно з таблицею: /api/exercise/user/:userId
            const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/exercise/user/${userId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) this.exercises = await res.json();
        } catch (err) { console.error("Помилка завантаження вправ:", err); }
    },

    async createNewExercise(name) {
        // Беремо ID прямо зі стору користувача, щоб не передавати його щоразу
        const userId = Alpine.store('user').user_id;
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            console.error("Помилка: Немає ID користувача або токена", { userId, token });
            return;
        }

        try {
            console.log("Відправка запиту на створення вправи...");
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/exercise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: Number(userId),
                    name: name,
                    category: 'Силові',
                    equipment: 'Немає'
                })
            });

            if (response.status === 401) {
                console.error("401: Токен недійсний або прострочений");
                return;
            }

            if (!response.ok) {
                const errBody = await response.json();
                console.error("Помилка сервера:", errBody);
                throw new Error("Server error");
            }

            const newEx = await response.json();
            this.exercises.push(newEx);

            return newEx.exercise_id;
        } catch (err) {
            console.error("Критична помилка:", err);
        }
    },

    prepareForm() {
        this.editMode = false;
        this.resetForm();
        this.addSet();
        Alpine.store('modal').open('workout-modal');
    },

    addSet() {
        this.formData.sets.push({ exercise_id: '', weight: null, reps: null });
    },

    removeSet(index) {
        this.formData.sets.splice(index, 1);
        if (this.formData.sets.length === 0) this.addSet();
    },

    resetForm() {
        this.formData = { workout_id: null, name: '', sets: [] };
    },

    async save(userId) {
        if (this.formData.sets.some(s => !s.exercise_id)) {
            alert("Оберіть вправу для кожного підходу");
            return;
        }

        const method = this.editMode ? 'PUT' : 'POST';
        const url = this.editMode
            ? `${import.meta.env.VITE_BACKEND_API_URL}/workout/${this.formData.workout_id}`
            : `${import.meta.env.VITE_BACKEND_API_URL}/workout`;

        this.isLoading = true;
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ ...this.formData, user_id: userId })
            });

            if (response.ok) {
                await this.loadWorkouts(userId);
                Alpine.store('modal').close();
                this.resetForm();
            }
        } catch (err) { alert("Помилка збереження"); }
        this.isLoading = false;
    }
});