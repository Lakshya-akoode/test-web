'use client';

import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/metadata';

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
                        <Link href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                            <Image
                                src="/instagram.png"
                                alt="Instagram"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
