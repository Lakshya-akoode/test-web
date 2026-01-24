'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { isAuthenticated, getUser, getToken } from '@/lib/auth';
import API from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Link from 'next/link';

function AnalyticsContent() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        const user = getUser();
        if (user?.userType !== 'rental_owner' && user?.userType !== 'owner') {
            // Optional: redirect logic
        }

        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const endDate = new Date();
            const startDate = new Date();

            if (timeRange === 'week') {
                startDate.setDate(endDate.getDate() - 7);
            } else if (timeRange === 'month') {
                startDate.setMonth(endDate.getMonth() - 1);
            } else if (timeRange === 'year') {
                startDate.setFullYear(endDate.getFullYear() - 1);
            }

            const query = new URLSearchParams({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }).toString();

            const response = await fetch(`${API.earningsAnalytics}?${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();

            if (data.status === 'Success') {
                setAnalyticsData(data.data);
            } else {
                toast.error(data.message || 'Failed to fetch analytics');
            }
        } catch (error) {
            console.error('Analytics error:', error);
            toast.error('Error loading analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    const { analytics, paymentSplit, dailyEarnings } = analyticsData || {};

    // Transform daily earnings for chart
    const chartData = dailyEarnings?.map(item => ({
        date: `${item._id.day}/${item._id.month}`,
        Amount: item.totalNetAmount,
        Trips: item.totalTrips
    })) || [];

    // Premium Colors
    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']; // Indigo, Emerald, Amber, Red

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100">
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    <p className="text-lg font-bold text-gray-900">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <section className="relative bg-[#0a0a0a] text-white pt-28 pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm font-medium">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Back
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Analytics</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl">
                                Track your earnings, booking performance, and revenue sources efficiently.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                                <div className="text-xs text-gray-400 mb-1">Total Balance</div>
                                <div className="text-xl font-bold">₹{analytics?.totalNetAmount?.toLocaleString() || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-20">
                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">+12%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-sm mb-1">Total Earnings</p>
                            <h3 className="text-3xl font-bold text-gray-900">₹{analytics?.totalNetAmount?.toLocaleString() || 0}</h3>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-sm mb-1">Total Trips</p>
                            <h3 className="text-3xl font-bold text-gray-900">{analytics?.totalTrips || 0}</h3>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-sm mb-1">Avg. Per Trip</p>
                            <h3 className="text-3xl font-bold text-gray-900">₹{Math.round(analytics?.averageEarningPerTrip || 0).toLocaleString()}</h3>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium text-sm mb-1">Platform Fees</p>
                            <h3 className="text-3xl font-bold text-gray-900">₹{analytics?.totalPlatformFee?.toLocaleString() || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Revenue Trend</h3>
                                <p className="text-sm text-gray-500">Earnings over time</p>
                            </div>
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-black cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="Amount"
                                        stroke="#000000"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorAmount)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Split Pie Chart */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Payment Methods</h3>
                            <p className="text-sm text-gray-500">Distribution by source</p>
                        </div>

                        <div className="h-[250px] w-full relative">
                            {paymentSplit && paymentSplit.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={paymentSplit}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="totalAmount"
                                            stroke="none"
                                        >
                                            {paymentSplit.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => `₹${value.toLocaleString()}`}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                                    No payment data
                                </div>
                            )}
                            {/* Center Text */}
                            {paymentSplit && paymentSplit.length > 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total</span>
                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{paymentSplit.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 space-y-3">
                            {paymentSplit?.map((item, index) => (
                                <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-gray-600 font-medium text-sm">{item._id}</span>
                                    </div>
                                    <span className="font-bold text-gray-900 text-sm">₹{item.totalAmount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
        }>
            <AnalyticsContent />
        </Suspense>
    );
}
