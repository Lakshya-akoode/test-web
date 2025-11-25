'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';

export default function Landing() {
  const router = useRouter();

  // This is a company landing page - no authentication redirect needed

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
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="flex justify-center mb-4 animate-fade-in">
            
              <Image
                src="/zugo.png"
                alt="Zugo Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
           
          </div>

          <div className="text-center mb-6 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-2xl">
              India's Largest Self-Drive
              <span className="block text-white mt-1">Vehicle Rental Platform</span>
            </h1>
            <p className="text-sm md:text-base text-gray-100 max-w-2xl mx-auto mb-6 leading-relaxed drop-shadow-lg">
              Rent bikes and cars on your own terms. No hidden charges, no fuel charges, 
              and complete freedom to travel wherever you want.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <button
                onClick={() => document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full sm:w-auto px-6 py-3 bg-white text-gray-900 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-white/50 hover:scale-105 transform"
              >
                Book a Vehicle
              </button>
              <button
                onClick={() => document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group w-full sm:w-auto px-6 py-3 bg-transparent text-white rounded-lg font-bold text-sm border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-white/30 hover:scale-105 transform"
              >
                List Your Vehicle
              </button>
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
              <p className="text-[10px] text-gray-400">Safe & reliable</p>
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
    </div>
  );
}

