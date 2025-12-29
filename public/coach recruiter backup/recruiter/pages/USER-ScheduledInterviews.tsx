'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function UserScheduledInterviews() {
  const router = useRouter();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get('/user/interviews/scheduled');
      setInterviews(data.data);
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const joinInterview = async (interviewId) => {
    try {
      const { data } = await api.post(`/user/interviews/video/${interviewId}/join`);
      window.open(data.data.meetingLink, '_blank');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Cannot join yet');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Scheduled Video Interviews</h1>
        <p className="text-gray-600">Join your upcoming mock interviews</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No scheduled interviews</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map(interview => (
            <div key={interview._id} className="bg-white border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Video Interview</h3>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  {interview.scheduledTime}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Coach: </span>
                  <span className="font-bold">{interview.coach?.firstName} {interview.coach?.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date: </span>
                  <span className="font-bold">{new Date(interview.scheduledDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Duration: </span>
                  <span className="font-bold">{interview.duration} minutes</span>
                </div>
              </div>

              {interview.notesForStudent && (
                <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                  {interview.notesForStudent}
                </div>
              )}

              <button
                onClick={() => joinInterview(interview._id)}
                className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 font-bold"
              >
                Join Video Call
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
