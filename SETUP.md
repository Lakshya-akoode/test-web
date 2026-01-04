# Zugo Web App Setup Guide

## What Has Been Created

### Core Infrastructure
- ✅ API configuration (`src/lib/api.js`) - All backend endpoints configured
- ✅ Authentication utilities (`src/lib/auth.js`) - Token and user management
- ✅ Layout component with bottom navigation
- ✅ Global styles with Tailwind CSS

### Pages Created

1. **Authentication**
   - `/login` - User login page
   - `/register` - User registration page

2. **Main Pages**
   - `/` - Home/Dashboard with suggestions and quick actions
   - `/settings` - User settings and profile

3. **Vehicle Booking**
   - `/book-bike` - Browse and search bikes
   - `/book-car` - Browse and search cars
   - `/vehicle/[id]` - Vehicle details and booking

4. **Booking Management**
   - `/my-bookings` - User's bookings (renter view)
   - `/owner-bookings` - Owner's bookings management
   - `/booking-request` - Create booking request
   - `/booking-confirmation/[id]` - Booking confirmation page
   - `/booking-details/[id]` - Detailed booking view

5. **Vehicle Registration**
   - `/register-vehicle` - Register a new vehicle
   - `/register-rental` - Register a rental business
   - `/tourist-location-rent` - Tourist location rental (placeholder)

## Required Assets

You need to add the following images to the `public/` directory:

### Icons (in `public/icons/`)
- `back.png` - Back button icon
- `search.png` - Search icon
- `check.png` - Checkmark icon
- `see.png` - Show password icon
- `invisible.png` - Hide password icon
- `google.png` - Google logo
- `apple-logo.png` - Apple logo
- `user.png` - User profile icon
- `upload.png` - Upload icon
- `calendar.png` - Calendar icon
- `notification.png` - Notification icon
- `help.png` - Help icon
- `lock.png` - Lock/logout icon
- `motorcycle.png` - Motorcycle icon
- `list-bike.png` - List bike icon
- `car.png` - Car icon
- `list.png` - List icon

### Images (in `public/images/`)
- `logo.png` - Zugo logo
- `activa.jpg` - Default vehicle image
- `travel.png` - Tourist location image
- `travelb.jpg` - Rental registration image

### Alternative Solution

If you don't have all images ready, you can:
1. Copy images from the React Native app's `images/` folder to `public/`
2. Use placeholder images or emoji icons temporarily
3. Update image paths in components as needed

## API Endpoints Used

All endpoints are configured in `src/lib/api.js`:
- Authentication: login, signup, logout
- Vehicles: getVehicle, registerVehicle, searchVehicles
- Bookings: createBooking, getUserBookings, getOwnerBookings, updateBookingStatus
- Search: searchVehiclesByCategory, getVehicleCategories

## Next Steps

1. **Add Images**: Copy required images to `public/` directory
2. **Test API Connection**: Verify backend is accessible
3. **Test Authentication**: Try login/register flows
4. **Test Booking Flow**: Complete a booking from start to finish
5. **Customize Styling**: Adjust colors, fonts, spacing as needed
6. **Add Error Handling**: Enhance error messages and validation
7. **Add Loading States**: Improve loading indicators
8. **Optimize Images**: Use Next.js Image optimization

## Running the App

```bash
cd frontend/ZugoWeb/zugo
npm install
npm run dev
```

Visit http://localhost:3000

## Notes

- The app uses client-side authentication with localStorage
- All protected routes check authentication status
- The design matches the mobile app's UI/UX
- Responsive design works on mobile and desktop
- Bottom navigation appears on authenticated pages








