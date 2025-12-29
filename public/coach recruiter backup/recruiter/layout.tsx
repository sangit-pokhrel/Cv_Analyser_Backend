'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import RecruiterSidebar from '@/components/recruiter/RecruiterSidebar';
import RecruiterHeader from '@/components/recruiter/RecruiterHeader';
import api from '@/lib/baseapi';

export default function RecruiterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === '/recruiter/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [pathname, isLoginPage]);

  const checkAuth = async () => {
    try {
      const recruiterToken = sessionStorage.getItem('recruiterToken');
      
      if (!recruiterToken || recruiterToken !== 'recruiterisloggedin') {
        router.push('/recruiter/login');
        return;
      }

      const { data } = await api.get('/users/me');
      
      if (!data.user || data.user.role !== 'recruiter') {
        sessionStorage.removeItem('recruiterToken');
        router.push('/recruiter/login');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);

    } catch (error) {
      sessionStorage.removeItem('recruiterToken');
      router.push('/recruiter/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying recruiter access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <RecruiterSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <RecruiterHeader />
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