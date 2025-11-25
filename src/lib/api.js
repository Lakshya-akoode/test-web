const endpoint = `https://zugo-backend.onrender.com/`;

export const API = {
  endpoint: endpoint,
  
  // Auth endpoints
  login: `${endpoint}login`,
  signup: `${endpoint}signup`,
  logout: `${endpoint}logout`,
  getUser: `${endpoint}getUser`,
  
  // Vehicle endpoints
  getVehicle: `${endpoint}veh/getVehicle`,
  registerVehicle: `${endpoint}reg/register`,
  registerRental: `${endpoint}reg/registerRental`,
  
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
};

export default API;


