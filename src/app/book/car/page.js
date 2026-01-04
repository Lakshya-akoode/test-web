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
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/home" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Car</h1>
                    <p className="text-gray-600">Find the perfect car for your journey</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by model, city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Filter by city"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-black/5 text-sm"
                            />
                            <button
                                onClick={() => setShowRadiusModal(true)}
                                className="px-4 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
                            >
                                📍 {searchRadius} km
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vehicles Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 h-80 animate-pulse border border-gray-100">
                                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No vehicles found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredVehicles.map((vehicle) => (
                            <Link
                                href={`/vehicle/${vehicle._id}`}
                                key={vehicle._id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative h-48 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                    {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                        <Image
                                            src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                            alt={vehicle.vehicleModel || 'Vehicle'}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1">
                                        <svg className="w-2.5 h-2.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">{vehicle.distance ? `${vehicle.distance} km` : 'Available'}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">{vehicle.vehicleModel || vehicle.VehicleModel}</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-3">
                                        <span className="px-1.5 py-0.5 bg-gray-100 rounded-full">{vehicle.vehicleType}</span>
                                        {vehicle.City && <span>• {vehicle.City}</span>}
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">₹{vehicle.rentalPrice}</div>
                                            <div className="text-[10px] text-gray-400">per day</div>
                                        </div>
                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Radius Modal */}
            {showRadiusModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRadiusModal(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-2">Search Radius</h3>
                        <p className="text-sm text-gray-600 mb-6">Select how far you want to search</p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[10, 25, 50, 100].map((radius) => (
                                <button
                                    key={radius}
                                    onClick={() => {
                                        setSearchRadius(radius);
                                        setShowRadiusModal(false);
                                    }}
                                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                        searchRadius === radius
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {radius} km
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowRadiusModal(false)}
                            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}




