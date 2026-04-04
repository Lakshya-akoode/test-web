// Centralized metadata configuration for SEO

export const siteConfig = {
    name: 'Zugo',
    description: 'Rent Royal Enfield, scooters and bikes in Rishikesh instantly. Pickup at Tapovan, Laxman Jhula and Ram Jhula. From Rs 300/day.',
    url: 'https://www.zugo.co.in',
    ogImage: 'https://www.zugo.co.in/og-image.jpg',
    keywords: [
        'bike rental rishikesh',
        'scooter rental rishikesh',
        'royal enfield rent rishikesh',
        'bike on rent rishikesh',
        'scooty rental rishikesh',
        'rent bike in rishikesh',
        'activa on rent rishikesh',
        'two wheeler rental rishikesh',
        'self drive bike rental rishikesh',
        'zugo',
    ],
    social: {
        instagram: 'https://www.instagram.com/zugo_pvt',
    },
    company: {
        name: 'Zugo Bike Rental Rishikesh',
        legalName: 'Zugo India',
        foundingDate: '2024',
        email: 'info@zugo.co.in',
        phone: '+919692031010',
        address: {
            streetAddress: 'Tapovan',
            addressLocality: 'Rishikesh',
            addressRegion: 'Uttarakhand',
            postalCode: '249192',
            addressCountry: 'IN',
        },
    },
};

function formatPageTitle(title = siteConfig.name) {
    if (!title) {
        return siteConfig.name;
    }

    return /zugo/i.test(title) ? title : `${title} | ${siteConfig.name}`;
}

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
        title: formatPageTitle(title),
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
            title: formatPageTitle(title),
            description,
            siteName: siteConfig.name,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: `${siteConfig.name} bike rental in Rishikesh`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: formatPageTitle(title),
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
        title: 'Bike & Scooter Rental in Rishikesh | Book Online | Zugo',
        description: 'Rent Royal Enfield, scooters & bikes in Rishikesh instantly. 50+ verified vehicles. Pickup at Tapovan, Laxman Jhula & Ram Jhula. From Rs 300/day. Book now at zugo.co.in',
        keywords: [
            'bike rental Rishikesh',
            'scooter rental Rishikesh',
            'royal enfield rent Rishikesh',
            'activa on rent Rishikesh',
            'rent bike in Rishikesh',
            'zugo',
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
    pricing: {
        title: 'Bike Rental Prices in Rishikesh | Scooter & Royal Enfield Rates | Zugo',
        description: 'Transparent bike rental pricing in Rishikesh. Royal Enfield from Rs 800/day, scooters from Rs 300/day. No hidden charges. See full pricing at zugo.co.in',
        keywords: [
            'bike rental prices rishikesh',
            'scooter rent price rishikesh',
            'royal enfield rent price rishikesh',
            'bike rental rates rishikesh',
        ],
    },
};
