'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';
import type { Submission } from '@/app/types/index';

export default function ReviewSubmissions() {
  const router = useRouter(); // kept as requested, though unused
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewing, setReviewing] = useState<boolean>(false);

  const [reviewData, setReviewData] = useState<{
    decision: 'approved' | 'rejected' | '';
    feedback: string;
    writtenScores: { answerId: string; points: number; notes: string }[];
  }>({
    decision: '',
    feedback: '',
    writtenScores: []
  });

  useEffect(() => {
    fetchSubmissions();
  }, [filter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/coach/submissions?reviewStatus=${filter}`);

      if (!data?.data) {
        setSubmissions([]);
        return;
      }

      setSubmissions(data.data as Submission[]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const viewSubmission = async (submissionId: string) => {
    try {
      const { data } = await api.get(`/coach/submissions/${submissionId}`);
      const submission = data?.data as Submission;

      if (!submission) {
        toast.error('Submission not found');
        return;
      }

      setSelectedSubmission(submission);

      const answers = submission.answers ?? [];
      const writtenScores = answers
        .filter(a => a.questionType === 'written')
        .map(a => ({
          answerId: a._id,
          points: a.coachScore ?? 0,
          notes: a.coachNotes ?? ''
        }));

      setReviewData({
        decision: '',
        feedback: '',
        writtenScores
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load submission');
    }
  };

  const submitReview = async () => {
    if (!reviewData.decision) {
      toast.error('Please select approve or reject');
      return;
    }

    if (!reviewData.feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }

    try {
      setReviewing(true);

      if (!selectedSubmission?._id) {
        toast.error('No submission selected');
        return;
      }

      await api.put(`/coach/submissions/${selectedSubmission._id}/review`, reviewData);
      toast.success(`Submission ${reviewData.decision}!`);

      setSelectedSubmission(null);
      fetchSubmissions();

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit review');
    } finally {
      setReviewing(false);
    }
  };

  const updateWrittenScore = (answerId: string, field: 'points' | 'notes', value: string | number) => {
    setReviewData(prev => ({
      ...prev,
      writtenScores: prev.writtenScores.map(score =>
        score.answerId === answerId ? { ...score, [field]: value } : score
      )
    }));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Review Submissions</h1>
        <p className="text-gray-600">Evaluate student assessments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected'] as const).map(status => (
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

      {/* Submissions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No {filter} submissions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map(submission => (
            <div
              key={submission._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {submission.student?.firstName ?? ''} {submission.student?.lastName ?? ''}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{submission.student?.email ?? ''}</p>
                  <p className="text-gray-700 mb-3">{submission.interviewRequest?.title ?? ''}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">MCQ Score:</span>
                      <span className={`px-3 py-1 rounded-full ${
                        (submission.mcqScore ?? 0) >= 70 ? 'bg-green-100 text-green-600' :
                        (submission.mcqScore ?? 0) >= 50 ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {submission.mcqScore ?? 0}%
                      </span>
                    </div>

                    <div><span className="font-bold">Total:</span> {submission.percentage ?? 0}%</div>
                    <div><span className="font-bold">Time:</span> {submission.timeTaken ?? 0} min</div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold">Submitted:</span>
                      <span>
                        {submission.submittedAt
                          ? new Date(submission.submittedAt).toLocaleString()
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => viewSubmission(submission._id)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 font-bold"
                >
                  {filter === 'pending' ? 'Review' : 'View'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between">
              <h2 className="text-2xl font-bold">Review Submission</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >✕</button>
            </div>

            <div className="p-6">
              {/* Student Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <p><strong>Student:</strong> {selectedSubmission.student?.firstName ?? ''} {selectedSubmission.student?.lastName ?? ''}</p>
                <p><strong>Assessment:</strong> {selectedSubmission.interviewRequest?.title ?? ''}</p>
                <p><strong>MCQ Score:</strong> {selectedSubmission.mcqScore ?? 0}% ({selectedSubmission.mcqCorrect ?? 0}/{selectedSubmission.mcqTotal ?? 0})</p>
                <p><strong>Time Taken:</strong> {selectedSubmission.timeTaken ?? 0} minutes</p>
              </div>

              {/* Answers */}
              <div className="space-y-4 mb-6">
                {(selectedSubmission.answers ?? []).map((answer, idx) => {
                  const question = selectedSubmission.interviewRequest?.questions?.find(
                    q => q._id === answer.questionId
                  );

                  return (
                    <div key={answer._id} className="border border-gray-200 rounded-xl p-4">
                      <p className="font-bold mb-2">Question {idx + 1} ({answer.questionType})</p>
                      <p className="mb-3">{question?.question ?? ''}</p>

                      {answer.questionType === 'mcq' && (
                        <>
                          <p className="text-sm"><strong>Student Answer:</strong> {answer.answer}</p>
                          <p className="text-sm"><strong>Correct Answer:</strong> {question?.correctAnswer ?? ''}</p>
                          <div className={`mt-2 px-3 py-1 rounded-full inline-block ${
                            answer.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </div>
                        </>
                      )}

                      {answer.questionType === 'written' && (
                        <>
                          <div className="bg-gray-50 p-3 rounded-lg mb-3">
                            <p className="text-sm whitespace-pre-wrap">{answer.answer}</p>
                          </div>

                          {filter === 'pending' && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-bold mb-1">Points</label>
                                <input
                                  type="number"
                                  className="w-full border border-gray-300 rounded-lg p-2"
                                  value={reviewData.writtenScores.find(s => s.answerId === answer._id)?.points ?? 0}
                                  onChange={(e) => updateWrittenScore(answer._id, 'points', Math.max(0, Math.min(parseInt(e.target.value), question?.points ?? 1)))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-bold mb-1">Notes</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-300 rounded-lg p-2"
                                  value={reviewData.writtenScores.find(s => s.answerId === answer._id)?.notes ?? ''}
                                  onChange={(e) => updateWrittenScore(answer._id, 'notes', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {filter === 'pending' && (
                <>
                  {/* Feedback */}
                  <div className="mb-6">
                    <label className="block font-bold mb-2">Feedback *</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-xl p-3"
                      rows={4}
                      value={reviewData.feedback}
                      onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                    />
                  </div>

                  {/* Decision */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setReviewData({ ...reviewData, decision: 'rejected' })}
                      className={`flex-1 py-3 rounded-xl font-bold ${
                        reviewData.decision === 'rejected'
                          ? 'bg-red-500 text-white'
                          : 'border-2 border-red-500 text-red-500 hover:bg-red-50'
                      }`}
                    >✗ Reject</button>

                    <button
                      onClick={() => setReviewData({ ...reviewData, decision: 'approved' })}
                      className={`flex-1 py-3 rounded-xl font-bold ${
                        reviewData.decision === 'approved'
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-green-500 text-green-500 hover:bg-green-50'
                      }`}
                    >✓ Approve & Schedule Interview</button>
                  </div>

                  {/* Submit */}
                  {reviewData.decision && (
                    <button
                      onClick={submitReview}
                      disabled={reviewing}
                      className="w-full mt-4 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50"
                    >
                      {reviewing ? 'Submitting...' : 'Submit Review'}
                    </button>
                  )}
                </>
              )}

              {filter !== 'pending' && selectedSubmission.coachFeedback && (
                <div className="p-4 bg-gray-50 rounded-xl mt-4">
                  <p className="font-bold mb-2">Coach Feedback:</p>
                  <p>{selectedSubmission.coachFeedback}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
