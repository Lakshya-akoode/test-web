'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function TopRentals({ vehicles = [], loading = false }) {
    const scrollContainerRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 340;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const categories = ['All', 'Bike', 'Scooter', 'Car'];

    const filteredVehicles = vehicles.filter(v => {
        if (activeFilter === 'All') return true;
        const type = (v.vehicleType || v.subcategory || '').toLowerCase();
        if (activeFilter === 'Bike') return type.includes('bike') || type.includes('motorcycle');
        if (activeFilter === 'Scooter') return type.includes('scoot') || type.includes('scooty');
        if (activeFilter === 'Car') return type.includes('car') || type.includes('suv') || type.includes('sedan') || type.includes('hatchback');
        return true;
    });

    return (
        <div className="w-full py-12 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Vehicles Section */}
                {!loading && vehicles.length > 0 && (
                    <div className="w-full">
                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-2">Top Picks</p>
                                <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                    Available Vehicles
                                </h3>
                                <p className="text-gray-500 text-base mt-2">{vehicles.length} vehicles ready to ride near you</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Category Filters */}
                                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveFilter(cat)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeFilter === cat
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Nav Arrows */}
                                <div className="hidden md:flex items-center gap-2">
                                    <button
                                        onClick={() => scroll('left')}
                                        className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                        aria-label="Scroll left"
                                    >
                                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => scroll('right')}
                                        className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
                                        aria-label="Scroll right"
                                    >
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <Link
                                    href="/rentals"
                                    className="hidden md:flex items-center gap-1 px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all group"
                                >
                                    View All
                                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="relative -mx-4 px-4">
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {filteredVehicles.slice(0, 8).map((vehicle, idx) => (
                                    <Link
                                        key={vehicle._id || idx}
                                        href={`/vehicle/${vehicle._id}`}
                                        className="flex-shrink-0 w-[300px] snap-start group block"
                                    >
                                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                            {/* Vehicle Image */}
                                            <div className="relative h-52 bg-gray-50 overflow-hidden">
                                                <img
                                                    src={vehicle.vehiclePhoto || vehicle.VehiclePhoto || '/placeholder-vehicle.jpg'}
                                                    alt={vehicle.vehicleModel || vehicle.VehicleModel}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        e.target.style.objectFit = 'contain';
                                                        e.target.style.padding = '1rem';
                                                    }}
                                                />

                                                {/* Vehicle Type Tag */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2.5 py-1 bg-gray-900/80 text-white text-[11px] font-bold rounded-lg uppercase tracking-wide">
                                                        {vehicle.vehicleType || vehicle.subcategory || 'Vehicle'}
                                                    </span>
                                                </div>

                                                {/* Availability Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500 text-white text-[11px] font-bold rounded-lg">
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                        Available
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Vehicle Info */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                                                        {vehicle.vehicleModel || vehicle.VehicleModel}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="truncate">{vehicle.City}{vehicle.State ? `, ${vehicle.State}` : ''}</span>
                                                    </p>

                                                    {/* Owner */}
                                                    {vehicle.ownerName && (
                                                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-3">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span className="truncate font-medium">{vehicle.ownerName}</span>
                                                        </p>
                                                    )}

                                                    {/* Rating */}
                                                    {vehicle.rating !== undefined && (
                                                        <div className="flex items-center gap-1.5 mb-3">
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg
                                                                        key={i}
                                                                        className={`w-3.5 h-3.5 ${i < Math.floor(vehicle.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-700">
                                                                {vehicle.rating?.toFixed(1) || '0.0'}
                                                            </span>
                                                            {vehicle.reviewCount && (
                                                                <span className="text-xs text-gray-400">
                                                                    ({vehicle.reviewCount})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Price & CTA */}
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Per Day</p>
                                                        <p className="text-xl font-black text-gray-900">
                                                            ₹{vehicle.rentalPrice}
                                                        </p>
                                                    </div>
                                                    <span className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl group-hover:bg-blue-600 transition-colors">
                                                        Book Now
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}

                                {filteredVehicles.length === 0 && (
                                    <div className="flex-1 flex flex-col items-center justify-center py-12 text-center min-w-full">
                                        <span className="text-4xl mb-3">🔍</span>
                                        <p className="text-gray-500 font-medium">No {activeFilter !== 'All' ? activeFilter.toLowerCase() + 's' : 'vehicles'} found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile View All */}
                        <div className="md:hidden mt-4 text-center">
                            <Link
                                href="/rentals"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                View All Vehicles
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex gap-5 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex-shrink-0 w-[300px] bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                                <div className="h-52 bg-gray-100"></div>
                                <div className="p-5 space-y-3">
                                    <div className="h-5 w-3/4 bg-gray-100 rounded-lg"></div>
                                    <div className="h-4 w-1/2 bg-gray-100 rounded-lg"></div>
                                    <div className="h-8 w-1/3 bg-gray-100 rounded-lg mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Rent or Earn Section */}
                <div className="text-center mb-4 relative pt-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                        Choose Your Path
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                        Rent or <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Earn</span> today
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Rent Card */}
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl min-h-[500px] flex flex-col">
                        <div className="relative z-10 p-8 md:p-12 flex-1 flex flex-col">
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Renter
                                </span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                                Find your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Perfect Ride</span>
                            </h3>
                            <p className="text-gray-400 mb-8 max-w-sm">
                                Choose from our premium collection of verified bikes and cars for your next adventure.
                            </p>

                            {/* Visual Element */}
                            <div className="relative mt-auto mb-8 h-48 w-full group-hover:scale-105 transition-transform duration-700">
                                <img src="/travel.png" alt="Rent Vehicle" className="w-full h-full object-cover rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                            </div>

                            <Link
                                href="/rentals"
                                className="w-full py-4 bg-white text-black text-center rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                            >
                                Browse Rentals
                                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* List Your Vehicle Card */}
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-xl min-h-[500px] flex flex-col">
                        <div className="relative z-10 p-8 md:p-12 flex-1 flex flex-col">
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-purple-600 uppercase tracking-wide">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    Partner
                                </span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                                Earn from your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Idle Vehicle</span>
                            </h3>
                            <p className="text-gray-500 mb-8 max-w-sm">
                                Join thousands of owners earning passive income by listing their bikes and cars securely.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-auto mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center group-hover:-translate-y-1 transition-transform">
                                    <div className="text-2xl mb-1">💰</div>
                                    <div className="text-sm font-bold text-gray-900">High Earnings</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">Up to ₹30k/mo</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center group-hover:-translate-y-1 transition-transform delay-75">
                                    <div className="text-2xl mb-1">🛡️</div>
                                    <div className="text-sm font-bold text-gray-900">Zero Risk</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">Verified Renters</div>
                                </div>
                            </div>

                            <Link
                                href="/register-rental"
                                className="w-full py-4 bg-gray-900 text-white text-center rounded-xl font-bold text-lg hover:bg-black transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group/btn"
                            >
                                Register Rental Service
                                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
