'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, getUser, setAuth, clearAuth, isAuthenticated } from '@/lib/auth';

/**
 * Custom hook for authentication management
 * Provides user state, authentication status, and auth operations
 */
export function useAuth(options = {}) {
    const { redirectTo = '/login', redirectIfAuthenticated = null } = options;
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            const currentUser = getUser();

            setUser(currentUser);
            setLoading(false);

            if (!authenticated && redirectTo) {
                router.push(redirectTo);
            } else if (authenticated && redirectIfAuthenticated) {
                router.push(redirectIfAuthenticated);
            }
        };

        checkAuth();
    }, [router, redirectTo, redirectIfAuthenticated]);

    const login = useCallback((token, userData) => {
        setAuth(token, userData);
        setUser(userData);
    }, []);

    const logout = useCallback(() => {
        clearAuth();
        setUser(null);
        if (redirectTo) {
            router.push(redirectTo);
        }
    }, [router, redirectTo]);

    const updateUser = useCallback((userData) => {
        const token = getToken();
        if (token) {
            setAuth(token, userData);
            setUser(userData);
        }
    }, []);

    return {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser,
        token: getToken()
    };
}

/**
 * Hook that requires authentication
 * Automatically redirects to login if not authenticated
 */
export function useRequireAuth() {
    return useAuth({ redirectTo: '/login' });
}

/**
 * Hook that redirects authenticated users away
 * Useful for login/register pages
 */
export function useGuestOnly(redirectTo = '/home') {
    return useAuth({ redirectIfAuthenticated: redirectTo });
}
