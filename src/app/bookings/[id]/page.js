'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';
import API from '@/lib/api';

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
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

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return date.toLocaleDateString('en-IN', options);
    };

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                color: 'text-orange-600',
                bg: 'bg-orange-500/10',
                border: 'border-orange-500/20',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
                label: 'Pending Owner Approval',
                step: 1
            },
            confirmed: {
                color: 'text-green-600',
                bg: 'bg-green-500/10',
                border: 'border-green-500/20',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ),
                label: 'Confirmed by Owner',
                step: 3
            },
            accepted: {
                color: 'text-blue-600',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                ),
                label: 'Payment Required',
                step: 2
            },
            completed: {
                color: 'text-purple-600',
                bg: 'bg-purple-500/10',
                border: 'border-purple-500/20',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
                label: 'Trip Completed',
                step: 4
            },
            rejected: {
                color: 'text-red-600',
                bg: 'bg-red-500/10',
                border: 'border-red-500/20',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ),
                label: 'Rejected by Owner',
                step: 0
            },
            cancelled: {
                color: 'text-gray-600',
                bg: 'bg-gray-500/10',
                border: 'border-gray-500/20',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                ),
                label: 'Cancelled',
                step: 0
            }
        };
        return configs[status] || configs.pending;
    };

    const getProgress = () => {
        const steps = [
            { id: 'requested', label: 'Requested', icon: '📝' },
            { id: 'payment', label: 'Payment', icon: '💳' }, // Swapped for correct flow logic if needed, adapting based on backend status flow
            { id: 'approved', label: 'Confirmed', icon: '👍' },
            // Note: Flow might be Requested -> Owner Accepts (Payment Due) -> User Pays (Confirmed) -> Active -> Completed
            // Adjusting steps based on statusConfig logic above:
            // 1: Pending (Requested)
            // 2: Accepted (Payment Required)
            // 3: Confirmed (Active)
            // 4: Completed
            { id: 'active', label: 'Active', icon: '🚗' },
            { id: 'completed', label: 'Completed', icon: '✔️' }
        ];

        // Simplified steps for visualisation
        const visualSteps = [
            { id: 'requested', label: 'Requested', step: 1 },
            { id: 'payment', label: 'Payment', step: 2 },
            { id: 'confirmed', label: 'Confirmed', step: 3 },
            { id: 'completed', label: 'Completed', step: 4 }
        ];

        const config = getStatusConfig(booking?.status);
        const currentStep = config.step;

        return visualSteps.map((step) => ({
            ...step,
            isComplete: step.step < currentStep,
            isCurrent: step.step === currentStep,
            isPending: step.step > currentStep
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50/50">
                <section className="bg-black h-64 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-zinc-900"></div>
                </section>
                <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-10">
                    <div className="h-80 bg-white rounded-3xl shadow-sm animate-pulse mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-48 bg-white rounded-3xl shadow-sm animate-pulse"></div>
                            <div className="h-32 bg-white rounded-3xl shadow-sm animate-pulse"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-64 bg-white rounded-3xl shadow-sm animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            {/* Premium Header */}
            <section className="relative bg-black text-white pt-24 pb-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#050505] to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>

                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>

                <div className="relative max-w-6xl mx-auto px-6 z-10">
                    <Link href="/bookings" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group text-sm font-medium">
                        <span className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </span>
                        Back to Bookings
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-md border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                                Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">#{booking._id.slice(-6).toUpperCase()}</span>
                            </h1>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative max-w-6xl mx-auto px-6 -mt-32 z-10">
                {/* Hero Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-8">
                    <div className="relative h-64 md:h-96 w-full bg-gray-900 group">
                        {booking.vehiclePhoto ? (
                            <Image
                                src={booking.vehiclePhoto}
                                alt={booking.vehicleModel}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                            <h2 className="text-3xl md:text-5xl font-black mb-2">{booking.vehicleModel}</h2>
                            <div className="flex items-center gap-2 text-white/80">
                                <span className="p-1 bg-white/20 rounded-full">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                <span>Owned by {booking.ownerName}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Timeline (Only active bookings) */}
                {booking.status !== 'rejected' && booking.status !== 'cancelled' && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
                        <div className="relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded-full transition-all duration-1000"
                                style={{ width: `${((statusConfig.step - 1) / 3) * 100}%` }}
                            ></div>

                            <div className="relative flex justify-between">
                                {progress.map((step) => (
                                    <div key={step.id} className="flex flex-col items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all z-10 ${step.isComplete ? 'bg-black border-black text-white' :
                                                step.isCurrent ? 'bg-white border-black text-black scale-110' :
                                                    'bg-white border-gray-200 text-gray-300'
                                            }`}>
                                            {step.isComplete ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            ) : (
                                                <span className="text-xs font-bold">{step.step}</span>
                                            )}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${step.isComplete || step.isCurrent ? 'text-black' : 'text-gray-400'
                                            }`}>{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Booking Period */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">🗓️</span>
                                Trip Schedule
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
                                    <p className="text-lg font-bold text-gray-900">{formatDate(booking.startDate)}</p>
                                    <p className="text-xs text-gray-500">10:00 AM</p>
                                </div>
                                <div className="hidden md:flex items-center justify-center text-gray-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-right md:text-left">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">End Date</p>
                                    <p className="text-lg font-bold text-gray-900">{formatDate(booking.endDate)}</p>
                                    <p className="text-xs text-gray-500">10:00 AM</p>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">📍</span>
                                Pickup Location
                            </h3>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-lg mb-1">{booking.pickupLocation || 'Location details provided by owner'}</p>
                                    <p className="text-gray-500 text-sm">Please arrive 10 minutes before the scheduled time.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary & Payment */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Price per day</span>
                                    <span className="font-medium">₹{Math.round((booking.totalAmount || 0) / (booking.totalDays || 1))}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-medium">{booking.totalDays} Days</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Platform Fee</span>
                                    <span className="font-medium text-green-600">Included</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-black text-gray-900">₹{booking.totalAmount}</span>
                                </div>
                            </div>

                            {booking.status === 'pending' && (
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={cancelling}
                                    className="w-full py-3.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    {cancelling ? 'Processing...' : 'Cancel Booking'}
                                </button>
                            )}
                        </div>

                        {/* Support / Help */}
                        <div className="bg-gray-900 rounded-3xl p-6 text-white text-center">
                            <p className="font-bold mb-2">Need Help?</p>
                            <p className="text-sm text-gray-400 mb-4">Have questions about your booking?</p>
                            <Link href="/contact" className="inline-block px-6 py-2 bg-white text-black rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
