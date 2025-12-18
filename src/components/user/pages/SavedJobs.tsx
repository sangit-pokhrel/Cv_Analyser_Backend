// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/baseapi';
// import { toast } from 'react-toastify';

// interface Job {
//   _id: string;
//   title: string;
//   companyName: string;
//   location: string;
//   jobType: string;
//   salaryMin?: number;
//   salaryMax?: number;
//   experienceLevel: string;
//   status: string;
//   postedDate: string;
//   deadline?: string;
//   companyLogoUrl?: string;
//   requiredSkills: string[];
// }

// interface SavedJob {
//   _id: string;
//   job: Job;
//   savedAt: string;
// }

// export default function SavedJobs() {
//   const router = useRouter();
//   const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterType, setFilterType] = useState<string>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     fetchSavedJobs();
//   }, [currentPage]);

//   const fetchSavedJobs = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get('/saved-jobs', {
//         params: { page: currentPage, limit: 10 }
//       });
      
//       setSavedJobs(data.data || []);
//       setTotalPages(data.meta?.pages || 1);
//     } catch (error) {
//       console.error('Error fetching saved jobs:', error);
//       toast.error('Failed to load saved jobs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUnsaveJob = async (jobId: string) => {
//     if (!confirm('Remove this job from saved list?')) return;

//     try {
//       await api.delete(`/saved-jobs/${jobId}`);
      
//       // Remove from local state immediately
//       setSavedJobs(prev => prev.filter(saved => saved.job._id !== jobId));
      
//       // Show success message
//       toast.success('Job removed from saved list');
//     } catch (error: any) {
//       console.error('Error removing saved job:', error);
//       toast.error(error.response?.data?.error || 'Failed to remove job');
//     }
//   };

//   const handleViewJob = (jobId: string) => {
//     router.push(`/user/jobs/${jobId}`);
//   };

//   const getJobTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       'full-time': 'bg-blue-100 text-blue-800',
//       'part-time': 'bg-green-100 text-green-800',
//       'contract': 'bg-purple-100 text-purple-800',
//       'remote': 'bg-orange-100 text-orange-800'
//     };
//     return colors[type] || 'bg-gray-100 text-gray-800';
//   };

//   const getExperienceLevelColor = (level: string) => {
//     const colors: Record<string, string> = {
//       'entry': 'bg-green-100 text-green-800',
//       'mid': 'bg-blue-100 text-blue-800',
//       'senior': 'bg-purple-100 text-purple-800'
//     };
//     return colors[level] || 'bg-gray-100 text-gray-800';
//   };

//   const formatSalary = (min?: number, max?: number) => {
//     if (!min && !max) return 'Salary not specified';
//     if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
//     if (min) return `From $${min.toLocaleString()}`;
//     return `Up to $${max?.toLocaleString()}`;
//   };

//   // Filter jobs
//   const filteredJobs = savedJobs.filter(saved => {
//     const job = saved.job;
//     const matchesSearch = 
//       job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesType = filterType === 'all' || job.jobType === filterType;
    
//     return matchesSearch && matchesType;
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading saved jobs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2">Saved Jobs</h1>
//         <p className="text-gray-600">Jobs you've bookmarked for later</p>
//         <svg width="200" height="12" className="mt-2">
//           <path
//             d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6"
//             stroke="#000"
//             strokeWidth="2"
//             fill="none"
//           />
//         </svg>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">💼</div>
//           <h3 className="text-lg font-medium mb-1">Total Saved</h3>
//           <p className="text-4xl font-bold text-blue-600">{savedJobs.length}</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">🏢</div>
//           <h3 className="text-lg font-medium mb-1">Companies</h3>
//           <p className="text-4xl font-bold text-green-600">
//             {new Set(savedJobs.map(s => s.job.companyName)).size}
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">🎯</div>
//           <h3 className="text-lg font-medium mb-1">Active</h3>
//           <p className="text-4xl font-bold text-orange-600">
//             {savedJobs.filter(s => s.job.status === 'active').length}
//           </p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">⏰</div>
//           <h3 className="text-lg font-medium mb-1">Expiring Soon</h3>
//           <p className="text-4xl font-bold text-red-600">
//             {savedJobs.filter(s => {
//               if (!s.job.deadline) return false;
//               const daysLeft = Math.ceil((new Date(s.job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
//               return daysLeft <= 7 && daysLeft > 0;
//             }).length}
//           </p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Search by title, company, or location..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//               🔍
//             </span>
//           </div>

