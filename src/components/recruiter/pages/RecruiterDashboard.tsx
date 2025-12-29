'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function RecruiterDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/recruiter/dashboard');
      
      setStats(data.data.stats);
      setRecentApplications(data.data.recentApplications);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Recruiter Dashboard</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">💼</span>
            <span className="text-3xl font-bold">{stats?.totalJobs || 0}</span>
          </div>
          <p className="text-blue-100 text-sm">Total Jobs</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">✅</span>
            <span className="text-3xl font-bold">{stats?.activeJobs || 0}</span>
          </div>
          <p className="text-green-100 text-sm">Active Jobs</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">📝</span>
            <span className="text-3xl font-bold">{stats?.totalApplications || 0}</span>
          </div>
          <p className="text-purple-100 text-sm">Total Applications</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">⏳</span>
            <span className="text-3xl font-bold">{stats?.pendingApplications || 0}</span>
          </div>
          <p className="text-orange-100 text-sm">Pending Review</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">📹</span>
            <span className="text-3xl font-bold">{stats?.interviewsScheduled || 0}</span>
          </div>
          <p className="text-pink-100 text-sm">Interviews</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => router.push('/recruiter/jobs/create')}
          className="bg-blue-500 text-white p-6 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-3xl">➕</span>
          Post New Job
        </button>

        <button
          onClick={() => router.push('/recruiter/applications')}
          className="bg-orange-500 text-white p-6 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-3xl">📋</span>
          Review Applications
        </button>

        <button
          onClick={() => router.push('/recruiter/jobs')}
          className="bg-green-500 text-white p-6 rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-3xl">💼</span>
          My Jobs
        </button>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Applications</h2>
          <button
            onClick={() => router.push('/recruiter/applications')}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            View All →
          </button>
        </div>

        {recentApplications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No applications yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-bold">Applicant</th>
                  <th className="text-left p-3 font-bold">Job</th>
                  <th className="text-left p-3 font-bold">Applied</th>
                  <th className="text-left p-3 font-bold">Status</th>
                  <th className="text-left p-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map(app => (
                  <tr key={app._id} className="border-t border-gray-200">
                    <td className="p-3">
                      <div className="font-bold">{app.applicant?.firstName} {app.applicant?.lastName}</div>
                      <div className="text-sm text-gray-600">{app.applicant?.email}</div>
                    </td>
                    <td className="p-3">{app.job?.title}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        app.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        app.status === 'interview' ? 'bg-blue-100 text-blue-600' :
                        app.status === 'offered' ? 'bg-green-100 text-green-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => router.push(`/recruiter/applications/${app._id}`)}
                        className="text-blue-500 hover:text-blue-600 font-bold text-sm"
                      >
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
