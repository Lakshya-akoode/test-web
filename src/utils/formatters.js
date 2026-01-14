/**
 * Utility functions for formatting data
 */

/**
 * Format date to localized string
 * @param {string|Date} dateString - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, options = {}) {
    if (!dateString) return 'N/A';

    const defaultOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options
    };

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-IN', defaultOptions);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format date to short format (e.g., "Jan 15, 2026")
 */
export function formatDateShort(dateString) {
    return formatDate(dateString, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Format date to time string
 */
export function formatTime(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Time';
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'Invalid Time';
    }
}

/**
 * Format date and time together
 */
export function formatDateTime(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid DateTime';
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return 'Invalid DateTime';
    }
}

/**
 * Format currency (Indian Rupees)
 * @param {number} amount - Amount to format
 * @param {boolean} showDecimals - Whether to show decimal places
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showDecimals = false) {
    if (amount === null || amount === undefined) return '₹0';

    try {
        const numAmount = Number(amount);
        if (isNaN(numAmount)) return '₹0';

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0
        }).format(numAmount);
    } catch (error) {
        console.error('Error formatting currency:', error);
        return '₹0';
    }
}

/**
 * Format number with Indian numbering system
 */
export function formatNumber(number) {
    if (number === null || number === undefined) return '0';

    try {
        const num = Number(number);
        if (isNaN(num)) return '0';
        return new Intl.NumberFormat('en-IN').format(num);
    } catch (error) {
        console.error('Error formatting number:', error);
        return '0';
    }
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone) {
    if (!phone) return 'N/A';

    const cleaned = phone.toString().replace(/\D/g, '');

    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }

    return phone;
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return formatDate(dateString);
    } catch (error) {
        console.error('Error getting relative time:', error);
        return 'N/A';
    }
}

/**
 * Calculate duration between two dates
 */
export function calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return 0;

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffInMs = end - start;
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
        return diffInDays > 0 ? diffInDays : 0;
    } catch (error) {
        console.error('Error calculating duration:', error);
        return 0;
    }
}

/**
 * Truncate text to specified length
 */
export function truncateText(text, maxLength = 100, suffix = '...') {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + suffix;
}
