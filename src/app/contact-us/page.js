import ContactForm from '../../components/ContactForm';
import Link from 'next/link';

export const metadata = {
    title: 'Contact Us | Zugo',
    description: 'Get in touch with Zugo support team.',
};

export default function ContactUs() {
    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Hero Section */}
            <section className="relative bg-black text-white pt-24 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-90"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <span className="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                        24/7 Support
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Touch</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Have questions about your rental? Need help with a booking? Our dedicated support team is here to assist you around the clock.
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="relative max-w-7xl mx-auto px-4 md:px-6 -mt-20 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Phone Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Phone Support</h3>
                            <p className="text-sm text-gray-500 mb-4">Mon-Sun 9am to 8pm</p>
                            <a href="tel:+919692031010" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                <span>+91 9692031010</span>
                                <svg className="w-4 h-4 text-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 transform transition-all duration-300 hover:-translate-y-1">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Email Us</h3>
                            <p className="text-sm text-gray-500 mb-4">For general inquiries</p>
                            <a href="mailto:info@zugo.co.in" className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 transition-colors">
                                <span>info@zugo.co.in</span>
                                <svg className="w-4 h-4 text-xs" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>

                        {/* Visit Us Card (Optional/Commented out in original, can be added back stylishly if needed) */}
                    </div>

                    {/* Contact Form Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-bl-full opacity-50 -z-10"></div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                                <p className="text-gray-500 mt-1">Fill out the form below and we'll get back to you shortly.</p>
                            </div>

                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
