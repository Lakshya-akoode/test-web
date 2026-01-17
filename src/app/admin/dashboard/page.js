'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API } from '@/lib/api';
import { getAdmin, getAdminAuthHeaders, clearAdminAuth, isAdminAuthenticated } from '@/lib/adminAuth';
import AdminSidebar from '@/components/AdminSidebar';
import DashboardStats from '@/components/admin/DashboardStats';
import UsersManagement from '@/components/admin/UsersManagement';
import RegisteredVehicles from '@/components/admin/RegisteredVehicles';
import VehicleVerification from '@/components/admin/VehicleVerification';
import AdminMessages from '@/components/admin/AdminMessages';

import { Suspense } from 'react';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const view = searchParams.get('view') || 'dashboard';
    setActiveView(view);
  }, [searchParams]);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    const adminData = getAdmin();
    setAdmin(adminData);

    // Fetch all dashboard data
    fetchAllDashboardData();
  }, [router]);

  const fetchAllDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch(API.adminDashboardStats, {
        headers: getAdminAuthHeaders()
      });
      const statsData = await statsResponse.json();
      if (statsData.status === 'Success') {
        setStats(statsData.data);
      }

      // Fetch revenue analytics for time-based charts
      const revenueResponse = await fetch(`${API.adminRevenueAnalytics}?period=month`, {
        headers: getAdminAuthHeaders()
      });
      const revenueAnalytics = await revenueResponse.json();
      if (revenueAnalytics.status === 'Success') {
        setRevenueData(revenueAnalytics.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(API.adminDashboardStats, {
        headers: getAdminAuthHeaders()
      });
      const data = await response.json();
      if (data.status === 'Success') {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(API.adminLogout, {
        method: 'POST',
        headers: getAdminAuthHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAdminAuth();
      router.push('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {activeView === 'dashboard' && 'Dashboard Stats'}
                  {activeView === 'verifications' && 'Vehicle Verifications'}
                  {activeView === 'users' && 'Users Management'}
                  {activeView === 'register-rental' && 'Registered Vehicles & Rentals'}
                  {activeView === 'messages' && 'Messages & Inquiries'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, {admin?.fullName || admin?.username}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Role: <span className="font-semibold capitalize">{admin?.role}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {activeView === 'dashboard' && (
            <DashboardStats
              stats={stats}
              revenueData={revenueData}
              loading={loading}
              onRefresh={fetchAllDashboardData}
            />
          )}
          {activeView === 'verifications' && <VehicleVerification />}
          {activeView === 'users' && <UsersManagement />}
          {activeView === 'register-rental' && <RegisteredVehicles />}
          {activeView === 'messages' && <AdminMessages />}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

