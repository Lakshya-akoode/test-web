'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { getAdminAuthHeaders } from '@/lib/adminAuth';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API.endpoint}contact/messages`, {
                // Using the public endpoint for now as per previous step discussion, 
                // but practically this should be secured. 
                // For now, let's pass headers just in case backend adds middleware later.
                headers: getAdminAuthHeaders()
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setMessages(data.data.messages || []);
            } else {
                setError('Failed to load messages');
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('An error occurred while loading messages');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                {error}
                <button
                    onClick={fetchMessages}
                    className="block mx-auto mt-2 text-sm font-semibold underline"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Messages & Inquiries</h2>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    Total: {messages.length}
                </span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Date</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Name</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Email</th>
                                <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {messages.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No messages found.
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {msg.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <a href={`mailto:${msg.email}`} className="hover:text-blue-600 hover:underline">
                                                {msg.email}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                            <p className="line-clamp-2 hover:line-clamp-none transition-all cursor-default">
                                                {msg.message}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
