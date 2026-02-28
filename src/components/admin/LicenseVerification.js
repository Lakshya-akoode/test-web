'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { getAdminAuthHeaders } from '@/lib/adminAuth';

export default function LicenseVerification() {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [viewingPhoto, setViewingPhoto] = useState(null);

    useEffect(() => {
        fetchPendingLicenses();
    }, []);

    const fetchPendingLicenses = async () => {
        setLoading(true);
        try {
            const response = await fetch(API.adminPendingVerifications, {
                headers: getAdminAuthHeaders()
            });
            const data = await response.json();
            if (data.status === 'Success') {
                setLicenses(data.data.pendingLicenses || data.data || []);
            }
        } catch (error) {
            console.error('Error fetching pending licenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (licenseId, status) => {
        if (status === 'rejected' && !rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        setActionLoading(true);
        try {
            const response = await fetch(API.adminVerifyLicense, {
                method: 'PUT',
                headers: {
                    ...getAdminAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    licenseId,
                    status,
                    rejectionReason: status === 'rejected' ? rejectionReason : ''
                })
            });
            const data = await response.json();
            if (data.status === 'Success') {
                alert(`License ${status} successfully`);
                setSelectedLicense(null);
                setRejectionReason('');
                fetchPendingLicenses();
            } else {
                alert(data.message || 'Action failed');
            }
        } catch (error) {
            console.error('Error verifying license:', error);
            alert('An error occurred');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">License Verifications</h2>
                    <p className="text-sm text-gray-500">{licenses.length} pending verification(s)</p>
                </div>
                <button onClick={fetchPendingLicenses}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium flex items-center gap-2">
                    🔄 Refresh
                </button>
            </div>

            {licenses.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">All caught up!</h3>
                    <p className="text-gray-500 text-sm">No pending license verifications</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {licenses.map((license) => (
                        <div key={license._id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">User</p>
                                        <p className="font-medium text-sm text-gray-800">
                                            {typeof license.userId === 'object' 
                                                ? (license.userId.mobile || license.userId.email || license.userId._id)
                                                : license.userId}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">
                                        {license.verificationStatus}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                    <span>Submitted: {new Date(license.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}</span>
                                </div>

                                {/* License Photos */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Front</p>
                                        {license.licenseFrontPhoto ? (
                                            <img
                                                src={license.licenseFrontPhoto}
                                                alt="License Front"
                                                className="w-full h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                                                onClick={() => setViewingPhoto(license.licenseFrontPhoto)}
                                            />
                                        ) : (
                                            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">No photo</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Back</p>
                                        {license.licenseBackPhoto ? (
                                            <img
                                                src={license.licenseBackPhoto}
                                                alt="License Back"
                                                className="w-full h-40 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                                                onClick={() => setViewingPhoto(license.licenseBackPhoto)}
                                            />
                                        ) : (
                                            <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">No photo</div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {selectedLicense === license._id ? (
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Reason for rejection (required)..."
                                            rows={2}
                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerify(license._id, 'rejected')}
                                                disabled={actionLoading}
                                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
                                            >
                                                {actionLoading ? 'Processing...' : '✗ Reject'}
                                            </button>
                                            <button
                                                onClick={() => { setSelectedLicense(null); setRejectionReason(''); }}
                                                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleVerify(license._id, 'verified')}
                                            disabled={actionLoading}
                                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-1"
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => setSelectedLicense(license._id)}
                                            className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium flex items-center justify-center gap-1"
                                        >
                                            ✗ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full-screen Photo Viewer */}
            {viewingPhoto && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
                    onClick={() => setViewingPhoto(null)}>
                    <button
                        onClick={() => setViewingPhoto(null)}
                        className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition"
                    >
                        ✕
                    </button>
                    <img src={viewingPhoto} alt="License Photo" className="max-w-full max-h-full object-contain rounded-lg" />
                </div>
            )}
        </div>
    );
}
