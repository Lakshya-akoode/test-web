'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

export default function RentalVehiclesPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rental, setRental] = useState(null);
    const [vehicles, setVehicles] = useState([]);

    // Fetch rental details and vehicles
    useEffect(() => {
        if (params.id) {
            fetchRentalVehicles(params.id);
        }
    }, [params.id]);

    const fetchRentalVehicles = async (rentalId) => {
        try {
            setLoading(true);
            const url = `${API_BASE_URL}${API_ENDPOINTS.RENTAL_VEHICLES}/${rentalId}/vehicles`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.status === 'Success') {
                setRental(data.data.rental);
                setVehicles(data.data.vehicles || []);
            }
        } catch (error) {
            console.error('Error fetching rental vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Link */}
                <div className="mb-6">
                    <Link href="/rentals" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Rentals
                    </Link>
                </div>

                {/* Rental Business Header */}
                {!loading && rental && (
                    <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 absolute inset-0"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 mb-2">{rental.businessName || rental.ownerName}</h1>
                                <p className="text-gray-500 flex items-center gap-2 text-lg">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {rental.City}, {rental.State}
                                </p>
                                <p className="text-gray-400 text-sm mt-1 ml-7 max-w-xl">{rental.Address}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Available Vehicles</p>
                                    <p className="text-3xl font-black text-gray-900">{vehicles.length}</p>
                                </div>
                                <div className="h-12 w-px bg-gray-200 hidden md:block"></div>
                                <div className="text-right hidden md:block">
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Contact</p>
                                    <p className="text-lg font-bold text-gray-900">{rental.ContactNo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100 shadow-sm overflow-hidden">
                                <div className="h-[50%] bg-gray-200"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && vehicles.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🚗</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Vehicles Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">This rental service currently has no vehicles listed.</p>
                    </div>
                )}

                {/* Vehicles Grid */}
                {!loading && vehicles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id || vehicle.additionalVehicleId}
                                className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 h-full flex flex-col transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 overflow-hidden bg-gray-50">
                                    {vehicle.vehiclePhoto ? (
                                        <img
                                            src={vehicle.vehiclePhoto}
                                            alt={vehicle.vehicleModel}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                                e.target.parentElement.innerHTML = '<span class="text-6xl grayscale opacity-30">🚗</span>';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl grayscale opacity-30">🚗</div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                    {/* Price Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-xs font-bold text-gray-900">₹</span>
                                                <span className="text-lg font-black text-gray-900">{vehicle.rentalPrice}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">/day</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col relative bg-white">
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{vehicle.vehicleType}</p>
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{vehicle.vehicleModel}</h3>
                                        <p className="text-sm text-gray-500">{vehicle.transmission || 'Manual'} • {vehicle.seats || '4'} Seats</p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-xs font-bold text-green-700">Available</span>
                                        </div>

                                        <Link
                                            href={`/vehicle/${vehicle._id}`}
                                            className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
