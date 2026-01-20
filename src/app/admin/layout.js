'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // If not on login page and not authenticated, redirect to login
    if (!isLoginPage && !isAdminAuthenticated()) {
      router.push('/admin/login');
    }
    // If on login page and already authenticated, redirect to dashboard
    if (isLoginPage && isAdminAuthenticated()) {
      router.push('/admin/dashboard');
    }
  }, [router, pathname, isLoginPage]);

  return <>{children}</>;
}










