'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { getAdminAuthHeaders } from '@/lib/adminAuth';

export default function VehicleVerification() {
  const [vehicles, setVehicles] = useState([]);
  const [registeredVehicles, setRegisteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'vehicles', 'registered'

  useEffect(() => {
    fetchPendingVerifications();
  }, [page, filter]);

  const fetchPendingVerifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API.adminPendingVehicleVerifications}?page=${page}&limit=10`, {
        headers: getAdminAuthHeaders()
      });
      
      const data = await response.json();
      if (data.status === 'Success') {
        // All vehicles are now in vehicles array (from RegisteredVehicles)
        setVehicles(data.data.vehicles || []);
        setRegisteredVehicles(data.data.registeredVehicles || []); // Keep for backward compatibility
        setTotalPages(data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (vehicleId, status, vehicleType = 'standard') => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(API.adminVerifyVehicle, {
        method: 'PUT',
        headers: getAdminAuthHeaders(),
        body: JSON.stringify({
          vehicleId,
          status,
          rejectionReason: status === 'rejected' ? rejectionReason : '',
          vehicleType
        })
      });

      const data = await response.json();
      if (data.status === 'Success') {
        alert(`Vehicle ${status} successfully!`);
        setShowModal(false);
        setSelectedVehicle(null);
        setRejectionReason('');
        fetchPendingVerifications();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error verifying vehicle:', error);
      alert('Error verifying vehicle. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (vehicle, type = 'standard') => {
    setSelectedVehicle({ ...vehicle, type: type });
    setShowModal(true);
    setRejectionReason('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
    setRejectionReason('');
  };

  const getImageFields = (vehicle, type) => {
    // All vehicles are now in RegisteredVehicles, but check if it's a rental
    if (type === 'registered' || vehicle.rentalId) {
      return [
        { label: 'Vehicle Photo', field: 'vehiclePhoto' },
        { label: 'Vehicle RC', field: 'vehicleRC' },
        { label: 'Insurance Document', field: 'insuranceDocument' },
        { label: 'Registration Document', field: 'registrationDocument' },
        { label: 'License Photo', field: 'licencePhoto' },
        { label: 'Vehicle Registration', field: 'vehicleRegistration' },
        { label: 'Gears Provided', field: 'gearsProvided' }
      ];
    } else {
      // Standard vehicles also use RegisteredVehicles fields
      return [
        { label: 'Vehicle Photo', field: 'vehiclePhoto' },
        { label: 'Vehicle RC', field: 'vehicleRC' },
        { label: 'Registration Document', field: 'registrationDocument' },
        { label: 'License Photo', field: 'licencePhoto' }
      ];
    }
  };

  const getAllImages = (vehicle, type) => {
    const imageFields = getImageFields(vehicle, type);
    return imageFields
      .map(field => ({
        label: field.label,
        url: vehicle[field.field]
      }))
      .filter(img => img.url && img.url.trim() !== '');
  };

  // All vehicles are now in RegisteredVehicles model
  // Determine type based on rentalId presence
  const allVehicles = [...vehicles, ...registeredVehicles].map(v => ({
    ...v,
    type: v.rentalId ? 'registered' : 'standard',
    // Map owner name from registerId or rentalId
    ownerName: v.registerId?.Name || v.rentalId?.ownerName || v.userId?.username || 'N/A',
    // Map vehicle model
    vehicleModel: v.vehicleModel || v.VehicleModel || 'N/A',
    // Map contact
    contact: v.registerId?.ContactNo || v.rentalId?.ContactNo || v.userId?.mobile || 'N/A'
  }));

  const displayVehicles = filter === 'all' 
    ? allVehicles
    : filter === 'vehicles'
    ? allVehicles.filter(v => v.type === 'standard')
    : allVehicles.filter(v => v.type === 'registered');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Vehicle Verifications</h2>
            <p className="text-sm text-gray-600 mt-1">Review and verify pending vehicle registrations</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({allVehicles.length})
            </button>
            <button
              onClick={() => setFilter('vehicles')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'vehicles' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vehicles ({allVehicles.filter(v => v.type === 'standard').length})
            </button>
            <button
              onClick={() => setFilter('registered')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'registered' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Registered ({allVehicles.filter(v => v.type === 'registered').length})
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : displayVehicles.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No pending verifications found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {displayVehicles.map((vehicle) => {
                const images = getAllImages(vehicle, vehicle.type);
                const hasImages = images.length > 0;
                
                return (
                  <div key={vehicle._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Vehicle Image Preview */}
                    <div className="h-48 bg-gray-100 relative">
                      {hasImages ? (
                        <img
                          src={images[0].url}
                          alt="Vehicle"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <span>No Images</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded">
                          {vehicle.type === 'registered' ? 'Rental' : 'Standard'}
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {vehicle.vehicleModel || vehicle.VehicleModel || 'N/A'}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p><span className="font-medium">Owner:</span> {vehicle.ownerName || vehicle.registerId?.Name || vehicle.rentalId?.ownerName || vehicle.userId?.username || 'N/A'}</p>
                        <p><span className="font-medium">Type:</span> {vehicle.vehicleType || 'N/A'}</p>
                        <p><span className="font-medium">Category:</span> {vehicle.category || 'N/A'}</p>
                        {vehicle.licensePlate && (
                          <p><span className="font-medium">License Plate:</span> {vehicle.licensePlate}</p>
                        )}
                        {vehicle.rentalPrice && (
                          <p><span className="font-medium">Price:</span> ₹{vehicle.rentalPrice.toLocaleString('en-IN')}</p>
                        )}
                        <p><span className="font-medium">Images:</span> {images.length} document(s)</p>
                      </div>
                      
                      <button
                        onClick={() => openModal(vehicle, vehicle.type)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                      >
                        View Details & Verify
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Verification Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Vehicle Verification - {selectedVehicle.vehicleModel || selectedVehicle.VehicleModel || 'N/A'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Vehicle Information */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Vehicle Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Owner Name:</span>
                    <p className="text-gray-800">{selectedVehicle.ownerName || selectedVehicle.registerId?.Name || selectedVehicle.rentalId?.ownerName || selectedVehicle.userId?.username || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Contact:</span>
                    <p className="text-gray-800">{selectedVehicle.contact || selectedVehicle.registerId?.ContactNo || selectedVehicle.rentalId?.ContactNo || selectedVehicle.userId?.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Vehicle Model:</span>
                    <p className="text-gray-800">{selectedVehicle.vehicleModel || selectedVehicle.VehicleModel || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Vehicle Type:</span>
                    <p className="text-gray-800">{selectedVehicle.vehicleType || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Category:</span>
                    <p className="text-gray-800">{selectedVehicle.category || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Subcategory:</span>
                    <p className="text-gray-800">{selectedVehicle.subcategory || 'N/A'}</p>
                  </div>
                  {selectedVehicle.licensePlate && (
                    <div>
                      <span className="font-medium text-gray-600">License Plate:</span>
                      <p className="text-gray-800">{selectedVehicle.licensePlate}</p>
                    </div>
                  )}
                  {selectedVehicle.rentalPrice && (
                    <div>
                      <span className="font-medium text-gray-600">Rental Price:</span>
                      <p className="text-gray-800">₹{selectedVehicle.rentalPrice.toLocaleString('en-IN')}</p>
                    </div>
                  )}
                  {(selectedVehicle.registerId?.Address || selectedVehicle.rentalId?.Address || selectedVehicle.Address) && (
                    <div className="col-span-2">
                      <span className="font-medium text-gray-600">Address:</span>
                      <p className="text-gray-800">
                        {selectedVehicle.registerId?.Address || selectedVehicle.rentalId?.Address || selectedVehicle.Address || 'N/A'}, 
                        {selectedVehicle.registerId?.City || selectedVehicle.rentalId?.City || selectedVehicle.City || 'N/A'}, 
                        {selectedVehicle.registerId?.State || selectedVehicle.rentalId?.State || selectedVehicle.State || 'N/A'} - 
                        {selectedVehicle.registerId?.Pincode || selectedVehicle.rentalId?.Pincode || selectedVehicle.Pincode || 'N/A'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Images Gallery */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Documents & Images</h4>
                {getAllImages(selectedVehicle, selectedVehicle.type).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getAllImages(selectedVehicle, selectedVehicle.type).map((img, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="h-32 bg-gray-100">
                          <img
                            src={img.url}
                            alt={img.label}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition"
                            onClick={() => window.open(img.url, '_blank')}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                        <p className="p-2 text-xs text-gray-600 text-center bg-gray-50">{img.label}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No images available</p>
                )}
              </div>

              {/* Rejection Reason Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (required if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleVerify(selectedVehicle._id, 'verified', selectedVehicle.type)}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : '✓ Accept & Verify'}
                </button>
                <button
                  onClick={() => handleVerify(selectedVehicle._id, 'rejected', selectedVehicle.type)}
                  disabled={processing || !rejectionReason.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : '✗ Reject'}
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

