'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser, clearAuth } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import Link from 'next/link';
import TopRentals from '@/components/TopRentals';

export default function HomePage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        setUser(getUser());
        fetchVehicles();
    }, [router]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            // Defaulting to 2-wheeler as per mobile app preference
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES}?category=2-wheeler`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.status === 'Success') {
                setVehicles(data.data.vehicles || []);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = (v.vehicleModel || v.VehicleModel || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'All'
            ? true
            : activeTab === 'Bikes'
                ? (v.vehicleType || '').toLowerCase().includes('bike')
                : (v.vehicleType || '').toLowerCase().includes('scooty');
        return matchesSearch && matchesTab;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Blended with Navbar */}
            <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white pt-16 pb-12">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
                <div className="relative max-w-7xl mx-auto px-4 md:px-6">
                    <div className="max-w-2xl pt-8">
                        <div className="mb-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                India's Largest Self-Drive Platform
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                            Find Your Perfect
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Ride Today
                            </span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-300 mb-6 max-w-2xl">
                            Choose from {vehicles.length}+ verified vehicles. Transparent pricing, no hidden charges.
                        </p>

                        {/* Search Bar */}
                        <div className="bg-white rounded-xl p-1.5 shadow-2xl flex flex-col sm:flex-row gap-1.5 border border-gray-200">
                            <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
                                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by model, city..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm font-medium"
                                />
                            </div>
                            <button className="px-6 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all text-sm shadow-lg hover:shadow-xl flex items-center justify-center">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section - Light Background */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 -mt-8 relative z-10">

                {/* Quick Actions */}
                <section className="mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                                <p className="text-xs text-gray-500 mt-1">Get started in seconds</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {[
                                { label: 'Book Bike', href: '/book/bike', icon: '🏍️', color: 'from-red-500 to-red-600', bg: 'bg-red-50' },
                                { label: 'List Bike', href: '/register-vehicle?type=bike', icon: '📝', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
                                { label: 'Book Car', href: '/book/car', icon: '🚗', color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50' },
                                { label: 'List Car', href: '/register-vehicle?type=car', icon: '📋', color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50' },
                                { label: 'Bookings', href: '/bookings', icon: '📅', color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
                            ].map((action, idx) => (
                                <Link
                                    key={idx}
                                    href={action.href}
                                    className="group relative overflow-hidden rounded-xl p-4 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-100 hover:border-transparent flex flex-col items-center justify-center min-h-[100px]"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    <div className={`absolute inset-0 ${action.bg} opacity-100 group-hover:opacity-0 transition-opacity duration-300`}></div>
                                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 w-full">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                                        <span className="text-xs font-bold text-gray-900 group-hover:text-white text-center transition-colors duration-300 leading-tight">{action.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <main>
                    <TopRentals
                        vehicles={filteredVehicles}
                        loading={loading}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </main>

            </div >
        </div >
    );
}
