'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';

export default function MyBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        setUser(getUser());
        fetchBookings();
    }, [router]);

    useEffect(() => {
        filterBookings();
    }, [activeFilter, bookings]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const userId = getUser()?._id || getUser()?.id;

            if (!userId) return;

            const response = await fetch(`${API_BASE_URL}/bookings/renter/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.status === 'Success') {
                setBookings(data.data || []);
            }
        } catch (error) {
            console.error('Fetch bookings error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        if (activeFilter === 'all') {
            setFilteredBookings(bookings);
        } else {
            setFilteredBookings(bookings.filter(b => b.status === activeFilter));
        }
    };

    const getStats = () => {
        return {
            total: bookings.length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            payment_due: bookings.filter(b => b.status === 'accepted').length, // Mapped 'accepted' to 'Payment Due'
            completed: bookings.filter(b => b.status === 'completed').length,
        };
    };

    const getStatusConfig = (status) => {
        const configs = {
            confirmed: {
                label: 'Confirmed',
                bg: 'bg-green-100',
                text: 'text-green-800',
                dot: 'bg-green-500',
                border: 'border-green-200'
            },
            accepted: {
                label: 'Payment Due',
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                dot: 'bg-blue-500',
                border: 'border-blue-200'
            },
            completed: {
                label: 'Completed',
                bg: 'bg-purple-100',
                text: 'text-purple-800',
                dot: 'bg-purple-500',
                border: 'border-purple-200'
            },
            rejected: {
                label: 'Rejected',
                bg: 'bg-red-100',
                text: 'text-red-800',
                dot: 'bg-red-500',
                border: 'border-red-200'
            },
            cancelled: {
                label: 'Cancelled',
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                dot: 'bg-gray-500',
                border: 'border-gray-200'
            },
            pending: {
                label: 'Pending Approval',
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                dot: 'bg-yellow-500',
                border: 'border-yellow-200'
            }
        };
        return configs[status] || configs.pending;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const stats = getStats();

    // Loading Skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50">
                <section className="bg-black h-64 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-zinc-900"></div>
                </section>
                <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-10">
                    <div className="h-10 w-48 bg-gray-800 rounded-lg mb-8 animate-pulse"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white h-32 rounded-3xl shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                    <div className="h-12 w-full max-w-md bg-gray-200 rounded-xl mb-8 animate-pulse"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white h-48 rounded-3xl shadow-sm animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            {/* Premium Header */}
            <section className="relative bg-black text-white pt-24 pb-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#050505] to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                        <div>
                            <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group text-sm font-medium">
                                <span className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </span>
                                Back to Home
                            </Link>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Journeys</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl font-light">
                                Manage your bookings, track upcoming trips, and view your travel history in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative max-w-7xl mx-auto px-4 md:px-6 -mt-32 z-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Total Bookings', value: stats.total, icon: '🚗', color: 'text-gray-900' },
                        { label: 'Payment Due', value: stats.payment_due, icon: '💳', color: 'text-blue-600' },
                        { label: 'Confirmed', value: stats.confirmed, icon: '✅', color: 'text-green-600' },
                        { label: 'Completed', value: stats.completed, icon: '🏁', color: 'text-purple-600' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-black/5 border border-white/20 transition-transform hover:-translate-y-1 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'accepted', label: 'Payment Due' },
                        { id: 'confirmed', label: 'Confirmed' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'cancelled', label: 'Cancelled' },
                        { id: 'rejected', label: 'Rejected' }
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${activeFilter === filter.id
                                    ? 'bg-black text-white border-black shadow-lg shadow-black/20'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-6">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-3xl">📭</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings found</h3>
                            <p className="text-gray-500 mb-6">Looks like you haven&apos;t made any bookings in this category yet.</p>
                            {activeFilter === 'all' && (
                                <Link href="/home" className="inline-flex items-center justify-center px-8 py-3 bg-black text-white font-bold rounded-xl hover:scale-105 transition-transform">
                                    Start Exploring
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredBookings.map((booking) => {
                            const status = getStatusConfig(booking.status);
                            return (
                                <div key={booking._id} className="group bg-white rounded-3xl p-2 sm:p-3 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300">
                                    <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                                        {/* Image Section */}
                                        <div className="w-full md:w-72 h-48 md:h-auto relative bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                                            {booking.vehiclePhoto ? (
                                                <Image
                                                    src={booking.vehiclePhoto}
                                                    alt={booking.vehicleModel}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${status.bg} ${status.text} border ${status.border}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                                    {status.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 py-2 pr-4 pl-2 md:pl-0 flex flex-col">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                                        {booking.vehicleModel}
                                                    </h3>
                                                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                                        <span>Owned by {booking.ownerName || 'Unknown'}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-gray-900">₹{booking.totalAmount?.toLocaleString()}</div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</div>
                                                </div>
                                            </div>

                                            {/* Details Grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8 py-4 border-t border-b border-gray-50 mb-4">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Start Date</p>
                                                    <p className="font-bold text-gray-900">{formatDate(booking.startDate)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">End Date</p>
                                                    <p className="font-bold text-gray-900">{formatDate(booking.endDate)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</p>
                                                    <p className="font-bold text-gray-900">{booking.totalDays} Days</p>
                                                </div>
                                            </div>

                                            <div className="mt-auto flex justify-end">
                                                <Link
                                                    href={`/bookings/${booking._id}`}
                                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                                                >
                                                    View Details
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
