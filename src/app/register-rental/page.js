'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getUser, setAuth } from '@/lib/auth';
import API from '@/lib/api';

export default function RegisterRentalPage() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    // Main form state
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        address: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        contactNo: '',
        vehicleMake: '',
        bikeCarModel: '',
        vehicleYear: '',
        licensePlate: '',
        rentalPrice: '',
        hourlyPrice: '',
        returnDuration: '',
        safetyGear: '',
    });

    // File states
    const [shopLicenseFile, setShopLicenseFile] = useState(null);
    const [vehicleRegFile, setVehicleRegFile] = useState(null);
    const [vehiclePhotoFile, setVehiclePhotoFile] = useState(null);
    const [rentalImageFile, setRentalImageFile] = useState(null);

    // Category and vehicle type
    const [selectedCategory, setSelectedCategory] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showVehicleTypeModal, setShowVehicleTypeModal] = useState(false);

    // Additional vehicles
    const [additionalVehicles, setAdditionalVehicles] = useState([]);
    const [isAddVehicleExpanded, setIsAddVehicleExpanded] = useState(false);

    // Location
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Terms
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Check if user is already a rental owner
    const [isAlreadyRentalOwner, setIsAlreadyRentalOwner] = useState(false);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        const user = getUser();
        if (user) {
            // Check if user is already registered as rental owner
            if (user.userType === 'rental_owner' || user.userType === 'owner') {
                setIsAlreadyRentalOwner(true);
            }

            setFormData(prev => ({
                ...prev,
                contactNo: user.mobile || '',
                ownerName: user.name || ''
            }));
        }

        // Get current location
        getCurrentLocation();
    }, [router]);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setLocationLoading(false);
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                setLocationError(errorMessage);
                setLocationLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, setter) => {
        const file = e.target.files[0];
        if (file) {
            setter(file);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setVehicleType('');
        setShowCategoryModal(false);
    };

    const handleVehicleTypeSelect = (type) => {
        setVehicleType(type);
        setShowVehicleTypeModal(false);
    };

    const getVehicleTypes = () => {
        if (selectedCategory === 'Bike') {
            return ['Bike', 'Scooty', 'Scooter'];
        } else if (selectedCategory === 'Car') {
            return ['Car', 'Sedan', 'SUV', 'Hatchback'];
        }
        return [];
    };

    // Additional vehicles handlers
    const handleAddVehicle = () => {
        const newVehicle = {
            id: Date.now(),
            category: '',
            subcategory: '',
            model: '',
            rentalPrice: '',
            photo: null
        };
        setAdditionalVehicles([...additionalVehicles, newVehicle]);
    };

    const handleRemoveVehicle = (index) => {
        const updatedVehicles = additionalVehicles.filter((_, i) => i !== index);
        setAdditionalVehicles(updatedVehicles);
    };

    const handleUpdateVehicle = (index, field, value) => {
        const updatedVehicles = additionalVehicles.map((vehicle, i) =>
            i === index ? { ...vehicle, [field]: value } : vehicle
        );
        setAdditionalVehicles(updatedVehicles);
    };

    const handleAdditionalVehiclePhoto = (index, file) => {
        handleUpdateVehicle(index, 'photo', file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const hasMainVehicle = !!(
            formData.vehicleMake &&
            formData.bikeCarModel &&
            formData.vehicleYear &&
            formData.licensePlate &&
            formData.rentalPrice &&
            vehiclePhotoFile &&
            selectedCategory &&
            vehicleType
        );

        const completedAdditionalVehicles = additionalVehicles.filter(v =>
            v.model && v.rentalPrice && v.photo && v.category && v.subcategory
        );

        const hasAdditionalVehicle = completedAdditionalVehicles.length > 0;

        const missingFields = [];
        if (!formData.businessName) missingFields.push("Business Name");
        if (!formData.ownerName) missingFields.push("Name of Owner");
        if (!formData.address) missingFields.push("Address");
        if (!formData.landmark) missingFields.push("Landmark");
        if (!formData.pincode) missingFields.push("Pincode");
        if (!formData.city) missingFields.push("City");
        if (!formData.state) missingFields.push("State");
        if (!formData.contactNo) missingFields.push("Contact No.");
        if (!rentalImageFile) missingFields.push("Rental Business Image");
        if (!shopLicenseFile) missingFields.push("Shop & Establishment License");
        if (!vehicleRegFile) missingFields.push("Commercial Vehicle Registration");
        if (!termsAccepted) missingFields.push("Terms and Conditions acceptance");

        // Location validation
        if (!location.latitude || !location.longitude) {
            missingFields.push("Location access (please enable location permissions)");
        }

        // Vehicle-specific validation
        if (formData.bikeCarModel || formData.rentalPrice || vehiclePhotoFile || selectedCategory || vehicleType) {
            // If any vehicle field is filled, all main vehicle fields are required
            if (!formData.vehicleMake) missingFields.push("Vehicle Make");
            if (!formData.bikeCarModel) missingFields.push("Vehicle Model");
            if (!formData.vehicleYear) missingFields.push("Vehicle Year");
            if (!formData.licensePlate) missingFields.push("License Plate");
            if (!formData.rentalPrice) missingFields.push("Rental Price");
            if (!formData.returnDuration) missingFields.push("Return Duration");
            if (!vehiclePhotoFile) missingFields.push("Vehicle Photo");
            if (!selectedCategory) missingFields.push("Vehicle Category");
            if (!vehicleType) missingFields.push("Vehicle Type");
        } else if (!hasAdditionalVehicle) {
            missingFields.push('Provide at least one vehicle with all required details (make, model, year, license plate, type, category, price and photo)');
        }

        if (missingFields.length > 0) {
            toast.error(`Please fill all required fields:\n\n${missingFields.join('\n')}`);
            return;
        }

        setLoading(true);

        const submitFormData = new FormData();
        submitFormData.append('businessName', formData.businessName);
        submitFormData.append('ownerName', formData.ownerName);
        submitFormData.append('Address', formData.address);
        submitFormData.append('Landmark', formData.landmark);
        submitFormData.append('Pincode', formData.pincode);
        submitFormData.append('City', formData.city);
        submitFormData.append('State', formData.state);
        submitFormData.append('ContactNo', formData.contactNo);
        submitFormData.append('latitude', location.latitude);
        submitFormData.append('longitude', location.longitude);

        // Handle main or promoted vehicle
        let mainModel = formData.bikeCarModel;
        let mainRentalPrice = formData.rentalPrice;
        let mainHourlyPrice = formData.hourlyPrice;
        let mainPhotoFile = vehiclePhotoFile;
        let mainCategory = selectedCategory;
        let mainVehicleType = vehicleType;
        let remainingAdditional = [...additionalVehicles];

        if (!hasMainVehicle && hasAdditionalVehicle) {
            const promotedVehicle = completedAdditionalVehicles[0];
            mainModel = promotedVehicle.model;
            mainRentalPrice = promotedVehicle.rentalPrice;
            mainHourlyPrice = '';
            mainPhotoFile = promotedVehicle.photo;
            mainCategory = promotedVehicle.category === '2-wheeler' ? 'Bike' : 'Car';
            mainVehicleType = promotedVehicle.subcategory;

            const promotedIndex = additionalVehicles.findIndex(v => v.id === promotedVehicle.id);
            remainingAdditional = additionalVehicles.filter((_, i) => i !== promotedIndex);
        }

        submitFormData.append('vehicleMake', formData.vehicleMake || '');
        submitFormData.append('VehicleModel', mainModel);
        submitFormData.append('vehicleYear', formData.vehicleYear || '');
        submitFormData.append('licensePlate', formData.licensePlate || '');
        submitFormData.append('rentalPrice', mainRentalPrice);
        if (mainHourlyPrice) submitFormData.append('hourlyPrice', mainHourlyPrice);
        if (formData.safetyGear) submitFormData.append('gearsProvided', formData.safetyGear);
        submitFormData.append('AgreedToTerms', termsAccepted);
        submitFormData.append('vehicleType', mainVehicleType);
        submitFormData.append('category', mainCategory === 'Bike' ? '2-wheeler' : '4-wheeler');
        submitFormData.append('subcategory', mainVehicleType);
        submitFormData.append('ReturnDuration', formData.returnDuration || '1 day');

        // Filter out photo from additional vehicles since it's a File object and needs separate upload
        const additionalVehiclesForSubmit = remainingAdditional.map(({ photo, ...vehicle }) => vehicle);
        submitFormData.append('additionalVehicles', JSON.stringify(additionalVehiclesForSubmit));

        // Append files
        if (rentalImageFile) submitFormData.append('rentalImage', rentalImageFile);
        if (mainPhotoFile) submitFormData.append('vehiclePhoto', mainPhotoFile);
        if (shopLicenseFile) submitFormData.append('licencePhoto', shopLicenseFile);
        if (vehicleRegFile) submitFormData.append('vehicleRegistration', vehicleRegFile);

        try {
            const response = await fetch(`${API.endpoint}reg/registerRental`, {
                method: 'POST',
                body: submitFormData,
                headers: {
                    'Authorization': `Bearer ${getUser().token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server Error:', response.status, errorText);
                toast.error(`Server returned ${response.status}. Please try again.`);
                return;
            }

            const data = await response.json();

            if (data.status === 'Success') {
                // Update local user role
                const currentUser = getUser();
                if (currentUser) {
                    const updatedUser = { ...currentUser, userType: 'rental_owner' };
                    setAuth(currentUser.token, updatedUser); // Assuming setAuth updates localStorage
                }

                toast.success(data.message || 'Rental Form Submitted Successfully!');
                router.push('/home');
            } else {
                toast.error(data.message || 'An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Network Error:', error);
            toast.error('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] pb-20">
            {/* Header */}
            <div className="relative bg-[#0F0F0F] text-white pt-32 pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-600/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/4 pointer-events-none"></div>

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </div>
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {isAlreadyRentalOwner ? (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                                        Already <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Registered</span>
                                    </h1>
                                </div>
                            </div>
                            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                                You're all set! Your rental business is registered with Zugo. Add more vehicles to expand your fleet.
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                                Register your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Rental Service</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                                Partner with Zugo to digitize your fleet, manage bookings efficiently, and reach thousands of new customers.
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-20">
                {isAlreadyRentalOwner ? (
                    /* Already Registered UI */
                    <div className="bg-white rounded-3xl p-10 md:p-12 shadow-xl shadow-black/5 ring-1 ring-black/5">
                        <div className="text-center max-w-2xl mx-auto">
                            <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                You're All Set!
                            </h2>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Your rental business is already registered with Zugo. You can add more vehicles to your fleet anytime to expand your offerings.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {/* Add Vehicle Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold text-lg rounded-2xl hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <span>Add More Vehicles</span>
                                        <svg className={`w-5 h-5 transition-transform ${showVehicleDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showVehicleDropdown && (
                                        <>
                                            {/* Backdrop to close dropdown */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowVehicleDropdown(false)}
                                            />

                                            <div className="absolute top-full mt-2 left-0 right-0 sm:left-auto sm:right-auto sm:w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button
                                                    onClick={() => {
                                                        setShowVehicleDropdown(false);
                                                        router.push('/register-vehicle?type=bike');
                                                    }}
                                                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-purple-50 transition-colors text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                        🏍️
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900 group-hover:text-purple-600">Add Bike</div>
                                                        <div className="text-sm text-gray-500">Register a new bike</div>
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>

                                                <div className="h-px bg-gray-100" />

                                                <button
                                                    onClick={() => {
                                                        setShowVehicleDropdown(false);
                                                        router.push('/register-vehicle?type=car');
                                                    }}
                                                    className="w-full px-6 py-4 flex items-center gap-4 hover:bg-purple-50 transition-colors text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                        🚗
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-gray-900 group-hover:text-purple-600">Add Car</div>
                                                        <div className="text-sm text-gray-500">Register a new car</div>
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => router.push('/home')}
                                    className="px-8 py-4 bg-gray-100 text-gray-700 font-bold text-lg rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
                                >
                                    <span>Go to Home</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Registration Form */
                    <div className="bg-transparent">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Business Details */}
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 ring-1 ring-black/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-12 h-12 rounded-2xl bg-purple-100/50 text-purple-600 flex items-center justify-center text-xl font-bold border border-purple-100">1</span>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Business Details</h3>
                                        <p className="text-gray-500">Tell us about your rental business</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Business Name *</label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleChange}
                                            placeholder="e.g. City Riders, GoWheels Rentals"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Owner Name *</label>
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Contact No. *</label>
                                        <input
                                            type="tel"
                                            name="contactNo"
                                            value={formData.contactNo}
                                            onChange={handleChange}
                                            placeholder="10-digit contact number"
                                            maxLength="10"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 ring-1 ring-black/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-12 h-12 rounded-2xl bg-purple-100/50 text-purple-600 flex items-center justify-center text-xl font-bold border border-purple-100">2</span>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Address Information</h3>
                                        <p className="text-gray-500">Where is your shop located?</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Address *</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="Shop No., Street, Area"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400 resize-none"
                                            required
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Landmark *</label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleChange}
                                            placeholder="E.g., Near XYZ Mall"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Pincode *</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="6-digit pincode"
                                            maxLength="6"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="e.g. Mumbai"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">State *</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Enter state"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                            required
                                        />
                                    </div>

                                    {/* Location Status */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Location *</label>
                                        <div className="p-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl">
                                            {locationLoading ? (
                                                <div className="flex items-center gap-3 text-purple-600">
                                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span className="text-sm font-semibold">Getting your location...</span>
                                                </div>
                                            ) : locationError ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-red-500">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="text-sm font-medium">{locationError}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={getCurrentLocation}
                                                        className="text-sm text-purple-600 hover:text-purple-700 font-bold"
                                                    >
                                                        Try Again
                                                    </button>
                                                </div>
                                            ) : location.latitude && location.longitude ? (
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-3 text-green-600">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-sm font-bold">
                                                            Location captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={getCurrentLocation}
                                                        className="self-start text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                        Update Location
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Document Uploads */}
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 ring-1 ring-black/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-12 h-12 rounded-2xl bg-purple-100/50 text-purple-600 flex items-center justify-center text-xl font-bold border border-purple-100">3</span>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Business Documents</h3>
                                        <p className="text-gray-500">Upload your business verification documents</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[{ label: 'Rental Business Image *', state: rentalImageFile, setter: setRentalImageFile },
                                    { label: 'Shop & Establishment License *', state: shopLicenseFile, setter: setShopLicenseFile },
                                    { label: 'Commercial Vehicle Registration *', state: vehicleRegFile, setter: setVehicleRegFile }].map((field, idx) => (
                                        <div key={idx} className={idx === 2 ? "md:col-span-2" : ""}>
                                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">{field.label}</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => handleFileChange(e, field.setter)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all ${field.state ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 group-hover:border-purple-400 group-hover:bg-purple-50'}`}>
                                                    {field.state ? (
                                                        <>
                                                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 shadow-sm">
                                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                            </div>
                                                            <span className="text-sm font-bold text-green-700 truncate max-w-full px-2">{field.state.name}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 rounded-full bg-white text-gray-400 flex items-center justify-center mb-3 shadow-sm ring-1 ring-gray-200 group-hover:ring-purple-200 group-hover:text-purple-500 transition-all">
                                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-600 group-hover:text-purple-600">Click to upload document</span>
                                                            <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Details */}
                            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 ring-1 ring-black/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="w-12 h-12 rounded-2xl bg-purple-100/50 text-purple-600 flex items-center justify-center text-xl font-bold border border-purple-100">4</span>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">Vehicle Information</h3>
                                        <p className="text-gray-500">Details of your primary rental vehicle</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Vehicle Make *</label>
                                        <input
                                            type="text"
                                            name="vehicleMake"
                                            value={formData.vehicleMake}
                                            onChange={handleChange}
                                            placeholder="E.g., Honda, Maruti, Toyota"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Bike / Car Model *</label>
                                        <input
                                            type="text"
                                            name="bikeCarModel"
                                            value={formData.bikeCarModel}
                                            onChange={handleChange}
                                            placeholder="E.g., Activa 6G, Swift"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Vehicle Year *</label>
                                        <input
                                            type="number"
                                            name="vehicleYear"
                                            value={formData.vehicleYear}
                                            onChange={handleChange}
                                            placeholder="E.g., 2023, 2024"
                                            min="1900"
                                            max="2030"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">License Plate *</label>
                                        <input
                                            type="text"
                                            name="licensePlate"
                                            value={formData.licensePlate}
                                            onChange={handleChange}
                                            placeholder="E.g., MH01AB1234"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Category Selector */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Category *</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowCategoryModal(true)}
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-left flex justify-between items-center bg-white"
                                        >
                                            <span className={`font-medium ${selectedCategory ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {selectedCategory || 'Select: Car or Bike'}
                                            </span>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Vehicle Type Selector */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Vehicle Type *</label>
                                        <button
                                            type="button"
                                            onClick={() => selectedCategory && setShowVehicleTypeModal(true)}
                                            disabled={!selectedCategory}
                                            className={`w-full px-5 py-4 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-left flex justify-between items-center ${!selectedCategory ? 'bg-gray-100 opacity-60 cursor-not-allowed' : 'bg-white'}`}
                                        >
                                            <span className={`font-medium ${vehicleType ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {vehicleType || (selectedCategory ? `Select ${selectedCategory} type` : 'Select category first')}
                                            </span>
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Rental Price *</label>
                                        <input
                                            type="number"
                                            name="rentalPrice"
                                            value={formData.rentalPrice}
                                            onChange={handleChange}
                                            placeholder="e.g., 500, 1000"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Hourly Price (Optional)</label>
                                        <input
                                            type="number"
                                            name="hourlyPrice"
                                            value={formData.hourlyPrice}
                                            onChange={handleChange}
                                            placeholder="e.g., 50, 100"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Return Duration *</label>
                                        <select
                                            name="returnDuration"
                                            value={formData.returnDuration}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium"
                                            required
                                        >
                                            <option value="">Select duration</option>
                                            <option value="1 hour">1 Hour</option>
                                            <option value="3 hours">3 Hours</option>
                                            <option value="6 hours">6 Hours</option>
                                            <option value="12 hours">12 Hours</option>
                                            <option value="1 day">1 Day</option>
                                            <option value="2 days">2 Days</option>
                                            <option value="3 days">3 Days</option>
                                            <option value="1 week">1 Week</option>
                                            <option value="1 month">1 Month</option>
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Upload Photo of Bike / Car *</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, setVehiclePhotoFile)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all ${vehiclePhotoFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 group-hover:border-purple-400 group-hover:bg-purple-50'}`}>
                                                {vehiclePhotoFile ? (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 shadow-sm">
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                        <span className="text-sm font-bold text-green-700 truncate max-w-full px-2">{vehiclePhotoFile.name}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-white text-gray-400 flex items-center justify-center mb-3 shadow-sm ring-1 ring-gray-200 group-hover:ring-purple-200 group-hover:text-purple-500 transition-all">
                                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-600 group-hover:text-purple-600">Click to upload photo</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Safety Gear Provided (Optional)</label>
                                        <input
                                            type="text"
                                            name="safetyGear"
                                            value={formData.safetyGear}
                                            onChange={handleChange}
                                            placeholder="The equipment issued (helmet, gloves, lock)"
                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Add More Vehicles */}
                            <div className="pt-8 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddVehicleExpanded(!isAddVehicleExpanded)}
                                    className="w-full flex items-center justify-between py-4 px-6 bg-purple-50 text-purple-700 font-bold rounded-2xl hover:bg-purple-100 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        Add more bikes / cars
                                    </span>
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${isAddVehicleExpanded ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isAddVehicleExpanded && (
                                    <div className="mt-8 space-y-6">
                                        {additionalVehicles.map((vehicle, index) => (
                                            <div key={vehicle.id} className="relative p-8 bg-white rounded-3xl shadow-xl shadow-black/5 ring-1 ring-black/5">
                                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                                    <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">{index + 1}</span>
                                                        Additional Vehicle
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVehicle(index)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                    </button>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Category *</label>
                                                        <div className="relative">
                                                            <select
                                                                value={vehicle.category}
                                                                onChange={(e) => handleUpdateVehicle(index, 'category', e.target.value)}
                                                                className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none appearance-none font-medium text-gray-900"
                                                            >
                                                                <option value="">Select Category</option>
                                                                <option value="2-wheeler">2-Wheeler</option>
                                                                <option value="4-wheeler">4-Wheeler</option>
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Vehicle Type *</label>
                                                        <div className="relative">
                                                            <select
                                                                value={vehicle.subcategory}
                                                                onChange={(e) => handleUpdateVehicle(index, 'subcategory', e.target.value)}
                                                                disabled={!vehicle.category}
                                                                className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none appearance-none font-medium text-gray-900 disabled:opacity-50"
                                                            >
                                                                <option value="">Select Type</option>
                                                                {vehicle.category === '2-wheeler' && (
                                                                    <>
                                                                        <option value="bike">Bike</option>
                                                                        <option value="scooty">Scooty</option>
                                                                        <option value="scooter">Scooter</option>
                                                                    </>
                                                                )}
                                                                {vehicle.category === '4-wheeler' && (
                                                                    <>
                                                                        <option value="car">Car</option>
                                                                        <option value="sedan">Sedan</option>
                                                                        <option value="suv">SUV</option>
                                                                        <option value="hatchback">Hatchback</option>
                                                                    </>
                                                                )}
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Vehicle Model *</label>
                                                        <input
                                                            type="text"
                                                            value={vehicle.model}
                                                            onChange={(e) => handleUpdateVehicle(index, 'model', e.target.value)}
                                                            placeholder="E.g., Honda Activa 6G"
                                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Rental Price *</label>
                                                        <input
                                                            type="number"
                                                            value={vehicle.rentalPrice}
                                                            onChange={(e) => handleUpdateVehicle(index, 'rentalPrice', e.target.value)}
                                                            placeholder="e.g., 500, 1000"
                                                            className="w-full px-5 py-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                                                        />
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Upload Photo *</label>
                                                        <div className="relative group">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleAdditionalVehiclePhoto(index, e.target.files[0])}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            />
                                                            <div className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all ${vehicle.photo ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 group-hover:border-purple-400 group-hover:bg-purple-50'}`}>
                                                                {vehicle.photo ? (
                                                                    <>
                                                                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                        </div>
                                                                        <span className="text-sm font-bold text-green-700 truncate max-w-full px-2">{vehicle.photo.name}</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-2 group-hover:bg-purple-100 group-hover:text-purple-500 transition-colors">
                                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                        </div>
                                                                        <span className="text-sm font-bold text-gray-600 group-hover:text-purple-600">Click to upload photo</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={handleAddVehicle}
                                            className="w-full py-4 border-2 border-dashed border-purple-200 text-purple-600 font-bold rounded-3xl hover:bg-purple-50 hover:border-purple-300 transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                            Add Another Vehicle
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Terms and Submit */}
                            <div className="pt-8 mt-8 border-t border-gray-100">
                                <label className="flex items-start gap-4 cursor-pointer p-4 hover:bg-gray-50 rounded-2xl transition-colors mb-6 group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-300 transition-all checked:border-purple-600 checked:bg-purple-600 hover:border-purple-400"
                                        />
                                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors pt-0.5">
                                        I confirm that the details provided are accurate and I agree to the <a href="#" className="text-purple-600 hover:underline">Terms of Service</a> and <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>.
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-5 bg-gradient-to-r from-gray-900 to-black text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:shadow-none disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            <span>Processing Registration...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Complete Registration</span>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                )}
            </div>

            {/* Category Selection Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Select Category</h3>
                        <p className="text-gray-500 mb-8 text-lg">Choose your vehicle type</p>

                        <div className="space-y-4 mb-8">
                            {['Car', 'Bike'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategorySelect(category)}
                                    className={`w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all hover:-translate-y-1 group ${selectedCategory === category
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 border-transparent text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-white border-gray-100 text-gray-900 hover:border-purple-200 hover:shadow-lg'
                                        }`}
                                >
                                    <span className="text-4xl filter drop-shadow-sm">{category === 'Bike' ? '🏍️' : '🚗'}</span>
                                    <div className="text-left">
                                        <span className={`block text-xl font-bold ${selectedCategory === category ? 'text-white' : 'text-gray-900'}`}>{category}</span>
                                        <span className={`text-sm ${selectedCategory === category ? 'text-purple-100' : 'text-gray-500'}`}>Register a new {category}</span>
                                    </div>
                                    <div className={`ml-auto w-8 h-8 rounded-full flex items-center justify-center ${selectedCategory === category ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-purple-50'}`}>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Vehicle Type Selection Modal */}
            {showVehicleTypeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Select Type</h3>
                        <p className="text-gray-500 mb-8 text-lg">
                            Which type of {selectedCategory?.toLowerCase()}?
                        </p>

                        <div className="grid grid-cols-1 gap-3 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {getVehicleTypes().map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleVehicleTypeSelect(type)}
                                    className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all hover:bg-purple-50/50 ${vehicleType === type
                                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                                        : 'bg-white border-gray-100 text-gray-700 hover:border-purple-200'
                                        }`}
                                >
                                    <span className="font-bold text-lg">{type}</span>
                                    {vehicleType === type && (
                                        <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowVehicleTypeModal(false)}
                            className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
