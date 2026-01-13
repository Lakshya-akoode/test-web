'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import { API_BASE_URL } from '@/lib/api-config';
import API from '@/lib/api';

export default function CreateRentalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);

    // Renter Information
    const [renterInfo, setRenterInfo] = useState({
        name: '',
        phone: '',
        email: '',
        licenseNumber: '',
        idProof: '',
        address: ''
    });

    // Booking Information
    const [bookingInfo, setBookingInfo] = useState({
        vehicleId: '',
        startDate: '',
        endDate: '',
        pricingType: 'daily',
        specialInstructions: ''
    });

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchOwnerVehicles();
    }, [router]);

    const fetchOwnerVehicles = async () => {
        try {
            setLoadingVehicles(true);
            const token = getToken();
            const userId = getUser()?._id || getUser()?.id;

            console.log('Fetching vehicles for owner:', userId);

            const response = await fetch(`${API.getMyVehicles}?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log('Vehicles API Response:', data);

            if (data.status === 'Success') {
                const vehiclesList = data.data || [];
                console.log('Vehicles found:', vehiclesList.length);
                setVehicles(vehiclesList);

                if (vehiclesList.length === 0) {
                    setError('No vehicles found. Please add vehicles to your account first.');
                }
            } else {
                console.error('Failed to fetch vehicles:', data.message);
                setError('Failed to load vehicles: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setError('Unable to load vehicles. Please check your connection and try again.');
        } finally {
            setLoadingVehicles(false);
        }
    };

    const handleVehicleSelect = (vehicleId) => {
        const vehicle = vehicles.find(v => v._id === vehicleId);
        setSelectedVehicle(vehicle);
        setBookingInfo({ ...bookingInfo, vehicleId });
    };

    const calculateDuration = () => {
        if (!bookingInfo.startDate || !bookingInfo.endDate) return { days: 0, hours: 0 };

        const start = new Date(bookingInfo.startDate);
        const end = new Date(bookingInfo.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        return { days: diffDays, hours: diffHours };
    };

    const calculateTotalPrice = () => {
        if (!selectedVehicle) return 0;

        const { days, hours } = calculateDuration();

        if (bookingInfo.pricingType === 'daily') {
            return (selectedVehicle.rentalPrice || 0) * days;
        } else {
            return (selectedVehicle.hourlyPrice || selectedVehicle.hourlyRate || 0) * hours;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!renterInfo.name || !renterInfo.phone || !renterInfo.licenseNumber) {
            setError('Please fill in all required renter details');
            return;
        }

        if (!bookingInfo.vehicleId || !bookingInfo.startDate || !bookingInfo.endDate) {
            setError('Please fill in all required booking details');
            return;
        }

        setLoading(true);

        try {
            const token = getToken();
            const userId = getUser()?._id || getUser()?.id;
            const { days, hours } = calculateDuration();
            const totalAmount = calculateTotalPrice();

            const bookingData = {
                renterId: userId, // Using owner as renter for now - may need separate endpoint
                renterName: renterInfo.name,
                renterPhone: renterInfo.phone,
                renterEmail: renterInfo.email,
                licenseNumber: renterInfo.licenseNumber,
                idProof: renterInfo.idProof,
                address: renterInfo.address,
                vehicleId: bookingInfo.vehicleId,
                startDate: new Date(bookingInfo.startDate).toISOString(),
                endDate: new Date(bookingInfo.endDate).toISOString(),
                totalDays: bookingInfo.pricingType === 'daily' ? days : 0,
                totalHours: bookingInfo.pricingType === 'hourly' ? hours : 0,
                pricingType: bookingInfo.pricingType,
                pricePerDay: bookingInfo.pricingType === 'daily' ? selectedVehicle.rentalPrice : 0,
                pricePerHour: bookingInfo.pricingType === 'hourly' ? (selectedVehicle.hourlyPrice || selectedVehicle.hourlyRate) : 0,
                totalAmount: totalAmount,
                specialRequests: bookingInfo.specialInstructions,
                pickupLocation: selectedVehicle.City || '',
                dropoffLocation: selectedVehicle.City || '',
                status: 'confirmed', // Manual bookings are confirmed immediately
                paymentStatus: 'paid' // Assuming offline payment
            };

            const response = await fetch(`${API_BASE_URL}/bookings/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();

            if (data.status === 'Success') {
                setSuccess('Booking created successfully!');
                setTimeout(() => {
                    router.push('/owner-bookings');
                }, 2000);
            } else {
                setError(data.message || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const { days, hours } = calculateDuration();
    const totalPrice = calculateTotalPrice();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <Link href="/owner-bookings" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Bookings</span>
                    </Link>
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Create <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Manual Booking</span>
                        </h1>
                        <p className="text-xl text-slate-300">Create rental bookings for walk-in customers</p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Renter Information */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Renter Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={renterInfo.name}
                                    onChange={(e) => setRenterInfo({ ...renterInfo, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Enter renter's full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={renterInfo.phone}
                                    onChange={(e) => setRenterInfo({ ...renterInfo, phone: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Enter mobile number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={renterInfo.email}
                                    onChange={(e) => setRenterInfo({ ...renterInfo, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Enter email (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Driving License Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={renterInfo.licenseNumber}
                                    onChange={(e) => setRenterInfo({ ...renterInfo, licenseNumber: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Enter license number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    ID Proof (Aadhaar/PAN/Passport)
                                </label>
                                <input
                                    type="text"
                                    value={renterInfo.idProof}
                                    onChange={(e) => setRenterInfo({ ...renterInfo, idProof: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Enter ID proof number"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Address
                                </label>
                                <textarea
                                    value={renterInfo.address}
                                    onChange={(e) => setRenterInfo({ ...renterInfo, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Enter address (optional)"
                                    rows="2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Selection */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Vehicle</h2>

                        {loadingVehicles ? (
                            <p className="text-gray-600">Loading vehicles...</p>
                        ) : vehicles.length === 0 ? (
                            <p className="text-gray-600">No vehicles available. Please add vehicles first.</p>
                        ) : (
                            <div className="space-y-4">
                                <select
                                    required
                                    value={bookingInfo.vehicleId}
                                    onChange={(e) => handleVehicleSelect(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 font-medium"
                                >
                                    <option value="">-- Select a vehicle --</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle._id} value={vehicle._id}>
                                            {vehicle.vehicleModel || vehicle.VehicleModel} - {vehicle.vehicleType} (₹{vehicle.rentalPrice}/day)
                                        </option>
                                    ))}
                                </select>

                                {selectedVehicle && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            {selectedVehicle.vehiclePhoto && (
                                                <img
                                                    src={selectedVehicle.vehiclePhoto}
                                                    alt={selectedVehicle.vehicleModel}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-bold text-gray-900">{selectedVehicle.vehicleModel}</h3>
                                                <p className="text-sm text-gray-600">{selectedVehicle.vehicleType}</p>
                                                <p className="text-sm font-semibold text-blue-700 mt-1">
                                                    Daily: ₹{selectedVehicle.rentalPrice}
                                                    {selectedVehicle.hourlyPrice && ` | Hourly: ₹${selectedVehicle.hourlyPrice}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Booking Details */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Start Date & Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={bookingInfo.startDate}
                                    onChange={(e) => setBookingInfo({ ...bookingInfo, startDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    End Date & Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={bookingInfo.endDate}
                                    onChange={(e) => setBookingInfo({ ...bookingInfo, endDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Pricing Type
                                </label>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setBookingInfo({ ...bookingInfo, pricingType: 'daily' })}
                                        className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${bookingInfo.pricingType === 'daily'
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Daily
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setBookingInfo({ ...bookingInfo, pricingType: 'hourly' })}
                                        disabled={!selectedVehicle?.hourlyPrice && !selectedVehicle?.hourlyRate}
                                        className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${bookingInfo.pricingType === 'hourly'
                                            ? 'bg-black text-white'
                                            : (!selectedVehicle?.hourlyPrice && !selectedVehicle?.hourlyRate)
                                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Hourly
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Special Instructions
                                </label>
                                <textarea
                                    value={bookingInfo.specialInstructions}
                                    onChange={(e) => setBookingInfo({ ...bookingInfo, specialInstructions: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="Any special notes or instructions"
                                    rows="2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    {selectedVehicle && bookingInfo.startDate && bookingInfo.endDate && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Summary</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-xs text-gray-600 mb-1">Duration</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {bookingInfo.pricingType === 'daily' ? `${days} day${days > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''}`}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-xs text-gray-600 mb-1">Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{bookingInfo.pricingType === 'daily' ? selectedVehicle.rentalPrice : (selectedVehicle.hourlyPrice || selectedVehicle.hourlyRate || 0)}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-4 md:col-span-2">
                                    <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                                    <p className="text-3xl font-extrabold text-blue-600">₹{totalPrice}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Link
                            href="/owner-bookings"
                            className="flex-1 px-6 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all text-center"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || !selectedVehicle}
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Booking...' : 'Create Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
