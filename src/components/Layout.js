'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, isAuthenticated } from '@/lib/auth';
import Image from 'next/image';

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    
    // Set active tab based on pathname
    if (pathname === '/' || pathname === '/home') {
      setActiveTab('home');
    } else if (pathname === '/my-bookings') {
      setActiveTab('activity');
    } else if (pathname === '/settings') {
      setActiveTab('settings');
    }
  }, [pathname]);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        router.push('/home');
        break;
      case 'activity':
        router.push('/my-bookings');
        break;
      case 'settings':
        router.push('/settings');
        break;
    }
  };

  // Don't show bottom nav on auth pages and landing page
  const hideNav = pathname === '/login' || pathname === '/register' || pathname === '/landing' || pathname === '/';

  return (
    <div className="min-h-screen bg-white">
      {children}
      
      {!hideNav && isAuthenticated() && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
          <button
            onClick={() => handleTabPress('home')}
            className="flex flex-col items-center justify-center"
          >
            <Image
              src={activeTab === 'home' ? '/homes.png' : '/homeus.png'}
              alt="Home"
              width={26}
              height={26}
              className="object-contain"
            />
          </button>
          
          <button
            onClick={() => handleTabPress('activity')}
            className="flex flex-col items-center justify-center"
          >
            <Image
              src={activeTab === 'activity' ? '/activitys.png' : '/activityus.png'}
              alt="Activity"
              width={26}
              height={26}
              className="object-contain"
            />
          </button>
          
          <button
            onClick={() => handleTabPress('settings')}
            className="flex flex-col items-center justify-center"
          >
            <Image
              src={activeTab === 'settings' ? '/settings.png' : '/settingsus.png'}
              alt="Settings"
              width={26}
              height={26}
              className="object-contain"
            />
          </button>
        </div>
      )}
    </div>
  );
}

