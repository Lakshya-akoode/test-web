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
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [formData, setFormData] = useState({
        vehicleModel: '',
        vehicleType: '',
        fuelType: 'Petrol',
        rentalPrice: '',
        hourlyPrice: '',
        returnDuration: ''
    });
    const [fileUpdates, setFileUpdates] = useState({
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

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle._id);
        setFormData({
            vehicleModel: vehicle.vehicleModel || vehicle.VehicleModel || '',
            vehicleType: vehicle.vehicleType || '',
            fuelType: vehicle.fuelType || 'Petrol',
            rentalPrice: vehicle.rentalPrice || '',
            hourlyPrice: vehicle.hourlyPrice || '',
            returnDuration: vehicle.returnDuration || ''
        });
        setFileUpdates({
            vehiclePhoto: null,
            addressPhoto: null,
            vehicleRC: null,
            PUC: null
        });
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFileUpdates(prev => ({ ...prev, [field]: file }));
        }
    };

    const handleUpdate = async (vehicleId) => {
        try {
            const token = getToken();
            const userId = getUser()?._id || getUser()?.id;
            
            if (!userId) {
                alert('User ID not found. Please login again.');
                return;
            }

            // Check if any files are being updated
            const hasFileUpdates = Object.values(fileUpdates).some(file => file !== null);
            
            if (hasFileUpdates) {
                // Use FormData for file uploads
                const formDataToSend = new FormData();
                
                // Add userId (required by backend) - must be first
                formDataToSend.append('userId', userId);
                
                // Add all form fields
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== null && formData[key] !== '' && formData[key] !== undefined) {
                        formDataToSend.append(key, formData[key]);
                    }
                });
                
                // Add only files that are being updated
                Object.keys(fileUpdates).forEach(key => {
                    if (fileUpdates[key] !== null) {
                        formDataToSend.append(key, fileUpdates[key]);
                    }
                });

                const response = await fetch(`${API.updateVehicle}/${vehicleId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formDataToSend
                });

                const data = await response.json();

                if (data.status === 'Success') {
                    alert('Vehicle updated successfully!');
                    setEditingVehicle(null);
                    setFileUpdates({
                        vehiclePhoto: null,
                        addressPhoto: null,
                        vehicleRC: null,
                        PUC: null
                    });
                    fetchVehicles();
                } else {
                    alert(data.message || 'Failed to update vehicle');
                }
            } else {
                // Use JSON for text-only updates
                const response = await fetch(`${API.updateVehicle}/${vehicleId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        userId: userId
                    })
                });

                const data = await response.json();

                if (data.status === 'Success') {
                    alert('Vehicle updated successfully!');
                    setEditingVehicle(null);
                    fetchVehicles();
                } else {
                    alert(data.message || 'Failed to update vehicle');
                }
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

    const handleCancelEdit = () => {
        setEditingVehicle(null);
        setFormData({
            vehicleModel: '',
            vehicleType: '',
            fuelType: 'Petrol',
            rentalPrice: '',
            hourlyPrice: '',
            returnDuration: ''
        });
        setFileUpdates({
            vehiclePhoto: null,
            addressPhoto: null,
            vehicleRC: null,
            PUC: null
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden flex flex-col">
            {/* Header Section */}
            <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-3 flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-extrabold mb-1 leading-tight">My Vehicles</h1>
                            <p className="text-xs text-slate-300">Manage your vehicle listings</p>
                        </div>
                        <Link
                            href="/register-vehicle"
                            className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-all shadow-md flex items-center gap-1.5 text-xs"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Vehicle
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-4 py-2 flex-1 overflow-y-auto">
                {vehicles.length === 0 ? (
                    <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">No Vehicles Listed</h3>
                        <p className="text-xs text-slate-600 mb-3">Start earning by listing your first vehicle!</p>
                        <Link
                            href="/register-vehicle"
                            className="inline-block px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md text-xs"
                        >
                            Add Your First Vehicle
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle._id}
                                className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200"
                            >
                                {/* Vehicle Image */}
                                <div className="relative h-24 w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                                    {vehicle.vehiclePhoto || vehicle.VehiclePhoto ? (
                                        <img
                                            src={vehicle.vehiclePhoto || vehicle.VehiclePhoto}
                                            alt={vehicle.vehicleModel || 'Vehicle'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                const placeholder = e.target.parentElement.querySelector('.placeholder');
                                                if (placeholder) placeholder.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`placeholder ${vehicle.vehiclePhoto || vehicle.VehiclePhoto ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-slate-400`}>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-1 right-1">
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            vehicle.isAvailable !== false 
                                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                                : 'bg-red-100 text-red-700 border border-red-200'
                                        }`}>
                                            {vehicle.isAvailable !== false ? 'Avail' : 'Unavail'}
                                        </span>
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <div className="p-2">
                                    {editingVehicle === vehicle._id ? (
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">Model *</label>
                                                <input
                                                    type="text"
                                                    value={formData.vehicleModel}
                                                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                                                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-200"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-700 mb-1">Type *</label>
                                                <input
                                                    type="text"
                                                    value={formData.vehicleType}
                                                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                                                    className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-200"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-1">Daily *</label>
                                                    <input
                                                        type="number"
                                                        value={formData.rentalPrice}
                                                        onChange={(e) => setFormData({ ...formData, rentalPrice: e.target.value })}
                                                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-200"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-700 mb-1">Hourly</label>
                                                    <input
                                                        type="number"
                                                        value={formData.hourlyPrice}
                                                        onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                                                        className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-slate-200"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 pt-2 border-t border-slate-200">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdate(vehicle._id)}
                                                    className="flex-1 px-2 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all text-xs"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="flex-1 px-2 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-all text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">{vehicle.vehicleModel || vehicle.VehicleModel}</h3>
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">{vehicle.vehicleType}</span>
                                            </div>
                                            <div className="space-y-1 mb-2">
                                                <div className="flex justify-between">
                                                    <span className="text-[10px] text-slate-600">Price</span>
                                                    <span className="font-bold text-slate-900 text-xs">₹{vehicle.rentalPrice}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 pt-1 border-t border-slate-100">
                                                <button
                                                    onClick={() => handleEdit(vehicle)}
                                                    className="flex-1 px-2 py-1 bg-slate-100 text-slate-900 rounded-lg font-bold hover:bg-slate-200 transition-all text-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteModal(vehicle._id)}
                                                    className="flex-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-all border border-red-200 text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

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

