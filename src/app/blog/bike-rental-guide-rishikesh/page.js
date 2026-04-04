import Link from 'next/link';

export const metadata = {
    title: 'Complete Guide to Renting a Bike in Rishikesh (2025) | Zugo',
    description: 'Everything you need to know about renting a bike in Rishikesh — best routes, prices, what documents you need, and which bike to choose. Updated 2025.',
    alternates: {
        canonical: 'https://www.zugo.co.in/blog/bike-rental-guide-rishikesh',
    },
    openGraph: {
        title: 'Complete Guide to Renting a Bike in Rishikesh (2025) | Zugo',
        description: 'Everything you need to know about renting a bike in Rishikesh — best routes, prices, what documents you need, and which bike to choose.',
        url: 'https://www.zugo.co.in/blog/bike-rental-guide-rishikesh',
        siteName: 'Zugo',
        locale: 'en_IN',
        type: 'article',
        images: [
            {
                url: 'https://www.zugo.co.in/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Bike rental guide for Rishikesh by Zugo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Complete Guide to Renting a Bike in Rishikesh (2025) | Zugo',
        description: 'Everything you need to know about renting a bike in Rishikesh — best routes, prices, what documents you need, and which bike to choose.',
        images: ['https://www.zugo.co.in/og-image.jpg'],
    },
};

const sections = [
    {
        heading: 'Why Rent a Bike in Rishikesh?',
        body: 'Traffic around Tapovan, Laxman Jhula and Ram Jhula can slow down cars quickly, especially during weekends and holiday seasons. A scooter or bike gives you the freedom to move between cafes, yoga centres, rafting points and riverfront spots on your own schedule.',
    },
    {
        heading: 'Best Bikes for Rishikesh Roads',
        body: 'Scooters and Activa models are ideal for local rides inside town, while Royal Enfield Classic 350, Bullet 350 and Himalayan are better for hill climbs, Neelkanth routes and longer rides towards Shivpuri or beyond. If you want comfort and extra power, touring bikes like Dominar are strong options.',
    },
    {
        heading: 'Top Routes to Ride from Rishikesh',
        body: 'Popular short rides include Tapovan to Neelkanth Mahadev Temple, the ghats around Triveni and the scenic road towards Shivpuri. If you have more time, travellers also enjoy full-day rides deeper into Uttarakhand after confirming bike condition, fuel policy and route suitability with the owner.',
    },
    {
        heading: 'How Much Does Bike Rental Cost in Rishikesh?',
        body: 'Scooters typically start from Rs 300 per day, commuter bikes begin around Rs 500 per day, and Royal Enfield rentals usually start from Rs 800 per day. Premium adventure bikes can cost more depending on season, pickup location and model availability.',
    },
    {
        heading: 'Documents Required for Bike Rental in Rishikesh',
        body: 'Carry a valid two-wheeler driving licence and one government ID. Verified returning users may get easier checkout and lower deposit requirements, but first-time riders should be ready for a refundable security deposit depending on the listing.',
    },
    {
        heading: 'Tips for Riding Safely in the Uttarakhand Hills',
        body: 'Start early, avoid aggressive overtakes on curves, wear your helmet properly and check brakes before heading uphill. During monsoon months, road edges and hill turns can become slippery, so leave more braking distance and ride conservatively.',
    },
    {
        heading: 'How to Book a Bike on Zugo',
        body: 'Choose your city, compare available scooters and bikes, review the daily rate and booking terms, then confirm your pickup point and dates online. Booking early is smart during weekends and long holidays because Rishikesh demand spikes fast.',
    },
];

export default function BlogPostPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <article className="max-w-4xl mx-auto px-6">
                <div className="mb-12">
                    <Link href="/blog" className="text-sm font-semibold text-emerald-700 hover:text-emerald-600">
                        Back to blog
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-6">
                        The Complete Guide to Renting a Bike in Rishikesh (2025)
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Rishikesh is one of the easiest places in North India to explore on two wheels. This guide covers what to rent, what to carry, how much it costs and how to plan a smooth ride.
                    </p>
                </div>

                <div className="space-y-10 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
                    {sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.heading}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">{section.body}</p>
                        </section>
                    ))}

                    <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 mb-3">Ready To Ride?</p>
                        <Link
                            href="/bikes-for-rent/rishikesh"
                            className="text-lg font-semibold text-emerald-900 underline underline-offset-4 hover:text-emerald-700"
                        >
                            Book a bike in Rishikesh on Zugo
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