//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="all">All Types</option>
//             <option value="full-time">Full Time</option>
//             <option value="part-time">Part Time</option>
//             <option value="contract">Contract</option>
//             <option value="remote">Remote</option>
//           </select>
//         </div>
//       </div>

//       {/* Job List */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//         {filteredJobs.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-6xl mb-4">📭</div>
//             <p className="text-gray-500 text-lg mb-4">
//               {searchQuery || filterType !== 'all' 
//                 ? 'No jobs match your filters' 
//                 : 'No saved jobs yet'}
//             </p>
//             <button
//               onClick={() => router.push('/user/job-matches')}
//               className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
//             >
//               Browse Job Matches
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredJobs.map((saved) => {
//               const job = saved.job;
//               const daysLeft = job.deadline 
//                 ? Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
//                 : null;

//               return (
//                 <div
//                   key={saved._id}
//                   className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
//                 >
//                   <div className="flex gap-4">
//                     {/* Company Logo */}
//                     <div className="flex-shrink-0">
//                       {job.companyLogoUrl ? (
//                         <img
//                           src={job.companyLogoUrl}
//                           alt={job.companyName}
//                           className="w-16 h-16 rounded-lg object-cover"
//                         />
//                       ) : (
//                         <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
//                           <span className="text-2xl">🏢</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Job Details */}
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-2">
//                         <div>
//                           <h3 className="text-xl font-bold text-gray-900 mb-1">
//                             {job.title}
//                           </h3>
//                           <p className="text-gray-600 font-medium">{job.companyName}</p>
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleViewJob(job._id)}
//                             className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
//                           >
//                             View Details
//                           </button>
//                           <button
//                             onClick={() => handleUnsaveJob(job._id)}
//                             className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
//                           >
//                             <span>🗑️</span>
//                             Remove
//                           </button>
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap gap-2 mb-3">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
//                           {job.jobType.replace('-', ' ').toUpperCase()}
//                         </span>
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceLevelColor(job.experienceLevel)}`}>
//                           {job.experienceLevel.toUpperCase()}
//                         </span>
//                         {job.status === 'active' ? (
//                           <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                             ACTIVE
//                           </span>
//                         ) : (
//                           <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
//                             CLOSED
//                           </span>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
//                         <div className="flex items-center gap-2">
//                           <span>📍</span>
//                           <span>{job.location || 'Location not specified'}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span>💰</span>
//                           <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span>📅</span>
//                           <span>
//                             Saved {new Date(saved.savedAt).toLocaleDateString('en-US', {
//                               month: 'short',
//                               day: 'numeric',
//                               year: 'numeric'
//                             })}
//                           </span>
//                         </div>
//                       </div>

//                       {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
//                           <p className="text-red-800 text-sm font-medium">
//                             ⚠️ Application deadline in {daysLeft} day{daysLeft !== 1 ? 's' : ''}!
//                           </p>
//                         </div>
//                       )}

//                       {job.requiredSkills && job.requiredSkills.length > 0 && (
//                         <div className="flex flex-wrap gap-2">
//                           {job.requiredSkills.slice(0, 5).map((skill, index) => (
//                             <span
//                               key={index}
//                               className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                           {job.requiredSkills.length > 5 && (
//                             <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
//                               +{job.requiredSkills.length - 5} more
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Pagination */}
//         {filteredJobs.length > 0 && totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 mt-8">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Prev
//             </button>
            
//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               const page = i + 1;
//               return (
//                 <button
//                   key={page}
//                   onClick={() => setCurrentPage(page)}
//                   className={`px-4 py-2 rounded-lg transition-colors ${
//                     currentPage === page
//                       ? 'bg-blue-500 text-white'
//                       : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               );
//             })}
            
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: string;
  status: string;
  postedDate: string;
  deadline?: string;
  companyLogoUrl?: string;
  requiredSkills: string[];
}

