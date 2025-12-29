'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import RecruiterSidebar from '@/components/recruiter/RecruiterSidebar';
import RecruiterHeader from '@/components/recruiter/RecruiterHeader';
import api from '@/lib/baseapi';

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/recruiter/login') {
      setIsLoading(false);
      return;
    }

    const token = sessionStorage.getItem('recruiterToken');
    if (!token) {
      router.push('/recruiter/login');
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  if (pathname === '/recruiter/login') return <>{children}</>;
  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <RecruiterSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <RecruiterHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
