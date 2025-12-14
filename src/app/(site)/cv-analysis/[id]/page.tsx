'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface AnalysisResult {
  _id: string;
  user: string;
  cvFileUrl: string;
  status: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  skillsDetected: string[];
  extractedData: {
    experience: string;
    education: string[];
    certifications: string[];
    languages: string[];
    totalYearsExperience: number;
  };
  analyzedAt: string;
  createdAt: string;
}

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.id as string;
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchResults();
  }, [analysisId]);

  const fetchResults = async () => {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      setError('No authentication token found. Please login.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/cv/analyses/${analysisId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to fetch results');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/cv-analysis"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            ← Back to Upload
          </Link>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const scoreColor = result.overallScore >= 80 ? 'from-green-500 to-emerald-600' :
                     result.overallScore >= 60 ? 'from-blue-500 to-indigo-600' :
                     result.overallScore >= 40 ? 'from-yellow-500 to-orange-600' :
                     'from-red-500 to-pink-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link
                href="/cv-analysis"
                className="text-blue-600 hover:text-blue-700 font-medium mb-2 inline-block"
              >
                ← New Analysis
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                CV Analysis Results
              </h1>
              <p className="text-gray-600">
                Analyzed on {new Date(result.analyzedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className={`bg-gradient-to-r ${scoreColor} rounded-2xl shadow-2xl p-8 mb-8 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-medium opacity-90 mb-2">Overall CV Score</p>
              <p className="text-6xl md:text-7xl font-bold">{result.overallScore}</p>
              <p className="text-xl mt-2">out of 100</p>
            </div>
            <div className="text-6xl md:text-8xl">
              {result.overallScore >= 80 ? '🌟' :
               result.overallScore >= 60 ? '✨' :
               result.overallScore >= 40 ? '💫' : '📝'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                ✅
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Strengths</h2>
            </div>
            <ul className="space-y-3">
              {result.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-green-600 font-bold flex-shrink-0">{i + 1}.</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Areas to Improve</h2>
            </div>
            <ul className="space-y-3">
              {result.weaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <span className="text-orange-600 font-bold flex-shrink-0">{i + 1}.</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              💡
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI Recommendations</h2>
          </div>
          <div className="space-y-3">
            {result.recommendations.map((item, i) => (
              <div key={i} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition-colors">
                <p className="font-medium text-blue-900 mb-1">Recommendation {i + 1}</p>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Detected */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Skills Detected</h2>
              <p className="text-gray-600">{result.skillsDetected.length} skills found</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.skillsDetected.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-medium hover:shadow-md transition-shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Extracted Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
              📋
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Extracted Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Experience Summary</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {result.extractedData.experience || 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Total Experience</h3>
              <p className="text-3xl font-bold text-blue-600 bg-blue-50 p-4 rounded-lg">
                {result.extractedData.totalYearsExperience || 0} years
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Education</h3>
              <ul className="space-y-2">
                {result.extractedData.education?.length > 0 ? (
                  result.extractedData.education.map((edu, i) => (
                    <li key={i} className="bg-gray-50 p-3 rounded-lg text-gray-700">
                      🎓 {edu}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No education information found</li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {result.extractedData.languages?.length > 0 ? (
                  result.extractedData.languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      🌐 {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No languages specified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/cv-analysis"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Analyze Another CV
          </Link>
          <Link
            href="/jobs/recommendations"
            className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
          >
            View Job Recommendations →
          </Link>
        </div>
      </div>
    </div>
  );
}