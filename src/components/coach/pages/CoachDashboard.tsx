'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import type { DashboardStats, Submission, VideoInterview } from '@/app/types/index';

export default function CoachDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalInterviews: 0,
    pendingSubmissions: 0,
    upcomingInterviews: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<VideoInterview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await api.get('/coach/dashboard');
      
      setStats(data.data.stats || {});
      setRecentSubmissions(data.data.recentSubmissions || []);
      setUpcomingInterviews(data.data.upcomingInterviews || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Career Coach Dashboard</h1>
        <svg width="350" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-medium mb-1">Total Students</h3>
          <p className="text-4xl font-bold">{stats.totalStudents || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-medium mb-1">Total Assessments</h3>
          <p className="text-4xl font-bold">{stats.totalInterviews || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="text-lg font-medium mb-1">Pending Reviews</h3>
          <p className="text-4xl font-bold">{stats.pendingSubmissions || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">📹</div>
          <h3 className="text-lg font-medium mb-1">Upcoming Interviews</h3>
          <p className="text-4xl font-bold">{stats.upcomingInterviews || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => router.push('/coach/interviews/create')}
          className="bg-blue-500 text-white p-6 rounded-2xl hover:bg-blue-600 transition-colors text-left shadow-sm"
        >
          <div className="text-3xl mb-2">➕</div>
          <div className="font-bold text-lg">Create Assessment</div>
          <div className="text-blue-100 text-sm mt-1">Send assessment to students</div>
        </button>

        <button
          onClick={() => router.push('/coach/submissions')}
          className="bg-green-500 text-white p-6 rounded-2xl hover:bg-green-600 transition-colors text-left shadow-sm"
        >
          <div className="text-3xl mb-2">✓</div>
          <div className="font-bold text-lg">Review Submissions</div>
          <div className="text-green-100 text-sm mt-1">{stats.pendingSubmissions || 0} pending</div>
        </button>

        <button
          onClick={() => router.push('/coach/students')}
          className="bg-purple-500 text-white p-6 rounded-2xl hover:bg-purple-600 transition-colors text-left shadow-sm"
        >
          <div className="text-3xl mb-2">👥</div>
          <div className="font-bold text-lg">My Students</div>
          <div className="text-purple-100 text-sm mt-1">View all students</div>
        </button>
      </div>

      {recentSubmissions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Submissions</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-bold">Student</th>
                    <th className="text-left p-4 font-bold">Assessment</th>
                    <th className="text-left p-4 font-bold">Score</th>
                    <th className="text-left p-4 font-bold">Status</th>
                    <th className="text-left p-4 font-bold">Date</th>
                    <th className="text-left p-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission: Submission) => (
                    <tr 
                      key={submission._id} 
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">{submission.student.firstName} {submission.student.lastName}</td>
                      <td className="p-4">{submission.interviewRequest.title}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-xl font-medium ${
                          submission.percentage >= 70 ? 'bg-green-100 text-green-600' :
                          submission.percentage >= 50 ? 'bg-yellow-100 text-yellow-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {submission.percentage}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-xl font-medium ${
                          submission.reviewStatus === 'approved' ? 'bg-green-100 text-green-600' :
                          submission.reviewStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {submission.reviewStatus}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => router.push(`/coach/submissions/${submission._id}`)}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {upcomingInterviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Video Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingInterviews.map((interview: VideoInterview) => (
              <div 
                key={interview._id}
                onClick={() => router.push(`/coach/video-interviews/${interview._id}`)}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              >
                <h3 className="font-bold text-lg mb-2">
                  {interview.student.firstName} {interview.student.lastName}
                </h3>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{interview.scheduledTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{interview.duration} minutes</span>
                  </div>
                </div>
                <span className="text-blue-500 hover:text-blue-700 font-medium text-sm">
                  View Details →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}