'use client';
import Link from 'next/link';
import { useRef } from 'react';

export default function TopRentals({ vehicles = [], loading = false }) {
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full py-8 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Horizontal Scrollable Vehicles Section */}
                {!loading && vehicles.length > 0 && (
                    <div className="w-full">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Available Vehicles</h3>
                                <p className="text-gray-500 text-sm mt-1">{vehicles.length} vehicles ready to ride</p>
                            </div>

                            {/* Navigation Controls */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => scroll('left')}
                                    className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                    aria-label="Scroll left"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                                    aria-label="Scroll right"
                                >
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <Link
                                    href="/rentals"
                                    className="flex items-center gap-2 px-5 py-3 text-purple-600 hover:text-purple-700 font-bold text-sm transition-all duration-200 group"
                                >
                                    View All
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="relative -mx-4 px-4">
                            <div
                                ref={scrollContainerRef}
                                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                {vehicles.map((vehicle, idx) => (
                                    <div
                                        key={vehicle._id || idx}
                                        className="flex-shrink-0 w-[280px] snap-start group"
                                    >
                                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                            {/* Vehicle Image */}
                                            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center">
                                                <img
                                                    src={vehicle.vehiclePhoto || vehicle.VehiclePhoto || '/placeholder-vehicle.jpg'}
                                                    alt={vehicle.vehicleModel || vehicle.VehicleModel}
                                                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                                                    ₹{vehicle.rentalPrice}/day
                                                </div>
                                            </div>

                                            {/* Vehicle Info */}
                                            <div className="p-4">
                                                <h4 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                                    {vehicle.vehicleModel || vehicle.VehicleModel}
                                                </h4>
                                                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="truncate">{vehicle.City}, {vehicle.State}</span>
                                                </p>

                                                {/* Owner and Rating */}
                                                <div className="mb-3 space-y-2">
                                                    {/* Owner */}
                                                    {vehicle.ownerName && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span className="truncate font-medium">{vehicle.ownerName}</span>
                                                        </div>
                                                    )}

                                                    {/* Rating */}
                                                    {vehicle.rating !== undefined && (
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="flex items-center gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <svg
                                                                        key={i}
                                                                        className={`w-3.5 h-3.5 ${i < Math.floor(vehicle.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
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
                                                                <span className="text-xs text-gray-500">
                                                                    ({vehicle.reviewCount})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                                                        {vehicle.vehicleType || vehicle.subcategory}
                                                    </span>
                                                    <Link
                                                        href={`/vehicle/${vehicle._id}`}
                                                        className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1"
                                                    >
                                                        View
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Main Heading Section */}
                <div className="text-center mb-12 relative pt-8">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                    <span className="relative inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                        Choose Your Path
                    </span>
                    <h2 className="relative text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                        Rent or <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Earn</span> today
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Rent Card */}
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 shadow-2xl min-h-[500px] flex flex-col">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>

                        <div className="relative z-10 p-8 md:p-12 flex-1 flex flex-col">
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-gray-300 uppercase tracking-wide">
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
                                className="w-full py-4 bg-white text-black text-center rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 group/btn"
                            >
                                Browse Rentals
                                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* List Your Vehicle Card */}
                    <div className="relative group overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 shadow-xl min-h-[500px] flex flex-col">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

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
