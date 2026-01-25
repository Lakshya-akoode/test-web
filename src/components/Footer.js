'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="block">
                            <Image
                                src="/black_logo.png"
                                alt="ZUGO"
                                width={80}
                                height={26}
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Zugo is your premium vehicle rental partner. Experience the freedom of movement with our wide range of bikes and scooters.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/home" className="hover:text-black transition-colors">Home</Link></li>
                            <li><Link href="/book/bike" className="hover:text-black transition-colors">Book a Ride</Link></li>
                            <li><Link href="/register-vehicle" className="hover:text-black transition-colors">List Your Vehicle</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-and-conditions" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/cancellation-refund-policy" className="hover:text-black transition-colors">Refund Policy</Link></li>
                            <li><Link href="/shipping-policy" className="hover:text-black transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="/contact-us" className="hover:text-black transition-colors">Contact Support</Link></li>
                            <li>Email: info@zugo.co.in</li>
                            <li>Phone: +91 9692031010</li>
                            {/* Placeholder Address - User to update */}
                            {/* <li>Address: Shop No. 12, Ground Floor, Zugo Tower, Pune, Maharashtra 411001</li> */}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Zugo Rentals. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="https://www.instagram.com/zugoforyou" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.407-.06 4.123-.06h.08zm-1.634 14.676c-3.668 0-6.643-2.975-6.643-6.643 0-3.668 2.975-6.643 6.643-6.643 3.668 0 6.643 2.975 6.643 6.643 0 3.668-2.975 6.643-6.643 6.643zm0-11.239c-2.54 0-4.596 2.056-4.596 4.596 0 2.54 2.056 4.596 4.596 4.596 2.54 0 4.596-2.056 4.596-4.596 0-2.54-2.056-4.596-4.596-4.596zm7.258-2.502c-.896 0-1.62-.724-1.62-1.62s.724-1.62 1.62-1.62 1.62.724 1.62 1.62-.724 1.62-1.62 1.62z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
