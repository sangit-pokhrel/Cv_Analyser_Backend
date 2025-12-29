'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';
import type { VideoInterview } from '@/app/types/index';

export default function CoachVideoInterviews() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<VideoInterview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'scheduled' | 'completed' | 'cancelled'>('scheduled');

  useEffect(() => {
    fetchInterviews();
  }, [filter]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/coach/video-interviews?status=${filter}`);

      if (!data?.data) {
        setInterviews([]);
        return;
      }

      setInterviews(data.data as VideoInterview[]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const cancelInterview = async (interviewId: string) => {
    const ok = window.confirm('Are you sure you want to cancel this interview?');
    if (!ok) return;

    try {
      await api.delete(`/coach/video-interviews/${interviewId}/cancel`, {
        data: { reason: 'Rescheduling needed' }
      });
      toast.success('Interview cancelled');
      fetchInterviews();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to cancel interview');
    }
  };

  const markComplete = async (interviewId: string, result: 'pass' | 'fail') => {
    try {
      await api.put(`/coach/video-interviews/${interviewId}`, {
        status: 'completed',
        result,
        resultNotes: result === 'pass' ? 'Good performance' : 'Needs improvement'
      });
      toast.success('Interview marked as complete');
      fetchInterviews();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update interview');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Video Interviews</h1>
        <p className="text-gray-600">Manage scheduled mock interviews</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['scheduled', 'completed', 'cancelled'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-xl font-bold capitalize ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No {filter} interviews</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map(interview => (
            <div key={interview._id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">
                  {interview.student.firstName} {interview.student.lastName}
                </h3>
                <span className="px-3 py-1 rounded-full text-sm">
                  {interview.status}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div><span className="text-gray-500">Date:</span> <b>{new Date(interview.scheduledDate).toLocaleDateString()}</b></div>
                <div><span className="text-gray-500">Time:</span> <b>{interview.scheduledTime}</b></div>
                <div><span className="text-gray-500">Duration:</span> <b>{interview.duration} min</b></div>

                {interview.submission && (
                  <div><span className="text-gray-500">Assessment Score:</span> <b>{interview.submission.percentage}%</b></div>
                )}
              </div>

              {filter === 'scheduled' && interview.meetingLink && (
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(interview.meetingLink, '_blank')}
                    className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 font-bold"
                  >
                    Join Call
                  </button>

                  <button
                    onClick={() => cancelInterview(interview._id)}
                    className="px-4 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {filter === 'completed' && interview.result && (
                <div className={`p-3 rounded-xl ${
                  interview.result === 'pass' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  Result: {interview.result} - {interview.resultNotes ?? ''}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => markComplete(interview._id, 'pass')} className="bg-green-500 text-white px-3 py-1 rounded-lg">Pass</button>
                    <button onClick={() => markComplete(interview._id, 'fail')} className="bg-red-500 text-white px-3 py-1 rounded-lg">Fail</button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </>
  );
}
