import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: 'Zugo Blog | Rishikesh Bike Rental Tips & Travel Guides',
    description: 'Explore bike rental tips, route ideas and travel guides for Rishikesh from the Zugo team.',
    canonical: 'https://www.zugo.co.in/blog',
});

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <div className="mb-12">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-700 mb-4">Zugo Blog</p>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Rishikesh bike rental guides</h1>
                    <p className="text-lg text-gray-600 max-w-2xl">
                        Practical tips for choosing the right bike, planning routes and booking faster when you are visiting Rishikesh.
                    </p>
                </div>

                <article className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">Featured Post</p>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">The Complete Guide to Renting a Bike in Rishikesh (2025)</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Everything you need to know about documents, pricing, popular routes, safety and booking the right scooter or Royal Enfield for your stay.
                    </p>
                    <Link
                        href="/blog/bike-rental-guide-rishikesh"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                    >
                        Read the guide
                    </Link>
                </article>
            </div>
        </div>
    );
}
