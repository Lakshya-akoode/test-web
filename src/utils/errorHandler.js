/**
 * Centralized error handling utilities
 */

/**
 * Extract user-friendly error message from various error formats
 * @param {Error|Object|string} error - Error object or message
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error) {
    // Handle string errors
    if (typeof error === 'string') {
        return error;
    }

    // Handle API response errors
    if (error?.response) {
        const { data, status } = error.response;

        // Handle common HTTP status codes
        switch (status) {
            case 400:
                return data?.message || 'Invalid request. Please check your input.';
            case 401:
                return 'Authentication required. Please log in.';
            case 403:
                return 'You don\'t have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 409:
                return data?.message || 'Conflict: This action cannot be completed.';
            case 422:
                return data?.message || 'Validation error. Please check your input.';
            case 429:
                return 'Too many requests. Please try again later.';
            case 500:
                return 'Server error. Please try again later.';
            case 503:
                return 'Service temporarily unavailable. Please try again later.';
            default:
                return data?.message || 'An unexpected error occurred.';
        }
    }

    // Handle network errors
    if (error?.message === 'Network Error') {
        return 'Network error. Please check your internet connection.';
    }

    // Handle timeout errors
    if (error?.code === 'ECONNABORTED') {
        return 'Request timeout. Please try again.';
    }

    // Handle Error objects
    if (error instanceof Error) {
        return error.message || 'An unexpected error occurred.';
    }

    // Handle API error format from your backend
    if (error?.message) {
        return error.message;
    }

    // Default fallback
    return 'An unexpected error occurred. Please try again.';
}

/**
 * Log error to console in development, and to error service in production
 * @param {Error} error - Error to log
 * @param {Object} context - Additional context about the error
 */
export function logError(error, context = {}) {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
        if (Object.keys(context).length > 0) {
            console.error('Context:', context);
        }
    } else {
        // TODO: Send to error tracking service (e.g., Sentry)
        // Sentry.captureException(error, { extra: context });
    }
}

/**
 * Handle API errors consistently
 * @param {Error} error - Error from API call
 * @param {Object} options - Error handling options
 * @returns {Object} Processed error object
 */
export function handleApiError(error, options = {}) {
    const {
        showToast = false,
        toast = null,
        logToConsole = true,
        context = {}
    } = options;

    const message = getErrorMessage(error);

    if (logToConsole) {
        logError(error, context);
    }

    if (showToast && toast) {
        toast.error(message);
    }

    return {
        message,
        status: error?.response?.status || 500,
        error
    };
}

/**
 * Validate API response
 * @param {Object} response - API response
 * @throws {Error} If response indicates failure
 */
export function validateApiResponse(response) {
    if (!response) {
        throw new Error('No response received from server');
    }

    if (response.status === 'Error' || response.status === 'Failed') {
        throw new Error(response.message || 'API request failed');
    }

    if (!response.data && response.status !== 'Success') {
        throw new Error('Invalid response format');
    }

    return response;
}

/**
 * Create a standardized API error
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} data - Additional error data
 * @returns {Object} Formatted error object
 */
export function createApiError(message, status = 500, data = {}) {
    return {
        message,
        status,
        data,
        isApiError: true
    };
}

/**
 * Check if error is a specific type
 */
export const isNetworkError = (error) => {
    return error?.message === 'Network Error' || !navigator.onLine;
};

export const isAuthError = (error) => {
    return error?.response?.status === 401 || error?.status === 401;
};

export const isValidationError = (error) => {
    return error?.response?.status === 422 || error?.status === 422;
};

export const isNotFoundError = (error) => {
    return error?.response?.status === 404 || error?.status === 404;
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of the function
 */
export async function retryWithBackoff(fn, options = {}) {
    const {
        maxRetries = 3,
        initialDelay = 1000,
        maxDelay = 10000,
        shouldRetry = (error) => isNetworkError(error)
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries || !shouldRetry(error)) {
                throw error;
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay));

            // Exponential backoff
            delay = Math.min(delay * 2, maxDelay);
        }
    }

    throw lastError;
}
