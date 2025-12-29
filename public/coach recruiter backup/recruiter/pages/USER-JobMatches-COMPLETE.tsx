'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:5000/api/v1';

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
  createdAt: string;
}

export default function JobMatches() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'salary'>('score');
  const [stats, setStats] = useState({
    total: 0,
    avgScore: 0,
    topMatch: 0
  });

  useEffect(() => {
    fetchRecommendations();
    fetchStats();
  }, []);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();

      const { data } = await axios.get(`${baseURL}/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          status: 'recommended',
          limit: 50
        }
      });

      console.log('📊 Recommendations:', data);
      setRecommendations(data.data || []);

    } catch (error: any) {
      console.error('❌ Error:', error);
      
      // If no recommendations found, might need to generate
      if (error.response?.status === 404 || error.response?.data?.data?.length === 0) {
        console.log('No recommendations found');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getAccessToken();
      const { data } = await axios.get(`${baseURL}/recommendations/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (data.data) {
        setStats({
          total: data.data.total || 0,
          avgScore: data.data.byStatus?.recommended?.averageScore || 0,
          topMatch: 0 // Will be calculated from recommendations
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateRecommendations = async () => {
    try {
      setGenerating(true);
      const token = getAccessToken();

      toast.info('🎯 Generating recommendations...');

      const { data } = await axios.post(
        `${baseURL}/recommendations/generate`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` },
          params: {
            limit: 50,
            minScore: 30
          }
        }
      );

      console.log('✅ Generated:', data);
      
      if (data.success) {
        toast.success(`✅ Found ${data.data.totalMatches} job matches!`);
        await fetchRecommendations();
        await fetchStats();
      }
    } catch (error: any) {
      console.error('❌ Generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const dismissRecommendation = async (id: string) => {
    try {
      const token = getAccessToken();
      await axios.put(
        `${baseURL}/recommendations/${id}/dismiss`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      toast.success('Recommendation dismissed');
      setRecommendations(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      toast.error('Failed to dismiss');
    }
  };

  const markAsViewed = async (id: string) => {
    try {
      const token = getAccessToken();
      await axios.put(
        `${baseURL}/recommendations/${id}/view`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error marking as viewed:', error);
    }
  };

  const handleViewJob = async (recommendation: JobRecommendation) => {
    await markAsViewed(recommendation._id);
    router.push(`/jobs/${recommendation.job._id}`);
  };

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    if (filterScore === 'all') return true;
    if (filterScore === 'high') return rec.matchScore >= 70;
    if (filterScore === 'medium') return rec.matchScore >= 50 && rec.matchScore < 70;
    if (filterScore === 'low') return rec.matchScore < 50;
    return true;
  });

  // Sort recommendations
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    if (sortBy === 'score') return b.matchScore - a.matchScore;
    if (sortBy === 'date') return new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime();
    if (sortBy === 'salary') return (b.job.salaryMax || 0) - (a.job.salaryMax || 0);
    return 0;
  });

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-50';
    if (score >= 60) return 'text-blue-500 bg-blue-50';
    if (score >= 40) return 'text-orange-500 bg-orange-50';
    return 'text-red-500 bg-red-50';
  };

  const getMatchBadge = (score: number) => {
    if (score >= 80) return '🎯 Excellent Match';
    if (score >= 60) return '✅ Good Match';
    if (score >= 40) return '⚠️ Fair Match';
    return '❌ Low Match';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading job matches...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (recommendations.length === 0) {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Matches</h1>
          <svg width="250" height="12" className="mt-2">
            <path
              d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 250 6"
              stroke="#000"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="bg-white rounded-2xl p-16 shadow-sm border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[500px]">
          <div className="text-8xl mb-6">🎯</div>
          <h2 className="text-4xl font-bold mb-4">No Job Matches Yet!</h2>
          <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
            We need to analyze your CV first to find the best job matches for you based on your skills and experience.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/user/cv-analysis')}
              className="bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <span>🔍</span>
              Analyze CV First
            </button>
            
            <button
              onClick={generateRecommendations}
              disabled={generating}
              className="bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Matches
                </>
              )}
            </button>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl">
            <h3 className="font-bold text-blue-900 mb-3">How It Works:</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Upload and analyze your CV using AI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Our ML algorithm matches your skills with job requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Get personalized job recommendations with match scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Apply to jobs that fit your profile perfectly!</span>
              </li>
            </ol>
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
            <h1 className="text-4xl font-bold mb-2">Job Matches</h1>
            <svg width="250" height="12" className="mt-2">
              <path
                d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 250 6"
                stroke="#000"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <button
            onClick={generateRecommendations}
            disabled={generating}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Refreshing...
              </>
            ) : (
              <>
                <span>🔄</span>
                Refresh Matches
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🎯</div>
            <div>
              <p className="text-gray-600 text-sm">Total Matches</p>
              <p className="text-3xl font-bold">{recommendations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📊</div>
            <div>
              <p className="text-gray-600 text-sm">Average Match</p>
              <p className="text-3xl font-bold">
                {recommendations.length > 0
                  ? Math.round(recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">⭐</div>
            <div>
              <p className="text-gray-600 text-sm">Best Match</p>
              <p className="text-3xl font-bold">
                {recommendations.length > 0
                  ? Math.max(...recommendations.map(r => r.matchScore))
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by Match:</label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All', icon: '📋' },
                { value: 'high', label: 'High (70%+)', icon: '🎯' },
                { value: 'medium', label: 'Medium (50-69%)', icon: '✅' },
                { value: 'low', label: 'Low (<50%)', icon: '⚠️' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterScore(filter.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterScore === filter.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.icon} {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">Best Match</option>
              <option value="date">Newest</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-6">
        {sortedRecommendations.map((rec) => (
          <div
            key={rec._id}
            className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{rec.job.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchColor(rec.matchScore)}`}>
                    {rec.matchScore}% Match
                  </span>
                </div>
                <p className="text-lg text-gray-700 font-medium mb-1">{rec.job.companyName}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    📍 {rec.job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    💼 {rec.job.jobType}
                  </span>
                  <span className="flex items-center gap-1">
                    📊 {rec.job.experienceLevel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Salary Range</p>
                <p className="text-xl font-bold text-green-600">
                  NPR {rec.job.salaryMin?.toLocaleString()} - {rec.job.salaryMax?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Match Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-3">Why This Match?</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Skills Match</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${rec.matchingCriteria.skillsMatch}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{rec.matchingCriteria.skillsMatch}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Experience Match</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${rec.matchingCriteria.experienceMatch}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{rec.matchingCriteria.experienceMatch}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Location Match</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${rec.matchingCriteria.locationMatch}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{rec.matchingCriteria.locationMatch}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-medium text-green-700 mb-2">✅ Matched Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {rec.matchingCriteria.matchedSkills.slice(0, 5).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {rec.matchingCriteria.matchedSkills.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{rec.matchingCriteria.matchedSkills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                {rec.matchingCriteria.missingSkills.length > 0 && (
                  <div className="flex-1">
                    <p className="text-xs font-medium text-orange-700 mb-2">⚠️ Skills to Learn</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.matchingCriteria.missingSkills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleViewJob(rec)}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => dismissRecommendation(rec._id)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Not Interested
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No results after filtering */}
      {sortedRecommendations.length === 0 && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No matches in this filter</h3>
          <p className="text-gray-600">Try changing your filter criteria</p>
        </div>
      )}
    </>
  );
}
