'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getToken } from '@/lib/auth';
import API from '@/lib/api';

export default function ReferEarnPage() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [referralData, setReferralData] = useState(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        fetchReferralStats();
    }, [router]);

    const fetchReferralStats = async () => {
        try {
            const token = getToken();
            const response = await fetch(API.getReferralStats, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.status === 'Success') {
                setReferralData(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch referral stats');
            }
        } catch (error) {
            console.error('Error fetching referral stats:', error);
            toast.error('Failed to load referral data');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (referralData?.referralCode) {
            navigator.clipboard.writeText(referralData.referralCode);
            toast.success('Referral code copied!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <section className="relative bg-black text-white py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900 opacity-90"></div>
                <div className="relative max-w-4xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Refer & Earn Rewards</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Invite your friends to Zugo. You get <span className="text-yellow-400 font-bold">50 Points</span>, and they get <span className="text-yellow-400 font-bold">20 Points</span> on signup!
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-10">
                {/* Stats Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-1">Your Balance</p>
                        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {referralData?.walletPoints || 0} <span className="text-xl text-gray-400 font-bold">Pts</span>
                        </h2>
                    </div>

                    <div className="w-full md:w-auto bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-2">Your Referral Code</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl font-mono font-bold text-gray-900 tracking-wider">
                                {referralData?.referralCode || 'LOADING'}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                                title="Copy Code"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                        <h3 className="font-bold text-lg mb-2">Share Code</h3>
                        <p className="text-gray-500 text-sm">Share your unique referral code with friends and family.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                        <h3 className="font-bold text-lg mb-2">They Sign Up</h3>
                        <p className="text-gray-500 text-sm">Friends sign up using your code and instantly get 20 points.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                        <h3 className="font-bold text-lg mb-2">You Earn</h3>
                        <p className="text-gray-500 text-sm">You receive 50 points for every successful referral.</p>
                    </div>
                </div>

                {/* Referral History */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Referral History</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {referralData?.referralHistory?.length > 0 ? (
                            referralData.referralHistory.map((item, index) => (
                                <div key={index} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Referred: {item.userId?.username || 'New User'}</p>
                                            <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600">+ {item.pointsEarned} Pts</span>
                                </div>
                            ))
                        ) : (
                            <div className="px-8 py-12 text-center text-gray-400">
                                <p>No referrals yet. Start sharing!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
