'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';

export default function BookingDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

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
            // Assuming there's an endpoint to get booking by ID
            // If not, you might need to fetch from the list and filter
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

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'accepted':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cancelled':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking details...</p>
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
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
                <Link href="/bookings" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Back to Bookings</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Booking ID: {booking._id}</p>
                    </div>

                    {/* Vehicle Info */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Vehicle Information</h2>
                        <div className="flex gap-4">
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {booking.vehiclePhoto ? (
                                    <Image
                                        src={booking.vehiclePhoto}
                                        alt={booking.vehicleModel}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.vehicleModel}</h3>
                                <p className="text-sm text-gray-600 mb-1">Type: {booking.vehicleType || 'N/A'}</p>
                                <p className="text-sm text-gray-600">Owner: {booking.ownerName || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Dates */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Booking Period</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Start Date</p>
                                <p className="font-bold text-gray-900">{formatDate(booking.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">End Date</p>
                                <p className="font-bold text-gray-900">{formatDate(booking.endDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Days</p>
                                <p className="font-bold text-gray-900">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Pickup Location</h2>
                        <p className="text-gray-700">{booking.pickupLocation || 'Location not specified'}</p>
                    </div>

                    {/* Pricing */}
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing Details</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rental Price per Day</span>
                                <span className="font-bold">₹{booking.rentalPrice || booking.totalAmount / booking.totalDays}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Number of Days</span>
                                <span className="font-bold">{booking.totalDays}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between">
                                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                <span className="text-lg font-bold text-gray-900">₹{booking.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Special Requests */}
                    {booking.specialRequests && (
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Special Requests</h2>
                            <p className="text-gray-700">{booking.specialRequests}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-6">
                        <div className="flex gap-3">
                            {booking.status === 'accepted' && (
                                <Link
                                    href={`/payment?bookingId=${booking._id}`}
                                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-bold text-center hover:bg-gray-800 transition-all"
                                >
                                    Proceed to Payment
                                </Link>
                            )}
                            {booking.status === 'pending' && (
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to cancel this booking?')) {
                                            // Handle cancel
                                        }
                                    }}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




