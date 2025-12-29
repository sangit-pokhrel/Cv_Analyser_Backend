'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function CoachDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/coach/dashboard');
      
      setStats(data.data.stats);
      setRecentSubmissions(data.data.recentSubmissions);
      setUpcomingInterviews(data.data.upcomingInterviews);
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Career Coach Dashboard</p>
        <svg width="350" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">👥</span>
            <span className="text-3xl font-bold">{stats?.assignedStudents || 0}</span>
          </div>
          <p className="text-blue-100 text-sm">Assigned Students</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">📝</span>
            <span className="text-3xl font-bold">{stats?.activeInterviews || 0}</span>
          </div>
          <p className="text-orange-100 text-sm">Active Assessments</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">⏳</span>
            <span className="text-3xl font-bold">{stats?.pendingReviews || 0}</span>
          </div>
          <p className="text-purple-100 text-sm">Pending Reviews</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">📹</span>
            <span className="text-3xl font-bold">{stats?.scheduledCalls || 0}</span>
          </div>
          <p className="text-green-100 text-sm">Scheduled Calls</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-4xl">📚</span>
            <span className="text-3xl font-bold">{stats?.activeAssignments || 0}</span>
          </div>
          <p className="text-pink-100 text-sm">Active Assignments</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => router.push('/coach/interviews/create')}
          className="bg-blue-500 text-white p-6 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-3xl">➕</span>
          Create Assessment
        </button>

        <button
          onClick={() => router.push('/coach/submissions')}
          className="bg-orange-500 text-white p-6 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-3xl">📝</span>
          Review Submissions
        </button>

        <button
          onClick={() => router.push('/coach/video-interviews')}
          className="bg-green-500 text-white p-6 rounded-2xl font-bold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-3xl">📅</span>
          Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Submissions</h2>
            <button
              onClick={() => router.push('/coach/submissions')}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {recentSubmissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending submissions</p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission._id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => router.push(`/coach/submissions/${submission._id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">
                      {submission.student?.firstName} {submission.student?.lastName}
                    </p>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                      Pending Review
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{submission.interviewRequest?.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>MCQ: {submission.mcqScore}%</span>
                    <span>Time: {submission.timeTaken} min</span>
                    <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Upcoming Interviews</h2>
            <button
              onClick={() => router.push('/coach/video-interviews')}
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {upcomingInterviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No scheduled interviews</p>
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">
                      {interview.student?.firstName} {interview.student?.lastName}
                    </p>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {interview.scheduledTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>📅 {new Date(interview.scheduledDate).toLocaleDateString()}</span>
                    <span>⏱️ {interview.duration} min</span>
                  </div>
                  {interview.submission && (
                    <div className="mt-2 text-xs text-gray-500">
                      Assessment Score: {interview.submission.percentage}%
                    </div>
                  )}
                  <button
                    onClick={() => router.push(`/coach/video-interviews/${interview._id}`)}
                    className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
