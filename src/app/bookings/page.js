'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

            if (!userId) {
                console.error('User ID not found');
                return;
            }

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
            } else {
                console.error('Failed to fetch bookings:', data.message);
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
            active: bookings.filter(b => b.status === 'accepted').length,
            completed: bookings.filter(b => b.status === 'completed').length,
        };
    };

    const getStatusConfig = (status) => {
        const configs = {
            confirmed: {
                color: 'text-green-600',
                bg: 'bg-green-500/10',
                border: 'border-green-500/20',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ),
                label: 'Confirmed'
            },
            accepted: {
                color: 'text-blue-600',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                ),
                label: 'Payment Due',
                pulse: true
            },
            completed: {
                color: 'text-purple-600',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                label: 'Completed'
            },
            rejected: {
                color: 'text-red-600',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ),
                label: 'Rejected'
            },
            cancelled: {
                color: 'text-gray-600',
                bg: 'bg-gray-500/10',
                border: 'border-gray-500/20',
                icon: (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ),
                label: 'Cancelled'
            }
        };
        return configs[status] || configs.confirmed;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    const stats = getStats();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header Section */}
            <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                Dashboard
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Bookings</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                                Track your ongoing rentals, view past trips, and manage booking status.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 md:px-6 -mt-20 z-10">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="text-4xl font-extrabold text-gray-900 mb-1">{stats.total}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="text-4xl font-extrabold text-blue-600 mb-1">{stats.active}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment Due</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="text-4xl font-extrabold text-green-600 mb-1">{stats.confirmed}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Confirmed</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="text-4xl font-extrabold text-purple-600 mb-1">{stats.completed}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl w-fit border border-gray-100 shadow-sm">
                        {[
                            { id: 'all', label: 'All', count: stats.total },
                            { id: 'accepted', label: 'Payment Due', count: stats.active },
                            { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                            { id: 'completed', label: 'Completed', count: stats.completed },
                        ].map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeFilter === filter.id
                                    ? 'bg-black text-white shadow-lg '
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {filter.label}
                                {filter.count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === filter.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        {filter.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {activeFilter === 'all' ? 'No Bookings Yet' : `No ${activeFilter} Bookings`}
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            {activeFilter === 'all'
                                ? 'Start by searching for vehicles and making your first booking!'
                                : `You don't have any ${activeFilter} bookings at the moment.`
                            }
                        </p>
                        {activeFilter === 'all' && (
                            <Link
                                href="/book/car"
                                className="inline-block px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Explore Vehicles
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {filteredBookings.map((booking, index) => {
                            const statusConfig = getStatusConfig(booking.status);
                            return (
                                <div
                                    key={booking._id}
                                    className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-full"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Vehicle Image */}
                                    <div className="relative h-48 sm:h-auto sm:w-2/5 bg-gray-100">
                                        {booking.vehiclePhoto ? (
                                            <img
                                                src={booking.vehiclePhoto}
                                                alt={booking.vehicleModel}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                                        {/* Mobile overlay text */}
                                        <div className="absolute bottom-3 left-3 right-3 sm:hidden">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md bg-white/90 ${statusConfig.color} shadow-sm`}>
                                                {statusConfig.icon} {statusConfig.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Booking Info */}
                                    <div className="flex-1 p-6 flex flex-col relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mb-2 ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}>
                                                    {statusConfig.icon} {statusConfig.label}
                                                </div>
                                                <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1" title={booking.vehicleModel}>
                                                    {booking.vehicleModel}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-medium">Owner: {booking.ownerName || 'Unknown'}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-2xl p-3">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Dates</p>
                                                <p className="text-sm font-bold text-gray-900">{formatDate(booking.startDate)}</p>
                                                <p className="text-xs text-gray-500">to {formatDate(booking.endDate)}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-3">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total</p>
                                                <p className="text-lg font-bold text-gray-900">₹{booking.totalAmount}</p>
                                                <p className="text-xs text-gray-500">{booking.totalDays} Days</p>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <Link
                                                href={`/bookings/${booking._id}`}
                                                className="block w-full py-3 bg-black text-white rounded-xl font-bold text-center text-sm hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl group-hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                View Booking Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
