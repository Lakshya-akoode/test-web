'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import API from '@/lib/api';

function RegisterVehicleContent() {
    const router = useRouter();
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
        hourlyPrice: '',
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
                    alert('Please enable location access to register your vehicle.');
                }
            );
        } else {
            setIsLoadingLocation(false);
            alert('Geolocation is not supported by your browser.');
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
            alert('Please fill all required fields and upload all documents.');
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
                alert('Vehicle registered successfully!');
                router.push('/my-vehicles');
            } else {
                alert(data.message || 'Failed to register vehicle. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Error registering vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
                <div className="max-w-4xl mx-auto px-6">
                    <Link href="/home" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                        {vehicleCategory === '2-wheeler' ? 'Register Bike/Scooty' : 'Register Car'}
                    </h1>
                    <p className="text-slate-300">List your vehicle and start earning</p>
                </div>
            </section>

            {/* Form Section */}
            <section className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Name of Lister *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Age of Lister *</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Enter age"
                                        min="18"
                                        max="100"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter full address"
                                        rows="3"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all resize-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Landmark *</label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                        placeholder="E.g., Near XYZ Mall"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        placeholder="Enter 6-digit pincode"
                                        maxLength="6"
                                        pattern="[0-9]{6}"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact No *</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        placeholder="Enter 10-digit contact number"
                                        maxLength="10"
                                        pattern="[0-9]{10}"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Location */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Vehicle Location *</h2>
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                {isLoadingLocation ? (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Loading your location...</span>
                                    </div>
                                ) : latitude && longitude ? (
                                    <div className="flex items-center gap-3 text-green-700">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-mono text-sm">Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 text-red-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div>
                                            <p className="font-medium">No location found</p>
                                            <p className="text-sm text-slate-600">Please enable location access</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={loadLocation}
                                            className="ml-auto px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm"
                                        >
                                            Get Location
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Documents</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Photo of Bike/Car *</label>
                                    <p className="text-xs text-slate-500 mb-3">You can upload JPG, JPEG, PNG. Uploaded files should not exceed 1MB.</p>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'vehiclePhoto')}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                                            required
                                        />
                                        {formData.vehiclePhoto && (
                                            <p className="mt-2 text-sm text-green-600 font-medium">✓ {formData.vehiclePhoto.name}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Valid Address Proof *</label>
                                    <p className="text-xs text-slate-500 mb-3">Address proof (Aadhaar card, Voter ID, Passport). Uploaded files should not exceed 1MB.</p>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(e, 'addressPhoto')}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                                            required
                                        />
                                        {formData.addressPhoto && (
                                            <p className="mt-2 text-sm text-green-600 font-medium">✓ {formData.addressPhoto.name}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Vehicle RC *</label>
                                    <p className="text-xs text-slate-500 mb-3">Vehicle registration certificate. Uploaded files should not exceed 1MB.</p>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(e, 'vehicleRC')}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                                            required
                                        />
                                        {formData.vehicleRC && (
                                            <p className="mt-2 text-sm text-green-600 font-medium">✓ {formData.vehicleRC.name}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Pollution Certificate *</label>
                                    <p className="text-xs text-slate-500 mb-3">PUC certificate. Uploaded files should not exceed 1MB.</p>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileChange(e, 'PUC')}
                                            className="w-full px-5 py-3.5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white file:cursor-pointer hover:file:bg-slate-800"
                                            required
                                        />
                                        {formData.PUC && (
                                            <p className="mt-2 text-sm text-green-600 font-medium">✓ {formData.PUC.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Vehicle Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Bike / Car Model *</label>
                                    <input
                                        type="text"
                                        name="vehicleModel"
                                        value={formData.vehicleModel}
                                        onChange={handleChange}
                                        placeholder="E.g., Honda Activa 6G, Maruti Swift"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Type *</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowVehicleTypeModal(true)}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all flex items-center justify-between text-left"
                                    >
                                        <span className={formData.vehicleType ? 'text-slate-900' : 'text-slate-400'}>
                                            {formData.vehicleType || (vehicleCategory === '2-wheeler' ? 'Select: Bike or Scooty' : 'Select: Sedan, SUV, or Hatchback')}
                                        </span>
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Return Duration *</label>
                                    <input
                                        type="text"
                                        name="returnDuration"
                                        value={formData.returnDuration}
                                        onChange={handleChange}
                                        placeholder="e.g., 5 days, 2 weeks"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-2">This is a period when you expect your bike/car to be returned.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Rental Price (per day) *</label>
                                        <input
                                            type="number"
                                            name="rentalPrice"
                                            value={formData.rentalPrice}
                                            onChange={handleChange}
                                            placeholder="e.g., 500, 1000"
                                            min="0"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-2">Enter the daily rental price for your vehicle in ₹.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Hourly Price (optional)</label>
                                        <input
                                            type="number"
                                            name="hourlyPrice"
                                            value={formData.hourlyPrice}
                                            onChange={handleChange}
                                            placeholder="e.g., 50, 100"
                                            min="0"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        />
                                        <p className="text-xs text-slate-500 mt-2">Enter the hourly rental price for your vehicle in ₹ (optional).</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border border-slate-200">
                            <input
                                type="checkbox"
                                name="agreed"
                                checked={formData.agreed}
                                onChange={handleChange}
                                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-200 cursor-pointer"
                                required
                            />
                            <label className="text-sm text-slate-700 cursor-pointer">
                                I have read and agree to the <Link href="/terms" className="text-slate-900 font-bold underline">terms and conditions</Link>.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={loading || !latitude || !longitude}
                                className="w-full px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                            >
                                {loading ? 'SUBMITTING...' : 'SUBMIT'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Vehicle Type Selection Modal */}
            {showVehicleTypeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowVehicleTypeModal(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Select Vehicle Type</h3>
                        <p className="text-slate-600 mb-8 text-center">
                            {vehicleCategory === '2-wheeler'
                                ? 'Choose the type of 2-wheeler you want to register'
                                : 'Choose the type of 4-wheeler you want to register'
                            }
                        </p>

                        <div className="space-y-3 mb-6">
                            {vehicleCategory === '2-wheeler' ? (
                                <>
                                    {['Bike', 'Scooty'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => handleVehicleTypeSelect(type)}
                                            className={`w-full px-5 py-4 rounded-xl font-bold transition-all duration-200 flex items-center gap-3 ${formData.vehicleType === type
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type === 'Bike' ? "M13 10V3L4 14h7v7l9-11h-7z" : "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"} />
                                            </svg>
                                            <span>{type}</span>
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
                                            className={`w-full px-5 py-4 rounded-xl font-bold transition-all duration-200 flex items-center gap-3 ${formData.vehicleType === type
                                                    ? 'bg-slate-900 text-white shadow-lg'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{type}</span>
                                        </button>
                                    ))}
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowVehicleTypeModal(false)}
                            className="w-full px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
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
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <RegisterVehicleContent />
        </Suspense>
    );
}
