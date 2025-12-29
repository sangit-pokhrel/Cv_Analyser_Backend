'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function VideoInterviewDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchInterview(params.id as string);
    }
  }, [params.id]);

  const fetchInterview = async (id: string) => {
    try {
      const { data } = await api.get(`/coach/video-interviews/${id}`);
      setInterview(data.data || data.interview);
    } catch (error: any) {
      toast.error('Failed to load interview');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !interview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-6 text-green-600 hover:underline">
        ← Back to Video Interviews
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">Video Interview Details</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Student</label>
            <p className="text-lg font-bold">
              {interview.student?.firstName} {interview.student?.lastName}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Scheduled Date & Time</label>
            <p className="text-lg">{interview.scheduledDate} at {interview.scheduledTime}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Duration</label>
            <p className="text-lg">{interview.duration} minutes</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Meeting Link</label>
            <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {interview.meetingLink || 'Not available'}
            </a>
          </div>
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              interview.status === 'completed' ? 'bg-green-100 text-green-800' : 
              interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {interview.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
