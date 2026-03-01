'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, getToken } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import API from '@/lib/api';

import { Suspense } from 'react';

function BookingConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const orderId = searchParams.get('order_id');
    
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'failed'

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        if (bookingId) {
            if (orderId) {
                // If order_id is present, we need to verify payment first
                verifyPaymentAndFetchDetails();
            } else {
                // Just fetch details
                fetchBookingDetails();
            }
        }
    }, [bookingId, orderId, router]);

    const verifyPaymentAndFetchDetails = async () => {
        setVerifying(true);
        setLoading(true);
        try {
            const token = getToken();
            console.log('Verifying payment for booking:', bookingId, 'Order:', orderId);
            
            // Call verify payment API
            const verifyRes = await fetch(API.verifyPayment, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    orderId: orderId
                })
            });
            
            const verifyData = await verifyRes.json();
            console.log('Verification result:', verifyData);

            if (verifyData.status === 'Success') {
                setVerificationStatus('success');
                // Could use the booking returned from verification, but let's fetch fresh details to be consistent
                if (verifyData.data && verifyData.data.booking) {
                    setBooking(verifyData.data.booking);
                } else {
                    await fetchBookingDetails();
                }
            } else {
                setVerificationStatus('failed');
            }

        } catch (error) {
            console.error('Payment verification error:', error);
            setVerificationStatus('failed');
        } finally {
            setLoading(false);
            setVerifying(false);
        }
    };

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_BOOKING}/${bookingId}`, {
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading || verifying) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">{verifying ? 'Verifying payment status...' : 'Loading confirmation...'}</p>
                </div>
            </div>
        );
    }

    if (verificationStatus === 'failed') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                    <p className="text-gray-600 mb-6">We couldn't verify your payment. If money was deducted, it will be refunded automatically.</p>
                    <Link href={`/bookings/${bookingId}`} className="block w-full px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all">
                        View Booking / Try Again
                    </Link>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
                    <Link href="/bookings" className="px-6 py-2 bg-black text-white rounded-lg">Go Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600">Your vehicle rental has been successfully booked</p>
                </div>

                {/* Confirmation Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
                    <div className="text-center mb-6">
                        <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
                            Booking ID: {booking._id?.slice(-8).toUpperCase()}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Vehicle Info */}
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                    src={booking.vehiclePhoto || '/static_bike.png'}
                                    alt={booking.vehicleModel || 'Vehicle'}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.vehicleModel}</h3>
                                <p className="text-sm text-gray-600">Owner: {booking.ownerName || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Start Date</span>
                                <span className="font-bold text-gray-900">{formatDate(booking.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">End Date</span>
                                <span className="font-bold text-gray-900">{formatDate(booking.endDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Days</span>
                                <span className="font-bold text-gray-900">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pickup Location</span>
                                <span className="font-bold text-gray-900 text-right max-w-xs">{booking.pickupLocation || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Trip Amount</span>
                                <span className="font-bold text-gray-900">₹{booking.totalAmount}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-200 flex justify-between">
                                <span className="text-lg text-gray-600">Advance Paid (10%)</span>
                                <span className="text-xl font-bold text-gray-900">₹{Math.round(booking.totalAmount * 0.1)}</span>
                            </div>
                            <div className="pt-2 flex justify-between">
                                <span className="text-xl font-bold text-gray-900">Balance Due at Pickup</span>
                                <span className="text-2xl font-black text-blue-600">₹{booking.totalAmount - Math.round(booking.totalAmount * 0.1)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-3">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>You will receive a confirmation email shortly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Contact the owner to arrange pickup details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Make sure to bring valid ID and driving license</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href={`/bookings/${booking._id}`}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold text-center hover:bg-gray-200 transition-all"
                    >
                        View Booking Details
                    </Link>
                    <Link
                        href="/bookings"
                        className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-bold text-center hover:bg-gray-800 transition-all"
                    >
                        My Bookings
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function BookingConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading confirmation...</p>
                </div>
            </div>
        }>
            <BookingConfirmationContent />
        </Suspense>
    );
}
