
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Applications from '@/components/user/pages/Applications';
import { useAuth } from '@/hooks/useAuth';
export default function ApplicationsPage() {
  const router = useRouter();
  const { isLoading } = useAuth();



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

  return <Applications />;
}