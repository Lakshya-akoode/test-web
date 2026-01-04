'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { getAdminAuthHeaders } from '@/lib/adminAuth';

export default function RegisteredVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [registeredVehicles, setRegisteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [filter, setFilter] = useState('all'); // 'all', 'vehicles', 'registered'
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all', 'pending', 'verified', 'rejected'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, [page, filter, verificationFilter, categoryFilter]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (verificationFilter !== 'all') {
        queryParams.append('verificationStatus', verificationFilter);
      }
      if (categoryFilter !== 'all') {
        queryParams.append('category', categoryFilter);
      }

      const response = await fetch(`${API.adminVehicles}?${queryParams.toString()}`, {
        headers: getAdminAuthHeaders()
      });
      
      const data = await response.json();
      if (data.status === 'Success') {
        setVehicles(data.data.vehicles || []);
        setRegisteredVehicles(data.data.registeredVehicles || []);
        setTotalPages(data.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayVehicles = () => {
    // All vehicles are now in RegisteredVehicles model
    // Determine type based on rentalId presence and map data correctly
    let allVehicles = [...vehicles, ...registeredVehicles].map(v => ({
      ...v,
      type: v.rentalId ? 'registered' : 'standard',
      // Map owner name from registerId or rentalId
      ownerName: v.registerId?.Name || v.rentalId?.ownerName || v.userId?.username || 'N/A',
      // Map vehicle model
      vehicleModel: v.vehicleModel || v.VehicleModel || 'N/A',
      // Map contact
      contact: v.registerId?.ContactNo || v.rentalId?.ContactNo || v.userId?.mobile || 'N/A',
      // Map address details
      city: v.registerId?.City || v.rentalId?.City || v.City || 'N/A',
      state: v.registerId?.State || v.rentalId?.State || v.State || 'N/A',
      address: v.registerId?.Address || v.rentalId?.Address || v.Address || 'N/A'
    }));
    
    // Apply filter
    if (filter === 'vehicles') {
      allVehicles = allVehicles.filter(v => v.type === 'standard');
    } else if (filter === 'registered') {
      allVehicles = allVehicles.filter(v => v.type === 'registered');
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      allVehicles = allVehicles.filter(v => 
        (v.vehicleModel || v.VehicleModel || '').toLowerCase().includes(term) ||
        (v.ownerName || '').toLowerCase().includes(term) ||
        (v.licensePlate || '').toLowerCase().includes(term) ||
        (v.contact || '').toLowerCase().includes(term)
      );
    }

    return allVehicles;
  };

  const getVehicleImage = (vehicle) => {
    // All vehicles use RegisteredVehicles fields
    return vehicle.vehiclePhoto || vehicle.vehicleRC || null;
  };

  const getVerificationBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const openModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  const displayVehicles = getDisplayVehicles();

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registered Vehicles & Rentals</h2>
            <p className="text-sm text-gray-600 mt-1">View and manage all registered vehicles and rental businesses</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search by model, owner, plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="vehicles">Standard Vehicles</option>
              <option value="registered">Registered Rentals</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={verificationFilter}
              onChange={(e) => {
                setVerificationFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="2-wheeler">2-Wheeler</option>
              <option value="4-wheeler">4-Wheeler</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Vehicles</p>
            <p className="text-2xl font-bold text-blue-600">{vehicles.length + registeredVehicles.length}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {[...vehicles, ...registeredVehicles].filter(v => v.verificationStatus === 'pending').length}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Verified</p>
            <p className="text-2xl font-bold text-green-600">
              {[...vehicles, ...registeredVehicles].filter(v => v.verificationStatus === 'verified').length}
            </p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">
              {[...vehicles, ...registeredVehicles].filter(v => v.verificationStatus === 'rejected').length}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : displayVehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow text-gray-600">
          No vehicles found
        </div>
      ) : viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayVehicles.map((vehicle) => {
              const image = getVehicleImage(vehicle);
              return (
                <div key={vehicle._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Image */}
                  <div className="h-48 bg-gray-100 relative">
                    {image ? (
                      <img
                        src={image}
                        alt="Vehicle"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getVerificationBadge(vehicle.verificationStatus)}`}>
                        {vehicle.verificationStatus || 'pending'}
                      </span>
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                        {vehicle.type === 'registered' ? 'Rental' : 'Standard'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {vehicle.vehicleModel || vehicle.VehicleModel || 'N/A'}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p><span className="font-medium">Owner:</span> {vehicle.ownerName || vehicle.registerId?.Name || vehicle.rentalId?.ownerName || vehicle.userId?.username || 'N/A'}</p>
                      <p><span className="font-medium">Type:</span> {vehicle.vehicleType || 'N/A'}</p>
                      <p><span className="font-medium">Category:</span> {vehicle.category || 'N/A'}</p>
                      {vehicle.licensePlate && (
                        <p><span className="font-medium">Plate:</span> {vehicle.licensePlate}</p>
                      )}
                      {vehicle.rentalPrice && (
                        <p><span className="font-medium">Price:</span> ₹{vehicle.rentalPrice.toLocaleString('en-IN')}/day</p>
                      )}
                      {vehicle.hourlyPrice && (
                        <p><span className="font-medium">Hourly:</span> ₹{vehicle.hourlyPrice.toLocaleString('en-IN')}/hr</p>
                      )}
                      <p><span className="font-medium">Contact:</span> {vehicle.contact || vehicle.registerId?.ContactNo || vehicle.rentalId?.ContactNo || vehicle.userId?.mobile || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => openModal(vehicle)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 mr-3">
                          {getVehicleImage(vehicle) ? (
                            <img
                              src={getVehicleImage(vehicle)}
                              alt="Vehicle"
                              className="h-12 w-12 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3C/svg%3E';
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Img</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.vehicleModel || vehicle.VehicleModel || 'N/A'}
                          </div>
                          {vehicle.licensePlate && (
                            <div className="text-sm text-gray-500">{vehicle.licensePlate}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.ownerName || vehicle.registerId?.Name || vehicle.rentalId?.ownerName || vehicle.userId?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {vehicle.vehicleType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.rentalPrice ? `₹${vehicle.rentalPrice.toLocaleString('en-IN')}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.contact || vehicle.registerId?.ContactNo || vehicle.rentalId?.ContactNo || vehicle.userId?.mobile || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getVerificationBadge(vehicle.verificationStatus)}`}>
                        {vehicle.verificationStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openModal(vehicle)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow px-6 py-4 flex items-center justify-between">
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

      {/* Detail Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Vehicle Details - {selectedVehicle.vehicleModel || selectedVehicle.VehicleModel || 'N/A'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {getVehicleImage(selectedVehicle) && (
                  <div>
                    <img
                      src={getVehicleImage(selectedVehicle)}
                      alt="Vehicle"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Verification Status:</span>
                    <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${getVerificationBadge(selectedVehicle.verificationStatus)}`}>
                      {selectedVehicle.verificationStatus || 'pending'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <span className="ml-2 text-sm text-gray-800">{selectedVehicle.rentalId ? 'Registered Rental' : 'Standard Vehicle'}</span>
                  </div>
                  {selectedVehicle.verifiedBy && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Verified By:</span>
                      <span className="ml-2 text-sm text-gray-800">{selectedVehicle.verifiedBy?.username || selectedVehicle.verifiedBy?.fullName || 'N/A'}</span>
                    </div>
                  )}
                  {selectedVehicle.verifiedAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Verified At:</span>
                      <span className="ml-2 text-sm text-gray-800">{new Date(selectedVehicle.verifiedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedVehicle.rejectionReason && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Rejection Reason:</span>
                      <p className="mt-1 text-sm text-red-600">{selectedVehicle.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>

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
                    <p className="text-gray-800">₹{selectedVehicle.rentalPrice.toLocaleString('en-IN')}/day</p>
                  </div>
                )}
                {selectedVehicle.hourlyPrice && (
                  <div>
                    <span className="font-medium text-gray-600">Hourly Price:</span>
                    <p className="text-gray-800">₹{selectedVehicle.hourlyPrice.toLocaleString('en-IN')}/hr</p>
                  </div>
                )}
                {(selectedVehicle.address || selectedVehicle.registerId?.Address || selectedVehicle.rentalId?.Address) && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-600">Address:</span>
                    <p className="text-gray-800">
                      {selectedVehicle.address || selectedVehicle.registerId?.Address || selectedVehicle.rentalId?.Address || 'N/A'}, 
                      {selectedVehicle.city || selectedVehicle.registerId?.City || selectedVehicle.rentalId?.City || 'N/A'}, 
                      {selectedVehicle.state || selectedVehicle.registerId?.State || selectedVehicle.rentalId?.State || 'N/A'} - 
                      {selectedVehicle.registerId?.Pincode || selectedVehicle.rentalId?.Pincode || 'N/A'}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">Registered:</span>
                  <p className="text-gray-800">{selectedVehicle.createdAt ? new Date(selectedVehicle.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Available:</span>
                  <p className="text-gray-800">{selectedVehicle.isAvailable !== false ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

