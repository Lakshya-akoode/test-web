'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading states
 * Provides loading state and utilities to wrap async operations
 */
export function useLoading(initialState = false) {
    const [loading, setLoading] = useState(initialState);
    const [error, setError] = useState(null);

    const startLoading = useCallback(() => {
        setLoading(true);
        setError(null);
    }, []);

    const stopLoading = useCallback(() => {
        setLoading(false);
    }, []);

    const setLoadingError = useCallback((err) => {
        setError(err);
        setLoading(false);
    }, []);

    /**
     * Wraps an async function with loading state management
     * @param {Function} asyncFn - Async function to execute
     * @param {Object} options - Options for error handling
     * @returns {Promise} Result of the async function
     */
    const withLoading = useCallback(async (asyncFn, options = {}) => {
        const { onError, throwError = false } = options;

        startLoading();
        try {
            const result = await asyncFn();
            stopLoading();
            return result;
        } catch (err) {
            setLoadingError(err);
            if (onError) {
                onError(err);
            }
            if (throwError) {
                throw err;
            }
            return null;
        }
    }, [startLoading, stopLoading, setLoadingError]);

    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
    }, []);

    return {
        loading,
        error,
        startLoading,
        stopLoading,
        setError: setLoadingError,
        withLoading,
        reset
    };
}

/**
 * Hook for managing multiple loading states
 * Useful when you have multiple async operations on the same page
 */
export function useMultipleLoading(keys = []) {
    const [loadingStates, setLoadingStates] = useState(
        keys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );

    const setLoading = useCallback((key, value) => {
        setLoadingStates(prev => ({ ...prev, [key]: value }));
    }, []);

    const startLoading = useCallback((key) => {
        setLoading(key, true);
    }, [setLoading]);

    const stopLoading = useCallback((key) => {
        setLoading(key, false);
    }, [setLoading]);

    const isAnyLoading = Object.values(loadingStates).some(state => state);

    return {
        loadingStates,
        setLoading,
        startLoading,
        stopLoading,
        isAnyLoading
    };
}
