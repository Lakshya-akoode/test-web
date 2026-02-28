'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getToken, clearAuth } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rentalProfile, setRentalProfile] = useState(null);
    const [isEditingRental, setIsEditingRental] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [rentalLoading, setRentalLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // License / KYC state
    const [licenseStatus, setLicenseStatus] = useState(null);
    const [licenseData, setLicenseData] = useState(null);
    const [showLicenseForm, setShowLicenseForm] = useState(false);
    const [licenseFrontPhoto, setLicenseFrontPhoto] = useState(null);
    const [licenseBackPhoto, setLicenseBackPhoto] = useState(null);
    const [frontPreview, setFrontPreview] = useState(null);
    const [backPreview, setBackPreview] = useState(null);
    const [licenseSubmitting, setLicenseSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchUserProfile();
        fetchLicenseStatus();
    }, [router]);

    useEffect(() => {
        if (user?.userType === 'rental_owner') {
            console.log('User is a rental owner');
            fetchRentalProfile();
        }
    }, [user]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_USER}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setUser(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRentalProfile = async () => {
        try {

            setRentalLoading(true);
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/api/user/rental/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setRentalProfile(data.data);
                setEditFormData(data.data);
            }
        } catch (error) {
            console.error('Error fetching rental profile:', error);
        } finally {
            setRentalLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRentalUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const token = getToken();
            const formData = new FormData();

            // Append all form fields
            Object.keys(editFormData).forEach(key => {
                if (editFormData[key]) {
                    formData.append(key, editFormData[key]);
                }
            });

            // Append image if selected
            if (selectedImage) {
                formData.append('rentalImage', selectedImage);
            }

            const response = await fetch(`${API_BASE_URL}/api/user/rental/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type, let browser set it with boundary for FormData
                },
                body: formData
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setRentalProfile(data.data);
                setIsEditingRental(false);
                setSelectedImage(null);
                setImagePreview(null);
                alert('Rental profile updated successfully!');
            } else {
                alert(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating rental profile:', error);
            alert('An error occurred while updating');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    // Fetch license/KYC status
    const fetchLicenseStatus = async () => {
        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/api/user/kyc-status`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.status === 'Success') {
                setLicenseStatus(data.data.kycStatus);
                setLicenseData(data.data.license);
            }
        } catch (error) {
            console.error('Error fetching license status:', error);
        }
    };

    // Handle license photo selection
    const handleLicensePhoto = (e, side) => {
        const file = e.target.files[0];
        if (!file) return;
        if (side === 'front') {
            setLicenseFrontPhoto(file);
            setFrontPreview(URL.createObjectURL(file));
        } else {
            setLicenseBackPhoto(file);
            setBackPreview(URL.createObjectURL(file));
        }
    };

    // Submit license (photos only)
    const handleLicenseSubmit = async (e) => {
        e.preventDefault();
        if (!licenseFrontPhoto || !licenseBackPhoto) {
            alert('Please upload both front and back photos of your license');
            return;
        }
        setLicenseSubmitting(true);
        try {
            const token = getToken();
            const formData = new FormData();
            formData.append('licenseFrontPhoto', licenseFrontPhoto);
            formData.append('licenseBackPhoto', licenseBackPhoto);

            const response = await fetch(`${API_BASE_URL}/api/user/submit-license`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const data = await response.json();
            if (data.status === 'Success') {
                alert('License submitted for verification!');
                setShowLicenseForm(false);
                setLicenseStatus('pending');
                fetchLicenseStatus();
            } else {
                alert(data.message || 'Failed to submit license');
            }
        } catch (error) {
            console.error('Error submitting license:', error);
            alert('An error occurred');
        } finally {
            setLicenseSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Hero Section */}
            <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                <div className="relative max-w-5xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-black rounded-full border-4 border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                <span className="text-3xl font-bold text-gray-300 group-hover:scale-110 transition-transform duration-300">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
                                    {user?.fullName || user?.username || 'User Profile'}
                                </h1>
                                <p className="text-gray-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    {user?.userType === 'rental_owner' || user?.userType === 'owner' ? 'Rental Business Owner' : 'Verified Renter'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-all backdrop-blur-md flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="relative max-w-5xl mx-auto px-4 md:px-6 -mt-20 z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Left Column: Info Sections */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Rental Business Details (Only for Rental Owners) */}
                        {user?.userType === 'rental_owner' && rentalProfile && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6">
                                    {!isEditingRental && (
                                        <button
                                            onClick={() => {
                                                setIsEditingRental(true);
                                                setImagePreview(rentalProfile.rentalImage || null);
                                            }}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-bold bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            Edit Details
                                        </button>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Rental Business Details
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                    {isEditingRental ? (
                                        <form onSubmit={handleRentalUpdate} className="col-span-2 space-y-6">
                                            {/* Business Image Upload */}
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Business Logo/Image</label>
                                                <div className="flex items-center gap-4">
                                                    {(imagePreview || rentalProfile.rentalImage) && (
                                                        <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0">
                                                            <img
                                                                src={imagePreview || rentalProfile.rentalImage}
                                                                alt="Business"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                            id="rental-image-upload"
                                                        />
                                                        <label
                                                            htmlFor="rental-image-upload"
                                                            className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-bold cursor-pointer transition-colors"
                                                        >
                                                            {imagePreview || rentalProfile.rentalImage ? 'Change Image' : 'Upload Image'}
                                                        </label>
                                                        <p className="text-xs text-gray-500 mt-1">Recommended: Square image, max 5MB</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Business Name</label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.businessName || ''}
                                                        onChange={(e) => setEditFormData({ ...editFormData, businessName: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Owner Name</label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.ownerName || ''}
                                                        onChange={(e) => setEditFormData({ ...editFormData, ownerName: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Contact No</label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.ContactNo || ''}
                                                        onChange={(e) => setEditFormData({ ...editFormData, ContactNo: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.City || ''}
                                                        onChange={(e) => setEditFormData({ ...editFormData, City: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-2 space-y-1">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                                    <textarea
                                                        value={editFormData.Address || ''}
                                                        onChange={(e) => setEditFormData({ ...editFormData, Address: e.target.value })}
                                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                                        rows="2"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isUpdating}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEditingRental(false);
                                                        setSelectedImage(null);
                                                        setImagePreview(null);
                                                    }}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            {rentalProfile.rentalImage && (
                                                <div className="col-span-2 mb-4">
                                                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
                                                        <img
                                                            src={rentalProfile.rentalImage}
                                                            alt="Business Logo"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business Name</label>
                                                <p className="font-semibold text-gray-900 text-lg">{rentalProfile.businessName}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owner Name</label>
                                                <p className="font-semibold text-gray-900 text-lg">{rentalProfile.ownerName}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</label>
                                                <p className="font-semibold text-gray-900 text-lg">{rentalProfile.ContactNo}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</label>
                                                <p className="font-semibold text-gray-900 text-lg">{rentalProfile.City}, {rentalProfile.State}</p>
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</label>
                                                <p className="font-semibold text-gray-900">{rentalProfile.Address} - {rentalProfile.Pincode}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                    <p className="font-semibold text-gray-900 text-lg">{user?.fullName || 'Not set'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                                    <p className="font-semibold text-gray-900 text-lg">@{user?.username}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <p className="font-semibold text-gray-900 text-lg break-all">{user?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                                    <p className="font-semibold text-gray-900 text-lg">{user?.mobile || 'Not linked'}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Created</label>
                                    <p className="font-semibold text-gray-900">{new Date(user?.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Driver's License / KYC Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                </svg>
                                Driver's License
                                {licenseStatus === 'verified' && (
                                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">✓ Verified</span>
                                )}
                                {licenseStatus === 'pending' && (
                                    <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">⏳ Under Review</span>
                                )}
                                {licenseStatus === 'rejected' && (
                                    <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">✗ Rejected</span>
                                )}
                            </h2>

                            {/* Not Submitted */}
                            {(!licenseStatus || licenseStatus === 'not_submitted') && !showLicenseForm && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 mb-4">Upload your driver's license to verify your identity and start booking vehicles.</p>
                                    <button
                                        onClick={() => setShowLicenseForm(true)}
                                        className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Upload License
                                    </button>
                                </div>
                            )}

                            {/* Rejected - show reason + re-upload */}
                            {licenseStatus === 'rejected' && !showLicenseForm && (
                                <div className="py-4">
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                                        <p className="text-red-700 text-sm font-medium">Reason: {licenseData?.rejectionReason || 'Documents unclear or incomplete'}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowLicenseForm(true)}
                                        className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        Re-upload License
                                    </button>
                                </div>
                            )}

                            {/* Pending */}
                            {licenseStatus === 'pending' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-yellow-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-yellow-800 font-semibold">Your license is under review</p>
                                    <p className="text-yellow-600 text-sm mt-1">This usually takes 24-48 hours. We'll notify you once verified.</p>
                                </div>
                            )}

                            {/* Verified - simple confirmation */}
                            {licenseStatus === 'verified' && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-green-800 font-semibold">Your license has been verified</p>
                                    <p className="text-green-600 text-sm mt-1">You're all set to book vehicles on Zugo.</p>
                                </div>
                            )}

                            {/* Upload Form — photos only */}
                            {showLicenseForm && (
                                <form onSubmit={handleLicenseSubmit} className="space-y-6">
                                    <p className="text-gray-600 text-sm">Upload clear photos of the front and back of your driver's license.</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Front Photo *</label>
                                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-black transition-colors cursor-pointer"
                                                onClick={() => document.getElementById('license-front').click()}>
                                                {frontPreview ? (
                                                    <img src={frontPreview} alt="Front" className="w-full h-40 object-cover rounded-lg" />
                                                ) : (
                                                    <div className="py-6">
                                                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 font-medium">Front of License</p>
                                                        <p className="text-xs text-gray-400 mt-1">Click to upload</p>
                                                    </div>
                                                )}
                                                <input type="file" id="license-front" accept="image/*" className="hidden"
                                                    onChange={e => handleLicensePhoto(e, 'front')} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Back Photo *</label>
                                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-black transition-colors cursor-pointer"
                                                onClick={() => document.getElementById('license-back').click()}>
                                                {backPreview ? (
                                                    <img src={backPreview} alt="Back" className="w-full h-40 object-cover rounded-lg" />
                                                ) : (
                                                    <div className="py-6">
                                                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 font-medium">Back of License</p>
                                                        <p className="text-xs text-gray-400 mt-1">Click to upload</p>
                                                    </div>
                                                )}
                                                <input type="file" id="license-back" accept="image/*" className="hidden"
                                                    onChange={e => handleLicensePhoto(e, 'back')} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="submit" disabled={licenseSubmitting}
                                            className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                            {licenseSubmitting ? (
                                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Submitting...</>
                                            ) : 'Submit for Verification'}
                                        </button>
                                        <button type="button" onClick={() => setShowLicenseForm(false)}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Recent Activity / Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-2">Start a new journey</h3>
                                <p className="text-blue-100 mb-6 max-w-sm">Ready for your next adventure? Browse our premium fleet of cars and bikes.</p>
                                <Link href="/home" className="inline-block px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
                                    Browse Vehicles
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Links</h2>
                            <div className="space-y-3">
                                {(user?.userType === 'rental_owner' || user?.userType === 'owner') && (
                                    <>
                                        <Link href="/dashboard/analytics" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Analytics</h3>
                                                <p className="text-xs text-gray-500">View earnings & stats</p>
                                            </div>
                                            <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>

                                        <Link href="/my-vehicles" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">My Vehicles</h3>
                                                <p className="text-xs text-gray-500">Manage your fleet</p>
                                            </div>
                                            <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </>
                                )}

                                <Link href="/refer-earn" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                    <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Refer & Earn</h3>
                                        <p className="text-xs text-gray-500">Invite friends, earn points</p>
                                    </div>
                                    <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <Link href="/bookings" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">My Bookings</h3>
                                        <p className="text-xs text-gray-500">View your trip history</p>
                                    </div>
                                    <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>

                                <Link href="/contact-us" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-gray-200">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Support</h3>
                                        <p className="text-xs text-gray-500">Get help & FAQs</p>
                                    </div>
                                    <svg className="w-5 h-5 ml-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="bg-black text-white rounded-3xl p-6 shadow-xl">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Account Status</h2>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="font-bold text-lg">Active Member</span>
                            </div>
                            <p className="text-xs text-gray-400">Since {new Date(user?.createdAt).getFullYear()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
