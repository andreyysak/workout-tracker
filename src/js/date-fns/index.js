import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';

export const formatDate = (dateString) => {
    if (!dateString) return '';

    try {
        const date = parseISO(dateString);
        return format(date, 'd MMMM yyyy', { locale: uk });
    } catch (error) {
        console.error("Помилка форматування дати:", error);
        return dateString;
    }
};