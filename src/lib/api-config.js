export const API_BASE_URL = 'http://localhost:3001';

export const API_ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
    GOOGLE_AUTH: '/google-auth',
    VEHICLES: '/search/vehicles/category',
    VEHICLE_DETAILS: '/search/vehicle',
    OWNER_DETAILS: '/search/owner',
    CHECK_AVAILABILITY: '/search/check-availability',
    MY_VEHICLES: '/veh/my-vehicles',
    GET_VEHICLE_BY_ID: '/veh/vehicle',
    UPDATE_VEHICLE: '/veh/update-vehicle',
    DELETE_VEHICLE: '/veh/delete-vehicle',
    TOGGLE_AVAILABILITY: '/veh/toggle-availability',
    CREATE_BOOKING: '/bookings/create',
    GET_BOOKING: '/bookings',
    RENTALS: '/search/rentals',
    RENTAL_VEHICLES: '/search/rental', // + /:id/vehicles
    GET_USER_BOOKINGS: '/bookings/user',
};
