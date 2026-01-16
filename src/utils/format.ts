/**
 * Utility functions for consistent formatting across the Voyage Bridge platform.
 */

/**
 * Formats a currency amount based on the provided currency code and locale.
 * @param amount - The numerical amount to format.
 * @param currency - The ISO currency code (e.g., 'USD', 'EUR').
 * @param locale - The locale string (defaults to 'en-US').
 */
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return `${currency} ${amount.toFixed(2)}`;
    }
};

/**
 * Formats a date string or object into a human-readable format.
 * @param date - The date to format (string, number, or Date).
 * @param options - Intl.DateTimeFormatOptions.
 */
export const formatDate = (
    date: string | number | Date,
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
): string => {
    try {
        const d = new Date(date);
        return new Intl.DateTimeFormat('en-US', options).format(d);
    } catch (error) {
        console.error('Error formatting date:', error);
        return String(date);
    }
};

/**
 * Capitalizes the first letter of each word in a string.
 */
export const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Formats a percentage value.
 * @param value - The numerical value (e.g., 0.15 for 15%).
 */
export const formatPercent = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(value);
};
