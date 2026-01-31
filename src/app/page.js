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
      {/* Hero Section - PRESERVED */}
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
          <div className="hidden md:flex justify-center mb-4 animate-fade-in">

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
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-tight drop-shadow-2xl">
              India's Most Flexible
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mt-2">Self-Drive Rental</span>
            </h1>
            <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-medium drop-shadow-lg">
              Rent bikes and cars on your own terms. No hidden charges, no fuel charges,
              and complete freedom to travel wherever you want.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/book/bike"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fade-in-up mt-8">
            {/* Verified Vehicles */}
            <div className="group flex items-center gap-4 bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-black/50 hover:border-white/20">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shadow-inner group-hover:bg-white/10 transition-all duration-300 border border-white/5">
                <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-black text-white tracking-tight leadng-none mb-0.5 group-hover:text-green-400 transition-colors">Verified</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">Vehicles</div>
              </div>
            </div>

            {/* Affordable Pricing */}
            <div className="group flex items-center gap-4 bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-black/50 hover:border-white/20">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shadow-inner group-hover:bg-white/10 transition-all duration-300 border border-white/5">
                <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-black text-white tracking-tight leading-none mb-0.5 group-hover:text-blue-400 transition-colors">Affordable</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">Pricing</div>
              </div>
            </div>

            {/* Flexible Bookings */}
            <div className="group flex items-center gap-4 bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-black/50 hover:border-white/20">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shadow-inner group-hover:bg-white/10 transition-all duration-300 border border-white/5">
                <svg className="w-6 h-6 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-2xl font-black text-white tracking-tight leading-none mb-0.5 group-hover:text-purple-400 transition-colors">Flexible</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-white/80 transition-colors">Bookings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section - UPGRADED UI */}
      <div className="py-24 px-5 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Why Choose Zugo?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Zugo is India's most flexible self-drive vehicle rental platform, dedicated to transforming how you travel.
              We make it incredibly easy for you to rent bikes and rent cars for any duration.
              By connecting verified vehicle owners with trusted renters, we create a community built on freedom, flexibility, and trust.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform border border-gray-100">
                <Image src="/rentbike.png" alt="Easy Booking" width={32} height={32} className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Easy Booking</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Experience a seamless booking process with our user-friendly app and website.
                Browse verified bikes and cars, look at the images, and book your perfect ride in just a few clicks.
              </p>
            </div>

            <div className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform border border-gray-100">
                <Image src="/bookcar.png" alt="Flexible Plans" width={32} height={32} className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Flexible Plans</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                We offer highly flexible rental plans tailored to your needs.
                Choose from hourly rentals, daily plans, or weekly and monthly subscriptions.
              </p>
            </div>

            <div className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform border border-gray-100">
                <Image src="/cal.png" alt="24/7 Support" width={32} height={32} className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                Our dedicated support team is available 24/7 to assist you.
                Drive with confidence knowing we have got your back with roadside assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Section - UPGRADED UI */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs - Glassmorphic Pill */}
          <div className="sticky top-24 z-30 flex justify-center mb-16">
            <div className="inline-flex p-1.5 bg-white/80 rounded-full shadow-2xl border border-gray-100 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('signup')}
                className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === 'signup'
                  ? 'bg-black text-white shadow-lg transform scale-105'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === 'search'
                  ? 'bg-black text-white shadow-lg transform scale-105'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
              >
                Search & Book
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === 'list'
                  ? 'bg-black text-white shadow-lg transform scale-105'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
              >
                List Vehicle
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-[2.5rem] p-8 lg:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100 min-h-[600px] flex items-center overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
              {/* Sign Up Content */}
              {activeTab === 'signup' && (
                <>
                  <div className="space-y-10 animate-fade-in">
                    <div>
                      <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Sign Up</h2>
                      <p className="text-xl text-gray-600">Create your free account in just a few minutes.</p>
                    </div>

                    <div className="space-y-8">
                      {[
                        { title: 'For Everyone', text: 'Whether you\'re a vehicle owner or a renter, simply provide your basic details to get started.', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                        { title: 'Flexible Sign Up', text: 'You can sign up using your email or phone, and instantly gain access to your dashboard.', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                        { title: 'Instant Features', text: 'Vehicle owners get tools to list their vehicles, and Renters get fast access to booking.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6 group">
                          <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300 shadow-sm border border-gray-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                            <p className="text-base text-gray-600 leading-relaxed">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                      Get Started Now
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                  <div className="relative h-[400px] lg:h-[600px] bg-gray-50 rounded-[2rem] overflow-hidden animate-fade-in delay-100 flex items-center justify-center border border-gray-100 p-8">
                    <div className="relative w-full h-full">
                      <Image src="/login.svg" alt="Login" fill className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                </>
              )}

              {/* Search Content */}
              {activeTab === 'search' && (
                <>
                  <div className="space-y-10 animate-fade-in">
                    <div>
                      <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Search & Book</h2>
                      <p className="text-xl text-gray-600">Find and book your perfect vehicle in minutes.</p>
                    </div>

                    <div className="space-y-8">
                      {[
                        { title: 'Search Nearby', text: 'Simply enter your destination to explore nearby available bikes and cars.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                        { title: 'Detailed Listings', text: 'View real photos, pricing, distance, and complete vehicle details.', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                        { title: 'Book Instantly', text: 'Filter by vehicle type, price, or location and confirm your booking.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6 group">
                          <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300 shadow-sm border border-gray-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                            <p className="text-base text-gray-600 leading-relaxed">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link href="/book/bike" className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                      Start Searching
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                  <div className="relative h-[400px] lg:h-[600px] bg-gray-50 rounded-[2rem] overflow-hidden animate-fade-in delay-100 flex items-center justify-center border border-gray-100 p-8">
                    <div className="relative w-full h-full">
                      <Image src="/Home_screen.svg" alt="Search" fill className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                </>
              )}

              {/* List Vehicle Content */}
              {activeTab === 'list' && (
                <>
                  <div className="space-y-10 animate-fade-in">
                    <div>
                      <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">List Your Vehicle</h2>
                      <p className="text-xl text-gray-600">Start earning by listing your vehicle today.</p>
                    </div>

                    <div className="space-y-8">
                      {[
                        { title: 'Complete Details', text: 'Add your bike or car with clear photos, availability, location, and pricing information.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                        { title: 'Your Rules', text: 'Set your own timings, access instructions, and restrictions, and update them anytime.', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
                        { title: 'Start Earning', text: 'Your listing reaches thousands of renters searching for reliable vehicles in your area.', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6 group">
                          <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black group-hover:scale-110 transition-transform duration-300 shadow-sm border border-gray-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                            <p className="text-base text-gray-600 leading-relaxed">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Link href="/register-vehicle" className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                      List Your Vehicle Now
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                  </div>
                  <div className="relative h-[400px] lg:h-[600px] bg-gray-50 rounded-[2rem] overflow-hidden animate-fade-in delay-100 flex items-center justify-center border border-gray-100 p-8">
                    <div className="relative w-full h-full">
                      <Image src="/registration.svg" alt="Registration" fill className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* How to Register Your Vehicle Section - UPGRADED UI */}
      <div className="py-24 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Earn Money by Listing Your Vehicle
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Turn your idle vehicle into a source of income. List your bike or car on Zugo
              and start earning today.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Account', text: 'Sign up with your phone number and verify your identity' },
              { step: '2', title: 'Add Details', text: 'Enter your vehicle model, price, location, and upload photos' },
              { step: '3', title: 'Get Verified', text: 'Our team verifies your vehicle details and documents' },
              { step: '4', title: 'Start Earning', text: 'Receive booking requests and start earning from day one' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 relative group hover:-translate-y-2">
                <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg mb-6 shadow-md group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Rental Business Section - UPGRADED UI */}
      <div className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Start Your Rental Business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Register your rental business and manage multiple vehicles from one dashboard.
              Perfect for rental agencies and fleet owners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { step: '1', title: 'Register Business', text: 'Create your rental business profile with company details and location' },
              { step: '2', title: 'Add Fleet', text: 'Upload your entire fleet of vehicles with detailed information' },
              { step: '3', title: 'Manage Bookings', text: 'Accept or reject bookings, track earnings, and manage your business' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-200/50 shadow-md hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-blue-200">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
            >
              Download App
            </button>
          </div>
        </div>
      </div>

      {/* Popular Cities Section - SITELINKS OPTIMIZATION */}
      <div className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Our Locations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Find the perfect ride in your city. Select your location to see available bikes and scooters.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Bangalore', link: '/bikes-for-rent/bangalore', img: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
              { name: 'Delhi', link: '/bikes-for-rent/delhi', img: 'bg-gradient-to-br from-orange-400 to-red-500' },
              { name: 'Gurugram', link: '/bikes-for-rent/gurugram', img: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
              { name: 'Rishikesh', link: '/bikes-for-rent/rishikesh', img: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
            ].map((city, i) => (
              <Link key={i} href={city.link} className="group relative h-48 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`absolute inset-0 ${city.img} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">{city.name}</h3>
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/30 group-hover:bg-white group-hover:text-black transition-all">
                      View Bikes
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section - UPGRADED UI */}
      <div className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-16 tracking-tight">
            What Makes Zugo Different?
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl shadow-sm">👤</span>
                For Renters
              </h3>
              <ul className="space-y-5">
                {[
                  'No fuel charges - pay only for the rental',
                  'Flexible pickup and drop locations',
                  '24/7 roadside assistance',
                  'Transparent pricing with no hidden costs'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-700 font-semibold text-lg">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 text-2xl shadow-sm">🚗</span>
                For Vehicle Owners
              </h3>
              <ul className="space-y-5">
                {[
                  'Earn passive income from your vehicle',
                  'Set your own pricing and availability',
                  'Insurance coverage for all rentals',
                  'Easy booking management dashboard'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-700 font-semibold text-lg">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 text-xs font-bold">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* About Zugo - SEO Rich Section */}
      <div className="py-24 px-5 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 tracking-tight">
            Experience the Freedom of Self-Drive with Zugo
          </h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed text-justify md:text-center">
            <p>
              Zugo is revolutionizing the mobility landscape in <strong>India</strong> by empowering you to travel on your own terms.
              As a premier <strong>self-drive vehicle rental platform</strong>, we bridge the gap between vehicle owners and those seeking a reliable ride.
              Gone are the days of depending on cabs or rigid schedules; with Zugo, you have the vehicle you need, right when you need it.
            </p>
            {/* <p>
              Our extensive fleet includes everything from fuel-efficient scooters and powerful motorcycles to comfortable sedans and spacious SUVs.
              Whether you need to <strong>rent a bike</strong> for navigating city traffic or <strong>rent a car</strong> for a family vacation,
              Zugo offers a diverse range of vehicles to suit every budget and preference. We operate in over 100 cities across India,
              ensuring that wherever you go, a Zugo vehicle is never far away.
            </p> */}
            <p>
              We pride ourselves on transparency and affordability. Our pricing is straightforward—what you see is what you pay.
              There are no hidden charges, and you don&apos;t have to worry about rising fuel costs eating into your budget.
              Plus, for vehicle owners, Zugo provides a unique opportunity to earn passive income by listing your idle vehicles on our secure platform.
              Join the self-drive revolution today and discover a smarter, more convenient way to travel.
            </p>
          </div>
        </div>
      </div>

      {/* Download App Section - UPGRADED UI */}
      <div id="download-section" className="py-28 px-5 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="mb-14 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Download the Zugo App
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto font-medium">
              Get the full Zugo experience on your mobile device.
            </p>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              One app for everything - rent vehicles, list your own, manage bookings, and track earnings.
            </p>
          </div>

          <div className="flex justify-center mb-16">
            <button className="group w-72 px-6 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-5 shadow-2xl hover:scale-105 transform">
              <Image src="/google.png" alt="Google Play" width={36} height={36} className="group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-[11px] uppercase font-bold text-gray-500 tracking-wider">GET IT ON</div>
                <div className="text-2xl leading-none font-extrabold">Google Play</div>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'Easy Booking', desc: 'Book in seconds', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
              { title: 'Secure Payments', desc: 'Safe & reliable', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: '24/7 Support', desc: 'Always available', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}