# Zugo Web Application

A Next.js web application for the Zugo vehicle rental platform, inspired by the React Native mobile app.

## Features

- **Authentication**: Login and registration with phone number and password
- **Vehicle Booking**: Browse and book bikes and cars
- **Vehicle Listing**: Register your own vehicles for rent
- **Booking Management**: View and manage bookings (as renter or owner)
- **Search & Filters**: Search vehicles by model, city, and category
- **Responsive Design**: Mobile-first design matching the mobile app experience

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **JavaScript** - Programming language

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd frontend/ZugoWeb/zugo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── book-bike/         # Browse and book bikes
│   ├── book-car/          # Browse and book cars
│   ├── my-bookings/       # User's bookings
│   ├── owner-bookings/    # Owner's bookings management
│   ├── settings/          # User settings
│   ├── vehicle/           # Vehicle details and booking
│   └── ...
├── components/            # Reusable components
│   └── Layout.js          # Main layout with navigation
├── lib/                   # Utilities and configurations
│   ├── api.js             # API endpoint configuration
│   └── auth.js            # Authentication utilities
└── ...
```

## API Integration

The application connects to the backend API at `https://zugo-backend.onrender.com/`.

### Available Endpoints

- **Authentication**: `/login`, `/signup`, `/logout`
- **Vehicles**: `/veh/getVehicle`, `/reg/register`
- **Search**: `/search/vehicles`, `/search/vehicles/category`
- **Bookings**: `/bookings/create`, `/bookings/user`, `/bookings/owner`

See `src/lib/api.js` for the complete API configuration.

## Authentication

The app uses localStorage to store authentication tokens and user data. Protected routes automatically redirect to the login page if the user is not authenticated.

## Features in Detail

### Home Page
- Quick access to common actions (Book/List bike/car)
- Tourist location rental options
- Search functionality

### Booking Flow
1. Browse vehicles by category
2. View vehicle details
3. Select dates
4. Create booking request
5. Owner accepts/rejects
6. Booking confirmation

### Owner Features
- Register vehicles
- Manage booking requests
- Accept/reject bookings
- View earnings

## Development

### Adding New Pages

Create a new directory in `src/app/` with a `page.js` file:

```javascript
'use client';

export default function NewPage() {
  return <div>New Page</div>;
}
```

### Styling

The app uses Tailwind CSS. Modify `src/app/globals.css` for global styles.

### API Calls

Use the API utilities from `src/lib/api.js`:

```javascript
import API from '@/lib/api';
import { getToken } from '@/lib/auth';

const response = await fetch(API.login, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  },
  body: JSON.stringify(data),
});
```

## Building for Production

```bash
npm run build
npm start
```

## Notes

- The app is designed to match the mobile app's UI/UX
- Images and icons should be placed in the `public/` directory
- The app uses client-side routing with Next.js App Router
- Authentication state is managed client-side using localStorage

## Future Enhancements

- Payment integration
- Real-time notifications
- Map integration for location-based search
- Image upload for vehicle registration
- Enhanced filtering options
