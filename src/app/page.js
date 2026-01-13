'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

export default function RootPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('signup');

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/home');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-5 py-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.png"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex justify-center mb-4 animate-fade-in">

            <Image
              src="/path2.png"
              alt="Zugo Logo"
              width={150}
              height={150}
              className="object-contain"
              priority
            />

          </div>

          <div className="text-center mb-10 animate-fade-in-up">
            <h1 className="text-4xl md:text-3xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-2xl">
              India's Largest Self-Drive Vehicle Rental Platform
              <span className="block text-white mt-1"></span>
            </h1>
            <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-medium drop-shadow-lg">
              Rent bikes and cars on your own terms. No hidden charges, no fuel charges,
              and complete freedom to travel wherever you want.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/login"
                className="group w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-base hover:bg-gray-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transform inline-flex items-center justify-center"
              >
                Book a Vehicle
              </Link>
              <Link
                href="/register"
                className="group w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-base border border-white/30 hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105 transform inline-flex items-center justify-center"
              >
                List Your Vehicle
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto animate-fade-in-up">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">10K+</div>
              <div className="text-xs md:text-sm text-gray-200 font-semibold">Vehicles</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">50K+</div>
              <div className="text-xs md:text-sm text-gray-200 font-semibold">Happy Customers</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-lg">100+</div>
              <div className="text-xs md:text-sm text-gray-200 font-semibold">Cities</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-10 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
            Why Choose Zugo?
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Zugo is India's leading self-drive vehicle rental platform, making it easy
            for you to rent bikes and cars, or earn money by listing your own vehicle.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Image
                  src="/rentbike.png"
                  alt="Easy Booking"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Book your favorite bike or car in just a few clicks. No paperwork, no hassle.
              </p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Image
                  src="/bookcar.png"
                  alt="Flexible Plans"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible Plans</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose from hourly, daily, or weekly rental plans that suit your needs.
              </p>
            </div>

            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Image
                  src="/cal.png"
                  alt="24/7 Support"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our support team is always ready to help you with any queries or issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 mb-12 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex justify-center">
              <div className="inline-flex flex-wrap p-1.5 bg-gray-100 rounded-2xl gap-1">
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'signup'
                    ? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'search'
                    ? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                >
                  Search & Book Vehicles
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'list'
                    ? 'bg-white text-gray-900 shadow-md ring-1 ring-black/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`}
                >
                  List Your Vehicle
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center min-h-[500px]">
            {/* Sign Up Tab */}
            {activeTab === 'signup' && (
              <>
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    Sign Up
                  </h1>
                  <p className="text-base md:text-lg font-semibold text-gray-800">
                    Create your free account in just a few minutes.
                  </p>
                  <div className="space-y-6 pt-4">
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">For Everyone</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          Whether you're a <strong>vehicle owner</strong> or a <strong>renter</strong>, simply provide your basic details to get started.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Flexible Sign Up</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          You can sign up using your <strong>email or phone</strong>, and once verified, you instantly gain access to your dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Instant Features</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          <strong>Vehicle owners</strong> get tools to list their vehicles, and <strong>Renters</strong> get fast access to vehicle search and booking.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Get Started Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="relative flex justify-center lg:justify-end">
                  <div className="transition-transform duration-700 ease-out">
                    <div className="w-[100px] h-[400px] md:w-[280px] md:h-[400px]">
                      <Image
                        src="/login.svg"
                        alt="Login Screen"
                        width={300}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>


              </>
            )}

            {/* Search & Book Tab */}
            {activeTab === 'search' && (
              <>
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    Search & Book Vehicles
                  </h1>
                  <p className="text-base md:text-lg font-semibold text-gray-800">
                    Find and book your perfect vehicle in minutes.
                  </p>
                  <div className="space-y-6 pt-4">
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Search Nearby Vehicles</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          Simply enter your destination to explore nearby available <strong>bikes and cars</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Detailed Listings</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          View <strong>real photos, pricing, distance</strong>, and complete vehicle details before booking.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Book Instantly</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          Filter by <strong>vehicle type, price, or location</strong> and confirm your booking in just a few clicks.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <Link
                      href="/book/bike"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Start Searching
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="relative flex justify-center lg:justify-start">
                  <div className="transition-transform duration-700 ease-out">
                    <div className="w-[100px] h-[400px] md:w-[280px] md:h-[400px]">
                      <Image
                        src="/Home_screen.svg"
                        alt="Search Screen"
                        width={280}
                        height={400}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>

              </>
            )}

            {/* List Vehicle Tab */}
            {activeTab === 'list' && (
              <>
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    List Your Vehicle
                  </h1>
                  <p className="text-base md:text-lg font-semibold text-gray-800">
                    Start earning by listing your vehicle today.
                  </p>
                  <div className="space-y-6 pt-4">
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Complete Details</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          Add your bike or car with <strong>clear photos, availability, location, and pricing</strong> information.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Your Rules</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          Set your own <strong>timings, access instructions, and restrictions</strong>, and update them anytime.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-5 group">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-900 font-medium text-lg mb-1">Start Earning</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          Your listing reaches <strong>thousands of renters</strong> searching for reliable vehicles in your area.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3">
                    <Link
                      href="/register-vehicle"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      List Your Vehicle Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="relative flex justify-center lg:justify-end">
                  <div className="transition-transform duration-700 ease-out">
                    <div className="w-[100px] h-[400px] md:w-[280px] md:h-[400px]">
                      <Image
                        src="/registration.svg"
                        alt="List Vehicle Screen"
                        width={280}
                        height={400}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* How to Register Your Vehicle Section */}
      <div className="py-10 px-5 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
            Earn Money by Listing Your Vehicle
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Turn your idle vehicle into a source of income. List your bike or car on Zugo
            and start earning today.
          </p>

          <div className="grid md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Create Account</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sign up with your phone number and verify your identity
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Add Vehicle Details</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Enter your vehicle model, price, location, and upload photos
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Get Verified</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our team verifies your vehicle details and documents
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                4
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Start Earning</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Receive booking requests and start earning from day one
              </p>
            </div>
          </div>


        </div>
      </div>

      {/* How to Register Rental Business Section */}
      <div className="py-10 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
            Start Your Rental Business
          </h2>
          <p className="text-center text-sm text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Register your rental business and manage multiple vehicles from one dashboard.
            Perfect for rental agencies and fleet owners.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                1
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Register Business</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Create your rental business profile with company details and location
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                2
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Add Fleet</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Upload your entire fleet of vehicles with detailed information
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 shadow-md">
                3
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-2">Manage Bookings</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Accept or reject bookings, track earnings, and manage your business
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all duration-300 shadow-lg hover:scale-105 transform"
            >
              Download App to Register Business
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-10 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
            What Makes Zugo Different?
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Renters</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>No fuel charges - pay only for the rental</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Flexible pickup and drop locations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>24/7 roadside assistance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Transparent pricing with no hidden costs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Vehicle Owners</h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Earn passive income from your vehicle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Set your own pricing and availability</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Insurance coverage for all rentals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Easy booking management dashboard</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Download App Section */}
      <div id="download-section" className="py-12 px-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Download the Zugo App
            </h2>
            <p className="text-sm md:text-base text-gray-300 mb-1 max-w-xl mx-auto">
              Get the full Zugo experience on your mobile device
            </p>
            <p className="text-xs text-gray-400 max-w-lg mx-auto">
              One app for everything - rent vehicles, list your own, manage bookings, and track earnings
            </p>
          </div>

          {/* Download Buttons Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl max-w-xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
              {/* iOS Button */}
              <button className="group flex-1 px-4 py-3 bg-black/80 hover:bg-black text-white rounded-xl font-bold transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-white/20 hover:scale-105 transform border border-white/10 min-h-[90px]">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Image src="/apple-logo.png" alt="Apple" width={20} height={20} className="brightness-0 invert" />
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-400 group-hover:text-gray-300 transition-colors mb-0.5">Download on the</div>
                  <div className="text-sm leading-tight font-bold">App Store</div>
                </div>
              </button>

              {/* Android Button */}
              <button className="group flex-1 px-4 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-white/30 hover:scale-105 transform min-h-[90px]">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Image src="/google.png" alt="Google" width={20} height={20} />
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500 group-hover:text-gray-600 transition-colors mb-0.5">GET IT ON</div>
                  <div className="text-sm leading-tight font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white mb-0.5">Easy Booking</h3>
              <p className="text-[10px] text-gray-400">Book in seconds</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white mb-0.5">Secure Payments</h3>
              <p className="text-xs text-gray-400">Safe & reliable</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center hover:bg-white/10 transition-all duration-300">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-white mb-0.5">24/7 Support</h3>
              <p className="text-[10px] text-gray-400">Always available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 px-5 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2">
            By continuing, you agree to Zugo's Terms of Service and Privacy Policy
          </p>
          <p className="text-xs text-gray-400">
            © 2024 Zugo. All rights reserved.
          </p>
        </div>
      </div>
    </div >
  );
}
