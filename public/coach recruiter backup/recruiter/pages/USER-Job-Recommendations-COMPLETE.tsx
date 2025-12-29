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
    companyLogoUrl?: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    jobType: string;
    experienceLevel: string;
    requiredSkills: string[];
    description: string;
    postedDate: string;
    deadline?: string;
    status: string;
  };
  cvAnalysis: {
    _id: string;
    overallScore: number;
  };
  createdAt: string;
}

export default function JobMatches() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'salary'>('match');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/recommendations', {
        params: {
          status: 'recommended',
          limit: 50
        }
      });
      
      console.log('📊 Recommendations:', data);
      setRecommendations(data.data || []);
    } catch (error: any) {
      console.error('Error fetching recommendations:', error);
      
      // If no recommendations, they might need to generate them
      if (error.response?.status === 404 || error.response?.data?.data?.length === 0) {
        // Check if they have a completed analysis
        checkForAnalysis();
      }
    } finally {
      setLoading(false);
    }
  };

  const checkForAnalysis = async () => {
    try {
      const { data } = await api.get('/cv/analyses/latest');
      if (data.data && data.data.status === 'done') {
        // They have an analysis but no recommendations
        toast.info('Ready to generate job recommendations!');
      }
    } catch (error) {
      console.log('No analysis found');
    }
  };

  const generateRecommendations = async () => {
    try {
      setGenerating(true);
      toast.info('🎯 Generating personalized job recommendations...');

      const { data } = await api.post('/recommendations/generate', null, {
        params: {
          limit: 50,
          minScore: 30
        }
      });

      console.log('✅ Generated:', data);
      toast.success(`Found ${data.data.totalMatches} job matches!`);
      
      // Refresh recommendations
      await fetchRecommendations();
    } catch (error: any) {
      console.error('Error generating recommendations:', error);
      toast.error(error.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewDetails = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleApply = async (recommendationId: string, jobId: string) => {
    try {
      // Mark as viewed first
      await api.put(`/recommendations/${recommendationId}/view`);
      
      // Navigate to job application or external link
      router.push(`/user/jobs/${jobId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDismiss = async (recommendationId: string) => {
    try {
      await api.put(`/recommendations/${recommendationId}/dismiss`);
      toast.success('Recommendation dismissed');
      
      // Remove from list
      setRecommendations(prev => prev.filter(r => r._id !== recommendationId));
    } catch (error) {
      console.error('Error dismissing:', error);
      toast.error('Failed to dismiss recommendation');
    }
  };

  const handleSaveJob = async (jobId: string) => {
    try {
      await api.post(`/jobs/saved/${jobId}`);
      toast.success('Job saved!');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    if (filterScore === 'all') return true;
    if (filterScore === 'high') return rec.matchScore >= 80;
    if (filterScore === 'medium') return rec.matchScore >= 60 && rec.matchScore < 80;
    if (filterScore === 'low') return rec.matchScore < 60;
    return true;
  });

  // Sort recommendations
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'date') return new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime();
    if (sortBy === 'salary') return (b.job.salaryMax || 0) - (a.job.salaryMax || 0);
    return 0;
  });

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
          <p className="text-gray-600 font-medium">Loading job recommendations...</p>
        </div>
      </div>
    );
  }

  // Empty state - No CV analysis yet
  if (recommendations.length === 0 && !generating) {
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

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 shadow-sm border border-blue-200">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-7xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold mb-4">Get Personalized Job Recommendations</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our AI will analyze your CV and match you with the best job opportunities based on your skills and experience.
            </p>

            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4">How it works:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-3xl mb-2">📄</div>
                  <h4 className="font-bold mb-1">1. Upload CV</h4>
                  <p className="text-sm text-gray-600">Upload your CV for AI analysis</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="font-bold mb-1">2. AI Analysis</h4>
                  <p className="text-sm text-gray-600">Get ATS score and skills extracted</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold mb-1">3. Get Matches</h4>
                  <p className="text-sm text-gray-600">See personalized job recommendations</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/user/cv-analysis')}
                className="bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <span>🚀</span>
                Analyze CV Now
              </button>
              
              <button
                onClick={generateRecommendations}
                disabled={generating}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <span>🎯</span>
                    Generate Recommendations
                  </>
                )}
              </button>
            </div>
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
                Refresh Recommendations
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <p className="text-sm text-gray-600">Total Matches</p>
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
              <p className="text-sm text-gray-600">Avg Match</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(recommendations.reduce((acc, r) => acc + r.matchScore, 0) / recommendations.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Filter by Match:</label>
            <div className="inline-flex gap-2">
              {['all', 'high', 'medium', 'low'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterScore(filter as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterScore === filter
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter !== 'all' && (
                    <span className="ml-1 text-xs">
                      ({filter === 'high' ? '80+' : filter === 'medium' ? '60-79' : '<60'}%)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto">
            <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="match">Best Match</option>
              <option value="date">Newest First</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Recommendations */}
      <div className="space-y-4">
        {sortedRecommendations.map((recommendation) => (
          <div
            key={recommendation._id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{recommendation.job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(recommendation.matchScore)}`}>
                    {recommendation.matchScore}% Match
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    #{recommendation.rank}
                  </span>
                </div>
                
                <p className="text-lg text-gray-700 font-medium mb-2">{recommendation.job.companyName}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    {recommendation.job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💰</span>
                    NPR {recommendation.job.salaryMin?.toLocaleString()} - NPR {recommendation.job.salaryMax?.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>💼</span>
                    {recommendation.job.jobType}
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📊</span>
                    {recommendation.job.experienceLevel} Level
                  </span>
                </div>
              </div>

              {/* Match Score Visual */}
              <div className="text-center ml-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getMatchColor(recommendation.matchScore)}`}>
                  <span className="text-3xl font-bold">{recommendation.matchScore}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  {getMatchLabel(recommendation.matchScore)}
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
                      style={{ width: `${recommendation.matchingCriteria.skillsMatch}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-green-700">
                    {recommendation.matchingCriteria.skillsMatch}%
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-xs text-blue-700 font-medium mb-1">Experience Match</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${recommendation.matchingCriteria.experienceMatch}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-700">
                    {recommendation.matchingCriteria.experienceMatch}%
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-3">
                <p className="text-xs text-purple-700 font-medium mb-1">Location Match</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${recommendation.matchingCriteria.locationMatch}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-700">
                    {recommendation.matchingCriteria.locationMatch}%
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Matched Skills */}
              {recommendation.matchingCriteria.matchedSkills.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <span>✅</span>
                    You Have ({recommendation.matchingCriteria.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.matchingCriteria.matchedSkills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {recommendation.matchingCriteria.matchedSkills.length > 5 && (
                      <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                        +{recommendation.matchingCriteria.matchedSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {recommendation.matchingCriteria.missingSkills.length > 0 && (
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                    <span>📚</span>
                    To Learn ({recommendation.matchingCriteria.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.matchingCriteria.missingSkills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                    {recommendation.matchingCriteria.missingSkills.length > 5 && (
                      <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                        +{recommendation.matchingCriteria.missingSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Expanded Details */}
            {expandedJob === recommendation._id && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold mb-2">Job Description</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {recommendation.job.description || 'No description available'}
                </p>
                
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.job.requiredSkills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => handleViewDetails(recommendation._id)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {expandedJob === recommendation._id ? 'Hide Details' : 'View Details'}
              </button>
              
              <button
                onClick={() => handleApply(recommendation._id, recommendation.job._id)}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                Apply Now
              </button>
              
              <button
                onClick={() => handleSaveJob(recommendation.job._id)}
                className="bg-orange-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-500 transition-colors"
              >
                💾 Save
              </button>
              
              <button
                onClick={() => handleDismiss(recommendation._id)}
                className="bg-red-100 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                ✕ Not Interested
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No results after filtering */}
      {sortedRecommendations.length === 0 && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-xl text-gray-600">No jobs match your current filter</p>
          <button
            onClick={() => setFilterScore('all')}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600"
          >
            Clear Filters
          </button>
        </div>
      )}
    </>
  );
}
