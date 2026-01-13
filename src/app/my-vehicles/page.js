'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import API from '@/lib/api';

export default function MyVehiclesPage() {
    const router = useRouter();
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
                alert('User ID not found. Please login again.');
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
                alert('Vehicle updated successfully!');
                setIsEditModalOpen(false);
                setEditingVehicle(null);
                setNewVehiclePhoto(null);
                fetchVehicles(); // Refresh list associated with user
            } else {
                alert(data.message || 'Failed to update vehicle');
            }
        } catch (error) {
            console.error('Update vehicle error:', error);
            alert('Error updating vehicle. Please try again.');
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
                alert('Vehicle deleted successfully!');
                setShowDeleteModal(null);
                fetchVehicles();
            } else {
                alert(data.message || 'Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Delete vehicle error:', error);
            alert('Error deleting vehicle. Please try again.');
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
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Section */}
            <section className="bg-slate-900 text-white pt-32 pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">My Vehicles</h1>
                            <p className="text-slate-400">Manage your fleet, update pricing, and track status.</p>
                        </div>
                        <Link
                            href="/register-vehicle"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Vehicle
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content Section - Negative Margin for Overlap Effect */}
            <div className="max-w-7xl mx-auto px-6 -mt-10">
                {vehicles.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Vehicles Listed Yet</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">Start earning by listing your first vehicle. It only takes a few minutes to get started.</p>
                        <Link
                            href="/register-vehicle"
                            className="inline-flex px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
                        >
                            Register Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {/* Vehicle Image with Status Badge */}
                                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                                    {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                        <img
                                            src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                            alt={vehicle.vehicleModel || 'Vehicle'}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-300 ${vehicle.vehiclePhoto || vehicle.VehiclePhoto ? 'hidden' : 'flex'}`}>
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${vehicle.isAvailable !== false
                                            ? 'bg-green-500/90 text-white'
                                            : 'bg-red-500/90 text-white'
                                            }`}>
                                            {vehicle.isAvailable !== false ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>

                                    {/* Edit Overlay Button */}
                                    <button
                                        onClick={() => handleEditClick(vehicle)}
                                        className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white text-slate-900 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                        title="Edit Vehicle"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Vehicle Details */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{vehicle.vehicleType}</span>
                                            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{vehicle.vehicleModel || vehicle.VehicleModel}</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 py-4 border-b border-slate-50 mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400">Daily Rate</span>
                                            <span className="text-lg font-bold text-slate-900">₹{vehicle.rentalPrice}</span>
                                        </div>
                                        {vehicle.hourlyPrice && (
                                            <div className="flex flex-col border-l border-slate-100 pl-4">
                                                <span className="text-xs text-slate-400">Hourly Rate</span>
                                                <span className="text-sm font-bold text-slate-700">₹{vehicle.hourlyPrice}</span>
                                            </div>
                                        )}
                                        <div className="flex flex-col border-l border-slate-100 pl-4">
                                            <span className="text-xs text-slate-400">Duration</span>
                                            <span className="text-sm font-bold text-slate-700">{vehicle.returnDuration || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <button
                                            onClick={() => handleEditClick(vehicle)}
                                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
                                        >
                                            Edit Details
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(vehicle._id)}
                                            className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100 text-sm"
                                        >
                                            Delete
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsEditModalOpen(false)}>
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-slate-900">Edit Vehicle</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Image Upload Section */}
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                                <label className="block text-sm font-bold text-slate-700 mb-4">Vehicle Photo</label>
                                <div className="space-y-4">
                                    {previewImage ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm mx-auto max-w-md bg-white">
                                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            {/* Overlay hint */}
                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => document.getElementById('vehicle-photo-upload').click()}>
                                                <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">Change Photo</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-white text-slate-400">
                                            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm">No photo available</span>
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
                                        <label
                                            htmlFor="vehicle-photo-upload"
                                            className="cursor-pointer px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all text-sm inline-flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            {previewImage ? 'Change Photo' : 'Upload Photo'}
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-500">Supports JPG, PNG (Max 5MB)</p>
                                </div>
                            </div>

                            {/* Form Fields - Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Model Name</label>
                                    <input
                                        type="text"
                                        value={formData.vehicleModel}
                                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Type</label>
                                    <input
                                        type="text"
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Daily Rental Price (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.rentalPrice}
                                        onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Hourly Price (₹) (Optional)</label>
                                    <input
                                        type="number"
                                        value={formData.hourlyPrice}
                                        onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Return Duration</label>
                                    <input
                                        type="text"
                                        value={formData.returnDuration}
                                        onChange={(e) => setFormData({ ...formData, returnDuration: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                        placeholder="e.g. 1 day"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Fuel Type</label>
                                    <select
                                        value={formData.fuelType}
                                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-400 transition-all"
                                    >
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="CNG">CNG</option>
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-slate-100 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(null)}>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">Delete Vehicle?</h3>
                        <p className="text-slate-600 mb-8 text-center">
                            Are you sure you want to delete this vehicle? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteModal)}
                                className="flex-1 px-5 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
