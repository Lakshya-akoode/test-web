'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser } from '@/lib/auth';

/**
 * Higher-Order Component for protecting routes
 * Wraps a component and ensures user is authenticated before rendering
 * 
 * @param {React.Component} Component - Component to protect
 * @param {Object} options - Configuration options
 * @returns {React.Component} Protected component
 */
export function withAuth(Component, options = {}) {
    const {
        redirectTo = '/login',
        requiredRole = null,
        fallback: Fallback = LoadingFallback
    } = options;

    return function ProtectedComponent(props) {
        const router = useRouter();

        useEffect(() => {
            const checkAuth = () => {
                const authenticated = isAuthenticated();

                if (!authenticated) {
                    router.push(redirectTo);
                    return;
                }

                // Role-based access control
                if (requiredRole) {
                    const user = getUser();
                    if (user?.role !== requiredRole) {
                        router.push('/unauthorized');
                    }
                }
            };

            checkAuth();
        }, [router]);

        if (!isAuthenticated()) {
            return <Fallback />;
        }

        // Optional role check
        if (requiredRole) {
            const user = getUser();
            if (user?.role !== requiredRole) {
                return <UnauthorizedFallback />;
            }
        }

        return <Component {...props} />;
    };
}

/**
 * HOC for admin-only routes
 */
export function withAdminAuth(Component, options = {}) {
    return withAuth(Component, {
        ...options,
        requiredRole: 'admin',
        redirectTo: '/admin/login'
    });
}

/**
 * HOC for guest-only routes (login, register)
 * Redirects to home if already authenticated
 */
export function withGuestOnly(Component, redirectTo = '/home') {
    return function GuestOnlyComponent(props) {
        const router = useRouter();

        useEffect(() => {
            if (isAuthenticated()) {
                router.push(redirectTo);
            }
        }, [router]);

        if (isAuthenticated()) {
            return <LoadingFallback />;
        }

        return <Component {...props} />;
    };
}

// Default loading fallback
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
}

// Unauthorized access fallback
function UnauthorizedFallback() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access this page.
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default withAuth;
