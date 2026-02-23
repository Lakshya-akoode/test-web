import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cityContent } from '@/lib/cityContent';
import { siteConfig } from '@/lib/metadata';

export async function generateMetadata({ params }) {
    const { city } = await params;
    const cityKey = city?.toLowerCase();
    const content = cityContent[cityKey];

    if (!content) {
        return {
            title: 'Vehicle Rentals | Zugo',
            description: 'Find vehicle rental services across India with Zugo.',
        };
    }

    const title = `Rentals in ${content.name} — Bikes, Scooters & Cars on Rent | Zugo`;
    const description = `Find the best vehicle rental services in ${content.name}. Rent bikes, scooters & cars at affordable rates. ${content.seoDescription || content.description}`;

    return {
        title,
        description,
        keywords: [
            `rentals in ${content.name.toLowerCase()}`,
            `vehicle rental ${content.name.toLowerCase()}`,
            `bike rent ${content.name.toLowerCase()}`,
            `scooty on rent ${content.name.toLowerCase()}`,
            ...(content.keywords || []),
        ].join(', '),
        alternates: {
            canonical: `https://zugo.co.in/rentals/${city}`,
        },
        openGraph: {
            type: 'website',
            locale: 'en_IN',
            url: `https://zugo.co.in/rentals/${city}`,
            title,
            description,
            siteName: siteConfig.name,
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: `Rentals in ${content.name} - Zugo`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [siteConfig.ogImage],
        },
    };
}

export default async function CityRentalsPage({ params }) {
    const resolvedParams = await params;
    const city = resolvedParams?.city;

    if (!city) {
        notFound();
    }

    const cityKey = city.toLowerCase();
    const content = cityContent[cityKey];

    if (!content) {
        notFound();
    }

    const { name, formalName, intro, points, faq, areas } = content;

    // Breadcrumb JSON-LD
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://zugo.co.in' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Rentals', 'item': 'https://zugo.co.in/rentals' },
            { '@type': 'ListItem', 'position': 3, 'name': `Rentals in ${name}`, 'item': `https://zugo.co.in/rentals/${city}` },
        ],
    };

    // FAQPage Schema
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faq.map(item => ({
            '@type': 'Question',
            'name': item.q,
            'acceptedAnswer': { '@type': 'Answer', 'text': item.a },
        })),
    };

    // AutoRental Schema
    const autoRentalSchema = {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        'name': `Zugo Vehicle Rentals - ${name}`,
        'image': 'https://zugo.co.in/black_logo.png',
        'description': content.seoDescription || content.description,
        'url': `https://zugo.co.in/rentals/${city}`,
        'telephone': siteConfig.company.phone,
        'email': siteConfig.company.email,
        'priceRange': '₹₹',
        'address': {
            '@type': 'PostalAddress',
            'addressLocality': name,
            'addressRegion': name === 'Rishikesh' ? 'Uttarakhand' : name === 'Bangalore' ? 'Karnataka' : name === 'Delhi' ? 'Delhi' : 'Haryana',
            'addressCountry': 'IN',
        },
        ...(content.coordinates && {
            'geo': {
                '@type': 'GeoCoordinates',
                'latitude': content.coordinates.latitude,
                'longitude': content.coordinates.longitude,
            },
        }),
        'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opens': '00:00',
            'closes': '23:59',
        },
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(autoRentalSchema) }} />

            {/* Hero Section */}
            <section className="relative bg-black text-white pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center gap-2 mb-6 text-sm font-medium text-gray-400">
                        <Link href="/home" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/rentals" className="hover:text-white transition-colors">Rentals</Link>
                        <span>/</span>
                        <span className="text-white">{name}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Vehicle <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Rentals in {name}</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                        Find the best bike, scooty & car rental services in {name}. Book self-drive vehicles at affordable rates with Zugo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/book/bike?city=${name}`} className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Rent a Bike in {name}
                        </Link>
                        <Link href={`/book/car?city=${name}`} className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all">
                            Rent a Car in {name}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-6 -mt-20 z-10 space-y-12">

                {/* About Rentals in City */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Rent with Zugo in {formalName}?</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {intro}
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {points.map((point, idx) => (
                            <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-2">{point.title}</h3>
                                <p className="text-sm text-gray-500">{point.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rental Types */}
                <div className="grid md:grid-cols-2 gap-8">
                    <Link href={`/bikes-for-rent/${cityKey}`} className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden hover:scale-[1.01] transition-transform duration-300 block">
                        <h3 className="text-2xl font-bold mb-4">🏍️ Bike & Scooty Rentals in {name}</h3>
                        <p className="text-blue-100 mb-6">Explore our range of well-maintained two-wheelers. Scooters, sports bikes, cruisers & more.</p>
                        <span className="inline-block px-6 py-3 bg-white text-blue-700 rounded-xl font-bold shadow-lg">
                            Browse Bikes →
                        </span>
                    </Link>

                    <div className="bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                        <h3 className="text-2xl font-bold mb-4">🚗 Car Rentals in {name}</h3>
                        <p className="text-purple-100 mb-6">Self-drive cars for daily commute, weekend trips, or road adventures.</p>
                        <Link href={`/book/car?city=${name}`} className="inline-block px-6 py-3 bg-white text-purple-700 rounded-xl font-bold shadow-lg hover:bg-purple-50 transition-colors">
                            Browse Cars →
                        </Link>
                    </div>
                </div>

                {/* Popular Areas */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Rental Locations in {name}</h2>
                    <div className="flex flex-wrap gap-3">
                        {areas.map((area, idx) => (
                            <Link
                                key={idx}
                                href={`/book/bike?city=${name}&query=${area}`}
                                className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-black transition-colors font-medium border border-gray-100"
                            >
                                📍 {area}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Other Cities */}
                <div className="bg-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <h3 className="text-2xl font-bold mb-4">Vehicle Rentals in Other Cities</h3>
                    <p className="text-gray-400 mb-6">We operate across multiple cities in India. Find rentals near you.</p>
                    <div className="flex gap-3 flex-wrap">
                        {Object.keys(cityContent).filter(k => k !== cityKey).map(k => (
                            <Link
                                key={k}
                                href={`/rentals/${k}`}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-semibold"
                            >
                                {cityContent[k].name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions About Rentals in {name}</h2>
                    <div className="space-y-6">
                        {faq.map((item, idx) => (
                            <div key={idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.q}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return Object.keys(cityContent).map((city) => ({
        city: city,
    }));
}
