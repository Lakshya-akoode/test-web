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
    const [nearbyRentals, setNearbyRentals] = useState([]);
    const [nearbyLoading, setNearbyLoading] = useState(false);

    // Filter & Sort State
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('price_asc'); // price_asc, price_desc

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
                setFilteredVehicles(data.data.vehicles || []); // Initialize filtered list

                // Fetch nearby rentals once we have rental details
                if (data.data.rental) {
                    fetchNearbyRentals(data.data.rental);
                }
            }
        } catch (error) {
            console.error('Error fetching rental vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNearbyRentals = async (currentRental) => {
        try {
            setNearbyLoading(true);
            const params = new URLSearchParams({
                limit: 4,
                excludeId: currentRental._id // Exclude current rental
            });

            // Prioritize Lat/Long, fallback to City
            if (currentRental.latitude && currentRental.longitude) {
                params.append('latitude', currentRental.latitude);
                params.append('longitude', currentRental.longitude);
                params.append('radius', 50); // 50km radius
            } else if (currentRental.City) {
                params.append('city', currentRental.City);
            }

            const url = `${API_BASE_URL}${API_ENDPOINTS.RENTALS}?${params.toString()}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.status === 'Success') {
                setNearbyRentals(data.data.rentals || []);
            }
        } catch (error) {
            console.error('Error fetching nearby rentals:', error);
        } finally {
            setNearbyLoading(false);
        }
    };

    // Filter Logic
    useEffect(() => {
        let result = [...vehicles];

        // 1. Filter by Category
        if (filterCategory !== 'All') {
            result = result.filter(v => {
                const type = (v.vehicleType || '').toLowerCase();
                const cat = (v.category || '').toLowerCase();
                const sub = (v.subcategory || '').toLowerCase();

                if (filterCategory === 'Bike') {
                    return type.includes('bike') || cat.includes('bike') || sub.includes('bike') ||
                        type.includes('motorcycle') || cat.includes('2-wheeler');
                }
                if (filterCategory === 'Scooter') {
                    return type.includes('scoot') || cat.includes('scoot') || sub.includes('scoot');
                }
                if (filterCategory === 'Car') {
                    return type.includes('car') || cat.includes('car') || sub.includes('car') ||
                        cat.includes('4-wheeler') || ['suv', 'sedan', 'hatchback'].includes(sub);
                }
                return true;
            });
        }

        // 2. Sort by Price
        result.sort((a, b) => {
            const priceA = parseInt(a.rentalPrice) || 0;
            const priceB = parseInt(b.rentalPrice) || 0;
            return sortOrder === 'price_asc' ? priceA - priceB : priceB - priceA;
        });

        setFilteredVehicles(result);
    }, [vehicles, filterCategory, sortOrder]);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Link */}
                <div className="mb-4">
                    <Link href="/rentals" className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Rentals
                    </Link>
                </div>

                {/* Rental Business Header */}
                {!loading && rental && (
                    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600/5 to-purple-600/5 absolute inset-0"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 mb-1.5">{rental.businessName || rental.ownerName}</h1>
                                <p className="text-gray-500 flex items-center gap-1.5 text-base">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {rental.City}, {rental.State}
                                </p>
                                <p className="text-gray-400 text-xs mt-1 ml-5.5 max-w-xl">{rental.Address}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Available Vehicles</p>
                                    <p className="text-2xl font-black text-gray-900">{vehicles.length}</p>
                                </div>
                                <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Contact</p>
                                    <p className="text-base font-bold text-gray-900">{rental.ContactNo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-[350px] animate-pulse border border-gray-100 shadow-sm overflow-hidden">
                                <div className="h-[50%] bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && vehicles.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                            <span className="text-3xl">🚗</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1.5">No Vehicles Found</h3>
                        <p className="text-gray-500 text-sm max-w-sm mx-auto">This rental service currently has no vehicles listed.</p>
                    </div>
                )}

                {/* Filters Section */}
                {!loading && vehicles.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sticky top-20 z-30 bg-gray-50/95 backdrop-blur py-2">
                        {/* Category Tabs */}
                        <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto max-w-full">
                            {['All', 'Bike', 'Scooter', 'Car'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${filterCategory === cat
                                            ? 'bg-black text-white shadow-md'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">Sort by:</span>
                            <div className="relative">
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
                                >
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Vehicles Grid */}
                {!loading && filteredVehicles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredVehicles.map((vehicle) => (
                            <div
                                key={vehicle._id || vehicle.additionalVehicleId}
                                className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 h-full flex flex-col transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden bg-gray-50">
                                    {vehicle.vehiclePhoto ? (
                                        <img
                                            src={vehicle.vehiclePhoto}
                                            alt={vehicle.vehicleModel}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                                                e.target.parentElement.innerHTML = '<span class="text-5xl grayscale opacity-30">🚗</span>';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl grayscale opacity-30">🚗</div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>

                                    {/* Price Badge */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg border border-white/20 shadow-sm">
                                            <div className="flex items-baseline gap-0.5">
                                                <span className="text-[10px] font-bold text-gray-900">₹</span>
                                                <span className="text-base font-black text-gray-900">{vehicle.rentalPrice}</span>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase">/day</span>
                                            </div>
                                        </div>
                                        {vehicle.securityDeposit > 0 && (
                                            <div className="bg-yellow-500/90 backdrop-blur px-2.5 py-1 rounded-lg border border-yellow-400/20 shadow-sm mt-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[9px] font-bold text-white uppercase">Deposit: ₹{vehicle.securityDeposit}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col relative bg-white">
                                    <div className="mb-3">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{vehicle.vehicleType}</p>
                                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">{vehicle.vehicleModel}</h3>
                                        <p className="text-xs text-gray-500">{vehicle.transmission || 'Manual'} • {vehicle.seats || '4'} Seats</p>
                                    </div>

                                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            <span className="text-[10px] font-bold text-green-700">Available</span>
                                        </div>

                                        <Link
                                            href={`/vehicle/${vehicle._id}`}
                                            className="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-lg hover:bg-gray-800 transition-colors"
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

            {/* Nearby Rentals Section */}
            {nearbyRentals.length > 0 && (
                <div className="max-w-6xl mx-auto mt-16 pt-10 border-t border-gray-200">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Nearby Rental Services</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nearbyRentals.map((item) => (
                            <Link
                                key={item._id}
                                href={`/rental/${item._id}`}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                            >
                                <div className="h-40 bg-gray-100 relative overflow-hidden">
                                    {item.rentalImage ? (
                                        <img
                                            src={item.rentalImage}
                                            alt={item.businessName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200">
                                            🏢
                                        </div>
                                    )}
                                    {item.distance !== null && (
                                        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                                            {item.distance} km
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                                        {item.businessName}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {item.City}, {item.State}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.vehicleCount} Vehicles</span>
                                        <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">View →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
