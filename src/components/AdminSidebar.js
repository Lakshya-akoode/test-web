'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function AdminSidebar({ activeView, setActiveView }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Stats',
      icon: '📊',
      path: '/admin/dashboard'
    },
    {
      id: 'verifications',
      label: 'Vehicle Verifications',
      icon: '✅',
      path: '/admin/dashboard?view=verifications'
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      path: '/admin/dashboard?view=users'
    },
    {
      id: 'register-rental',
      label: 'Registered Vehicles',
      icon: '🚗',
      path: '/admin/dashboard?view=register-rental'
    }
  ];

  const handleMenuClick = (item) => {
    if (item.id === 'dashboard') {
      router.push('/admin/dashboard');
    } else {
      setActiveView(item.id);
      router.push(`/admin/dashboard?view=${item.id}`);
    }
  };

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen fixed left-0 top-0 pt-16">
      <nav className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Panel</h2>
          <div className="h-1 w-12 bg-blue-600 rounded"></div>
        </div>
        
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeView === item.id || (item.id === 'dashboard' && !activeView);
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}



