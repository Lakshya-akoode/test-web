'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import API from '@/lib/api';

export default function MyVehiclesPage() {
    const router = useRouter();
    const toast = useToast();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Modal & Edit State
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        vehicleModel: '',
        vehicleType: '',
        rentalPrice: '',
        hourlyPrice: '',
        securityDeposit: '', // Added field
        returnDuration: '',
        fuelType: 'Petrol' // Default, though not always present in data
    });

    // File state for image updates
    const [newVehiclePhoto, setNewVehiclePhoto] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        const userData = getUser();
        setUser(userData);
        fetchVehicles();
    }, [router]);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const userId = getUser()?._id || getUser()?.id;

            if (!userId) {
                console.error('User ID not found');
                return;
            }

            const response = await fetch(`${API.getMyVehicles}?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.status === 'Success') {
                setVehicles(data.data || []);
            } else {
                console.error('Failed to fetch vehicles:', data.message);
            }
        } catch (error) {
            console.error('Fetch vehicles error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            vehicleModel: vehicle.vehicleModel || vehicle.VehicleModel || '',
            vehicleType: vehicle.vehicleType || '',
            rentalPrice: vehicle.rentalPrice || '',
            hourlyPrice: vehicle.hourlyPrice || '',
            securityDeposit: vehicle.securityDeposit || '',
            returnDuration: vehicle.returnDuration || vehicle.ReturnDuration || '',
            fuelType: vehicle.fuelType || 'Petrol'
        });
        setNewVehiclePhoto(null);
        setPreviewImage(vehicle.vehiclePhoto || vehicle.VehiclePhoto || null);
        setIsEditModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewVehiclePhoto(file);
            // Create preview URL
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editingVehicle) return;

        try {
            const token = getToken();
            const userId = getUser()?._id || getUser()?.id;

            if (!userId) {
                toast.error('User ID not found. Please login again.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('userId', userId);

            // Append text fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append new image if selected
            if (newVehiclePhoto) {
                formDataToSend.append('vehiclePhoto', newVehiclePhoto);
            }

            const response = await fetch(`${API.updateVehicle}/${editingVehicle._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (data.status === 'Success') {
                toast.success('Vehicle updated successfully!');
                setIsEditModalOpen(false);
                setEditingVehicle(null);
                setNewVehiclePhoto(null);
                fetchVehicles(); // Refresh list associated with user
            } else {
                toast.error(data.message || 'Failed to update vehicle');
            }
        } catch (error) {
            console.error('Update vehicle error:', error);
            toast.error('Error updating vehicle. Please try again.');
        }
    };

    const handleDelete = async (vehicleId) => {
        try {
            const token = getToken();
            const userId = getUser()?._id || getUser()?.id;

            const response = await fetch(`${API.deleteVehicle}/${vehicleId}?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.status === 'Success') {
                toast.success('Vehicle deleted successfully!');
                setShowDeleteModal(null);
                fetchVehicles();
            } else {
                toast.error(data.message || 'Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Delete vehicle error:', error);
            toast.error('Error deleting vehicle. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading your garage...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 font-sans">
            {/* Premium Header */}
            <div className="bg-white border-b border-gray-100 pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">My Garage</h1>
                        <p className="text-gray-500 font-medium">Manage your fleet, track status, and optimize earnings.</p>
                    </div>
                    <Link
                        href="/register-vehicle"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        List New Vehicle
                    </Link>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {vehicles.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Garage is Empty</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Start earning passive income by listing your verified bike or car today.</p>
                        <Link
                            href="/register-vehicle"
                            className="inline-flex px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl"
                        >
                            Add Your First Vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col hover:-translate-y-1"
                            >
                                {/* Card Header / Image */}
                                <div className="relative h-64 bg-gray-100 overflow-hidden">
                                    {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                        <img
                                            src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                            alt={vehicle.vehicleModel}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300 ${vehicle.vehiclePhoto || vehicle.VehiclePhoto ? 'hidden' : 'flex'}`}>
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        {vehicle.verificationStatus === 'pending' ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm border border-yellow-300/50">
                                                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                                Pending Review
                                            </div>
                                        ) : vehicle.verificationStatus === 'rejected' ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                Rejected
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/90 backdrop-blur-md rounded-full text-xs font-bold text-white shadow-sm">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                Verified
                                            </div>
                                        )}
                                    </div>

                                    {/* Edit Button Overlay */}
                                    <button
                                        onClick={() => handleEditClick(vehicle)}
                                        className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded-xl font-bold text-sm shadow-xl opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        Edit
                                    </button>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{vehicle.vehicleType}</span>
                                            <h3 className="text-xl font-black text-gray-900 line-clamp-1 mt-0.5">{vehicle.vehicleModel || vehicle.VehicleModel}</h3>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-lg">
                                            {vehicle.vehicleType?.toLowerCase().includes('car') ? '🚗' : '🏍️'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100 border-b mb-6">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Daily Rate</p>
                                            <p className="text-lg font-bold text-gray-900">₹{vehicle.rentalPrice}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium uppercase mb-1">Deposit</p>
                                            <p className={`text-lg font-bold ${vehicle.securityDeposit > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {vehicle.securityDeposit > 0 ? `₹${vehicle.securityDeposit}` : 'None'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center gap-3">
                                        <button
                                            onClick={() => handleEditClick(vehicle)}
                                            className="flex-1 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors text-sm"
                                        >
                                            Manage
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(vehicle._id)}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                                            title="Delete Vehicle"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Vehicle Modal */}
            {isEditModalOpen && editingVehicle && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-100 transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Edit Vehicle</h3>
                                <p className="text-gray-500 text-sm mt-1">Update price, photos, and details</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="w-10 h-10 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-8">
                            {/* Image Upload Section */}
                            <div className="bg-gray-50/50 rounded-2xl p-6 border-2 border-dashed border-gray-200 text-center hover:border-blue-400/50 transition-colors group">
                                <label className="block text-sm font-bold text-gray-900 mb-4">Vehicle Photo</label>
                                <div className="space-y-4">
                                    {previewImage ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm mx-auto max-w-md bg-white ring-1 ring-black/5">
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            {/* Overlay hint */}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => document.getElementById('vehicle-photo-upload').click()}>
                                                <span className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">Change Photo</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 rounded-xl flex flex-col items-center justify-center bg-white text-gray-400">
                                            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-medium">Click to upload photo</span>
                                        </div>
                                    )}

                                    <div className="flex justify-center">
                                        <input
                                            type="file"
                                            id="vehicle-photo-upload"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        {!previewImage && (
                                            <label
                                                htmlFor="vehicle-photo-upload"
                                                className="cursor-pointer px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm inline-flex items-center gap-2 shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                                Upload Photo
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400">Supports JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>

                            {/* Form Fields - Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Model Name</label>
                                    <input
                                        type="text"
                                        value={formData.vehicleModel}
                                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Vehicle Type</label>
                                    <input
                                        type="text"
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Daily Rental Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={formData.rentalPrice}
                                            onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-gray-900"
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Security Deposit (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={formData.securityDeposit}
                                            onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-gray-900"
                                            min="0"
                                            placeholder="0"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 ml-1">Optional. Paid at pickup.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hourly Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={formData.hourlyPrice}
                                            onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-gray-900"
                                            min="0"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Return Duration</label>
                                    <input
                                        type="text"
                                        value={formData.returnDuration}
                                        onChange={(e) => setFormData({ ...formData, returnDuration: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-gray-900"
                                        placeholder="e.g. 1 day"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Fuel Type</label>
                                    <select
                                        value={formData.fuelType}
                                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-bold text-gray-900 appearance-none"
                                    >
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="CNG">CNG</option>
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl text-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 transform scale-100" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 text-center">Delete Vehicle?</h3>
                        <p className="text-gray-500 mb-8 text-center leading-relaxed">
                            Are you sure you want to delete this vehicle? This action cannot be undone and you will stop receiving bookings for it.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 px-5 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                Keep Vehicle
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteModal)}
                                className="flex-1 px-5 py-3.5 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/30"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
