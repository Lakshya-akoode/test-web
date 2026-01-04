'use client';
import Link from 'next/link';

export default function TopRentals() {
    return (
        <div className="w-full py-16 px-4">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Main Heading Section */}
                <div className="text-center mb-12 relative">
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
