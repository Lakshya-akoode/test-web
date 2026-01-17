'use client';

import { useState } from 'react';
import { API } from '@/lib/api';

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(API.contactSend, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.status === 'Success') {
                setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to send message.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {status.message && (
                <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status.message}
                </div>
            )}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="How can we help you?"
                ></textarea>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
