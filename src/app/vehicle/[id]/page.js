'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated, getUser } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import Link from 'next/link';

export default function VehicleDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [vehicle, setVehicle] = useState(null);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking State
    const [startDate, setStartDate] = useState('');
    const [days, setDays] = useState(1); // Default 1 day
    const [pricingType, setPricingType] = useState('daily');
    const [hours, setHours] = useState(1);
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null); // null, true, false
    const [availabilityMsg, setAvailabilityMsg] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        if (id) {
            fetchDetails();
        }
    }, [id, router]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            // Fetch Vehicle
            const vehicleRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VEHICLE_DETAILS}/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const vehicleData = await vehicleRes.json();

            console.log('Vehicle API Response:', vehicleData);

            if (vehicleData.status === 'Success' && vehicleData.data) {
                // Handle nested structure: data.vehicle or flat data
                const vehicle = vehicleData.data.vehicle || vehicleData.data;
                console.log('Parsed Vehicle Object:', params);
                if (vehicle) {
                    setVehicle(vehicle);
                } else {
                    console.error('Vehicle object not found in response');
                }
            } else {
                console.error('Failed to load vehicle:', vehicleData);
                // Try to show error message
                if (vehicleData.message) {
                    alert(vehicleData.message);
                }
            }

            // Fetch Owner
            const ownerRes = await fetch(`${API_BASE_URL}${API_ENDPOINTS.OWNER_DETAILS}/${id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            const ownerData = await ownerRes.json();
            console.log('Owner API Response:', ownerData);

            if (ownerData.status === 'Success' && ownerData.data) {
                setOwner(ownerData.data);
            }

        } catch (error) {
            console.error('Error loading details:', error);
            alert('Failed to load vehicle details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        if (!startDate) {
            alert('Please select a start date');
            return;
        }

        setIsChecking(true);
        setAvailabilityMsg('');
        setIsAvailable(null);

        const start = new Date(startDate);
        const end = new Date(start);
        if (pricingType === 'daily') {
            end.setDate(end.getDate() + parseInt(days) - 1);
        }
        // For hourly, end date is same as start (simplified logic from mobile app)

        try {
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CHECK_AVAILABILITY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vehicleId: id,
                    startDate: start.toISOString().split('T')[0],
                    endDate: end.toISOString().split('T')[0],
                    pricingType
                })
            });
            const data = await res.json();

            if (data.status === 'Success' && data.data?.isAvailable) {
                setIsAvailable(true);
                setAvailabilityMsg('Vehicle is available!');
            } else {
                setIsAvailable(false);
                setAvailabilityMsg('Vehicle is NOT available for these dates.');
            }
        } catch (error) {
            console.error('Availability check failed', error);
            setAvailabilityMsg('Error checking availability.');
        } finally {
            setIsChecking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
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


    // Calculate Price based on pricing type
    const price = pricingType === 'hourly'
        ? (vehicle.hourlyPrice || vehicle.hourlyRate || 0)
        : (params.price || vehicle.rentalPrice || 0);

    const totalPrice = pricingType === 'daily'
        ? price * days
        : price * hours;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">


            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Image & Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-96 relative">
                            {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                <img
                                    src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                    alt={vehicle.vehicleModel || vehicle.VehicleModel || 'Vehicle'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) {
                                            e.target.nextSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div className={`w-full h-full ${vehicle.vehiclePhoto || vehicle.VehiclePhoto ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
                                <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                {vehicle.distance ? `${vehicle.distance} km away` : 'Available Now'}
                            </div>
                        </div>

                        {/* Vehicle Title & Specs */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{vehicle.vehicleModel || vehicle.VehicleModel}</h1>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-6">
                                <span className="px-3 py-1 bg-gray-100 rounded-full">{vehicle.vehicleType}</span>
                                <span className="px-3 py-1 bg-gray-100 rounded-full">{vehicle.fuelType || 'Petrol'}</span>
                                <span className="px-3 py-1 bg-gray-100 rounded-full">{vehicle.City}</span>
                            </div>

                            {/* About Owner */}
                            {owner && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Hosted by {owner.Name || owner.fullName}</h3>
                                        {owner.userId && (
                                            <Link
                                                href={`/host/${owner.userId}`}
                                                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                View Profile & Reviews &rarr;
                                            </Link>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Location</div>
                                                <div className="font-medium">{owner.City}, {owner.State || 'India'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Return Duration</div>
                                                <div className="font-medium">{owner.ReturnDuration || '5 days'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Safety Gear</div>
                                                <div className="font-medium">{owner.safetyGear || 'Helmet Provided'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="text-3xl font-bold">₹{price}</span>
                                    <span className="text-gray-500 text-sm">/{pricingType === 'daily' ? 'day' : 'hour'}</span>
                                </div>
                                <div className="flex p-1 bg-gray-100 rounded-lg">
                                    <button
                                        onClick={() => setPricingType('daily')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${pricingType === 'daily' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                                    >Daily</button>
                                    <button
                                        onClick={() => setPricingType('hourly')}
                                        disabled={!vehicle.hourlyPrice && !vehicle.hourlyRate}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${pricingType === 'hourly'
                                            ? 'bg-white shadow-sm text-black'
                                            : (!vehicle.hourlyPrice && !vehicle.hourlyRate)
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-500'
                                            }`}
                                        title={(!vehicle.hourlyPrice && !vehicle.hourlyRate) ? 'Hourly pricing not available for this vehicle' : ''}
                                    >Hourly</button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* Date Picker */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        min={new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>

                                {/* Duration Slider/Input */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
                                        {pricingType === 'daily' ? `Days: ${days}` : `Hours: ${hours}`}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max={pricingType === 'daily' ? (parseInt(owner?.ReturnDuration) || 30) : 24}
                                        value={pricingType === 'daily' ? days : hours}
                                        onChange={(e) => pricingType === 'daily' ? setDays(e.target.value) : setHours(e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>1</span>
                                        <span>{pricingType === 'daily' ? (parseInt(owner?.ReturnDuration) || 30) : 24}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Total Price</span>
                                    <span className="font-bold text-xl">₹{totalPrice}</span>
                                </div>
                                {availabilityMsg && (
                                    <div className={`text-sm font-medium mb-2 ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                        {availabilityMsg}
                                    </div>
                                )}
                            </div>

                            {isAvailable ? (
                                <button
                                    onClick={() => {
                                        // Store booking data in localStorage
                                        localStorage.setItem('bookingData', JSON.stringify({
                                            vehicleId: id,
                                            startDate: startDate,
                                            days: days,
                                            hours: hours,
                                            pricingType: pricingType,
                                            price: vehicle.rentalPrice || 0,
                                            image: vehicle.vehiclePhoto || vehicle.VehiclePhoto || '',
                                            vehicleModel: vehicle.vehicleModel || vehicle.VehicleModel,
                                            vehicleType: vehicle.vehicleType,
                                            city: vehicle.City
                                        }));
                                        router.push(`/book/vehicle/${id}`);
                                    }}
                                    className="block w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center cursor-pointer"
                                >
                                    Book Now
                                </button>
                            ) : (
                                <button
                                    onClick={checkAvailability}
                                    disabled={isChecking}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isChecking ? 'Checking...' : 'Check Availability'}
                                </button>
                            )}

                            <p className="text-center text-xs text-gray-400 mt-4">
                                You won't be charged yet
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
