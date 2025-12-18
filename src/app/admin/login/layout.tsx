'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Don't check auth on login page
    if (isLoginPage) {
      setIsLoading(false);
      setIsAuthenticated(true); // Allow login page to render
      return;
    }

    // Check authentication for all other pages
    checkAuth();
  }, [pathname, isLoginPage]);

  const checkAuth = async () => {
    try {
      // First check session storage
      const adminToken = sessionStorage.getItem('adminToken');
      
      if (!adminToken || adminToken !== 'adminisloggedin') {
        console.log('❌ No admin token in session storage');
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace('/admin/login');
        return;
      }

      console.log('✅ Session token found');

      // Get access token from cookie
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (!accessToken) {
        console.log('❌ No access token in cookie');
        sessionStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace('/admin/login');
        return;
      }

      console.log('✅ Access token found, verifying with API...');

      // Verify with API using the token
      const { data } = await axios.get(`${baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        withCredentials: true
      });

      const user = data.user || data;
      
      if (!user || user.role !== 'admin') {
        console.log('❌ User is not admin:', user?.role);
        sessionStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setIsLoading(false);
        router.replace('/admin/login');
        return;
      }

      console.log('✅ Admin verified:', user.email);
      
      // All checks passed
      setIsAuthenticated(true);
      setIsLoading(false);

    } catch (error: any) {
      console.error('❌ Auth check failed:', error.response?.data || error.message);
      sessionStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setIsLoading(false);
      router.replace('/admin/login');
    }
  };

  // Login page - render without auth check or layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - return null (will redirect via useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated - render admin layout
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}