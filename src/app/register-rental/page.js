'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser } from '@/lib/auth';
import API from '@/lib/api';

export default function RegisterRentalPage() {
    const router = useRouter();
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

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        const user = getUser();
        if (user) {
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
            alert(`Please fill all required fields:\n\n${missingFields.join('\n')}`);
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
                alert(`Server returned ${response.status}. Please try again.`);
                return;
            }

            const data = await response.json();

            if (data.status === 'Success') {
                alert(data.message || 'Rental Form Submitted Successfully!');
                router.push('/home');
            } else {
                alert(data.message || 'An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-[#0a0a0a] text-white py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Register your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Rental Service</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        Partner with Zugo to digitize your fleet, manage bookings efficiently, and reach thousands of new customers.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-10 mb-20 relative z-20">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Business Details */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">1</span>
                                Business Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Business Name *</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g. City Riders, GoWheels Rentals"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Owner Name *</label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Contact No. *</label>
                                    <input
                                        type="tel"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        placeholder="10-digit contact number"
                                        maxLength="10"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">2</span>
                                Address Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="Shop No., Street, Area"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none resize-none"
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Landmark *</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                        placeholder="E.g., Near XYZ Mall"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="6-digit pincode"
                                        maxLength="6"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="e.g. Mumbai"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </div>

                                {/* Location Status */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                        {locationLoading ? (
                                            <div className="flex items-center gap-3 text-blue-600">
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="text-sm">Getting your location...</span>
                                            </div>
                                        ) : locationError ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3 text-red-600">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm">{locationError}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={getCurrentLocation}
                                                    className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
                                                >
                                                    Try Again
                                                </button>
                                            </div>
                                        ) : location.latitude && location.longitude ? (
                                            <div className="flex items-center gap-3 text-green-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm font-medium">
                                                    Location captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">3</span>
                                Business Documents
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Rental Business Image *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setRentalImageFile)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                    />
                                    {rentalImageFile && (
                                        <p className="text-sm text-green-600 mt-2">✓ {rentalImageFile.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Shop & Establishment License *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleFileChange(e, setShopLicenseFile)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                    />
                                    {shopLicenseFile && (
                                        <p className="text-sm text-green-600 mt-2">✓ {shopLicenseFile.name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Commercial Vehicle Registration *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleFileChange(e, setVehicleRegFile)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                    />
                                    {vehicleRegFile && (
                                        <p className="text-sm text-green-600 mt-2">✓ {vehicleRegFile.name}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">4</span>
                                Vehicle Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Make *</label>
                                    <input
                                        type="text"
                                        name="vehicleMake"
                                        value={formData.vehicleMake}
                                        onChange={handleChange}
                                        placeholder="E.g., Honda, Maruti, Toyota"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Bike / Car Model *</label>
                                    <input
                                        type="text"
                                        name="bikeCarModel"
                                        value={formData.bikeCarModel}
                                        onChange={handleChange}
                                        placeholder="E.g., Activa 6G, Swift"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Year *</label>
                                    <input
                                        type="number"
                                        name="vehicleYear"
                                        value={formData.vehicleYear}
                                        onChange={handleChange}
                                        placeholder="E.g., 2023, 2024"
                                        min="1900"
                                        max="2030"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">License Plate *</label>
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        value={formData.licensePlate}
                                        onChange={handleChange}
                                        placeholder="E.g., MH01AB1234"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                {/* Category Selector */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryModal(true)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-left flex justify-between items-center"
                                    >
                                        <span className={selectedCategory ? 'text-gray-900' : 'text-gray-400'}>
                                            {selectedCategory || 'Select: Car or Bike'}
                                        </span>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Vehicle Type Selector */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Type *</label>
                                    <button
                                        type="button"
                                        onClick={() => selectedCategory && setShowVehicleTypeModal(true)}
                                        disabled={!selectedCategory}
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-left flex justify-between items-center ${!selectedCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span className={vehicleType ? 'text-gray-900' : 'text-gray-400'}>
                                            {vehicleType || (selectedCategory ? `Select ${selectedCategory} type` : 'Select category first')}
                                        </span>
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Rental Price *</label>
                                    <input
                                        type="number"
                                        name="rentalPrice"
                                        value={formData.rentalPrice}
                                        onChange={handleChange}
                                        placeholder="e.g., 500, 1000"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Price (Optional)</label>
                                    <input
                                        type="number"
                                        name="hourlyPrice"
                                        value={formData.hourlyPrice}
                                        onChange={handleChange}
                                        placeholder="e.g., 50, 100"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Return Duration *</label>
                                    <select
                                        name="returnDuration"
                                        value={formData.returnDuration}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
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
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload Photo of Bike / Car *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, setVehiclePhotoFile)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                    />
                                    {vehiclePhotoFile && (
                                        <p className="text-sm text-green-600 mt-2">✓ {vehiclePhotoFile.name}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Safety Gear Provided (Optional)</label>
                                    <input
                                        type="text"
                                        name="safetyGear"
                                        value={formData.safetyGear}
                                        onChange={handleChange}
                                        placeholder="The equipment issued (helmet, gloves, lock)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Add More Vehicles */}
                        <div className="border-t border-gray-200 pt-6">
                            <button
                                type="button"
                                onClick={() => setIsAddVehicleExpanded(!isAddVehicleExpanded)}
                                className="w-full flex items-center justify-between py-3 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
                            >
                                <span>Add more bikes / cars</span>
                                <svg
                                    className={`w-5 h-5 transition-transform ${isAddVehicleExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isAddVehicleExpanded && (
                                <div className="mt-4 space-y-4">
                                    {additionalVehicles.map((vehicle, index) => (
                                        <div key={vehicle.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-bold text-gray-900">Vehicle {index + 1}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveVehicle(index)}
                                                    className="text-red-600 hover:text-red-700 font-semibold text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                                                    <select
                                                        value={vehicle.category}
                                                        onChange={(e) => handleUpdateVehicle(index, 'category', e.target.value)}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                                    >
                                                        <option value="">Select Category</option>
                                                        <option value="2-wheeler">2-Wheeler</option>
                                                        <option value="4-wheeler">4-Wheeler</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Type *</label>
                                                    <select
                                                        value={vehicle.subcategory}
                                                        onChange={(e) => handleUpdateVehicle(index, 'subcategory', e.target.value)}
                                                        disabled={!vehicle.category}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none disabled:opacity-50"
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
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Model *</label>
                                                    <input
                                                        type="text"
                                                        value={vehicle.model}
                                                        onChange={(e) => handleUpdateVehicle(index, 'model', e.target.value)}
                                                        placeholder="E.g., Honda Activa 6G"
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Rental Price *</label>
                                                    <input
                                                        type="number"
                                                        value={vehicle.rentalPrice}
                                                        onChange={(e) => handleUpdateVehicle(index, 'rentalPrice', e.target.value)}
                                                        placeholder="e.g., 500, 1000"
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                                    />
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Upload Photo *</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleAdditionalVehiclePhoto(index, e.target.files[0])}
                                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                                                    />
                                                    {vehicle.photo && (
                                                        <p className="text-sm text-green-600 mt-2">✓ {vehicle.photo.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddVehicle}
                                        className="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
                                    >
                                        + Add Another Vehicle
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Terms and Submit */}
                        <div className="pt-6 border-t border-gray-100 space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">
                                    I have read and agree to the terms and conditions.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Processing...
                                    </>
                                ) : (
                                    'SUBMIT'
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* Category Selection Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Category</h3>
                        <p className="text-gray-600 mb-6">Choose whether you want to register a car or bike</p>

                        <div className="space-y-3 mb-6">
                            {['Car', 'Bike'].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategorySelect(category)}
                                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedCategory === category
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-purple-300'
                                        }`}
                                >
                                    <span className="text-2xl">{category === 'Bike' ? '🏍️' : '🚗'}</span>
                                    <span className="font-semibold">{category}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Vehicle Type Selection Modal */}
            {showVehicleTypeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Vehicle Type</h3>
                        <p className="text-gray-600 mb-6">
                            Choose the specific type of {selectedCategory?.toLowerCase()} you want to register
                        </p>

                        <div className="space-y-3 mb-6">
                            {getVehicleTypes().map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleVehicleTypeSelect(type)}
                                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${vehicleType === type
                                        ? 'bg-purple-600 border-purple-600 text-white'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-purple-300'
                                        }`}
                                >
                                    <span className="font-semibold">{type}</span>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowVehicleTypeModal(false)}
                            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
