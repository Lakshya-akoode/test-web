'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginModal({ isOpen, onClose, message = "Please login to continue" }) {
    const router = useRouter();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/register');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Icon */}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Login Required</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleLogin}
                        className="w-full px-6 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all hover:shadow-lg"
                    >
                        Login to Continue
                    </button>
                    <button
                        onClick={handleSignup}
                        className="w-full px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
                    >
                        Create New Account
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    By continuing, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
}
