

// 'use client';

// import { useState, useEffect } from 'react';
// import api from '@/lib/baseapi';
// import AnalysisModal from './analyses/AnalysisModel';

// interface Analysis {
//   _id: string;
//   user: string;
//   cvFileUrl: string;
//   status: 'pending' | 'done' | 'failed';
//   overallScore: number;
//   strengths: string[];
//   weaknesses: string[];
//   recommendations: string[];
//   skillsDetected: string[];
//   extractedData: {
//     experience: string;
//     education: string[];
//     certifications: string[];
//     languages: string[];
//     totalYearsExperience: number;
//   };
//   analysisResult?: {
//     overallScore: number;
//     strengths: string[];
//     weaknesses: string[];
//     recommendations: string[];
//     skillsDetected: string[];
//     extractedData: any;
//     detailedAnalysis: {
//       formatting: string;
//       content: string;
//       keywords: string;
//       atsCompatibility: string;
//     };
//   };
//   createdAt: string;
//   updatedAt: string;
//   analyzedAt?: string;
// }

// export default function MyAnalyses() {
//   const [analyses, setAnalyses] = useState<Analysis[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     fetchAnalyses();
//   }, []);

//   const fetchAnalyses = async () => {
//     try {
//       const { data } = await api.get('/cv/analyses');
//       console.log('API Response:', data);
//       setAnalyses(data.data || []);
//     } catch (error) {
//       console.error('Error fetching analyses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const viewDetails = (analysis: Analysis) => {
//     setSelectedAnalysis(analysis);
//     setShowModal(true);
//   };

//   // Calculate stats
//   const totalAnalyses = analyses.length;
//   const completedAnalyses = analyses.filter(a => a.status === 'done');
//   const processingAnalyses = analyses.filter(a => a.status === 'pending');
  
//   // Get all skills from completed analyses
//   const allSkills = completedAnalyses.flatMap(a => a.skillsDetected || []);
//   const skillCounts = allSkills.reduce((acc, skill) => {
//     acc[skill] = (acc[skill] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);
  
//   const mostCommonSkill = Object.keys(skillCounts).length > 0 
//     ? Object.entries(skillCounts).sort((a, b) => b[1] - a[1])[0][0]
//     : 'N/A';

//   // Filter analyses based on search
//   const filteredAnalyses = analyses.filter(analysis => {
//     const skills = (analysis.skillsDetected || []).join(' ').toLowerCase();
//     const query = searchQuery.toLowerCase();
//     return skills.includes(query) || analysis._id.toLowerCase().includes(query);
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
//         <svg width="350" height="12" className="mt-2">
//           <path
//             d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
//             stroke="#000"
//             strokeWidth="2"
//             fill="none"
//           />
//         </svg>
//       </div>

//       <h2 className="text-3xl font-bold mb-8">My Analyses</h2>

//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">🔍</div>
//           <h3 className="text-lg font-medium mb-1">Total Analyses</h3>
//           <p className="text-4xl font-bold">{totalAnalyses}</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">✅</div>
//           <h3 className="text-lg font-medium mb-1">Completed</h3>
//           <p className="text-4xl font-bold">{completedAnalyses.length}</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">⏳</div>
//           <h3 className="text-lg font-medium mb-1">Processing</h3>
//           <p className="text-4xl font-bold">{processingAnalyses.length}</p>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//           <div className="text-4xl mb-3">💡</div>
//           <h3 className="text-lg font-medium mb-1">Top Skill</h3>
//           <p className="text-xl font-bold truncate">{mostCommonSkill}</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//         <div className="flex gap-4 mb-6">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Search by skills or ID..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//               🔍
//             </span>
//           </div>
//           <button className="px-6 py-3 border border-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-50">
//             <span>📅</span>
//             Sort By Date
//             <span>▼</span>
//           </button>
//         </div>

