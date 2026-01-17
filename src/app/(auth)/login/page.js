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
        <div className="h-screen flex bg-white overflow-hidden">
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
                <div className="absolute bottom-10 left-10 right-10 text-white">
                    <h2 className="text-3xl font-bold mb-2">Start your journey today.</h2>
                    <p className="text-gray-300 text-base">Join India's largest self-drive vehicle rental community.</p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10">
                <div className="w-full max-w-sm space-y-5">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="/black_logo.png"
                                alt="ZUGO"
                                width={100}
                                height={32}
                                className="object-contain"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="mt-1 text-sm text-gray-600">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+91</span>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="9876543210"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-3 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none transition-all focus:border-black focus:ring-1 focus:ring-black text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-black" />
                                <span className="text-xs text-gray-600">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-xs font-medium text-black hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white rounded-lg py-3 font-bold text-sm hover:bg-gray-800 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            type="button"
                            onClick={() => googleLogin()}
                            disabled={isGoogleLoading || isLoading}
                            className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGoogleLoading ? (
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Image src="/google.png" alt="Google" width={18} height={18} />
                            )}
                            <span className="text-xs font-medium text-gray-700">Google</span>
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-600 mt-4">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-black font-bold hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
