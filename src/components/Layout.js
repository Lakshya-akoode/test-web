'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, isAuthenticated } from '@/lib/auth';
import Image from 'next/image';

import Navbar from './Navbar';

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
    </div>
  );
}

