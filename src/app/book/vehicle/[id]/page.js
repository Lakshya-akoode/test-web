'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import API from '@/lib/api';
import Script from 'next/script';

export default function BookVehiclePage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [vehicle, setVehicle] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);

    // Get data from localStorage (from previous page)
    const [startDate, setStartDate] = useState('');
    const [totalDays, setTotalDays] = useState(1);
    const [pricePerDay, setPricePerDay] = useState(0);
    const [vehicleImage, setVehicleImage] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        const currentUser = getUser();
        setUser(currentUser);

        // Get booking details from localStorage first
        const bookingDataStr = localStorage.getItem('bookingData');
        if (bookingDataStr) {
            try {
                const bookingData = JSON.parse(bookingDataStr);
                console.log('Booking data from localStorage:', bookingData);

                if (bookingData.startDate) {
                    setStartDate(bookingData.startDate);
                }

                if (bookingData.days) {
                    setTotalDays(parseInt(bookingData.days) || 1);
                }

                // Set price from localStorage - this is the primary source
                if (bookingData.price) {
                    const price = parseInt(bookingData.price) || 0;
                    console.log('Setting price from localStorage:', price);
                    setPricePerDay(price);
                }

                if (bookingData.image) {
                    setVehicleImage(bookingData.image);
                }
            } catch (error) {
                console.error('Error parsing booking data:', error);
            }
        }

        if (id) {
            fetchVehicleDetails();
        }
    }, [id, router]);

    const fetchVehicleDetails = async () => {
        setLoading(true);
        try {
            // Fetch Vehicle Details
            const vehicleRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VEHICLE_DETAILS}/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const vehicleData = await vehicleRes.json();
            console.log('Vehicle data from API:', vehicleData);

            if (vehicleData.status === 'Success' && vehicleData.data) {
                const vehicleInfo = vehicleData.data;
                setVehicle(vehicleInfo);

                // Only set price from API if not already set from localStorage
                setPricePerDay(prevPrice => {
                    if (prevPrice && prevPrice > 0) {
                        console.log('Using price from localStorage:', prevPrice);
                        return prevPrice;
                    }
                    const apiPrice = vehicleInfo.rentalPrice || vehicleInfo.pricePerDay || vehicleInfo.price || 0;
                    console.log('Using price from API:', apiPrice);
                    return apiPrice;
                });
            }

            // Fetch Owner Details
            const ownerRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OWNER_DETAILS}/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const ownerData = await ownerRes.json();
            if (ownerData.status === 'Success' && ownerData.data) {
                setOwner(ownerData.data);
            }
        } catch (error) {
            console.error('Error loading details:', error);
            setError('Failed to load vehicle details');
        } finally {
            setLoading(false);
        }
    };

    const calculateEndDate = () => {
        if (!startDate) return '';
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + totalDays - 1);
        return end.toISOString().split('T')[0];
    };

    const handlePayment = async () => {
        setError('');

        // Validation
        if (!startDate) {
            setError('Start date is required');
            return;
        }

        if (!user || !user.id) {
            setError('User information not found. Please login again.');
            router.push('/login');
            return;
        }

        if (!vehicle) {
            setError('Vehicle information not found');
            return;
        }

        if (!razorpayLoaded) {
            setError('Payment gateway is loading. Please wait...');
            return;
        }

        setProcessing(true);

        try {
            const endDate = calculateEndDate();
            const totalAmount = totalDays * pricePerDay;

            // Step 1: Create Razorpay order
            const token = getToken();
            const orderResponse = await fetch(API.createPaymentOrder, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: 'INR',
                    receipt: `booking_${Date.now()}`
                })
            });

            const orderData = await orderResponse.json();

            if (orderData.status !== 'Success') {
                setError('Failed to create payment order. Please try again.');
                setProcessing(false);
                return;
            }

            const order = orderData.data.order;

            // Step 2: Open Razorpay checkout
            const options = {
                key: 'rzp_test_S2qqGKFsiIoeZL', // Razorpay Key ID (client-side)
                amount: order.amount,
                currency: order.currency,
                name: 'Zugo Rentals',
                description: `${vehicle.vehicleModel || vehicle.VehicleModel} Rental`,
                order_id: order.id,
                handler: async function (response) {
                    // Payment successful - verify and create booking
                    await verifyPaymentAndCreateBooking(response, endDate, totalAmount);
                },
                prefill: {
                    name: user.username || user.fullName || 'User',
                    email: user.email || '',
                    contact: user.mobile || ''
                },
                theme: {
                    color: '#000000'
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (err) {
            console.error('Payment error:', err);
            setError('Network error. Please try again.');
            setProcessing(false);
        }
    };

    const verifyPaymentAndCreateBooking = async (paymentResponse, endDate, totalAmount) => {
        try {
            const token = getToken();

            // First, create the booking
            const bookingData = {
                renterId: user.id,
                renterName: user.username || user.fullName || 'User',
                renterPhone: user.mobile || '',
                renterEmail: user.email || '',
                vehicleId: id,
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString(),
                totalDays: totalDays,
                pricePerDay: pricePerDay,
                pickupLocation: owner?.Address || '',
                dropoffLocation: owner?.Address || '',
                specialRequests: ''
            };

            const bookingResponse = await fetch(API.createBooking, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const bookingResult = await bookingResponse.json();

            if (bookingResult.status === 'Success' && bookingResult.data?.bookingId) {
                // Verify payment
                const verifyResponse = await fetch(API.verifyPayment, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        orderId: paymentResponse.razorpay_order_id,
                        paymentId: paymentResponse.razorpay_payment_id,
                        signature: paymentResponse.razorpay_signature,
                        bookingId: bookingResult.data.bookingId,
                        amount: totalAmount
                    })
                });

                const verifyResult = await verifyResponse.json();

                if (verifyResult.status === 'Success') {
                    // Payment verified successfully
                    router.push(`/booking-confirmation?bookingId=${bookingResult.data.bookingId}`);
                } else {
                    setError('Payment verification failed. Please contact support.');
                    setProcessing(false);
                }
            } else {
                setError(bookingResult.message || 'Failed to create booking. Please try again.');
                setProcessing(false);
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
                <Link href="/home" className="px-6 py-2 bg-black text-white rounded-lg">Go Back Home</Link>
            </div>
        );
    }

    const totalAmount = totalDays * pricePerDay;
    const endDate = calculateEndDate();

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
                onError={() => setError('Failed to load payment gateway')}
            />
            <div className="min-h-screen bg-gray-50 pb-20">
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 pt-24">
                    {/* Header */}
                    <div className="mb-6">
                        <Link
                            href={`/vehicle/${id}`}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Back to Vehicle</span>
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Your Booking</h1>
                        <p className="text-gray-600 mt-1">Review details and make payment</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Invoice Section */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Invoice</h2>

                            {/* Vehicle Info */}
                            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
                                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    {(vehicleImage || vehicle?.vehiclePhoto || vehicle?.VehiclePhoto) ? (
                                        <img
                                            src={vehicleImage || vehicle?.vehiclePhoto || vehicle?.VehiclePhoto}
                                            alt={vehicle?.vehicleModel || vehicle?.VehicleModel || 'Vehicle'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                if (e.target.nextSibling) {
                                                    e.target.nextSibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full ${(vehicleImage || vehicle?.vehiclePhoto || vehicle?.VehiclePhoto) ? 'hidden' : 'flex'} items-center justify-center text-gray-400`}>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {vehicle.vehicleModel || vehicle.VehicleModel}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                                            {vehicle.vehicleType || 'Vehicle'}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                                            {vehicle.City}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="py-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                        <p className="text-base font-bold text-gray-900">
                                            {startDate ? new Date(startDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'Not selected'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">End Date</p>
                                        <p className="text-base font-bold text-gray-900">
                                            {endDate ? new Date(endDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            }) : 'Not selected'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-blue-900 font-semibold">Total Duration</p>
                                            <p className="text-xs text-blue-700 mt-1">
                                                {startDate && endDate ? `${new Date(startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}` : ''}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-900">{totalDays}</p>
                                            <p className="text-xs text-blue-700">day{totalDays > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="pt-6 border-t border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Price per day</span>
                                    <span className="font-bold text-gray-900">₹{pricePerDay}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Duration</span>
                                    <span className="font-bold text-gray-900">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{totalDays * pricePerDay}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-bold text-gray-900">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Pickup Location */}
                        {owner && (owner.latitude && owner.longitude) && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Pickup Location</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 mb-1">{owner.Address || 'Pickup Address'}</p>
                                            <p className="text-sm text-gray-600">
                                                {owner.Landmark && `${owner.Landmark}, `}
                                                {owner.City}, {owner.State} - {owner.Pincode}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-gray-200">
                                        <iframe
                                            width="100%"
                                            height="300"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://www.google.com/maps?q=${owner.latitude},${owner.longitude}&hl=es;z=14&output=embed`}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Button */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <button
                                onClick={handlePayment}
                                disabled={processing || !razorpayLoaded}
                                className="w-full bg-black text-white rounded-xl py-4 font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : !razorpayLoaded ? (
                                    'Loading Payment Gateway...'
                                ) : (
                                    `Pay ₹${totalAmount}`
                                )}
                            </button>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                🔒 Your payment is secure and encrypted
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
