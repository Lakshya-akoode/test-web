'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

export default function RentalsPage() {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    // Default location (e.g., Delhi) if user location is not available immediately
    const [userLocation, setUserLocation] = useState({ latitude: 28.6139, longitude: 77.2090 });

    // Fetch rentals
    useEffect(() => {
        // Try to get user location first
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.log("Using default location due to error:", error);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (userLocation.latitude && userLocation.longitude) {
            fetchRentals();
        }
    }, [userLocation]);

    const fetchRentals = async () => {
        try {
            setLoading(true);
            // Construct URL with lat/long
            let url = `${API_BASE_URL}${API_ENDPOINTS.RENTALS}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&radius=5000&limit=50`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.status === 'Success') {
                setRentals(data.data.rentals || []);
            }
        } catch (error) {
            console.error('Error fetching rentals:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/home" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Back to Home
                            </Link>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                            Permium <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600">Rentals</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg font-medium">Browse verified rental services near you</p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100 shadow-sm overflow-hidden">
                                <div className="h-[50%] bg-gray-200"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-1/3 bg-gray-200 rounded mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && rentals.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">store</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Rentals Found Near You</h3>
                        <p className="text-gray-500 max-w-md mx-auto">We couldn't find any rental services in your current location. Try changing your search options.</p>
                    </div>
                )}

                {/* Rentals Grid */}
                {!loading && rentals.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {rentals.map((rental, idx) => (
                            <div
                                key={rental._id}
                                className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 h-full flex flex-col transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden bg-gray-50">
                                    {rental.rentalImage || rental.vehiclePhoto ? (
                                        <img
                                            src={rental.rentalImage || rental.vehiclePhoto}
                                            alt={rental.businessName}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                                e.target.parentElement.innerHTML = '<span class="text-6xl grayscale opacity-30">🏪</span>';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl grayscale opacity-30">🏪</div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                    {/* Distance Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="px-3 py-1 bg-black/50 text-white text-xs font-bold rounded-full backdrop-blur-md border border-white/20 flex items-center gap-1">
                                            📍 {rental.distance} km
                                        </span>
                                    </div>

                                    {/* Location on Image Bottom */}
                                    <div className="absolute bottom-4 left-4 right-4 z-10">
                                        <p className="text-white font-bold text-lg truncate drop-shadow-md">{rental.businessName || rental.ownerName}</p>
                                        <p className="text-gray-200 text-xs truncate flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {rental.location || rental.City}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col relative bg-white">

                                    {/* Business Info */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Rental Service</p>
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{rental.businessName || rental.ownerName}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{rental.vehicleCount || '1+'} Vehicles</span>
                                            {rental.vehicleModel && <span className="text-xs truncate max-w-[120px]">feat. {rental.vehicleModel}</span>}
                                        </p>
                                    </div>

                                    {/* Price & Rating */}
                                    <div className="flex items-end justify-between mt-auto border-t border-gray-50 pt-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Starting from</p>
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-sm font-bold text-gray-900">₹</span>
                                                <span className="text-xl font-black text-gray-900">{rental.rentalPrice}</span>
                                                <span className="text-xs text-gray-400 font-medium">/day</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                            <span className="text-yellow-500 text-xs">★</span>
                                            <span className="text-xs font-bold text-yellow-700">{rental.rating || '4.5'}</span>
                                            <span className="text-[10px] text-gray-400">({rental.reviewCount || 20})</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/rentals/${rental.rentalId}`}
                                        className="mt-4 w-full py-2.5 bg-gray-900 text-white text-center rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                                    >
                                        View Vehicles
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
