'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

export default function BookBikePage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
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
        filterVehiclesByCategory(activeTab);
    }, [activeTab, vehicles]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            filterVehiclesByCategory(activeTab);
        } else {
            const filtered = vehicles.filter(vehicle =>
                (vehicle.vehicleModel || vehicle.VehicleModel)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vehicle.City?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredVehicles(filtered);
        }
    }, [searchQuery]);

    const filterVehiclesByCategory = (category) => {
        const normalized = (v) => (v || '').toString().trim().toLowerCase();
        const isBikeLike = (type) => ['bike'].includes(type);
        const isScootyLike = (type) => ['scooty', 'scooter'].includes(type);

        const onlyTwoWheelers = vehicles.filter(v => {
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

        const filtered = onlyTwoWheelers.filter(v => {
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <Link href="/home" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                            Book a <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Bike</span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">Find the perfect two-wheeler for your journey</p>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200 transition-all">
                                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by model, city, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-500 text-base font-medium"
                                />
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="px-5 py-4 bg-slate-50 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-slate-200 text-base font-medium min-w-[150px]"
                                />
                                <button
                                    onClick={() => setShowRadiusModal(true)}
                                    className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {searchRadius} km
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-1.5">
                        {['All', 'Bikes', 'Scooty'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-5 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                                    activeTab === tab
                                        ? 'bg-white text-slate-900 shadow-md'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vehicles Grid */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-5 h-80 animate-pulse border border-slate-100 shadow-sm">
                                <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded-lg w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No bikes found</h3>
                        <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCity('');
                            }}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
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
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="relative h-56 w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                    {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                        <Image
                                            src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                            alt={vehicle.vehicleModel || 'Vehicle'}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 border border-slate-100">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-slate-700">{vehicle.distance ? `${vehicle.distance} km` : 'Available'}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{vehicle.vehicleModel || vehicle.VehicleModel}</h3>
                                    <div className="flex items-center gap-2 flex-wrap mb-4">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">{vehicle.vehicleType}</span>
                                        {vehicle.City && (
                                            <span className="text-xs text-slate-600 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {vehicle.City}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            <div className="text-2xl font-extrabold text-slate-900">₹{vehicle.rentalPrice}</div>
                                            <div className="text-xs text-slate-500 font-medium">per day</div>
                                        </div>
                                        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-[-5deg]">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Radius Modal */}
            {showRadiusModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRadiusModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Search Radius</h3>
                        <p className="text-slate-600 mb-8">Select how far you want to search for vehicles</p>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[10, 25, 50, 100].map((radius) => (
                                <button
                                    key={radius}
                                    onClick={() => {
                                        setSearchRadius(radius);
                                        setShowRadiusModal(false);
                                    }}
                                    className={`px-5 py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                                        searchRadius === radius
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {radius} km
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowRadiusModal(false)}
                            className="w-full px-5 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold text-base hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

