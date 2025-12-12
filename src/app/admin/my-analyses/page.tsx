
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import MyAnalyses from '@/components/admin/pages/MyAnalyses';

export default function MyAnalysesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminToken = sessionStorage.getItem('adminToken');
    
    if (!adminToken) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <MyAnalyses />;
}