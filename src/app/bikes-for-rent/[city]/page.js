import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cityContent } from '@/lib/cityContent';
import { siteConfig } from '@/lib/metadata';


export async function generateMetadata({ params }) {
    const { city } = await params;

    if (!city) return {
        title: 'Bike Rental | Zugo',
        description: 'Rent affordable bikes and scooters with Zugo across India.',
    };

    const cityKey = city.toLowerCase();
    const content = cityContent[cityKey];

    if (!content) {
        return {
            title: 'Bike Rental | Zugo',
            description: 'Rent affordable bikes and scooters with Zugo across India.',
        };
    }

    const canonicalUrl = `https://www.zugo.co.in/bikes-for-rent/${cityKey}`;

    return {
        title: content.title,
        description: content.description,
        keywords: content.keywords ? content.keywords.join(', ') : '',
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: 'website',
            locale: 'en_IN',
            url: canonicalUrl,
            title: content.title,
            description: content.description,
            siteName: siteConfig.name,
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${content.name} bike rental by Zugo`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: content.title,
            description: content.description,
            images: [siteConfig.ogImage],
        },
    };
}

export default async function CityPage({ params }) {
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

    const { name, formalName, heroTitle, heroSubtitle, intro, points, faq, areas } = content;
    const canonicalUrl = `https://www.zugo.co.in/bikes-for-rent/${cityKey}`;
    const serviceSchema = cityKey === 'rishikesh' ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Vehicle Rental',
        name: 'Bike Rental in Rishikesh',
        provider: {
            '@type': 'LocalBusiness',
            name: 'Zugo',
            url: 'https://www.zugo.co.in',
        },
        areaServed: {
            '@type': 'City',
            name: 'Rishikesh',
        },
        offers: [
            {
                '@type': 'Offer',
                name: 'Scooty Rental Rishikesh',
                price: '300',
                priceCurrency: 'INR',
                priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price: '300',
                    priceCurrency: 'INR',
                    unitText: 'per day',
                },
            },
            {
                '@type': 'Offer',
                name: 'Royal Enfield Rental Rishikesh',
                price: '800',
                priceCurrency: 'INR',
                priceSpecification: {
                    '@type': 'UnitPriceSpecification',
                    price: '800',
                    priceCurrency: 'INR',
                    unitText: 'per day',
                },
            },
        ],
    } : null;

    // JSON-LD Schema for Breadcrumbs
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://www.zugo.co.in'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': `Bike Rental in ${name}`,
                'item': canonicalUrl
            }
        ]
    };

    // FAQPage Schema for rich snippets in Google
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faq.map(item => ({
            '@type': 'Question',
            'name': item.q,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.a,
            },
        })),
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {serviceSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
                />
            )}

            {/* Hero Section */}
            <section className="relative bg-black text-white pt-32 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className="flex justify-center gap-2 mb-6 text-sm font-medium text-gray-400">
                        <Link href="/home" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-white">Bikes in {name}</span>
                    </div>

                    <h1
                        className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                        dangerouslySetInnerHTML={{ __html: heroTitle }}
                    />
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={`/book/bike?city=${name}`} className="px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Book Now in {name}
                        </Link>
                        <Link href="/bike-rent-pricing" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-6 -mt-20 z-10 space-y-12">

                {/* Intro Card */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Bike Rental in {formalName} — Rent Bikes & Scooters with Zugo</h2>
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
                    {cityKey === 'rishikesh' && (
                        <div className="mt-8 rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 mb-3">Plan Your Ride</p>
                            <Link
                                href="/blog/bike-rental-guide-rishikesh"
                                className="text-lg font-semibold text-emerald-900 underline underline-offset-4 hover:text-emerald-700"
                            >
                                Read our complete Rishikesh bike rental guide
                            </Link>
                        </div>
                    )}
                </div>

                {/* Popular Areas */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Bike Rental Locations in {name}</h2>
                    <div className="flex flex-wrap gap-3">
                        {areas.map((area, idx) => (
                            <Link
                                key={idx}
                                href={`/book/bike?city=${name}&query=${area}`}
                                className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-black transition-colors font-medium border border-gray-100"
                            >
                                {area}
                            </Link>
                        ))}
                    </div>
                </div>

                {cityKey === 'rishikesh' ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full group-hover:bg-emerald-500/30 transition-all"></div>
                            <h3 className="text-2xl font-bold mb-4">Need help choosing the right bike?</h3>
                            <p className="text-gray-300 mb-6">Get route ideas, documents, pricing tips and the best bike types for Rishikesh roads.</p>
                            <Link
                                href="/blog/bike-rental-guide-rishikesh"
                                className="inline-flex px-6 py-3 bg-white text-black rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-colors"
                            >
                                Read our complete Rishikesh bike rental guide
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-600 to-cyan-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-4">See exact rates before you book</h3>
                            <p className="text-emerald-100 mb-6">Compare scooter, Activa and Royal Enfield pricing with no hidden charges.</p>
                            <Link href="/bike-rent-pricing" className="inline-block px-6 py-3 bg-white text-emerald-700 rounded-xl font-bold shadow-lg hover:bg-emerald-50 transition-colors">
                                View Rishikesh pricing
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full group-hover:bg-purple-600/30 transition-all"></div>
                            <h3 className="text-2xl font-bold mb-4">Bike Rentals in Other Cities</h3>
                            <p className="text-gray-400 mb-6">Traveling soon? Check out our fleet in other major cities.</p>
                            <div className="flex gap-3 flex-wrap">
                                {Object.keys(cityContent).filter(k => k !== cityKey).map(k => (
                                    <Link
                                        key={k}
                                        href={`/bikes-for-rent/${k}`}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-semibold"
                                    >
                                        {cityContent[k].name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                            <h3 className="text-2xl font-bold mb-4">Long Term Bike Rentals in {name}</h3>
                            <p className="text-purple-100 mb-6">Need a bike for a month or more? Get exclusive discounts on long-term bookings in {name}.</p>
                            <Link href="/contact-us" className="inline-block px-6 py-3 bg-white text-purple-700 rounded-xl font-bold shadow-lg hover:bg-purple-50 transition-colors">
                                Enquire Now
                            </Link>
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions About Bike Rental in {name}</h2>
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
