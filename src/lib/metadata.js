// Centralized metadata configuration for SEO

export const siteConfig = {
    name: 'Zugo',
    description: 'India\'s largest self-drive vehicle rental platform. Rent bikes and cars on your own terms. No hidden charges, no fuel charges, and complete freedom to travel wherever you want.',
    url: 'https://zugo.co.in',
    ogImage: 'https://zugo.co.in/og-image.jpg',
    keywords: [
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
    ],
    social: {
        instagram: 'https://www.instagram.com/zugoforyou',
    },
    company: {
        name: 'Zugo',
        legalName: 'Zugo India',
        foundingDate: '2024',
        email: 'support@zugo.co.in',
        phone: '+91-XXXXXXXXXX', // Update with actual phone number
        address: {
            streetAddress: '',
            addressLocality: '',
            addressRegion: '',
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
            canonical: canonical || siteConfig.url,
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
            google: '', // Add Google Search Console verification code
            yandex: '',
            bing: '',
        },
    };

    return metadata;
}

// Page-specific metadata presets
export const pageMetadata = {
    home: {
        title: 'Zugo - India\'s Largest Self-Drive Vehicle Rental Platform',
        description: 'Rent bikes and cars on your own terms. No hidden charges, no fuel charges, and complete freedom to travel. Book vehicles instantly across 100+ cities in India.',
        keywords: [
            'vehicle rental India',
            'bike rental India',
            'car rental India',
            'self drive rental',
            'zugo',
            'rent bike near me',
            'rent car near me',
        ],
    },
    bookBike: {
        title: 'Book Bikes for Rent',
        description: 'Find and book bikes for rent near you. Wide selection of bikes available for hourly, daily, and weekly rentals. Transparent pricing with no hidden charges.',
        keywords: [
            'bike rental',
            'rent bike',
            'two wheeler rental',
            'bike booking',
            'scooter rental',
            'bike on rent near me',
        ],
    },
    bookCar: {
        title: 'Book Cars for Rent',
        description: 'Rent self-drive cars near you. Choose from sedans, SUVs, hatchbacks and more. Flexible rental plans - hourly, daily, or weekly. Book now!',
        keywords: [
            'car rental',
            'self drive car',
            'rent car',
            'four wheeler rental',
            'car booking',
            'self drive car rental near me',
        ],
    },
    rentals: {
        title: 'Browse Available Vehicles',
        description: 'Explore thousands of bikes and cars available for rent across India. Filter by location, price, and vehicle type. Book instantly.',
        keywords: [
            'vehicle rental',
            'available bikes',
            'available cars',
            'rent vehicles',
            'vehicle listings',
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
};
