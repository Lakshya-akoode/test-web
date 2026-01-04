'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';
import API from '@/lib/api';

export default function MyBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        setUser(getUser());
        fetchBookings();
    }, [router]);

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

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending Owner Approval';
            case 'accepted':
                return 'Accepted - Payment Required';
            case 'rejected':
                return 'Rejected by Owner';
            case 'completed':
                return 'Trip Completed';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
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
                    <p className="text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden flex flex-col">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-3 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-xl font-extrabold mb-1 leading-tight">My Bookings</h1>
                    <p className="text-xs text-slate-300">View and manage all your vehicle rental bookings</p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 py-2 flex-1 overflow-y-auto">

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1">No Bookings Yet</h3>
                        <p className="text-xs text-gray-600 mb-3">Start by searching for vehicles and making your first booking!</p>
                        <Link
                            href="/book/bike"
                            className="inline-block px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md text-xs"
                        >
                            Search Vehicles
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-xl p-3 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                            >
                                <div className="flex gap-3">
                                    {/* Vehicle Image */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                        {booking.vehiclePhoto ? (
                                            <img
                                                src={booking.vehiclePhoto}
                                                alt={booking.vehicleModel}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const placeholder = e.target.parentElement.querySelector('.placeholder');
                                                    if (placeholder) placeholder.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="placeholder hidden w-full h-full items-center justify-center text-slate-400">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-slate-900 mb-0.5 truncate">{booking.vehicleModel}</h3>
                                                <p className="text-xs text-slate-600">Owner: {booking.ownerName || 'N/A'}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(booking.status)} flex-shrink-0`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div className="flex items-start gap-1.5">
                                                <svg className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] text-slate-600 mb-0.5">Period</p>
                                                    <p className="text-xs font-bold text-slate-900 leading-tight">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-1.5">
                                                <svg className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-[10px] text-slate-600 mb-0.5">Amount</p>
                                                    <p className="text-sm font-extrabold text-slate-900">₹{booking.totalAmount}</p>
                                                    <p className="text-[10px] text-slate-500">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                                            <Link
                                                href={`/bookings/${booking._id}`}
                                                className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-all text-center text-xs"
                                            >
                                                Details
                                            </Link>
                                            {booking.status === 'accepted' && (
                                                <Link
                                                    href={`/payment?bookingId=${booking._id}`}
                                                    className="flex-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all text-center shadow-md text-xs"
                                                >
                                                    Pay Now
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

