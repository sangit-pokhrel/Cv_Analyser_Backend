'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CoachSidebar from '@/components/coach/CoachSidebar';
import CoachHeader from '@/components/coach/CoachHeader';
import api from '@/lib/baseapi';

export default function CoachLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === '/coach/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    checkAuth();
  }, [pathname, isLoginPage]);

  const checkAuth = async () => {
    try {
      const coachToken = sessionStorage.getItem('coachToken');
      
      if (!coachToken || coachToken !== 'coachisloggedin') {
        console.log('No coach token in session storage');
        router.push('/coach/login');
        return;
      }

      const { data } = await api.get('/users/me');
      
      if (!data.user || data.user.role !== 'career_coach') {
        console.log('User is not coach:', data.user?.role);
        sessionStorage.removeItem('coachToken');
        router.push('/coach/login');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Auth check failed:', error);
      sessionStorage.removeItem('coachToken');
      router.push('/coach/login');
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying coach access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <CoachSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <CoachHeader />
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