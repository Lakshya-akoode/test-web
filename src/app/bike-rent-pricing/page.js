import Link from 'next/link';
import { pageMetadata } from '@/lib/metadata';

export const metadata = {
    title: 'Bike Rental Pricing | Zugo',
    description: 'Transparent bike rental pricing in Bangalore, Delhi, and other cities. Hourly, daily, and monthly plans starting at just ₹19/hr.',
};

export default function PricingPage() {
    const plans = [
        {
            name: 'Hourly',
            price: '₹19',
            period: '/ hour',
            description: 'Perfect for short errands and quick rides across the city.',
            features: [
                'Zero Security Deposit',
                'Fuel excluded',
                '24/7 Roadside Assistance',
                'Helmets Included'
            ],
            cta: 'Book Hourly',
            popular: false
        },
        {
            name: 'Daily (Starting at)',
            price: '₹399',
            period: '/ day',
            description: 'Ideal for city exploration and day trips.',
            features: [
                '120 km limit',
                'Fuel excluded',
                '24/7 Roadside Assistance',
                'Helmets Included',
                'Flexible extension'
            ],
            cta: 'Book Daily',
            popular: true
        },
        {
            name: 'Weekly',
            price: '₹1,899',
            period: '/ week',
            description: 'Best for weekly commutes or long vacations.',
            features: [
                'Reduced rates',
                'Maintenance included',
                'Doorstep Delivery',
                'Helmets Included'
            ],
            cta: 'Book Weekly',
            popular: false
        },
        {
            name: 'Monthly',
            price: '₹3,999',
            period: '/ month',
            description: 'Your own bike, without the ownership hassles.',
            features: [
                'Lowest rates',
                'Free Service & Maintenance',
                'Doorstep Delivery',
                'Exchange guarantee'
            ],
            cta: 'Book Monthly',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-24">
            {/* Header */}
            <div className="bg-black text-white py-20 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        No hidden charges. No confusing tiers. Just pick a plan that suits your ride.
                    </p>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden border transition-transform hover:-translate-y-2 duration-300 ${plan.popular ? 'border-purple-500 ring-2 ring-purple-500 ring-opacity-50 scale-105 md:scale-110 z-10' : 'border-gray-100'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    MOST POPULAR
                                </div>
                            )}
                            <div className="p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline mb-4">
                                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                                    <span className="text-gray-500 ml-1">{plan.period}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 min-h-[40px]">
                                    {plan.description}
                                </p>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/book/bike"
                                    className={`block w-full text-center py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Commuter Pass Banner */}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Zugo Commuter Pass</h2>
                        <p className="text-indigo-200 text-lg max-w-xl">
                            Unlock unlimited rides during weekdays at a flat monthly fee. Perfect for office goers and students.
                        </p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <Link href="/contact-us" className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                            Enquire Now
                        </Link>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-20 rounded-full -ml-10 -mb-10 blur-xl"></div>
                </div>
            </div>

            {/* City Links */}
            <div className="max-w-7xl mx-auto px-6 mt-24 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-8">Check pricing in your city</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {['Bangalore', 'Delhi', 'Gurugram', 'Rishikesh', 'Mumbai', 'Hyderabad', 'Pune'].map((city, idx) => (
                        <Link key={idx} href={`/bikes-for-rent/${city.toLowerCase()}`} className="px-6 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-black hover:text-black transition-all">
                            {city}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
