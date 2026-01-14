'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

function ToastContainer({ toasts, onRemove }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }) {
    const { id, message, type } = toast;

    const styles = {
        success: {
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-800',
            icon: '✓',
            iconBg: 'bg-green-100 text-green-600'
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-800',
            icon: '✕',
            iconBg: 'bg-red-100 text-red-600'
        },
        warning: {
            bg: 'bg-orange-50 border-orange-200',
            text: 'text-orange-800',
            icon: '⚠',
            iconBg: 'bg-orange-100 text-orange-600'
        },
        info: {
            bg: 'bg-blue-50 border-blue-200',
            text: 'text-blue-800',
            icon: 'ℹ',
            iconBg: 'bg-blue-100 text-blue-600'
        }
    };

    const style = styles[type] || styles.info;

    return (
        <div
            className={`${style.bg} border ${style.text} rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slide-in pointer-events-auto backdrop-blur-sm`}
        >
            <div className={`w-8 h-8 ${style.iconBg} rounded-full flex items-center justify-center flex-shrink-0 font-bold`}>
                {style.icon}
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onRemove(id)}
                className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
