'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { setAuth } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import { useGoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleGoogleAuth = async (accessToken) => {
        setIsGoogleLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GOOGLE_AUTH}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                }),
            });

            const data = await response.json();

            if (data.status === 'Success' && data.data?.token) {
                setAuth(data.data.token, data.data);
                router.push('/home');
            } else {
                setError(data.message || 'Google registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Google auth error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: tokenResponse => {
            handleGoogleAuth(tokenResponse.access_token);
        },
        onError: () => {
            setError('Google registration failed. Please try again.');
            setIsGoogleLoading(false);
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.mobile.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REGISTER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: formData.name,
                    mobile: formData.mobile,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (data.status === 'Success') {
                if (data.data?.token) {
                    setAuth(data.data.token, data.data);
                    router.push('/home');
                } else {
                    router.push('/login');
                }
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Branding / Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-900">
                <Image
                    src="/background.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                <div className="absolute bottom-12 left-12 right-12 text-white">
                    <h2 className="text-4xl font-bold mb-4">Join the community.</h2>
                    <p className="text-gray-300 text-lg">Create an account to start renting bikes and cars instantly.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/black_logo.png"
                                alt="ZUGO"
                                width={120}
                                height={40}
                                className="object-contain"
                            />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                        <p className="mt-2 text-gray-600">Enter your details to register.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    placeholder="9876543210"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                            </button>
                        </div>


                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white rounded-xl py-4 font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            type="button" 
                            onClick={() => googleLogin()} 
                            disabled={isGoogleLoading || isLoading}
                            className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGoogleLoading ? (
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Image src="/google.png" alt="Google" width={20} height={20} />
                            )}
                            <span className="text-sm font-medium text-gray-700">Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition-all shadow-sm">
                            <Image src="/apple-logo.png" alt="Apple" width={20} height={20} className="text-black" />
                            <span className="text-sm font-medium text-gray-700">Apple</span>
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 pt-2">
                        Already have an account?{' '}
                        <Link href="/login" className="text-black font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
