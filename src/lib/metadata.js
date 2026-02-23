// Centralized metadata configuration for SEO

export const siteConfig = {
    name: 'Zugo',
    description: 'India\'s most flexible self-drive vehicle rental platform. Rent bikes, scooters & cars on your own terms in Rishikesh, Delhi, Bangalore & more. No hidden charges, zero fuel costs, and complete freedom to travel.',
    url: 'https://zugo.co.in',
    ogImage: 'https://zugo.co.in/black_logo.png',
    keywords: [
        // Core keywords
        'vehicle rental India',
        'bike rental',
        'car rental',
        'self drive car rental',
        'self drive bike rental',
        'rent bike',
        'rent car',
        'zugo',
        'vehicle rental platform',
        'bike booking',
        'car booking',
        'two wheeler rental',
        'four wheeler rental',
        'hourly bike rental',
        'daily car rental',
        'monthly bike rental',
        'weekly car rental',
        // High-volume search keywords
        'bike rent',
        'bike on rent',
        'scooty on rent',
        'scooty rental',
        'bike rent near me',
        'rent bike near me',
        'rent car near me',
        'two wheeler on rent',
        'self drive bike',
        'self drive car',
        // Location-specific keywords
        'bike rental Rishikesh',
        'scooty on rent in Rishikesh',
        'rentals in Rishikesh',
        'bike rent Rishikesh',
        'bike rental Delhi',
        'bike rental Bangalore',
        'bike rental Gurugram',
        'car rental Rishikesh',
        'vehicle rental Rishikesh',
        'two wheeler rental Rishikesh',
        // Long-tail keywords
        'cheap bike rental India',
        'affordable scooty rental',
        'bike rental for travel',
        'rent bike for trip',
        'bike rental without deposit',
        'self drive two wheeler rental',
    ],
    social: {
        instagram: 'https://www.instagram.com/zugo_pvt',
    },
    company: {
        name: 'Zugo',
        legalName: 'Zugo India',
        foundingDate: '2024',
        email: 'info@zugo.co.in',
        phone: '+91-9692031010',
        address: {
            streetAddress: '',
            addressLocality: 'Rishikesh',
            addressRegion: 'Uttarakhand',
            postalCode: '',
            addressCountry: 'IN',
        },
    },
};

// Generate metadata for pages
export function generateMetadata({
    title = siteConfig.name,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    keywords,
    noIndex = false,
    canonical,
}) {
    const metadata = {
        title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
        description,
        keywords: keywords ? keywords.join(', ') : siteConfig.keywords.join(', '),
        authors: [{ name: siteConfig.name }],
        creator: siteConfig.name,
        publisher: siteConfig.name,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: canonical,
        },
        openGraph: {
            type: 'website',
            locale: 'en_IN',
            url: canonical || siteConfig.url,
            title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
            description,
            siteName: siteConfig.name,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: `${siteConfig.name} - ${description}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title === siteConfig.name ? title : `${title} | ${siteConfig.name}`,
            description,
            images: [image],
            creator: '@zugoforyou', // Can be updated if Twitter account is created
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            // Add verification codes when available
            google: 'hzf-CVVNwBGb4kXxB757RNdlLFz_3X2SNsYrQK4er94',
            yandex: '',
            bing: '',
        },
    };

    return metadata;
}

// Page-specific metadata presets
export const pageMetadata = {
    home: {
        title: 'Zugo - Bike & Car Rental in Rishikesh, Delhi, Bangalore | Self Drive Rentals India',
        description: 'Rent bikes, scooters & cars on your own terms. Affordable self-drive vehicle rentals in Rishikesh, Delhi, Bangalore & Gurugram. No hidden charges, zero fuel costs. Book instantly!',
        keywords: [
            'vehicle rental India',
            'bike rental India',
            'car rental India',
            'self drive rental',
            'zugo',
            'rent bike near me',
            'rent car near me',
            'bike rental Rishikesh',
            'bike rent',
            'scooty on rent',
            'rentals in Rishikesh',
            'two wheeler on rent',
            'self drive bike rental',
        ],
    },
    bookBike: {
        title: 'Rent Bike in India - Self Drive Bikes & Scooters | Zugo',
        description: 'Looking to rent a bike or scooty? Zugo offers the best self-drive two-wheeler rental service in Rishikesh, Delhi, Bangalore & more. Book bikes on rent near you starting at ₹20/hour. No hidden charges.',
        keywords: [
            'rent bike',
            'bike rental',
            'scooty rental',
            'bike on rent',
            'two wheeler rental',
            'rent bike near me',
            'scooter rental India',
            'bike rent',
            'scooty on rent',
            'bike rental Rishikesh',
            'self drive bike',
            'two wheeler on rent',
        ],
    },
    bookCar: {
        title: 'Rent Car in India - Self Drive Cars & SUVs | Zugo',
        description: 'Rent self-drive cars in India with Zugo. Choose from a wide range of hatchbacks, sedans, and SUVs. Best car rental service near you with unlimited kilometers options.',
        keywords: [
            'rent car',
            'car rental',
            'self drive car',
            'car rental near me',
            'rent car for self drive',
            'suv rental',
            'car booking India',
            'car rental Rishikesh',
            'self drive car rental',
        ],
    },
    rentals: {
        title: 'Browse Vehicle Rentals Near You - Bikes, Scooters & Cars on Rent | Zugo',
        description: 'Explore verified vehicle rental shops and services across India. Find bike rentals, scooty on rent, and car rentals in Rishikesh, Delhi, Bangalore, Gurugram. Book instantly with Zugo.',
        keywords: [
            'vehicle rental',
            'available bikes',
            'available cars',
            'rent vehicles',
            'vehicle listings',
            'rentals in Rishikesh',
            'bike rental near me',
            'scooty rental near me',
            'vehicle rental service',
            'bike rent',
            'two wheeler on rent',
        ],
    },
    registerVehicle: {
        title: 'List Your Vehicle & Start Earning',
        description: 'List your bike or car on Zugo and start earning passive income. Set your own pricing and availability. Join thousands of vehicle owners earning on Zugo.',
        keywords: [
            'list vehicle',
            'earn from vehicle',
            'vehicle listing',
            'rent out bike',
            'rent out car',
            'passive income',
        ],
    },
    registerRental: {
        title: 'Register Your Rental Business',
        description: 'Register your vehicle rental business on Zugo. Manage multiple vehicles, track bookings, and grow your rental business with our platform.',
        keywords: [
            'rental business',
            'vehicle rental business',
            'fleet management',
            'rental agency',
            'vehicle rental partnership',
        ],
    },
    login: {
        title: 'Login',
        description: 'Login to your Zugo account to manage your bookings and rentals.',
        keywords: ['login', 'zugo login', 'sign in'],
    },
    register: {
        title: 'Sign Up',
        description: 'Create a new account on Zugo to start renting bikes and cars.',
        keywords: ['register', 'sign up', 'create account', 'zugo register'],
    },
};
