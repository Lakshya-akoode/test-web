'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import API from '@/lib/api';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

export default function ManageRentalPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rentalDetails, setRentalDetails] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [stats, setStats] = useState({ totalVehicles: 0, activeRentals: 0, revenue: 0 });
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

    // Mock user for now if we can't get real one immediately
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        const currentUser = getUser();
        setUser(currentUser);
        fetchRentalDetails(currentUser);
    }, [router]);

    const fetchRentalDetails = async (currentUser) => {
        try {
            setLoading(true);
            const token = getToken();

            // In a real app, we'd fetch the user's rental business ID first
            // For now, we'll try to get it from a hypothetical 'my-rental' endpoint
            // or mock it based on the user ID logic previously seen

            // Mocking data structure for demonstration as backend might not have this specific aggregation yet

            // Fetch Vehicles (reusing logic from My Vehicles but contextualized for rental dashboard)
            const userId = currentUser?._id || currentUser?.id;
            // Assuming we have a rental ID, but we might just query by owner ID for now
            // The searchRouter has /rental/:rentalId/vehicles, but we need to know the rentalId first.
            // Let's assume for this view the backend would return rental info for the logged-in user.

            // For this UI mockup, I'll simulate receiving rental details
            setTimeout(() => {
                setRentalDetails({
                    id: 'rental_123',
                    businessName: 'City Riders',
                    ownerName: currentUser?.name || 'Owner',
                    status: 'Active',
                    rating: 4.8,
                    location: currentUser?.City || 'Mumbai',
                    joinedDate: 'Dec 2024'
                });

                setVehicles([
                    {
                        _id: 'v1',
                        model: 'Honda Activa 6G',
                        type: 'Scooty',
                        number: 'MH 02 AB 1234',
                        status: 'Available',
                        dailyPrice: 500,
                        totalTrips: 45,
                        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop'
                    },
                    {
                        _id: 'v2',
                        model: 'Royal Enfield Classic 350',
                        type: 'Bike',
                        number: 'MH 02 CD 5678',
                        status: 'Rented',
                        dailyPrice: 1200,
                        totalTrips: 28,
                        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c3d?q=80&w=2070&auto=format&fit=crop'
                    },
                    {
                        _id: 'v3',
                        model: 'Maruti Swift',
                        type: 'Car',
                        number: 'MH 02 EF 9012',
                        status: 'Maintenance',
                        dailyPrice: 2500,
                        totalTrips: 12,
                        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop'
                    }
                ]);

                setStats({
                    totalVehicles: 3,
                    activeRentals: 1,
                    revenue: 45000,
                    reviews: 12
                });

                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Simplified) */}
            <aside className="w-64 bg-[#0a0a0a] text-white hidden md:block fixed h-full">
                <div className="p-6">
                    <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8">
                        ZUGO PARTNER
                    </h1>
                    <nav className="space-y-4">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-bold text-white">
                            <span>📊</span> Dashboard
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                            <span>🏍️</span> Fleet
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                            <span>📅</span> Bookings
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                            <span>💰</span> Earnings
                        </a>
                        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
                            <span>⚙️</span> Settings
                        </a>
                    </nav>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                    <Link href="/home" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Exit to Home
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{rentalDetails?.businessName || 'My Rental Service'}</h2>
                                <p className="text-gray-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {rentalDetails?.status || 'Active'} • {rentalDetails?.location}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                    Edit Profile
                                </button>
                                <Link
                                    href="/register-vehicle?type=bike"
                                    className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors shadow-lg flex items-center gap-2"
                                >
                                    <span>+</span> Add Vehicle
                                </Link>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 text-sm font-bold uppercase mb-1">Total Fleet</p>
                                <p className="text-3xl font-black text-gray-900">{stats.totalVehicles}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 text-sm font-bold uppercase mb-1">Active Rentals</p>
                                <p className="text-3xl font-black text-green-600">{stats.activeRentals}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 text-sm font-bold uppercase mb-1">Revenue</p>
                                <p className="text-3xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <p className="text-gray-500 text-sm font-bold uppercase mb-1">Rating</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-3xl font-black text-gray-900">{rentalDetails?.rating}</span>
                                    <span className="text-yellow-500 text-xl">★</span>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Management Section */}
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Vehicle Management</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Search vehicles..."
                                        className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200"
                                    />
                                    <select className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none">
                                        <option>All Status</option>
                                        <option>Available</option>
                                        <option>Rented</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="px-6 py-4">Vehicle Details</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Pricing</th>
                                            <th className="px-6 py-4">Trips</th>
                                            <th className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {vehicles.map((vehicle) => (
                                            <tr key={vehicle._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                            <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{vehicle.model}</p>
                                                            <p className="text-xs text-gray-500">{vehicle.type} • {vehicle.number}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.status === 'Available' ? 'bg-green-100 text-green-700' :
                                                        vehicle.status === 'Rented' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        {vehicle.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900">₹{vehicle.dailyPrice}</p>
                                                    <p className="text-xs text-gray-500">per day</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-900">{vehicle.totalTrips}</p>
                                                    <p className="text-xs text-gray-500">completed</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                                                            ✏️
                                                        </button>
                                                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
