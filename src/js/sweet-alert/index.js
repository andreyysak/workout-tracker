import Swal from "sweetalert2";

export const successAddWorkout = () => {
    return Swal.fire({
        title: 'Успішно',
        text: 'Тренування успішно створено',
        icon: "success",
        confirmButtonColor: '#7ed321',
        timer: 2000
    });
};