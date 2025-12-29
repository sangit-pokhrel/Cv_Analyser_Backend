'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function TakeAssessment() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    accessInterview();
  }, [token]);

  useEffect(() => {
    if (started && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            autoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [started, timeRemaining]);

  const accessInterview = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/user/interviews/${token}`);
      
      setInterview(data.data.interview);
      setTimeRemaining(data.data.interview.timeLimit * 60);
      
      // Initialize empty answers
      const initialAnswers = {};
      data.data.interview.questions.forEach((q, idx) => {
        initialAnswers[idx] = '';
      });
      setAnswers(initialAnswers);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || 'Failed to access assessment');
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = () => {
    setStarted(true);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers({
      ...answers,
      [questionIndex]: value
    });
  };

  const autoSubmit = () => {
    toast.warning('Time is up! Submitting your answers...');
    submitAssessment();
  };

  const submitAssessment = async () => {
    try {
      setSubmitting(true);

      const payload = {
        answers: interview.questions.map((q, idx) => ({
          questionId: q._id,
          questionType: q.type,
          answer: answers[idx] || ''
        }))
      };

      await api.post(`/user/interviews/${interview._id}/submit`, payload);

      toast.success('Assessment submitted successfully!');
      router.push('/user/interviews');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Accessing assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 max-w-lg text-center">
          <div className="text-6xl mb-4">⛔</div>
          <h2 className="text-2xl font-bold mb-4">Assessment Unavailable</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/user/interviews')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-4">{interview.title}</h1>
          {interview.description && (
            <p className="text-gray-600 mb-6">{interview.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Type</div>
              <div className="font-bold capitalize">{interview.assessmentType}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Questions</div>
              <div className="font-bold">{interview.questions.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Time Limit</div>
              <div className="font-bold">{interview.timeLimit} minutes</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Total Points</div>
              <div className="font-bold">{interview.totalPoints}</div>
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-3">⚠️ Important Instructions:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• This assessment can only be opened once</li>
              <li>• Timer will start immediately when you begin</li>
              <li>• You cannot pause or restart the assessment</li>
              <li>• Assessment will auto-submit when time expires</li>
              <li>• Make sure you have stable internet connection</li>
              <li>• Do not refresh or close this page</li>
            </ul>
          </div>

          <button
            onClick={startAssessment}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600"
          >
            I Understand - Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const question = interview.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">{interview.title}</h2>
            <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {interview.questions.length}</p>
          </div>
          <div className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}`}>
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div
            className="bg-blue-500 h-1 transition-all"
            style={{ width: `${((currentQuestion + 1) / interview.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
              {question.type === 'mcq' ? 'Multiple Choice' : 'Written Answer'}
            </span>
          </div>

          <h3 className="text-xl font-bold mb-6">{question.question}</h3>

          {question.type === 'mcq' && (
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    answers[currentQuestion] === String.fromCharCode(65 + idx)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={String.fromCharCode(65 + idx)}
                    checked={answers[currentQuestion] === String.fromCharCode(65 + idx)}
                    onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                    className="w-5 h-5 text-blue-500"
                  />
                  <span className="ml-3 flex-1">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'written' && (
            <div>
              <textarea
                className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-blue-500 focus:outline-none"
                rows="10"
                placeholder="Type your answer here..."
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-2">
                Expected length: {question.expectedLength} words
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {currentQuestion < interview.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitAssessment}
              disabled={submitting}
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>

        {/* Answer Status */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm font-bold mb-2">Answer Progress:</p>
          <div className="flex flex-wrap gap-2">
            {interview.questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-10 h-10 rounded-lg font-bold text-sm ${
                  idx === currentQuestion
                    ? 'bg-blue-500 text-white'
                    : answers[idx]
                    ? 'bg-green-100 text-green-600 border border-green-300'
                    : 'bg-gray-100 text-gray-400 border border-gray-300'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
