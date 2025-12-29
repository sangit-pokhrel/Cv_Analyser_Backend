'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function UserInterviewDashboard() {
  const router = useRouter();
  const [pendingInterviews, setPendingInterviews] = useState([]);
  const [scheduledInterviews, setScheduledInterviews] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [pendingRes, scheduledRes, submissionsRes] = await Promise.all([
        api.get('/user/interviews/pending'),
        api.get('/user/interviews/scheduled?status=scheduled'),
        api.get('/user/interviews/submissions')
      ]);

      setPendingInterviews(pendingRes.data.data);
      setScheduledInterviews(scheduledRes.data.data);
      setSubmissions(submissionsRes.data.data);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Interviews & Assessments</h1>
        <p className="text-gray-600">Take assessments and join scheduled interviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6">
          <div className="text-4xl mb-2">📝</div>
          <div className="text-3xl font-bold">{pendingInterviews.length}</div>
          <div className="text-orange-100 text-sm">Pending Assessments</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
          <div className="text-4xl mb-2">⏳</div>
          <div className="text-3xl font-bold">{submissions.filter(s => s.reviewStatus === 'pending').length}</div>
          <div className="text-blue-100 text-sm">Awaiting Review</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
          <div className="text-4xl mb-2">📹</div>
          <div className="text-3xl font-bold">{scheduledInterviews.length}</div>
          <div className="text-green-100 text-sm">Scheduled Calls</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
          <div className="text-4xl mb-2">✓</div>
          <div className="text-3xl font-bold">{submissions.filter(s => s.reviewStatus === 'approved').length}</div>
          <div className="text-purple-100 text-sm">Completed</div>
        </div>
      </div>

      {/* Pending Assessments */}
      {pendingInterviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">⚡ Action Required: Pending Assessments</h2>
          <div className="grid grid-cols-1 gap-4">
            {pendingInterviews.map(interview => (
              <div
                key={interview._id}
                className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{interview.title}</h3>
                    <p className="text-gray-600 mb-3">{interview.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Type</span>
                        <p className="font-bold capitalize">{interview.assessmentType}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Questions</span>
                        <p className="font-bold">{interview.questions.length}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Time Limit</span>
                        <p className="font-bold">{interview.timeLimit} minutes</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Expires</span>
                        <p className="font-bold">{new Date(interview.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="bg-orange-100 border border-orange-300 rounded-lg p-3 mb-4">
                      <p className="text-sm text-orange-700">
                        <strong>⚠️ Important:</strong> This assessment link can only be opened once! 
                        Once you click "Start Assessment", a timer will begin and you cannot pause or restart.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push(`/user/interviews/${interview.accessToken}`)}
                      className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 text-lg"
                    >
                      🚀 Start Assessment
                    </button>
                  </div>

                  <div className="ml-4">
                    <div className="bg-white rounded-xl p-4 text-center">
                      <div className="text-sm text-gray-500 mb-1">Coach</div>
                      <div className="font-bold">{interview.coach?.firstName}</div>
                      <div className="font-bold">{interview.coach?.lastName}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Video Interviews */}
      {scheduledInterviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📹 Upcoming Video Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledInterviews.map(interview => (
              <div
                key={interview._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">Video Interview</h3>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                    {interview.scheduledTime}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Coach:</span>
                    <span className="font-bold">{interview.coach?.firstName} {interview.coach?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-bold">{new Date(interview.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-bold">{interview.duration} minutes</span>
                  </div>
                  {interview.submission && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Your Score:</span>
                      <span className="font-bold">{interview.submission.percentage}%</span>
                    </div>
                  )}
                </div>

                {interview.notesForStudent && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-600">{interview.notesForStudent}</p>
                  </div>
                )}

                <button
                  onClick={() => router.push(`/user/interviews/video/${interview._id}`)}
                  className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 font-bold"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Submissions */}
      {submissions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">📊 Past Assessments</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-bold">Assessment</th>
                  <th className="text-left p-4 font-bold">Score</th>
                  <th className="text-left p-4 font-bold">Status</th>
                  <th className="text-left p-4 font-bold">Submitted</th>
                  <th className="text-left p-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(submission => (
                  <tr key={submission._id} className="border-t border-gray-200">
                    <td className="p-4">{submission.interviewRequest?.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        submission.percentage >= 70 ? 'bg-green-100 text-green-600' :
                        submission.percentage >= 50 ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {submission.percentage}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        submission.reviewStatus === 'approved' ? 'bg-green-100 text-green-600' :
                        submission.reviewStatus === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>
                        {submission.reviewStatus}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => router.push(`/user/interviews/results/${submission._id}`)}
                        className="text-blue-500 hover:text-blue-600 font-bold text-sm"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {pendingInterviews.length === 0 && scheduledInterviews.length === 0 && submissions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold mb-2">No Interviews Yet</h3>
          <p className="text-gray-600">Your coach will send you assessment invitations via email</p>
        </div>
      )}
    </>
  );
}
