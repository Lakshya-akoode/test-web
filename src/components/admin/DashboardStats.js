'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardStats({ stats, revenueData, loading, onRefresh }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">No statistics available</p>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats?.overview?.totalUsers || stats?.totalUsers || 0} icon="👥" color="blue" />
          <StatCard title="Total Vehicles" value={stats?.overview?.totalVehicles || stats?.totalVehicles || 0} icon="🚗" color="green" />
          <StatCard title="Total Bookings" value={stats?.bookings?.total || stats?.totalBookings || 0} icon="📋" color="purple" />
          <StatCard title="Pending Verifications" value={stats?.overview?.pendingVerifications || stats?.pendingVerifications || 0} icon="⏳" color="orange" />
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Loading charts...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data from API
  const bookingStatusData = stats?.bookings ? [
    { name: 'Pending', value: stats.bookings.pending || 0 },
    { name: 'Active', value: stats.bookings.active || 0 },
    { name: 'Completed', value: stats.bookings.completed || 0 },
    { name: 'Cancelled', value: stats.bookings.cancelled || 0 }
  ] : [];

  const vehicleTypeData = stats?.distributions?.vehicleTypes 
    ? stats.distributions.vehicleTypes.map(item => ({
        name: item._id || 'Unknown',
        count: item.count || 0
      }))
    : [];

  const revenueTimeSeriesData = revenueData?.revenueData 
    ? revenueData.revenueData.map(item => ({
        date: item._id,
        revenue: item.totalRevenue || 0,
        platformFee: item.totalPlatformFee || 0,
        netAmount: item.totalNetAmount || 0
      }))
    : [];

  const recentActivityData = stats?.recentActivity ? [
    { name: 'New Users', value: stats.recentActivity.newUsers || 0 },
    { name: 'New Vehicles', value: stats.recentActivity.newVehicles || 0 },
    { name: 'New Bookings', value: stats.recentActivity.newBookings || 0 }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2"
        >
          <span>🔄</span>
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.overview?.totalUsers || stats?.totalUsers || 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Total Vehicles"
          value={stats?.overview?.totalVehicles || stats?.totalVehicles || 0}
          icon="🚗"
          color="green"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.bookings?.total || stats?.totalBookings || 0}
          icon="📋"
          color="purple"
        />
        <StatCard
          title="Pending Verifications"
          value={stats?.overview?.pendingVerifications || stats?.pendingVerifications || 0}
          icon="⏳"
          color="orange"
        />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Status Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Status Distribution</h2>
          {bookingStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => {
                    const colors = ['#3b82f6', '#eab308', '#22c55e', '#ef4444'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No booking data available
            </div>
          )}
        </div>

        {/* Vehicle Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Type Distribution</h2>
          {vehicleTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No vehicle data available
            </div>
          )}
        </div>

        {/* Booking Status Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Status Overview</h2>
          {bookingStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No booking data available
            </div>
          )}
        </div>

        {/* Revenue Breakdown - Current Totals */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Breakdown</h2>
          {stats?.revenue ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: 'Revenue',
                    'Total Revenue': stats.revenue.totalRevenue || 0,
                    'Platform Fee': stats.revenue.totalPlatformFee || 0,
                    'Net Amount': stats.revenue.totalNetAmount || 0
                  }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Legend />
                <Bar dataKey="Total Revenue" fill="#22c55e" />
                <Bar dataKey="Platform Fee" fill="#3b82f6" />
                <Bar dataKey="Net Amount" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </div>
      </div>

      {/* Revenue Trend Over Time */}
      {revenueTimeSeriesData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTimeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="Total Revenue" />
              <Line type="monotone" dataKey="platformFee" stroke="#3b82f6" strokeWidth={2} name="Platform Fee" />
              <Line type="monotone" dataKey="netAmount" stroke="#a855f7" strokeWidth={2} name="Net Amount" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Activity Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity Trend (Last 7 Days)</h2>
        {recentActivityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recentActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No recent activity data available
          </div>
        )}
      </div>

      {/* Booking Stats */}
      {stats.bookings && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.bookings.pending || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.bookings.active || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Active</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.bookings.completed || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Completed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.bookings.cancelled || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Cancelled</div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Stats */}
      {stats.revenue && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-green-700">
                ₹{stats.revenue.totalRevenue?.toLocaleString('en-IN') || 0}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Platform Fee</div>
              <div className="text-2xl font-bold text-blue-700">
                ₹{stats.revenue.totalPlatformFee?.toLocaleString('en-IN') || 0}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Net Amount</div>
              <div className="text-2xl font-bold text-purple-700">
                ₹{stats.revenue.totalNetAmount?.toLocaleString('en-IN') || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats.recentActivity && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity (Last 7 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">New Users</div>
              <div className="text-2xl font-bold text-gray-800">{stats.recentActivity.newUsers || 0}</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">New Vehicles</div>
              <div className="text-2xl font-bold text-gray-800">{stats.recentActivity.newVehicles || 0}</div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">New Bookings</div>
              <div className="text-2xl font-bold text-gray-800">{stats.recentActivity.newBookings || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

