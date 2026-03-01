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
        // Set user if authenticated, but don't redirect if not
        if (isAuthenticated()) {
            setUser(getUser());
        }
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            // Fetch all vehicles (remove category filter)
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES}?limit=5&dbLimit=5`, {
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
        <div className="min-h-screen bg-gray-50/50 overflow-x-hidden">
            {/* Hero Section - Blended with Navbar */}
            <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="max-w-3xl pt-8">
                        <div className="mb-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/10 shadow-lg">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Book on the go with Zugo
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                            Pay Just 10%
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Book In Advance
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl leading-relaxed">
                            Choose from our variety of ranges. Pay a 10% token amount to reserve, and settle the rest with the owner when you pick up your ride!
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Actions - Floating Over Hero */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 -mt-20">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Book Bike', href: '/book/bike', icon: '🏍️', color: 'text-blue-600', hoverBg: 'group-hover:bg-blue-50', hoverBorder: 'group-hover:border-blue-200' },
                        { label: 'List Bike', href: '/register-vehicle?type=bike', icon: '📝', color: 'text-purple-600', hoverBg: 'group-hover:bg-purple-50', hoverBorder: 'group-hover:border-purple-200' },
                        { label: 'Book Car', href: '/book/car', icon: '🚗', color: 'text-orange-600', hoverBg: 'group-hover:bg-orange-50', hoverBorder: 'group-hover:border-orange-200' },
                        { label: 'List Car', href: '/register-vehicle?type=car', icon: '📋', color: 'text-green-600', hoverBg: 'group-hover:bg-green-50', hoverBorder: 'group-hover:border-green-200' },
                        { label: 'Bookings', href: '/bookings', icon: '📅', color: 'text-pink-600', hoverBg: 'group-hover:bg-pink-50', hoverBorder: 'group-hover:border-pink-200' },
                    ].map((action, idx) => (
                        <Link
                            key={idx}
                            href={action.href}
                            className={`group bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 ${action.hoverBg} ${action.hoverBorder}`}
                        >
                            <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300 transform">{action.icon}</span>
                            <span className={`text-sm font-bold text-gray-700 group-hover:text-gray-900 ${action.color}`}>{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 mt-4 relative z-0">
                <main>
                    <TopRentals
                        vehicles={filteredVehicles}
                        loading={loading}
                    />
                </main>
            </div>
        </div>
    );
}
