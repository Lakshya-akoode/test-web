const DEFAULT_BACKEND_URL = 'https://api.zugo.co.in';

const isLocalHost = (host) => (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host?.endsWith('.local')
);

const configuredBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_BACKEND_URL;
const runningOnLocalHost = typeof window !== 'undefined' && isLocalHost(window.location.hostname);
const configuredLocalBackend = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?\/?$/i.test(configuredBackendUrl);
const backendUrl = configuredLocalBackend && !runningOnLocalHost ? DEFAULT_BACKEND_URL : configuredBackendUrl;

export const API_BASE_URL = backendUrl.replace(/\/$/, '');

export const API_ENDPOINTS = {
    LOGIN: '/login',
    REGISTER: '/register',
    REQUEST_SIGNUP_OTP: '/signup/request-otp',
    VERIFY_SIGNUP_OTP: '/signup/verify-otp',
    RESEND_SIGNUP_OTP: '/signup/resend-otp',
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
    HOST_PROFILE: '/reviews/profile', // + /:id
    HOST_REVIEWS: '/reviews/host', // + /:id
    ADD_REVIEW: '/reviews/add',
    GET_USER: '/getUser',
    CITIES: '/search/cities',
};
