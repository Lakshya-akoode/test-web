'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import API from '@/lib/api';
import { load } from '@cashfreepayments/cashfree-js';

export default function BookVehiclePage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [vehicle, setVehicle] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [cashfree, setCashfree] = useState(null);

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

        // Initialize Cashfree
        const initializeCashfree = async () => {
            try {
                const cf = await load({
                    mode: "sandbox" // Change to "production" for live
                });
                setCashfree(cf);
            } catch (err) {
                console.error('Cashfree initialization failed:', err);
                setError('Failed to load payment gateway');
            }
        };
        initializeCashfree();

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

        if (!cashfree) {
            setError('Payment gateway is loading. Please wait...');
            return;
        }

        setProcessing(true);

        try {
            const endDate = calculateEndDate();
            const totalAmount = totalDays * pricePerDay;
            const token = getToken();

            // Step 1: Create Booking Query (Pending State)
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

            if (bookingResult.status !== 'Success' || !bookingResult.data?.bookingId) {
                throw new Error(bookingResult.message || 'Failed to create booking');
            }

            const bookingId = bookingResult.data.bookingId;

            // Step 2: Create Cashfree order
            const orderResponse = await fetch(API.createPaymentOrder, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: totalAmount,
                    currency: 'INR',
                    bookingId: bookingId,
                    customerId: user.id,
                    customerPhone: user.mobile || '9999999999',
                    customerEmail: user.email || 'guest@example.com',
                    customerName: user.username || 'User'
                })
            });

            const orderData = await orderResponse.json();

            // Debug: log the FULL response to see exact shape
            console.log('[Frontend] Full order response:', JSON.stringify(orderData, null, 2));

            if (orderData.status !== 'Success') {
                console.log(orderData);
                throw new Error(orderData.message || 'Failed to create payment order');
            }

            // Extract payment_session_id — handle both old and new backend response shapes
            const paymentSessionId = orderData.data?.payment_session_id
                || orderData.data?.order?.payment_session_id;

            console.log('[Frontend] Payment Session ID received:', paymentSessionId);

            if (!paymentSessionId) {
                throw new Error('Invalid payment session ID received from server');
            }

            // Step 3: Redirect to Cashfree
            const checkoutOptions = {
                paymentSessionId,
                returnUrl: `${window.location.origin}/booking-confirmation?bookingId=${bookingId}&order_id={order_id}`
            };

            cashfree.checkout(checkoutOptions);

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message || 'Network error. Please try again.');
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
            <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
                {/* Header Background */}
                <div className="bg-white border-b border-gray-100 pt-24 pb-8 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link
                            href={`/vehicle/${id}`}
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-4 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            Back to Vehicle
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Complete Request</h1>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-fadeIn">
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-medium mt-0.5">{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
                        {/* Left Column: Details */}
                        <div className="flex-1 space-y-8">

                            {/* Vehicle Card */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-black rounded-full"></span>
                                    Vehicle Details
                                </h2>
                                <div className="flex gap-6">
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                        {(vehicleImage || vehicle?.vehiclePhoto || vehicle?.VehiclePhoto) ? (
                                            <img
                                                src={vehicleImage || vehicle?.vehiclePhoto || vehicle?.VehiclePhoto}
                                                alt={vehicle?.vehicleModel || vehicle?.VehicleModel || 'Vehicle'}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full ${(vehicleImage || vehicle?.vehiclePhoto || vehicle?.VehiclePhoto) ? 'hidden' : 'flex'} items-center justify-center text-gray-300`}>
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 py-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
                                                    {vehicle?.vehicleType}
                                                </span>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{vehicle?.vehicleModel || vehicle?.VehicleModel}</h3>
                                                <p className="text-gray-500 font-medium">{vehicle?.City}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Dates */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                                    Trip Duration
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Start Date</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {startDate ? new Date(startDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Select Date'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">End Date</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {endDate ? new Date(endDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Select Date'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-800">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="font-bold">{totalDays} Day{totalDays > 1 ? 's' : ''} Booking</span>
                                </div>
                            </div>

                            {/* Pickup Location */}
                            {owner && (owner.latitude && owner.longitude) && (
                                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                                        Pickup Location
                                    </h2>
                                    <div className="rounded-2xl overflow-hidden border border-gray-200 h-64 mb-4 relative group">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={`https://www.google.com/maps?q=${owner.latitude},${owner.longitude}&hl=es;z=14&output=embed`}
                                            allowFullScreen
                                        ></iframe>
                                        <div className="absolute inset-0 pointer-events-none border-4 border-white/50 rounded-2xl"></div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-gray-200">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{owner.Address || 'Pickup Address'}</p>
                                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                                {owner.Landmark && `${owner.Landmark}, `}
                                                {owner.City}, {owner.State} - {owner.Pincode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Sticky Summary */}
                        <div className="lg:w-[420px] shrink-0">
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50">
                                    <h2 className="text-2xl font-black text-gray-900 mb-6">Payment Summary</h2>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Trip Price ({totalDays} days)</span>
                                            <span className="font-bold text-gray-900">₹{totalDays * pricePerDay}</span>
                                        </div>
                                        {/* Security Deposit Line Item */}
                                        {vehicle?.securityDeposit > 0 && (
                                            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-yellow-800">Security Deposit</span>
                                                    <div className="group relative">
                                                        <svg className="w-4 h-4 text-yellow-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                                                            Refundable amount to be paid directly to the owner at pickup.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block font-bold text-gray-900">₹{vehicle.securityDeposit}</span>
                                                    <span className="text-[10px] uppercase font-bold text-yellow-700">Pay at Pickup</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                            <span className="font-bold text-gray-900">Total Payable Now</span>
                                            <span className="text-3xl font-black text-gray-900">₹{totalAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={processing || !cashfree}
                                        className="w-full bg-black text-white rounded-xl py-4 font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : !cashfree ? (
                                            'Loading Gateway...'
                                        ) : (
                                            <>
                                                Pay Securely
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-6 flex items-center justify-center gap-4 text-gray-400 grayscale opacity-70">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5z"/>
                                            </svg>
                                            <span className="text-xs font-bold">Secure Payment</span>
                                        </div>
                                        <div className="w-px h-4 bg-gray-200"></div>
                                        <span className="text-xs font-bold">Cashfree Payments</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Free Cancellation</h4>
                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                            Cancel up to 24 hours before your trip starts for a full refund.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
