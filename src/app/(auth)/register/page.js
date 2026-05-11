'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { setAuth } from '@/lib/auth';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/api-config';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '@/context/ToastContext';

export default function RegisterPage() {
    const router = useRouter();
    const toast = useToast();
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralCode: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [isOtpVerifying, setIsOtpVerifying] = useState(false);
    const [isOtpResending, setIsOtpResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const otpRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    const otpValue = otp.join('');
    const canResend = resendTimer === 0;
    const isOtpComplete = otp.every((digit) => digit.length === 1);

    useEffect(() => {
        if (!otpModalOpen || resendTimer === 0) return;
        const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [otpModalOpen, resendTimer]);

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

    const resetOtpState = () => {
        setOtp(['', '', '', '', '', '']);
        setOtpError('');
        setResendTimer(60);
        setIsOtpVerifying(false);
        setIsOtpResending(false);
    };

    const handleOtpChange = (index, value) => {
        const next = [...otp];
        next[index] = value.slice(-1).replace(/\D/g, '');
        setOtp(next);
        setOtpError('');

        if (value && index < otpRefs.length - 1) {
            otpRefs[index + 1]?.current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1]?.current?.focus();
        }
    };

    const verifyOtp = async () => {
        if (!isOtpComplete || isOtpVerifying) return;

        setOtpError('');
        setIsOtpVerifying(true);

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.VERIFY_SIGNUP_OTP}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    otp: otpValue,
                }),
            });

            const data = await response.json();

            if (data.status === 'Success') {
                toast.success('OTP verified. Account created.');
                setOtpModalOpen(false);
                resetOtpState();
                router.push('/login');
                return;
            }

            setOtpError(data.message || 'Invalid OTP');
        } catch (err) {
            console.error('Verify OTP error:', err);
            setOtpError('Network error. Please try again.');
        } finally {
            setIsOtpVerifying(false);
        }
    };

    const resendOtp = async () => {
        if (!canResend || isOtpResending) return;

        setOtpError('');
        setIsOtpResending(true);

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.RESEND_SIGNUP_OTP}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                }),
            });

            const data = await response.json();

            if (data.status === 'Success') {
                setOtp(['', '', '', '', '', '']);
                setResendTimer(60);
                toast.success('OTP resent to your email.');
                otpRefs[0]?.current?.focus();
                return;
            }

            setOtpError(data.message || 'Unable to resend OTP');
        } catch (err) {
            console.error('Resend OTP error:', err);
            setOtpError('Network error. Please try again.');
        } finally {
            setIsOtpResending(false);
        }
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
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REQUEST_SIGNUP_OTP}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Name: formData.name,
                    mobile: formData.mobile,
                    email: formData.email,
                    password: formData.password,
                    referralCode: formData.referralCode || undefined
                }),
            });

            const data = await response.json();

            if (data.status === 'Success') {
                resetOtpState();
                setOtpModalOpen(true);
                toast.success('OTP sent to your email.');
                setTimeout(() => otpRefs[0]?.current?.focus(), 100);
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
                            Join Us
                        </span>
                    </div>
                    <h2 className="text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Become part of the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Revolution.</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                        Create an account to start your premium rental experience. Fast, secure, and hassle-free.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
                <div className="w-full max-w-md space-y-4 my-auto">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-4 group">
                            <Image
                                src="/black_logo.png"
                                alt="ZUGO"
                                width={100}
                                height={32}
                                className="object-contain group-hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
                        <p className="mt-1 text-sm text-gray-500">Enter your details to register.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-3">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700">Mobile Number</label>
                                <div className="relative group">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs group-focus-within:text-black transition-colors">+91</span>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        placeholder="9876543210"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-3 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700">Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-700">Confirm</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-wider transition-colors"
                                >
                                    {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                                </button>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-700">Referral Code (Optional)</label>
                                <input
                                    type="text"
                                    name="referralCode"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    placeholder="Enter code if you have one"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 outline-none transition-all focus:bg-white focus:border-black focus:ring-1 focus:ring-black font-medium text-sm border-dashed"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white rounded-xl py-3 font-bold text-sm hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                            <span className="px-3 bg-white text-gray-400 font-bold">Or sign up with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => googleLogin()}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isGoogleLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        ) : (
                            <Image src="/google.png" alt="Google" width={18} height={18} className="group-hover:scale-110 transition-transform" />
                        )}
                        <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">Google Account</span>
                    </button>

                    <p className="text-center text-xs text-gray-500 font-medium pt-2">
                        Already have an account?{' '}
                        <Link href="/login" className="text-black font-bold hover:text-blue-600 transition-colors hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {otpModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4">
                    <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 4.26a2.25 2.25 0 002.22 0L21 8m-16.5 9h15A1.5 1.5 0 0021 15.5v-7A1.5 1.5 0 0019.5 7h-15A1.5 1.5 0 003 8.5v7A1.5 1.5 0 004.5 17z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900">Verify OTP</h2>
                            <p className="mt-2 text-sm text-gray-500">6-digit code sent to</p>
                            <p className="mt-1 break-all text-sm font-bold text-gray-900">{formData.email.trim().toLowerCase()}</p>
                        </div>

                        {otpError && (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {otpError}
                            </div>
                        )}

                        <div className="mb-5 flex justify-between gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={otpRefs[index]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className="h-14 w-12 rounded-2xl border border-gray-200 bg-gray-50 text-center text-xl font-extrabold outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={verifyOtp}
                            disabled={!isOtpComplete || isOtpVerifying}
                            className="mb-4 w-full rounded-2xl bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isOtpVerifying ? 'Verifying...' : 'Verify & Create Account'}
                        </button>

                        <div className="mb-4 text-center text-sm text-gray-500">
                            Resend OTP{' '}
                            <button
                                type="button"
                                onClick={resendOtp}
                                disabled={!canResend || isOtpResending}
                                className="font-bold text-black disabled:text-gray-300"
                            >
                                {isOtpResending ? 'Sending...' : canResend ? 'Now' : `in 00:${String(resendTimer).padStart(2, '0')}`}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setOtpModalOpen(false);
                                resetOtpState();
                            }}
                            className="w-full rounded-2xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition hover:border-gray-300 hover:text-black"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
