'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import API from '@/lib/api';

function RegisterVehicleContent() {
    const router = useRouter();
    const toast = useToast();
    const searchParams = useSearchParams();
    const vehicleType = searchParams.get('type') || 'bike';
    const vehicleCategory = vehicleType === 'car' ? '4-wheeler' : '2-wheeler';

    const [loading, setLoading] = useState(false);
    const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        address: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        contact: '',
        vehicleModel: '',
        vehicleType: '',
        returnDuration: '',
        rentalPrice: '',
        returnDuration: '',
        rentalPrice: '',
        hourlyPrice: '',
        securityDeposit: '', // Added field
        agreed: false,
        latitude: '',
        longitude: '',
        vehiclePhoto: null,
        addressPhoto: null,
        vehicleRC: null,
        PUC: null
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        const user = getUser();
        if (user) {
            setFormData(prev => ({
                ...prev,
                contact: user.mobile || '',
                city: user.City || '',
                state: user.State || ''
            }));
        }
        loadLocation();
    }, [router]);

    const loadLocation = () => {
        if (navigator.geolocation) {
            setIsLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }));
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsLoadingLocation(false);
                    toast.error('Please enable location access to register your vehicle.');
                }
            );
        } else {
            setIsLoadingLocation(false);
            toast.error('Geolocation is not supported by your browser.');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    const handleVehicleTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, vehicleType: type }));
        setShowVehicleTypeModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (
            !formData.name || !formData.age || !formData.address || !formData.landmark ||
            !formData.pincode || !formData.city || !formData.state || !formData.contact ||
            !formData.vehicleModel || !formData.vehicleType || !formData.returnDuration ||
            !formData.rentalPrice || !formData.agreed || !formData.vehiclePhoto ||
            !formData.addressPhoto || !formData.vehicleRC || !formData.PUC ||
            !latitude || !longitude
        ) {
            toast.error('Please fill all required fields and upload all documents.');
            return;
        }

        setLoading(true);

        try {
            const token = getToken();
            const formDataToSend = new FormData();

            // Append all text fields
            formDataToSend.append('name', formData.name);
            formDataToSend.append('age', formData.age);
            formDataToSend.append('address', formData.address);
            formDataToSend.append('landmark', formData.landmark);
            formDataToSend.append('pincode', formData.pincode);
            formDataToSend.append('city', formData.city);
            formDataToSend.append('state', formData.state);
            formDataToSend.append('contact', formData.contact);
            formDataToSend.append('vehicleModel', formData.vehicleModel);
            formDataToSend.append('vehicleType', formData.vehicleType);
            formDataToSend.append('returnDuration', formData.returnDuration);
            formDataToSend.append('rentalPrice', formData.rentalPrice);
            if (formData.hourlyPrice) {
                formDataToSend.append('hourlyPrice', formData.hourlyPrice);
            }
            if (formData.securityDeposit) {
                formDataToSend.append('securityDeposit', formData.securityDeposit);
            }
            formDataToSend.append('agreed', formData.agreed ? '1' : '0');
            formDataToSend.append('latitude', latitude.toString());
            formDataToSend.append('longitude', longitude.toString());

            // Append files
            if (formData.vehiclePhoto) {
                formDataToSend.append('vehiclePhoto', formData.vehiclePhoto);
            }
            if (formData.addressPhoto) {
                formDataToSend.append('addressPhoto', formData.addressPhoto);
            }
            if (formData.vehicleRC) {
                formDataToSend.append('vehicleRC', formData.vehicleRC);
            }
            if (formData.PUC) {
                formDataToSend.append('PUC', formData.PUC);
            }

            const response = await fetch(API.registerVehicle, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (data.status === 'Success') {
                // Update local user role
                const currentUser = getUser();
                if (currentUser) {
                    const updatedUser = { ...currentUser, userType: 'rental_owner' };
                    // Assuming setAuth or a similar method is available to update localStorage
                    // Since setAuth is not imported, we use localStorage directly if needed, 
                    // or better, if setAuth is available in auth lib but not imported, we check imports.
                    // Checking imports: import { isAuthenticated, getUser, getToken } from '@/lib/auth';
                    // We need to import setAuth.
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                }

                toast.success('Vehicle registered successfully!');
                router.push('/my-vehicles');
            } else {
                toast.error(data.message || 'Failed to register vehicle. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Error registering vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                <div className="relative max-w-5xl mx-auto px-6">
                    <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                                Host Your Vehicle
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                                Register {vehicleCategory === '2-wheeler' ? 'Bike' : 'Car'}
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                                Join India's most unique vehicle sharing community. List your vehicle and start earning passive income today.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            {/* Decorative element or illustration could go here */}
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20 rotate-12 blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-10 pb-20">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Personal Information Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                                <p className="text-sm text-gray-500">Your basic information for verifying identity</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="e.g. 25"
                                    min="18"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your full permanent address"
                                    rows="2"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Landmark</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    placeholder="e.g. Near City Mall"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="110001"
                                    maxLength="6"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Contact Number</label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    maxLength="10"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Location Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Pickup Location</h2>
                                <p className="text-sm text-gray-500">Where will the user pick up the vehicle?</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                            {isLoadingLocation ? (
                                <div className="space-y-3">
                                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <p className="font-medium text-gray-600">Fetching accurate location...</p>
                                </div>
                            ) : latitude && longitude ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Location Pinned Successfully</h3>
                                        <p className="text-gray-500 font-mono mt-1 text-sm bg-gray-100 py-1 px-3 rounded-lg inline-block">
                                            {latitude.toFixed(6)}, {longitude.toFixed(6)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={loadLocation}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                    >
                                        Update Location
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Location Required</h3>
                                        <p className="text-gray-500 mt-1 max-w-sm mx-auto">We need your current location to show your vehicle to nearby renters.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={loadLocation}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all"
                                    >
                                        Allow Location Access
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Documents Upload */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Verification Documents</h2>
                                <p className="text-sm text-gray-500">Upload clear photos of required documents</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { label: 'Vehicle Photo', field: 'vehiclePhoto', desc: 'Front view of your vehicle' },
                                { label: 'Address Proof', field: 'addressPhoto', desc: 'Aadhaar / Voter ID / Passport' },
                                { label: 'RC Book/Card', field: 'vehicleRC', desc: 'Registration Certificate' },
                                { label: 'Pollution (PUC)', field: 'PUC', desc: 'Valid Pollution Certificate' },
                            ].map((doc, idx) => (
                                <div key={idx} className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">{doc.label}</label>
                                    <div className={`relative group border-2 border-dashed rounded-xl p-6 transition-all text-center
                                        ${formData[doc.field] ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
                                    `}>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(e, doc.field)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            required
                                        />
                                        <div className="flex flex-col items-center">
                                            {formData[doc.field] ? (
                                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors mb-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                </div>
                                            )}

                                            {formData[doc.field] ? (
                                                <>
                                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{formData[doc.field].name}</p>
                                                    <p className="text-xs text-green-600 font-medium">Click to change</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Click to upload</p>
                                                    <p className="text-xs text-gray-400">{doc.desc}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Vehicle Information</h2>
                                <p className="text-sm text-gray-500">Details about the vehicle you are listing</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Vehicle Model</label>
                                <input
                                    type="text"
                                    name="vehicleModel"
                                    value={formData.vehicleModel}
                                    onChange={handleChange}
                                    placeholder={vehicleCategory === '2-wheeler' ? "e.g. Honda Activa 6G" : "e.g. Maruti Swift Dzire"}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Vehicle Type</label>
                                <button
                                    type="button"
                                    onClick={() => setShowVehicleTypeModal(true)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none flex items-center justify-between group"
                                >
                                    <span className={formData.vehicleType ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                        {formData.vehicleType || (vehicleCategory === '2-wheeler' ? 'Select Bike / Scooty' : 'Select Car Type')}
                                    </span>
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Availability Duration</label>
                                <input
                                    type="text"
                                    name="returnDuration"
                                    value={formData.returnDuration}
                                    onChange={handleChange}
                                    placeholder="e.g. 5 days, 2 weeks"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                                <p className="text-xs text-gray-500 ml-1">How long is the vehicle available for?</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Daily Rental Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            name="rentalPrice"
                                            value={formData.rentalPrice}
                                            onChange={handleChange}
                                            placeholder="500"
                                            min="0"
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-gray-900"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Hourly Price (Optional)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            name="hourlyPrice"
                                            value={formData.hourlyPrice}
                                            onChange={handleChange}
                                            placeholder="50"
                                            min="0"
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Security Deposit (Optional)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            name="securityDeposit"
                                            value={formData.securityDeposit}
                                            onChange={handleChange}
                                            placeholder="0"
                                            min="0"
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none font-bold text-gray-900"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 ml-1">Paid directly to you by renter</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms Confirmation */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 flex items-start gap-4">
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                name="agreed"
                                checked={formData.agreed}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-200 cursor-pointer"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            I confirm that I am the owner of this vehicle and I agree to the <Link href="/terms" className="text-blue-600 font-bold hover:underline">Terms & Conditions</Link> of Zugo. I confirm all provided documents are authentic.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !latitude || !longitude}
                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Creating Listing...
                            </span>
                        ) : 'Submit Listing Application'}
                    </button>
                </form>
            </div>

            {/* Vehicle Type Selection Modal */}
            {showVehicleTypeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowVehicleTypeModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Category</h3>
                            <p className="text-gray-500">What kind of {vehicleCategory} are you listing?</p>
                        </div>

                        <div className="space-y-3 mb-8">
                            {vehicleCategory === '2-wheeler' ? (
                                <>
                                    {['Bike', 'Scooty'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleVehicleTypeSelect(type)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${formData.vehicleType === type
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.vehicleType === type ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type === 'Bike' ? "M13 10V3L4 14h7v7l9-11h-7z" : "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"} />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className={`font-bold text-lg ${formData.vehicleType === type ? 'text-blue-900' : 'text-gray-700'}`}>{type}</div>
                                                <div className="text-xs text-gray-500">Standard {type.toLowerCase()} registration</div>
                                            </div>
                                            {formData.vehicleType === type && (
                                                <div className="ml-auto text-blue-500">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {['Sedan', 'SUV', 'Hatchback'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleVehicleTypeSelect(type)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${formData.vehicleType === type
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.vehicleType === type ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className={`font-bold text-lg ${formData.vehicleType === type ? 'text-blue-900' : 'text-gray-700'}`}>{type}</div>
                                                <div className="text-xs text-gray-500">4-seater {type.toLowerCase()}</div>
                                            </div>
                                            {formData.vehicleType === type && (
                                                <div className="ml-auto text-blue-500">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowVehicleTypeModal(false)}
                            className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function RegisterVehiclePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <RegisterVehicleContent />
        </Suspense>
    );
}
