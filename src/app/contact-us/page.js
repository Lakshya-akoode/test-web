import ContactForm from '../../components/ContactForm';

export const metadata = {
    title: 'Contact Us | Zugo',
    description: 'Get in touch with Zugo support team.',
};

export default function ContactUs() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <p className="text-lg text-gray-600">
                        Have questions about your rental? Need help with a booking? Our support team is here to assist you.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Phone Support</h3>
                                <p className="text-gray-600 mb-1">Mon-Sun 9am to 8pm</p>
                                <a href="tel:+919692031010" className="text-blue-600 font-semibold hover:underline">+91 9692031010</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                                <p className="text-gray-600 mb-1">For general inquiries and support</p>
                                <a href="mailto:info@zugo.co.in" className="text-blue-600 font-semibold hover:underline">info@zugo.co.in</a>
                            </div>
                        </div>

                        {/* <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Office Address</h3>
                                <address className="text-gray-600 not-italic">
                                    Shop No. 12, Ground Floor,<br />
                                    Zugo Tower, Pune,<br />
                                    Maharashtra 411001
                                </address>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Simple Contact Form */}
                <div className="bg-gray-50 p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
