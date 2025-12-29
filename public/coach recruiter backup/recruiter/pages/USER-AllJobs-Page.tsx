'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:5000/api/v1';

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  jobType: string;
  experienceLevel: string;
  requiredSkills: string[];
  postedDate: string;
  deadline?: string;
  status: string;
  jobSource: string;
  category?: {
    _id: string;
    name: string;
  };
}

export default function AllJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'salary'>('newest');

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filterType, filterLevel, filterLocation, sortBy]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        page: currentPage,
        limit: 12,
        status: 'active'
      };

      if (filterType !== 'all') params.jobType = filterType;
      if (filterLevel !== 'all') params.experienceLevel = filterLevel;
      if (filterLocation !== 'all') params.location = filterLocation;
      if (searchQuery) params.search = searchQuery;

      const { data } = await axios.get(`${baseURL}/jobs`, { params });

      console.log('Jobs:', data);
      
      setJobs(data.data || data.jobs || data.docs || []);
      setTotalPages(data.pagination?.totalPages || data.totalPages || 1);
      setTotalJobs(data.pagination?.total || data.total || 0);

    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs();
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleSaveJob = async (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      await axios.post(
        `${baseURL}/saved-jobs`,
        { jobId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      toast.success('✅ Job saved!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Please login to save jobs');
      } else {
        toast.error('Failed to save job');
      }
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Browse All Jobs</h1>
        <p className="text-gray-600">Explore {totalJobs} available positions</p>
        <svg width="350" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
        {/* Search */}
        <div className="mb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by job title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Job Type</label>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Experience Level</label>
            <select
              value={filterLevel}
              onChange={(e) => { setFilterLevel(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
            <select
              value={filterLocation}
              onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <p>Showing {jobs.length} of {totalJobs} jobs</p>
          {(searchQuery || filterType !== 'all' || filterLevel !== 'all' || filterLocation !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
                setFilterLevel('all');
                setFilterLocation('all');
                setCurrentPage(1);
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setFilterLevel('all');
              setFilterLocation('all');
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => handleViewJob(job._id)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <button
                      onClick={(e) => handleSaveJob(job._id, e)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      🔖
                    </button>
                  </div>
                  <p className="text-gray-700 font-medium mb-1">{job.companyName}</p>
                  <p className="text-sm text-gray-600">📍 {job.location}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                    {job.jobType}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                    {job.experienceLevel}
                  </span>
                  {job.jobSource !== 'manual' && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {job.jobSource}
                    </span>
                  )}
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{job.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Salary</p>
                      <p className="text-sm font-bold text-green-600">
                        NPR {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">
                        {new Date(job.postedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
