export function formatDate(dateString: string): string {
    if (!dateString) return '-';
    try {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
        }).format(date);
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

export function formatDateDisplay(
    date: Date | string,
    options?: Intl.DateTimeFormatOptions
): string {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const { timeZone, ...rest } = options || {};
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...rest,
        timeZone: timeZone || 'UTC',
    }).format(dateObj);
}
