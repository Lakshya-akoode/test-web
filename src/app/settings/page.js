'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, getUser, clearAuth, getToken } from '@/lib/auth';
import API from '@/lib/api';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        setUser(getUser());
    }, [router]);

    const handleLogout = async () => {
        if (!confirm('Are you sure you want to logout?')) return;

        setLoading(true);
        try {
            const token = getToken();
            const response = await fetch(API.logout, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.status === 'Success') {
                clearAuth();
                router.push('/login');
            } else {
                // Even if API fails, clear local auth
                clearAuth();
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
            clearAuth();
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const SettingItem = ({ icon, title, description, onClick, href }) => {
        const content = (
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-200">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-0.5 text-xs">{title}</h3>
                    {description && (
                        <p className="text-[10px] text-slate-600 leading-tight line-clamp-1">{description}</p>
                    )}
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        );

        if (href) {
            return <Link href={href}>{content}</Link>;
        }

        return <div onClick={onClick}>{content}</div>;
    };

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden flex flex-col">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-3 flex-shrink-0">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-xl font-extrabold mb-1 leading-tight">Settings</h1>
                    <p className="text-xs text-slate-300">Manage your account and preferences</p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-4xl mx-auto px-4 py-2 flex-1 overflow-y-auto">

                {/* User Profile Card */}
                {user && (
                    <div className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center text-white text-lg font-extrabold shadow-md">
                                {(user.Name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-sm font-bold text-slate-900 mb-0.5">{user.Name || 'User'}</h2>
                                <p className="text-xs text-slate-600">{user.email || user.mobile || 'No contact info'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings Options */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        <SettingItem
                            icon={
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            }
                            title="Your Account"
                            description="See information about your account, rental history"
                            href="/settings/account"
                        />
                        <SettingItem
                            icon={
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            }
                            title="Security and Account Access"
                            description="Manage your account's security"
                            href="/settings/security"
                        />
                        <SettingItem
                            icon={
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            }
                            title="Messages"
                            description="View your conversations"
                            href="/messages"
                        />
                        <SettingItem
                            icon={
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                            title="Manage Zugo Account"
                            description="Update your profile, change password, view history"
                            href="/settings/profile"
                        />
                        <SettingItem
                            icon={
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            }
                            title="Notifications"
                            description="Select notification preferences"
                            href="/settings/notifications"
                        />
                        <SettingItem
                            icon={
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                            title="Help"
                            description="Need assistance? We're here to help"
                            href="/help"
                        />
                        <SettingItem
                            icon={
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            }
                            title="Legal"
                            description="Check out helpful information about Zugo"
                            href="/legal"
                        />
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full mt-3 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                    {loading ? 'Logging out...' : 'Sign Out'}
                </button>
            </section>
        </div>
    );
}

