'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

interface JobRecommendation {
  _id: string;
  matchScore: number;
  rank: number;
  status: string;
  matchingCriteria: {
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    matchedSkills: string[];
    missingSkills: string[];
  };
  job: {
    _id: string;
    title: string;
    companyName: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    jobType: string;
    experienceLevel: string;
    requiredSkills: string[];
    description: string;
    postedDate: string;
    deadline?: string;
  };
  cvAnalysis: {
    _id: string;
    overallScore: number;
  };
}

export default function JobMatches() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    checkAnalysisAndFetchRecommendations();
  }, []);

  const checkAnalysisAndFetchRecommendations = async () => {
    try {
      setLoading(true);

      // Step 1: Check if user has completed CV analysis
      const { data: analysisData } = await api.get('/cv/analyses/latest');
      
      if (!analysisData.data || analysisData.data.status !== 'done') {
        setHasAnalysis(false);
        setLoading(false);
        return;
      }

      setHasAnalysis(true);

      // Step 2: Try to get existing recommendations
      try {
        const { data: recData } = await api.get('/recommendations', {
          params: {
            status: 'recommended',
            limit: 20
          }
        });

        if (recData.data && recData.data.length > 0) {
          setRecommendations(recData.data);
          setLoading(false);
        } else {
          // No recommendations yet, generate them
          await generateRecommendations();
        }
      } catch (error) {
        // No recommendations, generate them
        await generateRecommendations();
      }
    } catch (error) {
      console.error('Error checking analysis:', error);
      setHasAnalysis(false);
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    try {
      setGenerating(true);
      toast.info('🎯 Generating personalized job recommendations...');

      const { data } = await api.post('/recommendations/generate', null, {
        params: {
          limit: 20,
          minScore: 40
        }
      });

      console.log('✅ Generated:', data);
      toast.success(`Found ${data.data.totalMatches} job matches!`);
      
      // Fetch the recommendations
      const { data: recData } = await api.get('/recommendations', {
        params: {
          status: 'recommended',
          limit: 20
        }
      });

      setRecommendations(recData.data || []);
      setLoading(false);
      setGenerating(false);
    } catch (error: any) {
      console.error('Error generating recommendations:', error);
      toast.error(error.response?.data?.error || 'Failed to generate recommendations');
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleViewDetails = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleApply = async (recommendationId: string, jobId: string) => {
    try {
      await api.put(`/recommendations/${recommendationId}/view`);
      router.push(`/user/jobs/${jobId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDismiss = async (recommendationId: string) => {
    try {
      await api.put(`/recommendations/${recommendationId}/dismiss`);
      toast.success('Recommendation dismissed');
      setRecommendations(prev => prev.filter(r => r._id !== recommendationId));
    } catch (error) {
      console.error('Error dismissing:', error);
      toast.error('Failed to dismiss recommendation');
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-100';
    if (score >= 60) return 'text-blue-500 bg-blue-100';
    if (score >= 40) return 'text-orange-500 bg-orange-100';
    return 'text-red-500 bg-red-100';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {generating ? 'Generating job recommendations...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  // No CV analysis - Show start analysis page
  if (!hasAnalysis) {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Recommendations</h1>
          <svg width="350" height="12" className="mt-2">
            <path
              d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
              stroke="#000"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-16 shadow-sm border border-blue-200">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-8xl mb-6">🎯</div>
            <h2 className="text-4xl font-bold mb-4">Get Personalized Job Recommendations</h2>
            <p className="text-xl text-gray-600 mb-8">
              Analyze your CV first to get AI-powered job recommendations matched to your skills and experience.
            </p>

            <div className="bg-white rounded-xl p-8 mb-8">
              <h3 className="font-bold text-xl mb-6">How it works:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-5xl mb-3">📄</div>
                  <h4 className="font-bold text-lg mb-2">1. Upload CV</h4>
                  <p className="text-gray-600">Upload your CV for AI analysis</p>
                </div>
                <div>
                  <div className="text-5xl mb-3">🤖</div>
                  <h4 className="font-bold text-lg mb-2">2. AI Analysis</h4>
                  <p className="text-gray-600">Get ATS score and skills extracted</p>
                </div>
                <div>
                  <div className="text-5xl mb-3">🎯</div>
                  <h4 className="font-bold text-lg mb-2">3. Get Matches</h4>
                  <p className="text-gray-600">See personalized job recommendations</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/user/cv-analysis')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-12 py-5 rounded-xl text-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-colors flex items-center gap-3 mx-auto"
            >
              <span>🚀</span>
              Start CV Analysis
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Job Recommendations</h1>
            <p className="text-gray-600">Personalized job matches based on your CV analysis</p>
            <svg width="350" height="12" className="mt-2">
              <path
                d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <button
            onClick={generateRecommendations}
            disabled={generating}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Refreshing...
              </>
            ) : (
              <>
                <span>🔄</span>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{recommendations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <p className="text-sm text-gray-600">High Match</p>
              <p className="text-2xl font-bold text-green-600">
                {recommendations.filter(r => r.matchScore >= 80).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💼</span>
            <div>
              <p className="text-sm text-gray-600">Good Match</p>
              <p className="text-2xl font-bold text-blue-600">
                {recommendations.filter(r => r.matchScore >= 60 && r.matchScore < 80).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <p className="text-sm text-gray-600">Avg Score</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(recommendations.reduce((acc, r) => acc + r.matchScore, 0) / recommendations.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec._id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{rec.job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(rec.matchScore)}`}>
                    {rec.matchScore}% Match
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    #{rec.rank}
                  </span>
                </div>
                
                <p className="text-lg text-gray-700 font-medium mb-2">{rec.job.companyName}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>📍 {rec.job.location}</span>
                  <span>💰 NPR {rec.job.salaryMin?.toLocaleString()} - {rec.job.salaryMax?.toLocaleString()}</span>
                  <span>💼 {rec.job.jobType}</span>
                  <span>📊 {rec.job.experienceLevel} Level</span>
                </div>
              </div>

              <div className="text-center ml-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getMatchColor(rec.matchScore)}`}>
                  <span className="text-3xl font-bold">{rec.matchScore}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  {getMatchLabel(rec.matchScore)}
                </p>
              </div>
            </div>

            {/* Match Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-green-700 font-medium mb-1">Skills Match</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${rec.matchingCriteria.skillsMatch}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-green-700">
                    {rec.matchingCriteria.skillsMatch}%
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-700 font-medium mb-1">Experience</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${rec.matchingCriteria.experienceMatch}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    {rec.matchingCriteria.experienceMatch}%
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-purple-700 font-medium mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${rec.matchingCriteria.locationMatch}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    {rec.matchingCriteria.locationMatch}%
                  </span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {rec.matchingCriteria.matchedSkills.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <span>✅</span>
                    You Have ({rec.matchingCriteria.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.matchingCriteria.matchedSkills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {rec.matchingCriteria.matchedSkills.length > 5 && (
                      <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        +{rec.matchingCriteria.matchedSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {rec.matchingCriteria.missingSkills.length > 0 && (
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <span>📚</span>
                    To Learn ({rec.matchingCriteria.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.matchingCriteria.missingSkills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {rec.matchingCriteria.missingSkills.length > 5 && (
                      <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                        +{rec.matchingCriteria.missingSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            {expandedJob === rec._id && rec.job.description && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold mb-2">Job Description</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {rec.job.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              {rec.job.description && (
                <button
                  onClick={() => handleViewDetails(rec._id)}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  {expandedJob === rec._id ? 'Hide Details' : 'View Details'}
                </button>
              )}
              
              <button
                onClick={() => handleApply(rec._id, rec.job._id)}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                View Job
              </button>
              
              <button
                onClick={() => handleDismiss(rec._id)}
                className="bg-red-100 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                ✕ Not Interested
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
