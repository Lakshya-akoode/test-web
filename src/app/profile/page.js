'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getToken, clearAuth } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchUserProfile();
    }, [router]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_USER}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setUser(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Hero Section */}
            <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                <div className="relative max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-black rounded-full border-4 border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                <span className="text-3xl font-bold text-gray-300 group-hover:scale-110 transition-transform duration-300">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
                                    {user?.fullName || user?.username || 'User Profile'}
                                </h1>
                                <p className="text-gray-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {user?.userType === 'owner' ? 'Vehicle Owner' : 'Verified Renter'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-all backdrop-blur-md flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="relative max-w-5xl mx-auto px-4 md:px-6 -mt-20 z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column: Personal Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                    <p className="font-semibold text-gray-900 text-lg">{user?.fullName || 'Not set'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                                    <p className="font-semibold text-gray-900 text-lg">@{user?.username}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <p className="font-semibold text-gray-900 text-lg break-all">{user?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                                    <p className="font-semibold text-gray-900 text-lg">{user?.mobile || 'Not linked'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Created</label>
                                    <p className="font-semibold text-gray-900">{new Date(user?.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Start a new journey</h3>
                                <p className="text-blue-100 mb-6 max-w-sm">Ready for your next adventure? Browse our premium fleet of cars and bikes.</p>
                                <Link href="/home" className="inline-block px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
                                    Browse Vehicles
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Links</h2>
                            <div className="space-y-3">
                                <Link href="/bookings" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">My Bookings</h3>
                                        <p className="text-xs text-gray-500">View your trip history</p>
                                    </div>
                                    <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <Link href="/my-vehicles" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">My Vehicles</h3>
                                        <p className="text-xs text-gray-500">Manage your fleet</p>
                                    </div>
                                    <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <Link href="/contact-us" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Support</h3>
                                        <p className="text-xs text-gray-500">Get help & FAQs</p>
                                    </div>
                                    <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="bg-black text-white rounded-3xl p-6 shadow-xl">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account Status</h2>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="font-bold text-lg">Active Member</span>
                            </div>
                            <p className="text-xs text-gray-400">Since {new Date(user?.createdAt).getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
