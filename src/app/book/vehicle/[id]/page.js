'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import API from '@/lib/api';

export default function BookVehiclePage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [vehicle, setVehicle] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Booking form state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalDays, setTotalDays] = useState(1);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        const currentUser = getUser();
        setUser(currentUser);
        if (id) {
            fetchVehicleDetails();
        }
    }, [id, router]);

    useEffect(() => {
        if (startDate) {
            calculateEndDate();
        }
    }, [startDate, totalDays]);

    const fetchVehicleDetails = async () => {
        setLoading(true);
        try {
            // Fetch Vehicle Details
            const vehicleRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VEHICLE_DETAILS}/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const vehicleData = await vehicleRes.json();

            if (vehicleData.status === 'Success' && vehicleData.data) {
                setVehicle(vehicleData.data);
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
        if (!startDate) return;
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + totalDays - 1);
        setEndDate(end.toISOString().split('T')[0]);
    };

    const handleDaysChange = (e) => {
        const days = parseInt(e.target.value) || 1;
        setTotalDays(days);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!startDate || !endDate) {
            setError('Please select start and end dates');
            return;
        }

        if (!pickupLocation || !dropoffLocation) {
            setError('Please provide pickup and dropoff locations');
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

        setSubmitting(true);

        try {
            const pricePerDay = vehicle.rentalPrice || vehicle.pricePerDay || 0;
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
                pickupLocation: pickupLocation,
                dropoffLocation: dropoffLocation,
                specialRequests: specialRequests || ''
            };

            const token = getToken();
            const response = await fetch(API.createBooking, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();

            if (data.status === 'Success' && data.data?.bookingId) {
                // Redirect to booking confirmation
                router.push(`/booking-confirmation?bookingId=${data.data.bookingId}`);
            } else {
                setError(data.message || 'Failed to create booking. Please try again.');
            }
        } catch (err) {
            console.error('Booking error:', err);
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
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

    const pricePerDay = vehicle.rentalPrice || vehicle.pricePerDay || 0;
    const totalAmount = totalDays * pricePerDay;
    const minDate = new Date().toISOString().split('T')[0];

    return (
        <div className="h-screen bg-gray-50 overflow-hidden flex flex-col">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex-1 overflow-y-auto">
                {/* Header */}
                <div className="mb-4">
                    <Link 
                        href={`/vehicle/${id}`} 
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-2 text-xs"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-xs font-medium">Back</span>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900">Complete Your Booking</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {error && (
                                <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                                    {error}
                                </div>
                            )}

                            {/* Vehicle Summary Card */}
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 mb-2">Vehicle Details</h2>
                                <div className="flex items-center gap-3">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                            <img
                                                src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                                alt={vehicle.vehicleModel || vehicle.VehicleModel}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full ${vehicle.vehiclePhoto || vehicle.VehiclePhoto ? 'hidden' : 'flex'} items-center justify-center text-gray-400`}>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                                            {vehicle.vehicleModel || vehicle.VehicleModel}
                                        </h3>
                                        <p className="text-xs text-gray-600 mb-1">
                                            {vehicle.vehicleType || 'Vehicle'}
                                        </p>
                                        <p className="text-sm font-bold text-gray-900">
                                            ₹{pricePerDay} <span className="text-xs font-normal text-gray-600">per day</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 mb-2">Select Dates</h2>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Start Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            min={minDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            End Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            min={startDate || minDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Duration: {totalDays} day{totalDays > 1 ? 's' : ''}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={totalDays}
                                        onChange={handleDaysChange}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                        <span>1</span>
                                        <span>30</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 mb-2">Location Details</h2>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Pickup Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            placeholder="Enter pickup address"
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                                            Dropoff Location <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={dropoffLocation}
                                            onChange={(e) => setDropoffLocation(e.target.value)}
                                            placeholder="Enter dropoff address"
                                            className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 mb-2">Special Requests (Optional)</h2>
                                <textarea
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    placeholder="Any special requests or notes for the owner..."
                                    rows="2"
                                    className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none transition-all focus:border-black focus:ring-1 focus:ring-black resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black text-white rounded-lg py-2.5 font-bold text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    'Confirm Booking'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Booking Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 sticky top-4">
                            <h2 className="text-sm font-bold text-gray-900 mb-3">Booking Summary</h2>
                            
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                            <img
                                                src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                                alt={vehicle.vehicleModel || vehicle.VehicleModel}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full ${vehicle.vehiclePhoto || vehicle.VehiclePhoto ? 'hidden' : 'flex'} items-center justify-center text-gray-400`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-xs truncate">
                                            {vehicle.vehicleModel || vehicle.VehicleModel}
                                        </h3>
                                        <p className="text-xs text-gray-600">{vehicle.vehicleType || 'Vehicle'}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Price per day</span>
                                        <span className="font-bold text-gray-900">₹{pricePerDay}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-600">Duration</span>
                                        <span className="font-bold text-gray-900">{totalDays} day{totalDays > 1 ? 's' : ''}</span>
                                    </div>
                                    {startDate && (
                                        <div className="pt-1.5 border-t border-gray-100">
                                            <div className="text-xs text-gray-500 mb-0.5">Start Date</div>
                                            <div className="text-xs font-medium text-gray-900">
                                                {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    )}
                                    {endDate && (
                                        <div>
                                            <div className="text-xs text-gray-500 mb-0.5">End Date</div>
                                            <div className="text-xs font-medium text-gray-900">
                                                {new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900">Total</span>
                                        <span className="text-lg font-bold text-gray-900">₹{totalAmount}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Payment after owner accepts
                                    </p>
                                </div>
                            </div>

                            {/* Owner Info */}
                            {owner && (
                                <div className="pt-2 border-t border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-900 mb-1">Owner</h3>
                                    <p className="text-xs text-gray-600">{owner.Name || owner.fullName || 'N/A'}</p>
                                    {owner.ContactNo && (
                                        <p className="text-xs text-gray-600 mt-0.5">{owner.ContactNo}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

