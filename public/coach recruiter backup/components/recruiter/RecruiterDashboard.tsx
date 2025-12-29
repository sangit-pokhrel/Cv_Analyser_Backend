'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import type { DashboardStats, Job, Application } from '../../app/types/index';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({});
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async (): Promise<void> => {
    try {
      const { data } = await api.get('/recruiter/dashboard');
      setStats(data.data.stats || {});
      setRecentJobs(data.data.recentJobs || []);
      setRecentApplications(data.data.recentApplications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Recruiter Dashboard</h1>
        <svg width="350" height="12" className="mt-2">
          <path d="M 0 6 Q 20 2, 40 6 T 80 6" stroke="#000" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="text-lg font-medium mb-1">Total Jobs</h3>
          <p className="text-4xl font-bold">{stats.totalJobs || 0}</p>
        </div>
        {/* Add more stat cards... */}
      </div>

      {/* Rest of dashboard content... */}
    </>
  );
}