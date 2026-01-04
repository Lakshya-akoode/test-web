'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';

import { Suspense } from 'react';

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('bookingId');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId, router]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
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

    const handlePayment = async () => {
        if (!booking) return;

        setProcessing(true);
        try {
            const token = getToken();
            // In a real app, you would integrate with a payment gateway
            // For now, we'll simulate a successful payment
            const response = await fetch(`${API_BASE_URL}/bookings/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingId: booking._id,
                    paymentMethod,
                    amount: booking.totalAmount
                })
            });

            const data = await response.json();
            if (data.status === 'Success') {
                router.push(`/booking-confirmation?bookingId=${booking._id}`);
            } else {
                alert(data.message || 'Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment processing failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment details...</p>
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
        <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
            <div className="max-w-4xl mx-auto px-4 md:px-6 py-2 flex-1 overflow-y-auto">
                <Link href={`/bookings/${bookingId}`} className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-2 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xs font-medium">Back</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Payment Form */}
                    <div className="lg:col-span-2 space-y-3">
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h2>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 p-2 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-black"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900 text-xs">Credit/Debit Card</div>
                                        <div className="text-[10px] text-gray-600">Pay securely with your card</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 p-2 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-black"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900 text-xs">UPI</div>
                                        <div className="text-[10px] text-gray-600">Pay using UPI apps</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 p-2 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-all">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="wallet"
                                        checked={paymentMethod === 'wallet'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-black"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900 text-xs">Wallet</div>
                                        <div className="text-[10px] text-gray-600">Pay using your wallet</div>
                                    </div>
                                </label>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="mt-3 space-y-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-black/5"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-black/5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 mb-1">CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-black/5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 sticky top-2">
                            <h2 className="text-sm font-bold text-gray-900 mb-3">Booking Summary</h2>

                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {booking.vehiclePhoto && (
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
                                        )}
                                        <div className="placeholder hidden w-full h-full items-center justify-center text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-xs truncate">{booking.vehicleModel}</h3>
                                        <p className="text-[10px] text-gray-600">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-gray-100 space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-bold">₹{booking.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Service Fee</span>
                                        <span className="font-bold">₹0</span>
                                    </div>
                                    <div className="pt-1 border-t border-gray-200 flex justify-between">
                                        <span className="text-sm font-bold text-gray-900">Total</span>
                                        <span className="text-sm font-bold text-gray-900">₹{booking.totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full px-4 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                            >
                                {processing ? 'Processing...' : `Pay ₹${booking.totalAmount}`}
                            </button>

                            <p className="text-[10px] text-gray-500 text-center mt-2">
                                Your payment is secure and encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment details...</p>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}




