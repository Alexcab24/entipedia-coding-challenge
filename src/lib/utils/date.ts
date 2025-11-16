import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(dateString: string): string {
    if (!dateString) return '-';
    try {
      
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return format(date, 'dd/MM/yyyy', { locale: es });
    } catch {
        return dateString;
    }
}

export function parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    try {
     
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    } catch {
        return null;
    }
}


export function formatDateToLocalString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


export function parseLocalDateString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

