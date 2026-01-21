const endpoint = `https://zugo-backend.onrender.com/`;
// const endpoint = `http://localhost:3001/`;

export const API = {
  endpoint: endpoint,

  // Auth endpoints
  login: `${endpoint}login`,
  signup: `${endpoint}signup`,
  logout: `${endpoint}logout`,
  getUser: `${endpoint}getUser`,
  googleAuth: `${endpoint}google-auth`,

  // Vehicle endpoints
  getVehicle: `${endpoint}veh/getVehicle`,
  registerVehicle: `${endpoint}reg/register`,
  registerRental: `${endpoint}reg/registerRental`,
  getMyVehicles: `${endpoint}veh/my-vehicles`,
  getVehicleById: `${endpoint}veh/vehicle`,
  updateVehicle: `${endpoint}veh/update-vehicle`,
  deleteVehicle: `${endpoint}veh/delete-vehicle`,
  toggleVehicleAvailability: `${endpoint}veh/toggle-availability`,

  // Search endpoints
  searchVehicles: `${endpoint}search/vehicles`,
  searchVehiclesByCategory: `${endpoint}search/vehicles/category`,
  getVehicleDetails: `${endpoint}search/vehicle`,
  getVehicleCategories: `${endpoint}search/categories`,
  checkAvailability: `${endpoint}search/check-availability`,

  // Booking endpoints
  createBooking: `${endpoint}bookings/create`,
  getUserBookings: `${endpoint}bookings/user`,
  updateBookingStatus: `${endpoint}bookings/status`,
  completeBooking: `${endpoint}bookings/complete`,
  getRenterBookings: `${endpoint}bookings/renter`,
  getOwnerBookings: `${endpoint}bookings/owner`,
  cancelBooking: `${endpoint}bookings/cancel`,
  getBookingById: `${endpoint}bookings`,

  // Payment endpoints
  createPaymentOrder: `${endpoint}payments/create-order`,
  verifyPayment: `${endpoint}payments/verify`,
  getPaymentStatus: `${endpoint}payments/status`,
  createOfflineBooking: `${endpoint}payments/offline-booking`,

  // Admin endpoints
  adminLogin: `${endpoint}admin/login`,
  adminLogout: `${endpoint}admin/logout`,
  adminDashboardStats: `${endpoint}admin/dashboard-stats`,
  adminUsers: `${endpoint}admin/users`,
  adminVehicles: `${endpoint}admin/vehicles`,
  adminBookings: `${endpoint}admin/bookings`,
  adminRecentActivities: `${endpoint}admin/recent-activities`,
  adminRevenueAnalytics: `${endpoint}admin/revenue-analytics`,
  adminProfile: `${endpoint}admin/profile`,
  adminPendingVerifications: `${endpoint}admin/pending-verifications`,
  adminVerifyLicense: `${endpoint}admin/verify-license`,
  adminRTORequests: `${endpoint}admin/rto-requests`,
  adminUpdateRTOStatus: `${endpoint}admin/rto-status`,
  adminPendingVehicleVerifications: `${endpoint}admin/pending-vehicle-verifications`,
  adminPendingVehicleVerifications: `${endpoint}admin/pending-vehicle-verifications`,
  adminVerifyVehicle: `${endpoint}admin/verify-vehicle`,

  // Contact endpoints
  contactSend: `${endpoint}contact/send`,
  contactMessages: `${endpoint}contact/messages`,
};

export default API;




