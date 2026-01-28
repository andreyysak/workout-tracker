import Chart from 'chart.js/auto';
import Alpine from "alpinejs";

export function initWorkoutChart() {
    // 1. Використовуємо setTimeout або дочікуємося наступного тіку,
    // щоб <load> компоненти встигли відрендеритись
    setTimeout(() => {
        const canvas = document.getElementById('workoutChart');
        if (!canvas) {
            console.error("Canvas element #workoutChart not found");
            return;
        }

        const ctx = canvas.getContext('2d');
        const store = Alpine.store('workout');

        // Створюємо графік з початковими даними
        const chart = new Chart(ctx, {
            type: 'line',
            data: store.chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: document.body.classList.contains('dark-mode') ? '#fff' : '#666',
                            font: { size: 12, weight: 'bold' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        cornerRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: '#999' },
                        grid: { color: 'rgba(200, 200, 200, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#999' },
                        grid: { display: false }
                    }
                }
            }
        });

        // 2. Реактивне оновлення при зміні даних у сторі
        Alpine.effect(() => {
            const newData = store.chartData;
            if (newData.labels.length > 0) {
                chart.data = newData;
                chart.update('none'); // Оновлюємо без зайвої анімації для плавності
            }
        });
    }, 100);
}