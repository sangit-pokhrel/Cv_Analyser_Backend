

// 'use client';

// import { useState, useEffect } from 'react';
// import api from '@/lib/baseapi';
// import ApplicationTimelineModal from './application/ApplicationTimelineModal';

// interface Job {
//   _id: string;
//   title: string;
//   company: string;
//   location: string;
// }

// interface Application {
//   _id: string;
//   jobId: Job;
//   userId: string;
//   status: 'submitted' | 'reviewed' | 'shortlisted' | 'interview' | 'rejected' | 'accepted';
//   coverLetter?: string;
//   appliedAt: string;
//   updatedAt: string;
//   statusHistory?: Array<{
//     status: string;
//     timestamp: string;
//     note?: string;
//   }>;
//   interviewDetails?: {
//     scheduledAt: string;
//     location: string;
//     notes: string;
//   };
// }

// export default function Applications() {
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState<string>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchApplications();
//   }, [activeFilter, currentPage]);

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       const params: any = {
//         page: currentPage,
//         limit: 20,
//       };
      
//       if (activeFilter !== 'all') {
//         params.status = activeFilter;
//       }

//       const { data } = await api.get('/applications/my-applications', { params });
//       setApplications(data.data || []);
//       setTotalPages(data.pagination?.totalPages || 1);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const viewDetails = (application: Application) => {
//     setSelectedApplication(application);
//     setShowModal(true);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'submitted':
//         return 'bg-blue-100 text-blue-600';
//       case 'reviewed':
//         return 'bg-purple-100 text-purple-600';
//       case 'shortlisted':
//         return 'bg-yellow-100 text-yellow-600';
//       case 'interview':
//         return 'bg-orange-400 text-white';
//       case 'rejected':
//         return 'bg-red-500 text-white';
//       case 'accepted':
//         return 'bg-green-500 text-white';
//       default:
//         return 'bg-gray-100 text-gray-600';
//     }
//   };

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case 'submitted':
//         return 'Under Review';
//       case 'reviewed':
//         return 'Reviewed';
//       case 'shortlisted':
//         return 'Shortlisted';
//       case 'interview':
//         return 'Interview';
//       case 'rejected':
//         return 'Rejected';
//       case 'accepted':
//         return 'Accepted';
//       default:
//         return status;
//     }
//   };

//   // Calculate stats
//   const totalApplications = applications.length;
//   const underReview = applications.filter(a => a.status === 'submitted').length;
//   const interviews = applications.filter(a => a.status === 'interview').length;
//   const accepted = applications.filter(a => a.status === 'accepted').length;
//   const rejected = applications.filter(a => a.status === 'rejected').length;

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading applications...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2">Job Applications</h1>
//         <svg width="350" height="12" className="mt-2">
//           <path
//             d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
//             stroke="#000"
//             strokeWidth="2"
//             fill="none"
//           />
//         </svg>
//       </div>

//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">📋</div>
//           <h3 className="text-lg font-medium mb-1">Total Applications</h3>
//           <p className="text-4xl font-bold">{totalApplications}</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">⏳</div>
//           <h3 className="text-lg font-medium mb-1">Under Review</h3>
//           <p className="text-4xl font-bold">{underReview}</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">🎤</div>
//           <h3 className="text-lg font-medium mb-1">Interview</h3>
//           <p className="text-4xl font-bold">{interviews}</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">📊</div>
//           <h3 className="text-lg font-medium mb-1">Accepted/Rejected</h3>
//           <p className="text-4xl font-bold">
//             <span className="text-green-500">{accepted}</span>
//             /
//             <span className="text-red-500">{rejected}</span>
//           </p>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//         <div className="flex gap-3 mb-6 flex-wrap">
//           {[
//             { key: 'all', label: 'ALL' },
//             { key: 'submitted', label: 'Under Review' },
//             { key: 'shortlisted', label: 'Shortlisted' },
//             { key: 'interview', label: 'Interview' },
//             { key: 'accepted', label: 'Accepted' },
//             { key: 'rejected', label: 'Rejected' },
//           ].map((filter) => (
//             <button
//               key={filter.key}
//               onClick={() => {
//                 setActiveFilter(filter.key);
//                 setCurrentPage(1);
//               }}
//               className={`px-6 py-2 rounded-xl font-medium transition-colors ${
//                 activeFilter === filter.key
//                   ? filter.key === 'all'
//                     ? 'bg-blue-500 text-white'
//                     : filter.key === 'submitted'
//                     ? 'bg-blue-400 text-white'
//                     : filter.key === 'shortlisted'
//                     ? 'bg-yellow-500 text-white'
//                     : filter.key === 'interview'
//                     ? 'bg-orange-400 text-white'
//                     : filter.key === 'accepted'
//                     ? 'bg-green-500 text-white'
//                     : 'bg-red-500 text-white'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               {filter.label}
//             </button>
//           ))}
//         </div>

//         {applications.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No applications found</p>
//           </div>
//         ) : (
//           <>
//             <div className="space-y-4">
//               {applications.map((application) => (
//                 <div
//                   key={application._id}
//                   onClick={() => viewDetails(application)}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
//                 >
//                   <div>
//                     <h4 className="font-bold text-lg mb-1">
//                       {application.jobId?.title || 'Job Title'}
//                     </h4>
//                     <p className="text-sm text-gray-600 mb-1">
//                       {application.jobId?.company || 'Company Name'}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Applied Date: {new Date(application.appliedAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric'
//                       })}
//                       {application.interviewDetails?.scheduledAt && (
//                         <span className="ml-4 text-orange-500">
//                           Interview: {new Date(application.interviewDetails.scheduledAt).toLocaleDateString('en-US', {
//                             year: 'numeric',
//                             month: 'short',
//                             day: 'numeric'
//                           })}
//                         </span>
//                       )}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <span
//                       className={`px-6 py-2 rounded-xl font-medium ${getStatusColor(
//                         application.status
//                       )}`}
//                     >
//                       {getStatusLabel(application.status)}
//                     </span>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         viewDetails(application);
//                       }}
//                       className="text-blue-500 hover:text-blue-700 font-medium"
//                     >
//                       View Timeline →
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div className="flex justify-center items-center gap-2 mt-8">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Prev
//                 </button>
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
//                   <button
//                     key={page}
//                     onClick={() => setCurrentPage(page)}
//                     className={`px-4 py-2 rounded-lg transition-colors ${
//                       currentPage === page
//                         ? 'bg-blue-500 text-white'
//                         : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {showModal && selectedApplication && (
//         <ApplicationTimelineModal
//           application={selectedApplication}
//           onClose={() => setShowModal(false)}
//         />
//       )}
//     </>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/baseapi';
import ApplicationTimelineModal from './application/ApplicationTimelineModal';

interface Job {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
}

interface Application {
  _id: string;
  job: Job;
  user: string;
  status: string;
  coverLetter?: string;
  appliedDate: string;
  updatedAt: string;
  resumeUrl?: string;
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [activeFilter, currentPage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        limit: 20,
      };
      
      if (activeFilter !== 'all') {
        params.status = activeFilter;
      }

      const { data } = await api.get('/applications/my-applications', { params });
      setApplications(data.data || []);
      setTotalPages(data.meta?.pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'submitted':
        return 'bg-blue-100 text-blue-600';
      case 'reviewed':
        return 'bg-purple-100 text-purple-600';
      case 'shortlisted':
        return 'bg-yellow-100 text-yellow-600';
      case 'interview':
        return 'bg-orange-400 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'accepted':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'submitted':
        return 'Under Review';
      case 'reviewed':
        return 'Reviewed';
      case 'shortlisted':
        return 'Shortlisted';
      case 'interview':
        return 'Interview';
      case 'rejected':
        return 'Rejected';
      case 'accepted':
        return 'Accepted';
      default:
        return status;
    }
  };

  // Calculate stats
  const totalApplications = applications.length;
  const underReview = applications.filter(a => a.status.toLowerCase() === 'pending').length;
  const interviews = applications.filter(a => a.status.toLowerCase() === 'interview').length;
  const accepted = applications.filter(a => a.status.toLowerCase() === 'accepted').length;
  const rejected = applications.filter(a => a.status.toLowerCase() === 'rejected').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Job Applications</h1>
        <svg width="350" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-medium mb-1">Total Applications</h3>
          <p className="text-4xl font-bold">{totalApplications}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="text-lg font-medium mb-1">Under Review</h3>
          <p className="text-4xl font-bold">{underReview}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🎤</div>
          <h3 className="text-lg font-medium mb-1">Interview</h3>
          <p className="text-4xl font-bold">{interviews}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-medium mb-1">Accepted/Rejected</h3>
          <p className="text-4xl font-bold">
            <span className="text-green-500">{accepted}</span>
            /
            <span className="text-red-500">{rejected}</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { key: 'all', label: 'ALL' },
            { key: 'pending', label: 'Under Review' },
            { key: 'shortlisted', label: 'Shortlisted' },
            { key: 'interview', label: 'Interview' },
            { key: 'accepted', label: 'Accepted' },
            { key: 'rejected', label: 'Rejected' },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => {
                setActiveFilter(filter.key);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeFilter === filter.key
                  ? filter.key === 'all'
                    ? 'bg-blue-500 text-white'
                    : filter.key === 'pending'
                    ? 'bg-blue-400 text-white'
                    : filter.key === 'shortlisted'
                    ? 'bg-yellow-500 text-white'
                    : filter.key === 'interview'
                    ? 'bg-orange-400 text-white'
                    : filter.key === 'accepted'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No applications found</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  onClick={() => viewDetails(application)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {application.job?.title || 'Job Title'}
                    </h4>
                    <p className="text-sm text-gray-600 mb-1">
                      {application.job?.companyName || 'Company Name'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Applied Date: {new Date(application.appliedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-6 py-2 rounded-xl font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {getStatusLabel(application.status)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDetails(application);
                      }}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
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
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && selectedApplication && (
        <ApplicationTimelineModal
          application={selectedApplication}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}