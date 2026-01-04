'use client';

import { usePathname } from 'next/navigation';
import Layout from "@/components/Layout";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'insert-your-google-client-id-here'}>
      {isAdminPage ? children : <Layout>{children}</Layout>}
    </GoogleOAuthProvider>
  );
}










