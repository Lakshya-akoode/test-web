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
        clearAuth();
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

                        {/* Desktop Navigation */}
                        {/* <div className={`hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold ${textColorClass}`}>
                            <Link href="/home" className={`transition-colors ${pathname === '/home' && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>
                                Explore
                            </Link>
                            <Link href="/book/bike" className={`transition-colors ${pathname?.startsWith('/book') && !isTransparent ? 'text-black font-bold' : ''} ${hoverTextClass}`}>
                                Book Vehicle
                            </Link>
                            <Link href="/register-vehicle" className={`transition-colors ${hoverTextClass}`}>
                                List Vehicle
                            </Link>
                        </div> */}
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
    );
}
