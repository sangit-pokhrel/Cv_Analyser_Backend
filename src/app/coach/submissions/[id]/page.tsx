'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';
import type { Submission } from '@/types';

export default function SubmissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchSubmission(params.id as string);
    }
  }, [params.id]);

  const fetchSubmission = async (id: string) => {
    try {
      const { data } = await api.get(`/coach/submissions/${id}`);
      setSubmission(data.data || data.submission);
    } catch (error: any) {
      toast.error('Failed to load submission');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/coach/submissions/${params.id}/review`, {
        reviewStatus: status,
        feedback: reviewNotes
      });
      toast.success(`Submission ${status}`);
      router.back();
    } catch (error: any) {
      toast.error('Failed to review submission');
    }
  };

  if (loading || !submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-6 text-green-600 hover:underline">
        ← Back to Submissions
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Review Submission</h1>
          <p className="text-gray-600">
            Student: {typeof submission.student === 'object' ? 
              `${submission.student.firstName} ${submission.student.lastName}` : 
              'Unknown Student'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600">MCQ Score</p>
            <p className="text-2xl font-bold">{submission.mcqScore}/{submission.interviewRequest?.totalPoints || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Written Score</p>
            <p className="text-2xl font-bold">{submission.writtenScore}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Total Percentage</p>
            <p className="text-2xl font-bold">{submission.percentage}%</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2">Review Notes</label>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full border-2 rounded-xl p-3 h-32"
            placeholder="Add your review notes..."
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleReview('approved')}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleReview('rejected')}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
