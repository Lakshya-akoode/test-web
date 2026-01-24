'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { setAuth } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
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
                setError(data.message || 'Google authentication failed. Please try again.');
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
            setError('Google login failed. Please try again.');
            setIsGoogleLoading(false);
        },
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (phoneNumber.length < 10) {
            setError('Please enter a valid 10-digit phone number');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: phoneNumber,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.status === 'Success' && data.data?.token) {
                setAuth(data.data.token, data.data);
                router.push('/home');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Branding / Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0b2e] via-[#000000] to-[#11001c] z-10"></div>
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-10"></div>
                <Image
                    src="/background.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                    priority
                />
                <div className="absolute bottom-0 left-0 right-0 p-16 z-20">
                    <div className="mb-6">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20 uppercase tracking-widest">
                            Welcome Back
                        </span>
                    </div>
                    <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Start your journey <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">with Zugo.</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        Join India's most flexible self-drive vehicle rental community. Experience freedom on the road.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-8 group">
                            <Image
                                src="/black_logo.png"
                                alt="ZUGO"
                                width={120}
                                height={40}
                                className="object-contain group-hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h1>
                        <p className="mt-2 text-gray-500">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm group-focus-within:text-black transition-colors">+91</span>
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="9876543210"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-wider bg-transparent p-1"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-black peer-checked:border-black transition-all"></div>
                                    <svg className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white rounded-xl py-4 font-bold text-base hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wider">
                            <span className="px-4 bg-white text-gray-400 font-bold">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => googleLogin()}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 rounded-xl py-3.5 hover:bg-gray-50 hover:border-gray-200 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGoogleLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        ) : (
                            <Image src="/google.png" alt="Google" width={20} height={20} className="group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">Google Account</span>
                    </button>

                    <p className="text-center text-sm text-gray-500 font-medium pt-4">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-black font-bold hover:text-blue-600 transition-colors hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
