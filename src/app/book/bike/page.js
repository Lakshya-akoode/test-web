'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import LoginModal from '@/components/LoginModal';

export default function BookBikePage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [radius, setRadius] = useState(1000000000); // Default 5000m (5km) to match Rentals page
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    // Date Filters (Default: Today to Tomorrow)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);

    useEffect(() => {
        // Check authentication status but don't redirect
        setIsUserAuthenticated(isAuthenticated());

        // Try to get user location on mount
        getCurrentLocation();
        fetchVehicles();
    }, []);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Error getting location:", error);
                }
            );
        }
    };

    useEffect(() => {
        filterVehiclesByCategory(activeTab);
    }, [activeTab, vehicles]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredVehicles(vehicles);
        } else {
            // Filter grouped vehicles
            const filtered = vehicles.filter(group => {
                const vehicle = group.mainVehicle;
                return (
                    (vehicle.vehicleModel || vehicle.VehicleModel)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    vehicle.City?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (vehicle.businessName && vehicle.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            });
            setFilteredVehicles(filtered);
        }
    }, [searchQuery, vehicles]);

    // Helper to group vehicles by Model + Rental/Owner
    const groupVehicles = (vehicleList) => {
        const groups = {};
        vehicleList.forEach(vehicle => {
            // Create a unique key for grouping: Model + (RentalId OR UserId)
            // Use businessName or ownerName/userId to distinguish providers
            const modelKey = (vehicle.vehicleModel || vehicle.VehicleModel || 'Unknown').trim().toLowerCase();
            const providerKey = vehicle.rentalId ? `rental-${vehicle.rentalId}` : `user-${vehicle.userId}`;

            const key = `${modelKey}-${providerKey}`;

            if (!groups[key]) {
                groups[key] = {
                    id: key,
                    mainVehicle: vehicle, // Store the first vehicle as the main display
                    count: 0,
                    vehicles: [] // Store all vehicles in this group
                };
            }
            groups[key].count++;
            groups[key].vehicles.push(vehicle);
        });
        return Object.values(groups);
    };

    // ... helper functions ...
    const filterVehiclesByCategory = (category) => {
        const normalized = (v) => (v || '').toString().trim().toLowerCase();
        const isBikeLike = (type) => ['bike'].includes(type);
        const isScootyLike = (type) => ['scooty', 'scooter'].includes(type);

        // Filter the already grouped vehicles
        const onlyTwoWheelers = vehicles.filter(group => {
            const v = group.mainVehicle;
            const vc = normalized(v.category);
            const vt = normalized(v.vehicleType);
            const vs = normalized(v.subcategory);
            return vc === '2-wheeler' || isBikeLike(vt) || isScootyLike(vt) || isBikeLike(vs) || isScootyLike(vs);
        });

        const tab = normalized(category);
        if (tab === 'all') {
            setFilteredVehicles(onlyTwoWheelers);
            return;
        }

        const filtered = onlyTwoWheelers.filter(group => {
            const v = group.mainVehicle;
            const vt = normalized(v.vehicleType);
            const vs = normalized(v.subcategory);
            if (tab === 'bikes' || tab === 'bike') {
                return isBikeLike(vt) || isBikeLike(vs);
            }
            if (tab === 'scooty') {
                return isScootyLike(vt) || isScootyLike(vs);
            }
            return normalized(vt) === tab || normalized(vs) === tab;
        });
        setFilteredVehicles(filtered);
    };

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            let queryParams = 'category=2-wheeler';
            if (selectedCity) {
                queryParams += `&city=${selectedCity}`;
            }

            // Add location params if available
            if (userLocation.latitude && userLocation.longitude) {
                queryParams += `&latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=${radius}`;
            }

            // Add date params
            if (startDate && endDate) {
                queryParams += `&startDate=${startDate}&endDate=${endDate}`;
            }

            const url = `${API_BASE_URL}${API_ENDPOINTS.VEHICLES}?${queryParams}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.status === 'Success') {
                const fetchedVehicles = data.data.vehicles || [];
                const groupedVehicles = groupVehicles(fetchedVehicles);
                setVehicles(groupedVehicles);
                setFilteredVehicles(groupedVehicles);
            }
        } catch (error) {
            console.error('Fetch vehicles error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when location or radius changes
    useEffect(() => {
        if (userLocation.latitude && userLocation.longitude) {
            fetchVehicles();
        }
    }, [userLocation, radius]);

    useEffect(() => {
        fetchVehicles();
    }, [selectedCity, startDate, endDate]);

    return (
        <>
            <div className="min-h-screen bg-gray-50/50 pb-20">
                {/* Header Section */}
                <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                    <div className="relative max-w-7xl mx-auto px-6">
                        <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                    Two-Wheeler Rentals
                                </span>
                                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                                    Book a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Bike</span>
                                </h1>
                                <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                                    Zip through traffic with our range of bikes and scooters. Affordable, convenient, and ready to ride.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Area */}
                <div className="relative max-w-7xl mx-auto px-4 md:px-6 -mt-20 z-10">
                    {/* Search and Filters */}
                    <div className="bg-white rounded-2xl p-4 mb-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus:ring-blue-500 focus-within:border-blue-500 transition-all">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by model, city..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Filter by city"
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    />

                                    <div className="relative group min-w-[160px]">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <select
                                            value={radius}
                                            onChange={(e) => setRadius(Number(e.target.value))}
                                            className="block w-full pl-10 pr-8 py-3.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value={10000000000}>All cities</option>
                                            <option value={5000}>Within 5 km</option>
                                            <option value={10000}>Within 10 km</option>
                                            <option value={20000}>Within 20 km</option>
                                            <option value={50000}>Within 50 km</option>
                                            <option value={100000}>Within 100 km</option>

                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>

                                </div>

                                {/* Date Pickers */}
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200">
                                        <span className="text-xs text-gray-500 font-bold uppercase">Start</span>
                                        <input
                                            type="date"
                                            value={startDate}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="bg-transparent outline-none text-gray-900 font-medium text-sm"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50 rounded-xl border border-gray-200">
                                        <span className="text-xs text-gray-500 font-bold uppercase">End</span>
                                        <input
                                            type="date"
                                            value={endDate}
                                            min={startDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="bg-transparent outline-none text-gray-900 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filter Tabs - Styled to match */}
                            <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-xl w-fit">
                                {['All', 'Bikes', 'Scooty'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                            ? 'bg-white text-black shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vehicles Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="bg-white rounded-3xl p-4 h-[340px] animate-pulse border border-gray-100 shadow-sm">
                                    <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded-xl mt-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No bikes found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any bikes or scooters matching your search. Try adjusting your filters.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCity(''); setRadius(5000); }}
                                className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredVehicles.map((group) => {
                                const vehicle = group.mainVehicle;
                                return (
                                    <div
                                        key={vehicle._id}
                                        onClick={() => {
                                            if (!isUserAuthenticated) {
                                                setShowLoginModal(true);
                                            } else {
                                                router.push(`/vehicle/${vehicle._id}`);
                                            }
                                        }}
                                        className="group bg-white rounded-3xl p-3 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                                    >
                                        <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                                            <div className="relative w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                <Image
                                                    src={vehicle.vehiclePhoto || vehicle.VehiclePhoto || '/static_bike.png'}
                                                    alt={vehicle.vehicleModel || 'Vehicle'}
                                                    fill
                                                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="text-gray-800">{vehicle.distance ? `${vehicle.distance} km` : 'Available'}</span>
                                            </div>

                                            {group.count > 1 && (
                                                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md ">
                                                    {group.count} Available
                                                </div>
                                            )}

                                            <div className="absolute bottom-3 left-3 flex gap-2">
                                                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wide border border-white/10">
                                                    {vehicle.vehicleType || 'Bike'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="px-2 pb-2 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{vehicle.vehicleModel || vehicle.VehicleModel}</h3>
                                                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="truncate max-w-[150px]">{vehicle.businessName || vehicle.City || selectedCity || 'Nearby'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                                <div>
                                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Daily Rate</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-lg font-bold text-gray-900">₹{vehicle.rentalPrice}</span>
                                                        <span className="text-xs text-gray-400">/day</span>
                                                    </div>
                                                </div>

                                                <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200">
                                                    <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* SEO Content Section */}
                <section className="max-w-7xl mx-auto px-6 py-12 mb-10">
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Rent a Bike with Zugo?</h2>
                        <div className="prose prose-lg text-gray-600 max-w-none">
                            <p className="mb-4">
                                Looking to <strong>rent a bike</strong> for your daily commute or a weekend getaway? Zugo is your one-stop solution for affordable and convenient <strong>two-wheeler rentals</strong>. We offer a wide range of verified bikes and scooters to suit every need.
                            </p>
                            <p className="mb-4">
                                Whether you want to <strong>rent a scooty</strong> for easy city navigation or a powerful motorcycle for a long ride, our platform connects you with trusted vehicle owners. With Zugo, you get:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li><strong>Transparent Pricing:</strong> No hidden charges. Pay only for what you see.</li>
                                <li><strong>Wide Variety:</strong> From Honda Activa to Royal Enfield, find your perfect <strong>bike on rent</strong>.</li>
                                <li><strong>Flexible Plans:</strong> Rent by the hour, day, week, or month.</li>
                                <li><strong>Zero Fuel Cost:</strong> Pay only for the rental duration.</li>
                            </ul>
                            <p>
                                Search for "<strong>rent bike near me</strong>" and you'll find Zugo ready to serve you. Experience the freedom of self-drive with India's most flexible vehicle rental platform. Book your ride today!
                            </p>
                        </div>
                    </div>
                </section>


            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                message="Please login to view vehicle details and book your ride"
            />
        </>
    );
}
