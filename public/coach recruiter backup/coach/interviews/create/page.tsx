'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';
import type { Student, Question } from '@/app/types/index';


export default function CreateInterviewAssessment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  interface Question {
    id: number;
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    expectedLength: number;
    points: number;
  }

  const [formData, setFormData] = useState<{
    studentId: string;
    title: string;
    description: string;
    assessmentType: string;
    timeLimit: number;
    expiryDays: number;
    questions: Question[];
  }>({
    studentId: '',
    title: '',
    description: '',
    assessmentType: 'both',
    timeLimit: 45,
    expiryDays: 7,
    questions: []
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/coach/students');
      setStudents(data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: '',
      options: type === 'mcq' ? ['', '', '', ''] : [],
      correctAnswer: type === 'mcq' ? 'A' : '',
      expectedLength: type === 'written' ? 200 : 0,
      points: 1
    };

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (id: number, field: string, value: string | number) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    });
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
          : q
      )
    });
  };

  const removeQuestion = (id: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== id)
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Validation
    if (!formData.studentId) {
      toast.error('Please select a student');
      return;
    }

    if (!formData.title) {
      toast.error('Please enter assessment title');
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Validate questions
    for (const q of formData.questions) {
      if (!q.question.trim()) {
        toast.error('All questions must have text');
        return;
      }

      if (q.type === 'mcq') {
        if (q.options.some(opt => !opt.trim())) {
          toast.error('All MCQ options must be filled');
          return;
        }
        if (!q.correctAnswer) {
          toast.error('Please select correct answer for all MCQ questions');
          return;
        }
      }
    }

    try {
      setLoading(true);

      const payload = {
        studentId: formData.studentId,
        title: formData.title,
        description: formData.description,
        assessmentType: formData.assessmentType,
        timeLimit: formData.timeLimit,
        expiryDays: formData.expiryDays,
        questions: formData.questions.map(q => ({
          type: q.type,
          question: q.question,
          options: q.type === 'mcq' ? q.options : undefined,
          correctAnswer: q.type === 'mcq' ? q.correctAnswer : undefined,
          expectedLength: q.type === 'written' ? q.expectedLength : undefined,
          points: q.points
        }))
      };

      await api.post('/coach/interviews/create', payload);

      toast.success('Assessment created and sent to student!');
      router.push('/coach/interviews');

    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to create assessment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Interview Assessment</h1>
        <p className="text-gray-600">Send MCQ and written questions to students</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        
        {/* Student Selection */}
        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Select Student *</label>
          {loadingStudents ? (
            <p className="text-gray-500">Loading students...</p>
          ) : (
            <select
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              required
            >
              <option value="">Choose a student...</option>
              {students.map(student => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} ({student.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Assessment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold mb-2">Assessment Title *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="e.g., Frontend Developer Assessment"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Assessment Type *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.assessmentType}
              onChange={(e) => setFormData({ ...formData, assessmentType: e.target.value })}
            >
              <option value="mcq">MCQ Only</option>
              <option value="written">Written Only</option>
              <option value="both">Both MCQ & Written</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Time Limit (minutes) *</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
              min="15"
              max="180"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Link Expiry (days) *</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.expiryDays}
              onChange={(e) => setFormData({ ...formData, expiryDays: parseInt(e.target.value) || 0 })}
              min="1"
              max="30"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3"
            rows={3}
            placeholder="Additional instructions for the student..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Questions Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Questions ({formData.questions.length})</h3>
            <div className="flex gap-2">
              {(formData.assessmentType === 'mcq' || formData.assessmentType === 'both') && (
                <button
                  type="button"
                  onClick={() => addQuestion('mcq')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                >
                  + Add MCQ
                </button>
              )}
              {(formData.assessmentType === 'written' || formData.assessmentType === 'both') && (
                <button
                  type="button"
                  onClick={() => addQuestion('written')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                >
                  + Add Written
                </button>
              )}
            </div>
          </div>

          {formData.questions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No questions added yet</p>
              <p className="text-sm text-gray-400">Click "Add MCQ" or "Add Written" to create questions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-300 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                      Question {index + 1} - {question.type === 'mcq' ? 'MCQ' : 'Written'}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">Question Text *</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg p-3"
                      rows={2}
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      required
                    />
                  </div>

                  {question.type === 'mcq' && (
                    <>
                      <div className="mb-4 grid grid-cols-2 gap-3">
                        {question.options.map((option, idx) => (
                          <div key={idx}>
                            <label className="block text-xs font-bold mb-1">Option {String.fromCharCode(65 + idx)}</label>
                            <input
                              type="text"
                              className="w-full border border-gray-300 rounded-lg p-2"
                              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                              value={option}
                              onChange={(e) => updateOption(question.id, idx, e.target.value)}
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="text-sm font-bold">Correct Answer:</label>
                        <select
                          className="border border-gray-300 rounded-lg p-2"
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                        </select>
                      </div>
                    </>
                  )}

                  {question.type === 'written' && (
                    <div>
                      <label className="block text-sm font-bold mb-2">Expected Length (words)</label>
                      <input
                        type="number"
                        className="w-40 border border-gray-300 rounded-lg p-2"
                        value={question.expectedLength}
                        onChange={(e) => updateQuestion(question.id, 'expectedLength', parseInt(e.target.value))}
                        min="50"
                        max="1000"
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-bold mb-2">Points</label>
                    <input
                      type="number"
                      className="w-24 border border-gray-300 rounded-lg p-2"
                      value={question.points}
                      onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || formData.questions.length === 0}
          >
            {loading ? 'Creating...' : 'Create & Send Assessment'}
          </button>
        </div>

        {formData.questions.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-600">
              <strong>📧 Email will be sent to student with:</strong>
              <br />• One-time assessment link (expires in {formData.expiryDays} days)
              <br />• {formData.questions.length} questions ({formData.questions.filter(q => q.type === 'mcq').length} MCQ, {formData.questions.filter(q => q.type === 'written').length} Written)
              <br />• {formData.timeLimit} minutes time limit
              <br />• ⚠️ Link can only be opened once for security
            </p>
          </div>
        )}
      </form>
    </>
  );
}
