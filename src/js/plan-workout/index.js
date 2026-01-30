import Alpine from 'alpinejs';

Alpine.store('plannedWorkout', {
    items: [],
    isLoading: false,

    currentDate: new Date(),
    selectedDate: new Date(),

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
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                this.items = await response.json();
            }
        } catch (err) {
            console.error("Помилка завантаження:", err);
        } finally { this.isLoading = false; }
    },

    get weekDays() {
        const start = new Date(this.currentDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return {
                full: date,
                number: date.getDate(),
                name: date.toLocaleDateString('uk-UA', { weekday: 'short' }),
                isToday: date.toDateString() === new Date().toDateString(),
                isSelected: date.toDateString() === this.selectedDate.toDateString(),
                hasPlans: this.items.some(p => new Date(p.scheduled_at).toDateString() === date.toDateString())
            };
        });
    },

    get currentMonthYear() {
        return this.currentDate.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
    },

    get filteredItems() {
        return this.items.filter(item =>
            new Date(item.scheduled_at).toDateString() === this.selectedDate.toDateString()
        ).sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
    },

    changeWeek(direction) {
        const newDate = new Date(this.currentDate);
        newDate.setDate(this.currentDate.getDate() + (direction * 7));
        this.currentDate = newDate;
    },

    selectDate(date) {
        this.selectedDate = date;
    },

    addExerciseToForm() {
        this.formData.exercises.push({ exercise_id: '', sets_count: 1, reps_goal: '' });
    },

    removeExerciseFromForm(index) {
        this.formData.exercises.splice(index, 1);
    },

    resetForm() {
        this.formData = { title: '', scheduled_at: '', exercises: [], notes: '' };
    },

    async save() {
        if (!this.formData.title || !this.formData.scheduled_at) return alert("Заповніть поля");
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
                await this.loadPlanned();
                this.resetForm();
                Alpine.store('modal').close('planned-modal');
            }
        } catch (err) { console.error(err); }
    },

    async deletePlanned(id) {
        if (!confirm('Видалити цей план?')) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/planned-workouts/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.status === 204) {
                this.items = this.items.filter(i => i.planned_workout_id !== id);
            }
        } catch (err) { console.error(err); }
    },

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Перевірка на валідність дати
        if (isNaN(date.getTime())) return dateString;

        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('uk-UA', options);
    }
});