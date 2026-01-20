'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';

export default function OwnerBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [paymentMode, setPaymentMode] = useState('online');
    const [processing, setProcessing] = useState(false);

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
            const userData = getUser();
            const userId = userData?._id || userData?.id;

            if (!userId) {
                console.error('User ID not found');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/bookings/owner/${userId}`, {
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

    const handleActionClick = (bookingId, action) => {
        if (action === 'accepted') {
            setSelectedBookingId(bookingId);
            setPaymentMode('online'); // Reset to default
            setShowPaymentModal(true);
        } else {
            handleStatusUpdate(bookingId, action);
        }
    };

    const confirmAccept = async () => {
        if (!selectedBookingId) return;
        await handleStatusUpdate(selectedBookingId, 'accepted', paymentMode);
        setShowPaymentModal(false);
        setSelectedBookingId(null);
    };

    const handleStatusUpdate = async (bookingId, newStatus, selectedPaymentMode = null, paymentStatus = null) => {
        try {
            setProcessing(true);
            const token = getToken();
            const userData = getUser();
            const ownerId = userData?._id || userData?.id;

            const body = {
                bookingId,
                status: newStatus,
                ownerId: ownerId
            };

            if (selectedPaymentMode) {
                body.paymentMethod = selectedPaymentMode;
            }

            if (paymentStatus) {
                body.paymentStatus = paymentStatus;
            }

            const response = await fetch(`${API_BASE_URL}/bookings/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            // Handle non-JSON responses (like 404 Not Found HTML/Text)
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                const text = await response.text();
                throw new Error(`Server returned non-JSON response: ${text}`);
            }

            if (data.status === 'Success') {
                fetchBookings();
            } else {
                alert(data.message || 'Failed to update booking status');
            }
        } catch (error) {
            console.error('Update status error:', error);
            alert('Error updating booking status: ' + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleCompleteBooking = async (bookingId) => {
        try {
            if (!window.confirm('Are you sure you want to mark this booking as completed?')) return;

            setProcessing(true);
            const token = getToken();
            const userData = getUser();
            const ownerId = userData?._id || userData?.id;

            const response = await fetch(`${API_BASE_URL}/bookings/complete`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId,
                    ownerId
                })
            });

            const data = await response.json();
            if (data.status === 'Success') {
                fetchBookings();
            } else {
                alert(data.message || 'Failed to complete booking');
            }
        } catch (error) {
            console.error('Complete booking error:', error);
            alert('Error completing booking');
        } finally {
            setProcessing(false);
        }
    };

    const getStats = () => {
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            accepted: bookings.filter(b => b.status === 'accepted').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            completed: bookings.filter(b => b.status === 'completed').length,
        };
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'from-orange-500 to-orange-600',
                bg: 'bg-orange-50',
                text: 'text-orange-700',
                border: 'border-orange-200',
                icon: '⏳',
                label: 'Pending Approval',
                pulse: true
            },
            accepted: {
                color: 'from-blue-500 to-indigo-600',
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                border: 'border-blue-200',
                icon: '✓',
                label: 'Accepted'
            },
            confirmed: {
                color: 'from-green-500 to-emerald-600',
                bg: 'bg-green-50',
                text: 'text-green-700',
                border: 'border-green-200',
                icon: '✓',
                label: 'Confirmed'
            },
            completed: {
                color: 'from-purple-500 to-violet-600',
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                border: 'border-purple-200',
                icon: '🎉',
                label: 'Completed'
            },
            rejected: {
                color: 'from-red-500 to-red-600',
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                icon: '✕',
                label: 'Rejected'
            },
            cancelled: {
                color: 'from-gray-400 to-gray-500',
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                border: 'border-gray-200',
                icon: '⊘',
                label: 'Cancelled'
            }
        };
        return configs[status] || configs.pending;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    const stats = getStats();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Payment Mode Selection Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Accept Booking</h3>
                            <p className="text-gray-600 mb-6">Please select how the renter will make the payment.</p>

                            <div className="space-y-3 mb-8">
                                <label
                                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'online'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMode"
                                        value="online"
                                        checked={paymentMode === 'online'}
                                        onChange={() => setPaymentMode('online')}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <div className="ml-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">Online Payment</span>
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Recommended</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Secure payment via Zugo Platform</p>
                                    </div>
                                </label>

                                <label
                                    className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'offline'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMode"
                                        value="offline"
                                        checked={paymentMode === 'offline'}
                                        onChange={() => setPaymentMode('offline')}
                                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <div className="ml-4">
                                        <span className="font-bold text-gray-900">Cash / Offline</span>
                                        <p className="text-sm text-gray-500 mt-1">Collect payment directly from renter</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAccept}
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Accept'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <Link href="/home" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Owner <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Bookings</span>
                        </h1>
                        <p className="text-xl text-slate-300">Manage and review booking requests for your vehicles</p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="text-3xl font-extrabold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
                        <div className="text-3xl font-extrabold text-orange-700">{stats.pending}</div>
                        <div className="text-sm text-orange-600 mt-1">Pending</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                        <div className="text-3xl font-extrabold text-blue-700">{stats.accepted}</div>
                        <div className="text-sm text-blue-600 mt-1">Accepted</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200">
                        <div className="text-3xl font-extrabold text-green-700">{stats.confirmed}</div>
                        <div className="text-sm text-green-600 mt-1">Confirmed</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                        <div className="text-3xl font-extrabold text-purple-700">{stats.completed}</div>
                        <div className="text-sm text-purple-600 mt-1">Completed</div>
                    </div>
                </div>

                {/* Create Manual Booking Button */}
                <div className="mb-6">
                    <Link
                        href="/create-rental"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Manual Booking
                    </Link>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-6 flex gap-2 overflow-x-auto">
                    {[
                        { id: 'all', label: 'All', count: stats.total },
                        { id: 'pending', label: 'Pending', count: stats.pending },
                        { id: 'accepted', label: 'Accepted', count: stats.accepted },
                        { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                        { id: 'completed', label: 'Completed', count: stats.completed },
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeFilter === filter.id
                                ? 'bg-black text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {filter.label} {filter.count > 0 && `(${filter.count})`}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {activeFilter === 'all' ? 'No Bookings Yet' : `No ${activeFilter} Bookings`}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {activeFilter === 'all'
                                ? "You haven't received any booking requests yet."
                                : `You don't have any ${activeFilter} bookings at the moment.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredBookings.map((booking, index) => {
                            const statusConfig = getStatusConfig(booking.status);
                            return (
                                <div
                                    key={booking._id}
                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative">
                                        {/* Vehicle Image with Gradient Overlay */}
                                        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
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
                                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                            {/* Status Badge */}
                                            <div className={`absolute top-4 right-4 px-3 py-2 rounded-xl backdrop-blur-md ${statusConfig.bg} ${statusConfig.border} border-2 ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{statusConfig.icon}</span>
                                                    <span className={`text-xs font-bold ${statusConfig.text}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Vehicle Name Overlay */}
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                                                    {booking.vehicleModel}
                                                </h3>
                                                <p className="text-sm text-white/90 drop-shadow">
                                                    Renter: {booking.renterName || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Info */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600 font-medium">Booking Period</span>
                                                </div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {formatDate(booking.startDate)}
                                                </p>
                                                <p className="text-sm font-bold text-gray-900">
                                                    to {formatDate(booking.endDate)}
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-xs text-gray-600 font-medium">Total Amount</span>
                                                </div>
                                                <p className="text-2xl font-extrabold text-gray-900">
                                                    ₹{booking.totalAmount}
                                                </p>

                                                {/* Payment Status Toggle */}
                                                <div className="mt-2 flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">Payment:</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newStatus = booking.paymentStatus === 'paid' ? 'pending' : 'paid';
                                                            handleStatusUpdate(booking._id, booking.status, null, newStatus);
                                                        }}
                                                        className={`px-2 py-1 rounded-md text-xs font-bold transition-all ${booking.paymentStatus === 'paid'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                            }`}
                                                    >
                                                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                                            {booking.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleActionClick(booking._id, 'accepted')}
                                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all text-center shadow-lg hover:shadow-xl text-sm"
                                                    >
                                                        ✓ Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionClick(booking._id, 'rejected')}
                                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all text-center shadow-lg hover:shadow-xl text-sm"
                                                    >
                                                        ✕ Reject
                                                    </button>
                                                </div>
                                            )}

                                            {booking.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all text-center shadow-md text-sm"
                                                >
                                                    Confirm Booking
                                                </button>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleCompleteBooking(booking._id)}
                                                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-violet-700 transition-all text-center shadow-md text-sm"
                                                >
                                                    Mark as Completed
                                                </button>
                                            )}

                                            <Link
                                                href={`/bookings/${booking._id}`}
                                                className={`w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all text-center text-sm`}
                                            >
                                                View Details
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
