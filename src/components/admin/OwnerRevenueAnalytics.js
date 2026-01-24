'use client';

import { useState, useEffect } from 'react';
import { API } from '@/lib/api';
import { getAdminAuthHeaders } from '@/lib/adminAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function OwnerRevenueAnalytics() {
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('totalRevenue'); // totalRevenue, totalTrips

    useEffect(() => {
        fetchAnalytics();
    }, [sortBy]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API.adminOwnerRevenueAnalytics}?limit=20&sortBy=${sortBy}&order=desc`, {
                headers: getAdminAuthHeaders()
            });
            const data = await response.json();
            if (data.status === 'Success') {
                setAnalyticsData(data.data.ownerAnalytics);
            }
        } catch (error) {
            console.error('Error fetching owner analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Charts Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Top Performing Owners</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('totalRevenue')}
                            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${sortBy === 'totalRevenue' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                            By Revenue
                        </button>
                        <button
                            onClick={() => setSortBy('totalTrips')}
                            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${sortBy === 'totalTrips' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        >
                            By Trips
                        </button>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.slice(0, 10)} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="ownerName"
                                width={120}
                                tick={{ fontSize: 12, fill: '#4b5563' }}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value, name) => [
                                    name === 'totalRevenue' ? `₹${value.toLocaleString()}` : value,
                                    name === 'totalRevenue' ? 'Revenue' : 'Trips'
                                ]}
                            />
                            <Bar
                                dataKey={sortBy}
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            >
                                {analyticsData.slice(0, 10).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">Owner Revenue Details</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Owner Name</th>
                                <th className="px-6 py-3">Contact</th>
                                <th className="px-6 py-3 text-right">Trips</th>
                                <th className="px-6 py-3 text-right">Gross Revenue</th>
                                <th className="px-6 py-3 text-right">Platform Fee</th>
                                <th className="px-6 py-3 text-right">Net Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {analyticsData.map((owner) => (
                                <tr key={owner._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{owner.ownerName}</div>
                                        <div className="text-xs text-gray-500">{owner.ownerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{owner.ownerContact}</td>
                                    <td className="px-6 py-4 text-right font-medium">{owner.totalTrips}</td>
                                    <td className="px-6 py-4 text-right">₹{owner.totalRevenue?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right text-red-500">-₹{owner.totalPlatformFee?.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-bold text-green-600 md:text-base">₹{owner.totalNetAmount?.toLocaleString()}</td>
                                </tr>
                            ))}
                            {analyticsData.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                                        No revenue data available found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
