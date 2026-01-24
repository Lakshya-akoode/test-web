'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, clearAuth, isAuthenticated } from '@/lib/auth';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Hide navbar on auth pages if desired, or handle differently
    // Based on "Same accross website", we might want it everywhere, 
    // but usually Login/Register have their own layouts.
    useEffect(() => {
        setUser(getUser());

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        clearAuth();
        setShowLogoutModal(false);
        router.push('/login');
    };

    // Hide navbar on auth pages if desired, or handle differently
    // Based on "Same accross website", we might want it everywhere, 
    // but usually Login/Register have their own layouts.
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (isAuthPage) return null;

    // Determine if we are on the home page hero section (transparent state)
    const isHome = pathname === '/home' || pathname === '/';
    // Transparent if on Home AND not scrolled. Otherwise white/glass.
    const isTransparent = isHome && !isScrolled;

    const navClass = isTransparent
        ? 'bg-transparent border-transparent'
        : 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-sm';

    const textColorClass = isTransparent ? 'text-white' : 'text-gray-900';
    const logoFilterClass = isTransparent ? 'invert brightness-0' : ''; // Turn black logo to white
    const hoverTextClass = isTransparent ? 'hover:text-gray-200' : 'hover:text-black';

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${navClass}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo Section */}
                        <div className="flex items-center gap-8 lg:gap-12">
                            <Link href={isAuthenticated() ? "/home" : "/"} className="flex-shrink-0 group">
                                <Image
                                    src="/black_logo.png"
                                    alt="ZUGO"
                                    width={100}
                                    height={32}
                                    className={`object-contain transition-all duration-300 group-hover:scale-105 ${logoFilterClass}`}
                                    priority
                                />
                            </Link>

                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            {isAuthenticated() ? (
                                <>
                                    <div className={`hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-semibold ${textColorClass}`}>
                                        <Link href="/bookings" className={`transition-colors ${pathname === '/bookings' && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>My Bookings</Link>
                                        <Link href="/my-vehicles" className={`transition-colors ${pathname === '/my-vehicles' && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>My Vehicles</Link>
                                        <Link href="/owner-bookings" className={`transition-colors ${pathname === '/owner-bookings' && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>Owner Bookings</Link>
                                    </div>

                                    <div className={`h-6 w-px hidden lg:block ${isTransparent ? 'bg-white/20' : 'bg-gray-200'}`}></div>

                                    <div className="flex items-center gap-2 lg:gap-3">
                                        <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
                                            <div className="text-right hidden sm:block">
                                                <div className={`text-xs font-bold leading-tight ${isTransparent ? 'text-white' : 'text-gray-900'}`}>User</div>
                                                <div className={`text-[10px] font-semibold uppercase tracking-wide ${isTransparent ? 'text-gray-300' : 'text-gray-500'}`}>VERIFIED</div>
                                            </div>
                                            <Link href="/profile" className={`w-9 h-9 lg:w-10 lg:h-10 ${isTransparent ? 'bg-white/20 ring-2 ring-white/30' : 'bg-gray-900 ring-2 ring-gray-200'} rounded-full flex items-center justify-center text-white text-xs lg:text-sm font-bold shadow-md hover:scale-105 transition-transform cursor-pointer`}>
                                                {(user?.Name || user?.username || 'U').charAt(0).toUpperCase()}
                                            </Link>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className={`p-2 rounded-lg transition-colors ${isTransparent ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                                            title="Logout"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href="/login" className={`text-sm font-bold hover:opacity-80 transition-opacity ${isTransparent ? 'text-white' : 'text-gray-900'}`}>
                                        Log In
                                    </Link>
                                    <Link href="/register" className={`px-5 py-2.5 text-sm font-bold rounded-xl shadow-lg transition-all hover:scale-105 ${isTransparent ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 text-center mb-2">Log Out?</h3>
                        <p className="text-gray-500 text-center mb-8 font-medium">
                            Are you sure you want to log out? <br /> You will need to sign in again to access your account.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 px-5 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-5 py-3.5 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/30 text-sm"
                            >
                                Yes, Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
