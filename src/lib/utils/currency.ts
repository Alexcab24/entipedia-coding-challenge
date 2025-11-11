export function formatCurrency(value: number, currency: string = 'DOP'): string {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function parseCurrency(value: string): number {

    const cleaned = value.replace(/[^\d.,]/g, '');
    const normalized = cleaned.replace(',', '.');
    return parseFloat(normalized) || 0;
}

