'use client';

import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Small delay to allow enter animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for exit animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-black text-white',
        error: 'bg-red-600 text-white',
        info: 'bg-white text-gray-900 border border-gray-200'
    };

    const icons = {
        success: (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div
            className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                } ${bgColors[type]}`}
        >
            <div className="shrink-0">
                {icons[type]}
            </div>
            <p className="font-bold text-sm">{message}</p>
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                }}
                className="ml-2 hover:opacity-70 transition-opacity"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
