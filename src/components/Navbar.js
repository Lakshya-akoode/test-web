'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, clearAuth, isAuthenticated } from '@/lib/auth';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        setShowLogoutModal(true);
        setIsMobileMenuOpen(false);
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
    const isTransparent = isHome && !isScrolled && !isMobileMenuOpen;

    const navClass = isTransparent
        ? 'bg-transparent border-transparent'
        : 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-sm';

    const textColorClass = isTransparent ? 'text-white' : 'text-gray-900';
    const logoFilterClass = isTransparent ? 'invert brightness-0' : ''; // Turn black logo to white
    const hoverTextClass = isTransparent ? 'hover:text-gray-200' : 'hover:text-black';
    const hamburgerColorClass = isTransparent ? 'text-white' : 'text-gray-900';

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

                        {/* Right Side Actions (Desktop) */}
                        <div className="hidden lg:flex items-center gap-4 lg:gap-6">
                            {isAuthenticated() ? (
                                <>
                                    <div className={`flex items-center gap-4 xl:gap-6 text-sm font-semibold ${textColorClass}`}>
                                        <Link href="/bookings" className={`transition-colors ${pathname === '/bookings' && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>My Bookings</Link>
                                        <Link href="/my-vehicles" className={`transition-colors ${pathname === '/my-vehicles' && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>My Vehicles</Link>
                                        <Link href="/owner-bookings" className={`transition-colors ${pathname === '/owner-bookings' && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>Owner Bookings</Link>
                                    </div>

                                    <div className={`h-6 w-px ${isTransparent ? 'bg-white/20' : 'bg-gray-200'}`}></div>

                                    <div className="flex items-center gap-2 lg:gap-3">
                                        <div className="flex items-center gap-2.5 lg:gap-3">
                                            <div className="text-right">
                                                <div className={`text-xs font-bold leading-tight ${isTransparent ? 'text-white' : 'text-gray-900'}`}>User</div>
                                                <div className={`text-[10px] font-semibold uppercase tracking-wide ${isTransparent ? 'text-gray-300' : 'text-gray-500'}`}>VERIFIED</div>
                                            </div>
                                            <Link href="/profile" className={`w-10 h-10 ${isTransparent ? 'bg-white/20 ring-2 ring-white/30' : 'bg-gray-900 ring-2 ring-gray-200'} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md hover:scale-105 transition-transform cursor-pointer`}>
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

                        {/* Hamburger Button (Mobile) */}
                        <div className="flex lg:hidden items-center gap-4 z-50">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2.5 rounded-full shadow-lg border border-gray-100 transition-all active:scale-95 ${isTransparent ? 'bg-white text-black' : 'bg-white text-gray-900'}`}
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`lg:hidden fixed inset-0 z-[9999] bg-white transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ backgroundColor: '#ffffff' }}
            >
                <div className="flex flex-col h-full bg-white">
                    {/* Menu Header with Close Button */}
                    <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 shrink-0">
                        {/* Optional: Add Logo here if desired, otherwise just space or "Menu" title */}
                        <div className="text-xl font-bold tracking-tight text-gray-900">Menu</div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 -mr-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            aria-label="Close menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                        <div className="flex flex-col gap-6 text-lg font-medium text-gray-900">
                            {isAuthenticated() ? (
                                <>
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                        <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                                            {(user?.Name || user?.username || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-900 truncate">{user?.Name || user?.username || 'User'}</div>
                                            <div className="text-xs font-semibold text-green-600 uppercase tracking-wide">Verified Member</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Link href="/home" className="py-3 px-2 border-b border-gray-100 hover:bg-gray-50 hover:pl-4 transition-all rounded-lg">Home</Link>
                                        <Link href="/bookings" className="py-3 px-2 border-b border-gray-100 hover:bg-gray-50 hover:pl-4 transition-all rounded-lg">My Bookings</Link>
                                        <Link href="/my-vehicles" className="py-3 px-2 border-b border-gray-100 hover:bg-gray-50 hover:pl-4 transition-all rounded-lg">My Vehicles</Link>
                                        <Link href="/owner-bookings" className="py-3 px-2 border-b border-gray-100 hover:bg-gray-50 hover:pl-4 transition-all rounded-lg">Owner Bookings</Link>
                                        <Link href="/profile" className="py-3 px-2 border-b border-gray-100 hover:bg-gray-50 hover:pl-4 transition-all rounded-lg">My Profile</Link>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="py-3 px-2 text-left text-red-600 font-bold hover:bg-red-50 hover:pl-4 transition-all rounded-lg mt-2"
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/" className="py-3 border-b border-gray-100 hover:text-blue-600 transition-colors">Home</Link>
                                    <Link href="/login" className="py-3 border-b border-gray-100 hover:text-blue-600 transition-colors">Log In</Link>
                                    <Link href="/register" className="py-3 px-4 bg-black text-white text-center rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all mt-6">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
