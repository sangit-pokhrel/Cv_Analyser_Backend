'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:5000/api/v1';

interface JobDetail {
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
  requirements?: any;
  postedDate: string;
  deadline?: string;
  status: string;
  jobSource: string;
  externalUrl?: string;
  applicationMethod: string;
  category?: {
    name: string;
  };
}

interface Recommendation {
  matchScore: number;
  matchingCriteria: {
    skillsMatch: number;
    experienceMatch: number;
    locationMatch: number;
    matchedSkills: string[];
    missingSkills: string[];
  };
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      fetchRecommendation();
    }
  }, [jobId]);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${baseURL}/jobs/${jobId}`);
      console.log('Job details:', data);
      setJob(data.data || data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendation = async () => {
    try {
      const token = getAccessToken();
      const { data } = await axios.get(`${baseURL}/recommendations`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { limit: 100 }
      });

      // Find recommendation for this job
      const rec = data.data?.find((r: any) => r.job._id === jobId || r.job === jobId);
      if (rec) {
        setRecommendation(rec);
      }
    } catch (error) {
      console.log('No recommendation found for this job');
    }
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      const token = getAccessToken();

      // If external job, redirect
      if (job?.applicationMethod === 'external_redirect' && job.externalUrl) {
        window.open(job.externalUrl, '_blank');
        
        // Track external click
        await axios.post(
          `${baseURL}/jobs/${jobId}/track-click`,
          {},
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        toast.success('Redirecting to external application...');
        return;
      }

      // Internal application
      await axios.post(
        `${baseURL}/applications`,
        { jobId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      toast.success('✅ Application submitted successfully!');
      router.push('/user/my-applications');

    } catch (error: any) {
      console.error('Apply error:', error);
      toast.error(error.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = getAccessToken();

      await axios.post(
        `${baseURL}/jobs/${jobId}/save`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setIsSaved(true);
      toast.success('✅ Job saved!');
    } catch (error) {
      toast.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-500 bg-green-50';
    if (score >= 60) return 'text-blue-500 bg-blue-50';
    if (score >= 40) return 'text-orange-500 bg-orange-50';
    return 'text-red-500 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
      >
        <span>←</span> Back to Jobs
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3">{job.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <p className="text-2xl font-medium text-gray-700">{job.companyName}</p>
              {job.jobSource !== 'manual' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {job.jobSource}
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                📍 {job.location}
              </span>
              <span className="flex items-center gap-2">
                💼 {job.jobType}
              </span>
              <span className="flex items-center gap-2">
                📊 {job.experienceLevel} Level
              </span>
              <span className="flex items-center gap-2">
                📅 Posted {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {recommendation && (
            <div className="text-center">
              <div className={`text-5xl font-bold px-6 py-4 rounded-2xl ${getMatchColor(recommendation.matchScore)}`}>
                {recommendation.matchScore}%
              </div>
              <p className="text-sm text-gray-600 mt-2">Match Score</p>
            </div>
          )}
        </div>

        {/* Salary & Deadline */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-sm text-gray-600 mb-1">Salary Range</p>
            <p className="text-2xl font-bold text-green-600">
              NPR {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
            </p>
          </div>
          {job.deadline && (
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Application Deadline</p>
              <p className="text-xl font-bold text-red-600">
                {new Date(job.deadline).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Match Breakdown (if available) */}
      {recommendation && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-sm border border-blue-200 mb-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>🎯</span>
            Why This Match?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Skills Match</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${recommendation.matchingCriteria.skillsMatch}%` }}
                  />
                </div>
                <span className="text-xl font-bold">{recommendation.matchingCriteria.skillsMatch}%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Experience Match</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${recommendation.matchingCriteria.experienceMatch}%` }}
                  />
                </div>
                <span className="text-xl font-bold">{recommendation.matchingCriteria.experienceMatch}%</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Location Match</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all"
                    style={{ width: `${recommendation.matchingCriteria.locationMatch}%` }}
                  />
                </div>
                <span className="text-xl font-bold">{recommendation.matchingCriteria.locationMatch}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                <span>✅</span>
                Your Matching Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {recommendation.matchingCriteria.matchedSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {recommendation.matchingCriteria.missingSkills.length > 0 && (
              <div className="bg-white rounded-xl p-4">
                <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                  <span>⚠️</span>
                  Skills to Learn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendation.matchingCriteria.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  💡 Consider learning these skills to improve your match!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <div className="prose max-w-none text-gray-700">
                {typeof job.requirements === 'string' ? (
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                ) : (
                  <div>{JSON.stringify(job.requirements, null, 2)}</div>
                )}
              </div>
            </div>
          )}

          {/* Required Skills */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
            <h3 className="font-bold text-lg mb-4">Apply Now</h3>
            
            <button
              onClick={handleApply}
              disabled={applying || job.status !== 'active'}
              className="w-full bg-blue-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3 flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : job.applicationMethod === 'external_redirect' ? (
                <>
                  <span>🔗</span>
                  Apply on {job.jobSource}
                </>
              ) : (
                <>
                  <span>📝</span>
                  Apply Now
                </>
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={saving || isSaved}
              className="w-full bg-orange-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : isSaved ? '✅ Saved' : '🔖 Save Job'}
            </button>

            {job.status !== 'active' && (
              <p className="text-sm text-red-600 mt-3 text-center">
                This job is no longer accepting applications
              </p>
            )}
          </div>

          {/* Job Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Job Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Job Type</p>
                <p className="font-medium capitalize">{job.jobType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience Level</p>
                <p className="font-medium capitalize">{job.experienceLevel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
              {job.category && (
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{job.category.name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Posted Date</p>
                <p className="font-medium">
                  {new Date(job.postedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
