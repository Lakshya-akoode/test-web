'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';
import API from '@/lib/api';

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter(); // Changed order to match others for consistency
    const toast = useToast();
    const { id } = params;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        if (id) {
            fetchBookingDetails();
        }
    }, [id, router]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.status === 'Success') {
                setBooking(data.data);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            setCancelling(true);
            const token = getToken();
            const response = await fetch(API.cancelBooking, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: booking._id,
                    reason: 'Cancelled by user'
                })
            });

            const data = await response.json();
            if (data.status === 'Success') {
                toast.success('Booking cancelled successfully');
                fetchBookingDetails();
            } else {
                toast.error(data.message || 'Failed to cancel booking');
            }
        } catch (error) {
            console.error('Cancel booking error:', error);
            toast.error('Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'from-orange-500 to-orange-600',
                bg: 'bg-orange-50',
                text: 'text-orange-700',
                icon: '⏳',
                label: 'Pending Owner Approval',
                step: 1
            },
            confirmed: {
                color: 'from-green-500 to-emerald-600',
                bg: 'bg-green-50',
                text: 'text-green-700',
                icon: '✓',
                label: 'Confirmed by Owner',
                step: 3
            },
            accepted: {
                color: 'from-blue-500 to-indigo-600',
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                icon: '💳',
                label: 'Payment Required',
                step: 2
            },
            completed: {
                color: 'from-purple-500 to-violet-600',
                bg: 'bg-purple-50',
                text: 'text-purple-700',
                icon: '🎉',
                label: 'Trip Completed',
                step: 4
            },
            rejected: {
                color: 'from-red-500 to-red-600',
                bg: 'bg-red-50',
                text: 'text-red-700',
                icon: '✕',
                label: 'Rejected by Owner',
                step: 0
            },
            cancelled: {
                color: 'from-gray-400 to-gray-500',
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                icon: '⊘',
                label: 'Cancelled',
                step: 0
            }
        };
        return configs[status] || configs.pending;
    };

    const getProgress = () => {
        const steps = [
            { id: 'requested', label: 'Requested', icon: '📝' },
            { id: 'approved', label: 'Owner Accepts', icon: '👍' },
            { id: 'payment', label: 'Payment', icon: '💳' },
            { id: 'active', label: 'Active', icon: '🚗' },
            { id: 'completed', label: 'Completed', icon: '✔️' }
        ];

        const config = getStatusConfig(booking.status);
        const currentStep = config.step;

        return steps.map((step, index) => ({
            ...step,
            isComplete: index < currentStep,
            isCurrent: index === currentStep,
            isPending: index > currentStep
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
                    <Link href="/bookings" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                        Back to Bookings
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(booking.status);
    const progress = getProgress();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <Link href="/bookings" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Bookings</span>
                    </Link>
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Booking <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Details</span>
                        </h1>
                        <p className="text-xl text-slate-300">View and manage your booking information</p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                    <div className="relative h-80 bg-gradient-to-br from-gray-900 to-gray-700">
                        {booking.vehiclePhoto ? (
                            <>
                                <img
                                    src={booking.vehiclePhoto}
                                    alt={booking.vehicleModel}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}

                        {/* Overlay Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <div className="flex items-end justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg">
                                        {booking.vehicleModel}
                                    </h1>
                                    <p className="text-lg text-white/90 mb-1">Owner: {booking.ownerName || 'N/A'}</p>
                                    <p className="text-sm text-white/75">Booking ID: {booking._id.slice(-8)}</p>
                                </div>
                                <div className={`px-6 py-3 rounded-2xl backdrop-blur-md ${statusConfig.bg} border-2 border-white/20`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{statusConfig.icon}</span>
                                        <div>
                                            <div className={`text-xs font-medium ${statusConfig.text}`}>Status</div>
                                            <div className={`text-lg font-bold ${statusConfig.text}`}>{statusConfig.label}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Timeline */}
                {booking.status !== 'rejected' && booking.status !== 'cancelled' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Progress</h2>
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
                            <div
                                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000"
                                style={{ width: `${(statusConfig.step / 4) * 100}%` }}
                            ></div>

                            {/* Steps */}
                            <div className="relative flex justify-between">
                                {progress.map((step, index) => (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${step.isComplete
                                                ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg'
                                                : step.isCurrent
                                                    ? `bg-gradient-to-br ${statusConfig.color} text-white shadow-lg animate-pulse`
                                                    : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {step.icon}
                                        </div>
                                        <p className={`text-xs font-medium text-center max-w-[80px] ${step.isComplete || step.isCurrent ? 'text-gray-900' : 'text-gray-500'
                                            }`}>
                                            {step.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Period */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Period</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                                    <p className="text-xs text-blue-600 font-medium mb-1">Start Date</p>
                                    <p className="text-lg font-bold text-blue-900">{formatDate(booking.startDate)}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
                                    <p className="text-xs text-purple-600 font-medium mb-1">End Date</p>
                                    <p className="text-lg font-bold text-purple-900">{formatDate(booking.endDate)}</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                                    <p className="text-xs text-green-600 font-medium mb-1">Duration</p>
                                    <p className="text-lg font-bold text-green-900">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</p>
                                </div>
                            </div>
                        </div>

                        {/* Pickup Location */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Pickup Location</h2>
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-700 flex-1">{booking.pickupLocation || 'Location not specified'}</p>
                            </div>
                        </div>

                        {/* Special Requests */}
                        {booking.specialRequests && (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Special Requests</h2>
                                <p className="text-gray-700 p-4 bg-gray-50 rounded-2xl">{booking.specialRequests}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Summary & Actions */}
                    <div className="space-y-6">
                        {/* Price Summary - Sticky */}
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 lg:sticky lg:top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Price per day</span>
                                    <span className="font-bold">₹{Math.round(booking.totalAmount / booking.totalDays)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Number of days</span>
                                    <span className="font-bold">{booking.totalDays}</span>
                                </div>
                                <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-3xl font-extrabold text-gray-900">₹{booking.totalAmount}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 space-y-3">
                                {booking.status === 'pending' && (
                                    <button
                                        onClick={handleCancelBooking}
                                        disabled={cancelling}
                                        className="w-full px-6 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                                    >
                                        {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Owner Info */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-lg p-6 text-white">
                            <h2 className="text-lg font-bold mb-4">Vehicle Owner</h2>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold">
                                        {(booking.ownerName || 'O').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-lg">{booking.ownerName || 'Owner'}</p>
                                    {booking.ownerPhone && (
                                        <p className="text-sm text-white/75">{booking.ownerPhone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
