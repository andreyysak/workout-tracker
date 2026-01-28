import Alpine from 'alpinejs';

Alpine.store('plannedWorkout', {
    items: [],
    isLoading: false,

    formData: {
        title: '',
        scheduled_at: '',
        notes: '',
        exercises: []
    },

    async loadPlanned() {
        this.isLoading = true;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/planned-workouts/me`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                this.items = await response.json();
            }
        } catch (err) {
            console.error("Помилка завантаження запланованих тренувань:", err);
        } finally {
            this.isLoading = false;
        }
    },

    addExerciseToForm() {
        this.formData.exercises.push({
            exercise_id: '',
            sets_count: 1,
            reps_goal: ''
        });
    },

    removeExerciseFromForm(index) {
        this.formData.exercises.splice(index, 1);
    },

    prepareForm() {
        this.resetForm();
        Alpine.store('modal').open('planned-modal');
    },

    resetForm() {
        this.formData = {
            title: '',
            scheduled_at: '',
            exercises: []
        };
    },

    async save() {
        if (!this.formData.title || !this.formData.scheduled_at) {
            alert("Заповніть назву та дату");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/planned-workouts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(this.formData)
            });

            if (response.ok) {
                const newPlan = await response.json();
                this.items.push(newPlan);
                this.items.sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));

                this.resetForm();
                Alpine.store('modal').close('planned-modal');
                return true;
            }
        } catch (err) {
            console.error("Помилка створення плану:", err);
            return false;
        }
    },

    async deletePlanned(id) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/planned-workouts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 204) {
                this.items = this.items.filter(item => item.planned_workout_id !== id);
                return true;
            }
        } catch (err) {
            console.error("Помилка видалення плану:", err);
            return false;
        }
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('uk-UA', options);
    }
});