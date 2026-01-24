'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '@/components/ui/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    // Toast Function
    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-0 right-0 p-6 z-50 pointer-events-none flex flex-col gap-4">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    // Helpers for easier usage
    return {
        show: context.showToast,
        success: (msg) => context.showToast(msg, 'success'),
        error: (msg) => context.showToast(msg, 'error'),
        info: (msg) => context.showToast(msg, 'info'),
    };
}
