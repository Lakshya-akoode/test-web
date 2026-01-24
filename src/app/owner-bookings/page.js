'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';

export default function OwnerBookingsPage() {
    const router = useRouter();
    const toast = useToast();
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
                toast.error(data.message || 'Failed to update booking status');
            }
        } catch (error) {
            console.error('Update status error:', error);
            toast.error('Error updating booking status: ' + error.message);
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
                toast.error(data.message || 'Failed to complete booking');
            }
        } catch (error) {
            console.error('Complete booking error:', error);
            toast.error('Error completing booking');
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
            in_progress: bookings.filter(b => b.status === 'in_progress').length,
            completed: bookings.filter(b => b.status === 'completed').length,
        };
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bg: 'bg-yellow-400',
                text: 'text-white',
                label: 'Pending Review',
                icon: '⏳',
                pulse: true
            },
            accepted: {
                bg: 'bg-blue-600',
                text: 'text-white',
                label: 'Accepted',
                icon: '✓'
            },
            confirmed: {
                bg: 'bg-emerald-500',
                text: 'text-white',
                label: 'Confirmed',
                icon: '📅'
            },
            in_progress: {
                bg: 'bg-orange-500',
                text: 'text-white',
                label: 'Ride Ongoing',
                icon: '🛵',
                pulse: true
            },
            completed: {
                bg: 'bg-purple-600',
                text: 'text-white',
                label: 'Completed',
                icon: '🎉'
            },
            rejected: {
                bg: 'bg-red-500',
                text: 'text-white',
                label: 'Rejected',
                icon: '✕'
            },
            cancelled: {
                bg: 'bg-gray-500',
                text: 'text-white',
                label: 'Cancelled',
                icon: '⊘'
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading requests...</p>
                </div>
            </div>
        );
    }

    const stats = getStats();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            {/* Payment Mode Selection Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 p-8 transform scale-100 transition-all">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                💸
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Accept Booking</h3>
                            <p className="text-gray-500">How will the renter pay for this ride?</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <label
                                className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${paymentMode === 'online'
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-white'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMode"
                                    value="online"
                                    checked={paymentMode === 'online'}
                                    onChange={() => setPaymentMode('online')}
                                    className="w-5 h-5 text-black focus:ring-black border-gray-300"
                                />
                                <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900">Online Payment</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-md">Recommended</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">Via Zugo Platform (Secure)</p>
                                </div>
                            </label>

                            <label
                                className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${paymentMode === 'offline'
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-white'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMode"
                                    value="offline"
                                    checked={paymentMode === 'offline'}
                                    onChange={() => setPaymentMode('offline')}
                                    className="w-5 h-5 text-black focus:ring-black border-gray-300"
                                />
                                <div className="ml-4">
                                    <span className="font-bold text-gray-900">Cash / Offline</span>
                                    <p className="text-sm text-gray-500 mt-1">Collect directly from renter</p>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-4 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAccept}
                                disabled={processing}
                                className="flex-1 px-4 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing
                                    </>
                                ) : (
                                    'Confirm Accept'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Header */}
            <div className="bg-white border-b border-gray-100 pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Link href="/home" className="text-sm font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to Home
                            </Link>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                            Owner <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Bookings</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-2 text-lg">Manage requests and track your vehicle earnings.</p>
                    </div>
                    <Link
                        href="/create-rental"
                        className="inline-flex items-center gap-2 px-6 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Manual Booking
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-white' },
                        { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50/50' },
                        { label: 'Accepted', value: stats.accepted, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                        { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600', bg: 'bg-green-50/50' },
                        { label: 'Ongoing', value: stats.in_progress, color: 'text-orange-600', bg: 'bg-orange-50/50' },
                        { label: 'Completed', value: stats.completed, color: 'text-purple-600', bg: 'bg-purple-50/50' },
                    ].map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center`}>
                            <span className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 mb-8 flex gap-1 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'pending', label: 'Pending' },
                        { id: 'accepted', label: 'Accepted' },
                        { id: 'confirmed', label: 'Confirmed' },
                        { id: 'in_progress', label: 'Ongoing' },
                        { id: 'completed', label: 'Completed' },
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeFilter === filter.id
                                ? 'bg-black text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            {filter.label}
                            {activeFilter === filter.id && <span className="ml-2 opacity-70 bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{stats[filter.id] || stats.total}</span>}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl opacity-50">📭</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {activeFilter === 'all'
                                ? "You haven't received any bookings yet. Ensure your vehicles are listed and verified!"
                                : `You don't have any bookings with status "${activeFilter}".`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredBookings.map((booking, index) => {
                            const statusConfig = getStatusConfig(booking.status);
                            return (
                                <div
                                    key={booking._id}
                                    className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                                >
                                    {/* Card Image Header */}
                                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                                        {booking.vehiclePhoto ? (
                                            <img
                                                src={booking.vehiclePhoto}
                                                alt={booking.vehicleModel}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                        {/* Status Badge */}
                                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md ${statusConfig.bg} shadow-lg ring-1 ring-white/20 flex items-center gap-1.5 ${statusConfig.pulse ? 'animate-pulse' : ''}`}>
                                            <span className="text-sm">{statusConfig.icon}</span>
                                            <span className="text-xs font-bold text-white uppercase tracking-wide">
                                                {statusConfig.label}
                                            </span>
                                        </div>

                                        {/* Bottom Info on Image */}
                                        <div className="absolute bottom-5 left-5 right-5 text-white">
                                            <p className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1">Renter</p>
                                            <p className="text-xl font-bold truncate">{booking.renterName || 'Unknown User'}</p>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-lg font-black text-gray-900 line-clamp-1">{booking.vehicleModel}</h3>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-600">{booking.totalDays} Days</span>
                                                    <span>•</span>
                                                    <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                                                <p className="text-xl font-black text-gray-900">₹{booking.totalAmount}</p>
                                            </div>
                                        </div>

                                        {/* Payment Status Bar */}
                                        <div className="bg-gray-50 rounded-xl p-3 mb-6 flex items-center justify-between border border-gray-100 group-hover:border-gray-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                                                <span className="text-xs font-bold text-gray-600 uppercase">Payment Status</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newStatus = booking.paymentStatus === 'paid' ? 'pending' : 'paid';
                                                    handleStatusUpdate(booking._id, booking.status, null, newStatus);
                                                }}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${booking.paymentStatus === 'paid'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    }`}
                                            >
                                                {booking.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                                            </button>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto grid gap-3">
                                            {booking.status === 'pending' && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => handleActionClick(booking._id, 'accepted')}
                                                        className="py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl text-sm"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionClick(booking._id, 'rejected')}
                                                        className="py-3 bg-white text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-50 transition-colors text-sm"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {booking.status === 'accepted' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                                                >
                                                    Confirm Handover
                                                </button>
                                            )}

                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'in_progress')}
                                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                                                >
                                                    <span>Start Ride</span> <span className="text-white/60">→</span>
                                                </button>
                                            )}

                                            {booking.status === 'in_progress' && (
                                                <button
                                                    onClick={() => handleCompleteBooking(booking._id)}
                                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl font-bold hover:shadow-lg transition-all text-sm"
                                                >
                                                    Complete Ride
                                                </button>
                                            )}

                                            <Link
                                                href={`/bookings/${booking._id}`}
                                                className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors text-center text-sm"
                                            >
                                                View Request Details
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
