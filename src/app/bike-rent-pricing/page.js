import Link from 'next/link';
import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.pricing.title,
    description: pageMetadata.pricing.description,
    keywords: pageMetadata.pricing.keywords,
    canonical: 'https://www.zugo.co.in/bike-rent-pricing',
});

export default function PricingPage() {
    const plans = [
        {
            name: 'Scooters & Activa',
            price: 'Rs 300',
            period: '/ day',
            description: 'Best for local rides around Tapovan, Ram Jhula and cafe hopping.',
            features: ['Easy city riding', 'Helmet included', 'Great for couples and solo travellers'],
            cta: 'Book now',
            popular: false,
        },
        {
            name: 'Commuter Bikes',
            price: 'Rs 500',
            period: '/ day',
            description: 'Reliable daily bikes for exploring Rishikesh and nearby short routes.',
            features: ['Fuel efficient options', 'Comfortable for full-day trips', 'Verified owners'],
            cta: 'Book now',
            popular: false,
        },
        {
            name: 'Royal Enfield Classic & Bullet',
            price: 'Rs 800',
            period: '/ day',
            description: 'The most popular option for Neelkanth, Shivpuri and scenic Uttarakhand rides.',
            features: ['Classic 350 options', 'Strong hill performance', 'Pickup near Tapovan'],
            cta: 'Book now',
            popular: true,
        },
        {
            name: 'Himalayan & Dominar',
            price: 'Rs 1200',
            period: '/ day',
            description: 'Built for longer hill routes and riders who want extra touring comfort.',
            features: ['Adventure-ready models', 'Ideal for highway stretches', 'Limited premium inventory'],
            cta: 'Book now',
            popular: false,
        },
    ];

    const pickupZones = ['Tapovan', 'Laxman Jhula', 'Ram Jhula', 'Rishikesh Bus Stand', 'Shivpuri', 'Neelkanth Road'];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24">
            <div className="bg-black text-white py-20 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-emerald-950 opacity-95"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-300 mb-4">Rishikesh Pricing</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Bike Rental Prices in Rishikesh
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Transparent scooter and Royal Enfield rates with no hidden charges. Compare daily prices before you book.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border transition-transform hover:-translate-y-2 duration-300 ${plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-gray-100'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    MOST BOOKED
                                </div>
                            )}
                            <div className="p-8 h-full flex flex-col">
                                <h2 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h2>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 ml-1">{plan.period}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 min-h-[64px]">
                                    {plan.description}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/book/bike?city=Rishikesh"
                                    className={`mt-auto block w-full text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-10 lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">What&apos;s included in Zugo pricing?</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Daily prices include verified listings, clear pickup coordination and transparent checkout. New riders may pay a refundable security deposit, while verified users can often book with zero deposit.
                            </p>
                            <Link
                                href="/book/bike?city=Rishikesh"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                            >
                                Book now
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 w-full lg:max-w-md">
                            {pickupZones.map((zone) => (
                                <div key={zone} className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-700">
                                    {zone}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