interface SavedJob {
  _id: string;
  job: Job;
  savedAt: string;
}

export default function SavedJobs() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSavedJobs();
  }, [currentPage]);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/saved-jobs', {
        params: { page: currentPage, limit: 10 }
      });
      
      console.log('API Response:', response); // Debug
      console.log('Response data:', response.data); // Debug
      
      // The data structure is: response.data.data
      const jobsData = response.data?.data || [];
      const metaData = response.data?.meta || { pages: 1 };
      
      console.log('Jobs data:', jobsData); // Debug
      console.log('Meta data:', metaData); // Debug
      
      setSavedJobs(jobsData);
      setTotalPages(metaData.pages);
    } catch (error: any) {
      console.error('Error fetching saved jobs:', error);
      console.error('Error response:', error.response); // Debug
      toast.error(error.response?.data?.error || 'Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    if (!confirm('Remove this job from saved list?')) return;

    try {
      await api.delete(`/saved-jobs/${jobId}`);
      
      // Remove from local state immediately
      setSavedJobs(prev => prev.filter(saved => saved.job._id !== jobId));
      
      // Show success message
      toast.success('Job removed from saved list');
    } catch (error: any) {
      console.error('Error removing saved job:', error);
      toast.error(error.response?.data?.error || 'Failed to remove job');
    }
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/user/jobs/${jobId}`);
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-green-100 text-green-800',
      'contract': 'bg-purple-100 text-purple-800',
      'remote': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'entry': 'bg-green-100 text-green-800',
      'mid': 'bg-blue-100 text-blue-800',
      'senior': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  // Filter jobs
  const filteredJobs = savedJobs.filter(saved => {
    const job = saved.job;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || job.jobType === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Saved Jobs</h1>
        <p className="text-gray-600">Jobs you've bookmarked for later</p>
        <svg width="200" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">💼</div>
          <h3 className="text-lg font-medium mb-1">Total Saved</h3>
          <p className="text-4xl font-bold text-blue-600">{savedJobs.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🏢</div>
          <h3 className="text-lg font-medium mb-1">Companies</h3>
          <p className="text-4xl font-bold text-green-600">
            {new Set(savedJobs.map(s => s.job.companyName)).size}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-medium mb-1">Active</h3>
          <p className="text-4xl font-bold text-orange-600">
            {savedJobs.filter(s => s.job.status === 'active').length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="text-lg font-medium mb-1">Expiring Soon</h3>
          <p className="text-4xl font-bold text-red-600">
            {savedJobs.filter(s => {
              if (!s.job.deadline) return false;
              const daysLeft = Math.ceil((new Date(s.job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return daysLeft <= 7 && daysLeft > 0;
            }).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Job List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg mb-4">
              {searchQuery || filterType !== 'all' 
                ? 'No jobs match your filters' 
                : 'No saved jobs yet'}
            </p>
            <button
              onClick={() => router.push('/user/job-matches')}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Browse Job Matches
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((saved) => {
              const job = saved.job;
              const daysLeft = job.deadline 
                ? Math.ceil((new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <div
                  key={saved._id}
                  className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {job.companyLogoUrl ? (
                        <img
                          src={job.companyLogoUrl}
                          alt={job.companyName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🏢</span>
                        </div>
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 font-medium">{job.companyName}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewJob(job._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleUnsaveJob(job._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                          >
                            <span>🗑️</span>
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.jobType)}`}>
                          {job.jobType.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceLevelColor(job.experienceLevel)}`}>
                          {job.experienceLevel.toUpperCase()}
                        </span>
                        {job.status === 'active' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                            CLOSED
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{job.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>
                            Saved {new Date(saved.savedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-red-800 text-sm font-medium">
                            ⚠️ Application deadline in {daysLeft} day{daysLeft !== 1 ? 's' : ''}!
                          </p>
                        </div>
                      )}

                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.requiredSkills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 5 && (
                            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                              +{job.requiredSkills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredJobs.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}