//         {filteredAnalyses.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No analyses found</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredAnalyses.map((analysis) => (
//               <div
//                 key={analysis._id}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h4 className="font-bold text-lg">
//                       CV Analysis
//                     </h4>
//                     {analysis.overallScore && (
//                       <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
//                         Score: {analysis.overallScore}/100
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 mb-1">
//                     Analyzed: {analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleString('en-US', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     }) : new Date(analysis.createdAt).toLocaleString('en-US', {
//                       year: 'numeric',
//                       month: 'short',
//                       day: 'numeric'
//                     })}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Skills Detected: {analysis.skillsDetected?.length || 0} | 
//                     Experience: {analysis.extractedData?.totalYearsExperience || 0} years
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="text-right">
//                     <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
//                       analysis.status === 'done' ? 'bg-green-100 text-green-800' :
//                       analysis.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-red-100 text-red-800'
//                     }`}>
//                       {analysis.status === 'done' ? 'COMPLETED' : analysis.status.toUpperCase()}
//                     </span>
//                   </div>
//                   {analysis.status === 'done' ? (
//                     <button 
//                       onClick={() => viewDetails(analysis)}
//                       className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
//                     >
//                       View Details
//                     </button>
//                   ) : (
//                     <button 
//                       disabled
//                       className="bg-gray-300 text-gray-500 px-6 py-2 rounded-xl font-medium cursor-not-allowed"
//                     >
//                       {analysis.status === 'pending' ? 'Processing...' : 'Failed'}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {filteredAnalyses.length > 0 && (
//           <div className="flex justify-center items-center gap-2 mt-8">
//             <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
//               Prev
//             </button>
//             {[1, 2, 3, 4, 5].map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   currentPage === page
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {showModal && selectedAnalysis && (
//         <AnalysisModal 
//           analysis={selectedAnalysis} 
//           onClose={() => setShowModal(false)} 
//         />
//       )}
//     </>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/baseapi';
import AnalysisModal from './analyses/AnalysisModel';

interface Analysis {
  _id: string;
  user: string;
  cvFileUrl: string;
  status: 'pending' | 'done' | 'failed';
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
  analysisResult?: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    skillsDetected: string[];
    extractedData: any;
    detailedAnalysis: {
      formatting: string;
      content: string;
      keywords: string;
      atsCompatibility: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  analyzedAt?: string;
}

export default function MyAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const FREE_UPLOAD_LIMIT = 3;
  const remainingUploads = Math.max(0, FREE_UPLOAD_LIMIT - analyses.length);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data } = await api.get('/cv/analyses');
      console.log('API Response:', data);
      setAnalyses(data.data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (analysis: Analysis) => {
    setSelectedAnalysis(analysis);
    setShowModal(true);
  };

  // Calculate stats
  const totalAnalyses = analyses.length;
  const completedAnalyses = analyses.filter(a => a.status === 'done');
  const processingAnalyses = analyses.filter(a => a.status === 'pending');
  
  // Get all skills from completed analyses
  const allSkills = completedAnalyses.flatMap(a => a.skillsDetected || []);
  const skillCounts = allSkills.reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonSkill = Object.keys(skillCounts).length > 0 
    ? Object.entries(skillCounts).sort((a, b) => b[1] - a[1])[0][0]
    : 'N/A';

  // Filter analyses based on search
  const filteredAnalyses = analyses.filter(analysis => {
    const skills = (analysis.skillsDetected || []).join(' ').toLowerCase();
    const query = searchQuery.toLowerCase();
    return skills.includes(query) || analysis._id.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
        <svg width="350" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <h2 className="text-3xl font-bold mb-8">My Analyses</h2>

      {/* Upload Limit Warning */}
      {analyses.length >= FREE_UPLOAD_LIMIT && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🚫</div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Free Upload Limit Reached</h3>
                <p className="text-white/90">You've used all {FREE_UPLOAD_LIMIT} free CV analyses. Upgrade to Premium for unlimited uploads!</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <span>⭐</span>
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {/* Remaining Uploads Info */}
      {analyses.length < FREE_UPLOAD_LIMIT && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <p className="text-blue-800 font-medium">
            📊 Free uploads remaining: <span className="font-bold text-blue-600">{remainingUploads}/{FREE_UPLOAD_LIMIT}</span>
            {remainingUploads === 1 && ' - This is your last free analysis!'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Total Analyses</h3>
          <p className="text-4xl font-bold">{totalAnalyses}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-medium mb-1">Completed</h3>
          <p className="text-4xl font-bold">{completedAnalyses.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">⏳</div>
          <h3 className="text-lg font-medium mb-1">Processing</h3>
          <p className="text-4xl font-bold">{processingAnalyses.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">💡</div>
          <h3 className="text-lg font-medium mb-1">Top Skill</h3>
          <p className="text-xl font-bold truncate">{mostCommonSkill}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by skills or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <button className="px-6 py-3 border border-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-50">
            <span>📅</span>
            Sort By Date
            <span>▼</span>
          </button>
        </div>

        {filteredAnalyses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No analyses found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnalyses.map((analysis) => (
              <div
                key={analysis._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-lg">
                      CV Analysis
                    </h4>
                    {analysis.overallScore && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                        Score: {analysis.overallScore}/100
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Analyzed: {analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : new Date(analysis.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Skills Detected: {analysis.skillsDetected?.length || 0} | 
                    Experience: {analysis.extractedData?.totalYearsExperience || 0} years
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                      analysis.status === 'done' ? 'bg-green-100 text-green-800' :
                      analysis.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysis.status === 'done' ? 'COMPLETED' : analysis.status.toUpperCase()}
                    </span>
                  </div>
                  {analysis.status === 'done' ? (
                    <button 
                      onClick={() => viewDetails(analysis)}
                      className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="bg-gray-300 text-gray-500 px-6 py-2 rounded-xl font-medium cursor-not-allowed"
                    >
                      {analysis.status === 'pending' ? 'Processing...' : 'Failed'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAnalyses.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
              Prev
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
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
            <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
              Next
            </button>
          </div>
        )}
      </div>

      {showModal && selectedAnalysis && (
        <AnalysisModal 
          analysis={selectedAnalysis} 
          onClose={() => setShowModal(false)} 
        />
      )}

      {/* Upgrade to Premium Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">⭐</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upgrade to Premium
              </h2>
              
              <p className="text-gray-600 mb-8 text-lg">
                Unlock unlimited CV analyses and access premium features!
              </p>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Features</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Unlimited CV Analyses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Advanced AI Insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Priority Job Matching</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">Download PDF Reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="text-gray-700">24/7 Priority Support</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement payment/upgrade flow
                    alert('Premium upgrade coming soon!');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}