'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

export default function BookCarPage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [searchRadius, setSearchRadius] = useState(50);
    const [showRadiusModal, setShowRadiusModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchVehicles();
    }, [router]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredVehicles(vehicles);
        } else {
            const filtered = vehicles.filter(vehicle =>
                (vehicle.vehicleModel || vehicle.VehicleModel)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vehicle.City?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredVehicles(filtered);
        }
    }, [searchQuery, vehicles]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            let queryParams = 'category=4-wheeler';
            if (selectedCity) {
                queryParams += `&city=${selectedCity}`;
            }

            const url = `${API_BASE_URL}${API_ENDPOINTS.VEHICLES}?${queryParams}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.status === 'Success') {
                const fetchedVehicles = data.data.vehicles || [];
                setVehicles(fetchedVehicles);
                setFilteredVehicles(fetchedVehicles);
            }
        } catch (error) {
            console.error('Fetch vehicles error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [selectedCity]);

    return (
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
                                Premium Fleet
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                                Book a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Car</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                                Choose from our wide range of premium cars for your city rides or outstation trips.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="relative max-w-7xl mx-auto px-4 md:px-6 -mt-20 z-10">
                {/* Search and Filters */}
                <div className="bg-white rounded-2xl p-4 mb-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
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
                            <button
                                onClick={() => setShowRadiusModal(true)}
                                className="px-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <span>📍</span>
                                <span>{searchRadius} km</span>
                            </button>
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
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any cars matching your search. Try adjusting your filters or search radius.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCity(''); }}
                            className="mt-6 px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredVehicles.map((vehicle) => (
                            <Link
                                href={`/vehicle/${vehicle._id}`}
                                key={vehicle._id}
                                className="group bg-white rounded-3xl p-3 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col"
                            >
                                <div className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4">
                                    {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                        <Image
                                            src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                            alt={vehicle.vehicleModel || 'Vehicle'}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-gray-800">{vehicle.distance ? `${vehicle.distance} km` : 'Available'}</span>
                                    </div>

                                    <div className="absolute bottom-3 left-3 flex gap-2">
                                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wide border border-white/10">
                                            {vehicle.vehicleType || 'Car'}
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
                                                <span className="truncate max-w-[150px]">{vehicle.City || selectedCity || 'Nearby'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                        <div>
                                            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Daily Rate</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-lg font-bold text-gray-900">₹{vehicle.rentalPrice}</span>
                                            </div>
                                        </div>

                                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200">
                                            <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* SEO Content Section */}
            <section className="max-w-7xl mx-auto px-6 py-12 mb-10">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Rent a Car with Zugo?</h2>
                    <div className="prose prose-lg text-gray-600 max-w-none">
                        <p className="mb-4">
                            Planning a road trip or need a comfortable ride for the city? <strong>Rent a car</strong> with Zugo and enjoy the privacy and freedom of a personal vehicle. As a leading <strong>self-drive car rental</strong> platform, we offer a seamless booking experience.
                        </p>
                        <p className="mb-4">
                            Forget the hassle of cabs and drivers. With our <strong>car rental service</strong>, you are in the driver's seat. Choose from our premium fleet of hatchbacks, sedans, and SUVs. Our <strong>four-wheeler rental</strong> options are perfect for:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mb-6">
                            <li><strong>Weekend Getaways:</strong> Spacious SUVs for family trips.</li>
                            <li><strong>City Commutes:</strong> Compact hatchbacks for easy parking.</li>
                            <li><strong>Business Travel:</strong> Premium sedans for a professional impression.</li>
                        </ul>
                        <p>
                            When you search for "<strong>car rental near me</strong>", trust Zugo for quality and reliability. We provide well-maintained vehicles with optional unlimited kilometer plans. Start your journey with the best <strong>self-drive car</strong> service in India.
                        </p>
                    </div>
                </div>
            </section>

            {/* Radius Modal */}
            {
                showRadiusModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRadiusModal(false)}>
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Search Radius</h3>
                                <p className="text-gray-500">Find cars within {searchRadius}km of your location</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {[10, 25, 50, 100].map((radius) => (
                                    <button
                                        key={radius}
                                        onClick={() => {
                                            setSearchRadius(radius);
                                            setShowRadiusModal(false);
                                        }}
                                        className={`px-4 py-4 rounded-xl font-bold text-lg transition-all border-2 ${searchRadius === radius
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-100 bg-white text-gray-700 hover:border-blue-200'
                                            }`}
                                    >
                                        {radius} km
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowRadiusModal(false)}
                                className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
