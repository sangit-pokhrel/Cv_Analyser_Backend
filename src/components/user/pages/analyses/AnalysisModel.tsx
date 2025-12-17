// // 'use client';

// // interface AnalysisData {
// //   personalInfo?: {
// //     name?: string;
// //     email?: string;
// //     phone?: string;
// //     location?: string;
// //   };
// //   summary?: string;
// //   skills?: {
// //     technical?: string[];
// //     soft?: string[];
// //     languages?: string[];
// //     tools?: string[];
// //   };
// //   experience?: Array<{
// //     position?: string;
// //     title?: string;
// //     company: string;
// //     duration?: string;
// //     description?: string;
// //     achievements?: string[];
// //   }>;
// //   education?: Array<{
// //     degree: string;
// //     institution: string;
// //     duration?: string;
// //     grade?: string;
// //   }>;
// //   strengths?: string[];
// //   areasForImprovement?: string[];
// //   careerRecommendations?: string[];
// // }

// // interface Analysis {
// //   _id: string;
// //   userId: string;
// //   cvUrl: string;
// //   status: 'processing' | 'completed' | 'failed';
// //   analysisData: AnalysisData;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // interface AnalysisModalProps {
// //   analysis: Analysis;
// //   onClose: () => void;
// // }

// // export default function AnalysisModal({ analysis, onClose }: AnalysisModalProps) {
// //   const data = analysis.analysisData;

// //   return (
// //     <div 
// //       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
// //       onClick={onClose}
// //     >
// //       <div 
// //         className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" 
// //         onClick={(e) => e.stopPropagation()}
// //       >
        
// //         {/* Header */}
// //         <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
// //           <h2 className="text-2xl font-bold">Analysis Details</h2>
// //           <button 
// //             onClick={onClose} 
// //             className="text-3xl hover:text-gray-600 leading-none"
// //           >
// //             &times;
// //           </button>
// //         </div>

// //         {/* Content */}
// //         <div className="p-6">
// //           {/* Personal Info */}
// //           {data?.personalInfo && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Personal Information</h3>
// //               <div className="grid grid-cols-2 gap-4">
// //                 {data.personalInfo.name && (
// //                   <div>
// //                     <p className="text-sm text-gray-500">Name</p>
// //                     <p className="font-semibold">{data.personalInfo.name}</p>
// //                   </div>
// //                 )}
// //                 {data.personalInfo.email && (
// //                   <div>
// //                     <p className="text-sm text-gray-500">Email</p>
// //                     <p className="font-semibold">{data.personalInfo.email}</p>
// //                   </div>
// //                 )}
// //                 {data.personalInfo.phone && (
// //                   <div>
// //                     <p className="text-sm text-gray-500">Phone</p>
// //                     <p className="font-semibold">{data.personalInfo.phone}</p>
// //                   </div>
// //                 )}
// //                 {data.personalInfo.location && (
// //                   <div>
// //                     <p className="text-sm text-gray-500">Location</p>
// //                     <p className="font-semibold">{data.personalInfo.location}</p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Summary */}
// //           {data?.summary && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Professional Summary</h3>
// //               <p className="text-gray-700 leading-relaxed">{data.summary}</p>
// //             </div>
// //           )}

// //           {/* Skills */}
// //           {data?.skills && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Skills</h3>
              
// //               {data.skills.technical && data.skills.technical.length > 0 && (
// //                 <div className="mb-4">
// //                   <p className="font-semibold mb-2">Technical Skills:</p>
// //                   <div className="flex flex-wrap gap-2">
// //                     {data.skills.technical.map((skill, i) => (
// //                       <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
// //                         {skill}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {data.skills.soft && data.skills.soft.length > 0 && (
// //                 <div className="mb-4">
// //                   <p className="font-semibold mb-2">Soft Skills:</p>
// //                   <div className="flex flex-wrap gap-2">
// //                     {data.skills.soft.map((skill, i) => (
// //                       <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
// //                         {skill}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {data.skills.languages && data.skills.languages.length > 0 && (
// //                 <div className="mb-4">
// //                   <p className="font-semibold mb-2">Languages:</p>
// //                   <div className="flex flex-wrap gap-2">
// //                     {data.skills.languages.map((skill, i) => (
// //                       <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
// //                         {skill}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {data.skills.tools && data.skills.tools.length > 0 && (
// //                 <div className="mb-4">
// //                   <p className="font-semibold mb-2">Tools & Technologies:</p>
// //                   <div className="flex flex-wrap gap-2">
// //                     {data.skills.tools.map((skill, i) => (
// //                       <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
// //                         {skill}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* Experience */}
// //           {data?.experience && data.experience.length > 0 && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Work Experience</h3>
// //               <div className="space-y-4">
// //                 {data.experience.map((exp, i) => (
// //                   <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
// //                     <p className="font-bold text-lg">{exp.position || exp.title}</p>
// //                     <p className="text-gray-700 font-medium">{exp.company}</p>
// //                     {exp.duration && (
// //                       <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
// //                     )}
// //                     {exp.description && (
// //                       <p className="text-gray-600 mb-2">{exp.description}</p>
// //                     )}
// //                     {exp.achievements && exp.achievements.length > 0 && (
// //                       <ul className="list-disc pl-5 text-gray-600 space-y-1">
// //                         {exp.achievements.map((achievement, idx) => (
// //                           <li key={idx}>{achievement}</li>
// //                         ))}
// //                       </ul>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Education */}
// //           {data?.education && data.education.length > 0 && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Education</h3>
// //               <div className="space-y-3">
// //                 {data.education.map((edu, i) => (
// //                   <div key={i} className="border-l-4 border-green-500 pl-4 py-2">
// //                     <p className="font-bold text-lg">{edu.degree}</p>
// //                     <p className="text-gray-700 font-medium">{edu.institution}</p>
// //                     {edu.duration && (
// //                       <p className="text-sm text-gray-500">{edu.duration}</p>
// //                     )}
// //                     {edu.grade && (
// //                       <p className="text-sm text-gray-600">Grade: {edu.grade}</p>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {/* Strengths */}
// //           {data?.strengths && data.strengths.length > 0 && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Strengths</h3>
// //               <ul className="list-disc pl-5 text-gray-700 space-y-2">
// //                 {data.strengths.map((s, i) => (
// //                   <li key={i}>{s}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}

// //           {/* Areas for Improvement */}
// //           {data?.areasForImprovement && data.areasForImprovement.length > 0 && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Areas for Improvement</h3>
// //               <ul className="list-disc pl-5 text-gray-700 space-y-2">
// //                 {data.areasForImprovement.map((a, i) => (
// //                   <li key={i}>{a}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}

// //           {/* Career Recommendations */}
// //           {data?.careerRecommendations && data.careerRecommendations.length > 0 && (
// //             <div className="mb-6">
// //               <h3 className="font-bold text-xl mb-3 border-b pb-2">Career Recommendations</h3>
// //               <ul className="list-disc pl-5 text-gray-700 space-y-2">
// //                 {data.careerRecommendations.map((r, i) => (
// //                   <li key={i}>{r}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}

// //           {/* Analysis Info */}
// //           <div className="bg-gray-50 rounded-lg p-4 mt-6">
// //             <h3 className="font-bold text-lg mb-3">Analysis Information</h3>
// //             <div className="grid grid-cols-2 gap-3 text-sm">
// //               <div>
// //                 <p className="text-gray-500">Analysis ID</p>
// //                 <p className="font-mono text-gray-900">{analysis._id}</p>
// //               </div>
// //               <div>
// //                 <p className="text-gray-500">Status</p>
// //                 <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
// //                   analysis.status === 'completed' ? 'bg-green-100 text-green-800' :
// //                   analysis.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
// //                   'bg-red-100 text-red-800'
// //                 }`}>
// //                   {analysis.status.toUpperCase()}
// //                 </span>
// //               </div>
// //               <div>
// //                 <p className="text-gray-500">Created At</p>
// //                 <p className="text-gray-900">
// //                   {new Date(analysis.createdAt).toLocaleDateString('en-US', {
// //                     year: 'numeric',
// //                     month: 'long',
// //                     day: 'numeric',
// //                     hour: '2-digit',
// //                     minute: '2-digit'
// //                   })}
// //                 </p>
// //               </div>
// //               {analysis.cvUrl && (
// //                 <div>
// //                   <p className="text-gray-500">CV File</p>
// //                   <a
// //                     href={analysis.cvUrl}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="text-blue-600 hover:underline"
// //                   >
// //                     View Original CV
// //                   </a>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Footer */}
// //         <div className="sticky bottom-0 bg-gray-50 border-t p-4">
// //           <button
// //             onClick={onClose}
// //             className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
// //           >
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// 'use client';

// import { useRef } from 'react';

// interface Analysis {
//   _id: string;
//   user: string;
//   cvFileUrl: string;
//   status: string;
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
//     detailedAnalysis: {
//       formatting: string;
//       content: string;
//       keywords: string;
//       atsCompatibility: string;
//     };
//   };
//   createdAt: string;
//   analyzedAt?: string;
// }

// interface AnalysisModalProps {
//   analysis: Analysis;
//   onClose: () => void;
// }

// export default function AnalysisModal({ analysis, onClose }: AnalysisModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null);

//   const handleDownloadPDF = async () => {
//     try {
//       // Use browser's print to PDF functionality
//       window.print();
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       alert('Failed to generate PDF');
//     }
//   };

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return 'text-green-600 bg-green-100';
//     if (score >= 60) return 'text-blue-600 bg-blue-100';
//     if (score >= 40) return 'text-orange-600 bg-orange-100';
//     return 'text-red-600 bg-red-100';
//   };

//   return (
//     <>
//       {/* Print Styles */}
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           #printable-content, #printable-content * {
//             visibility: visible;
//           }
//           #printable-content {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>

//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto no-print">
//         <div className="bg-white rounded-2xl max-w-5xl w-full my-8 shadow-xl">
//           {/* Header */}
//           <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl z-10 flex justify-between items-center no-print">
//             <h2 className="text-2xl font-bold">CV Analysis Report</h2>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleDownloadPDF}
//                 className="px-6 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center gap-2"
//               >
//                 <span>📥</span>
//                 Download PDF
//               </button>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 ×
//               </button>
//             </div>
//           </div>

//           {/* Printable Content */}
//           <div id="printable-content" ref={modalRef} className="p-8">
//             {/* Overall Score */}
//             <div className="text-center mb-8">
//               <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreColor(analysis.overallScore)} mb-4`}>
//                 <span className="text-5xl font-bold">{analysis.overallScore}</span>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Overall Score</h3>
//               <p className="text-gray-600">
//                 Analyzed on {analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 }) : new Date(analysis.createdAt).toLocaleDateString()}
//               </p>
//             </div>

//             {/* Extracted Data Summary */}
//             <div className="bg-blue-50 rounded-2xl p-6 mb-8">
//               <h3 className="text-xl font-bold mb-4">Profile Summary</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Total Experience</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {analysis.extractedData.totalYearsExperience} years
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Skills Detected</p>
//                   <p className="text-2xl font-bold text-blue-600">
//                     {analysis.skillsDetected.length}
//                   </p>
//                 </div>
//               </div>
              
//               {analysis.extractedData.experience && (
//                 <div className="mt-4">
//                   <p className="text-sm font-medium text-gray-700 mb-2">Experience Overview</p>
//                   <p className="text-gray-700 text-sm">{analysis.extractedData.experience}</p>
//                 </div>
//               )}
//             </div>

//             {/* Strengths */}
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <span className="text-2xl">💪</span>
//                 Strengths
//               </h3>
//               <div className="space-y-3">
//                 {analysis.strengths.map((strength, index) => (
//                   <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-4">
//                     <p className="text-gray-800">{strength}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Weaknesses */}
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <span className="text-2xl">⚠️</span>
//                 Areas for Improvement
//               </h3>
//               <div className="space-y-3">
//                 {analysis.weaknesses.map((weakness, index) => (
//                   <div key={index} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
//                     <p className="text-gray-800">{weakness}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recommendations */}
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <span className="text-2xl">💡</span>
//                 Recommendations
//               </h3>
//               <div className="space-y-3">
//                 {analysis.recommendations.map((recommendation, index) => (
//                   <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                     <p className="text-gray-800">{recommendation}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Skills Detected */}
//             <div className="mb-8">
//               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <span className="text-2xl">🎯</span>
//                 Skills Detected
//               </h3>
//               <div className="flex flex-wrap gap-2">
//                 {analysis.skillsDetected.map((skill, index) => (
//                   <span
//                     key={index}
//                     className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Education */}
//             {analysis.extractedData.education.length > 0 && (
//               <div className="mb-8">
//                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                   <span className="text-2xl">🎓</span>
//                   Education
//                 </h3>
//                 <div className="space-y-3">
//                   {analysis.extractedData.education.map((edu, index) => (
//                     <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//                       <p className="text-gray-800">{edu}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Detailed Analysis */}
//             {analysis.analysisResult?.detailedAnalysis && (
//               <div className="mb-8">
//                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                   <span className="text-2xl">📊</span>
//                   Detailed Analysis
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-white border border-gray-200 rounded-xl p-4">
//                     <h4 className="font-bold text-gray-900 mb-2">Formatting</h4>
//                     <p className="text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.formatting}</p>
//                   </div>
//                   <div className="bg-white border border-gray-200 rounded-xl p-4">
//                     <h4 className="font-bold text-gray-900 mb-2">Content</h4>
//                     <p className="text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.content}</p>
//                   </div>
//                   <div className="bg-white border border-gray-200 rounded-xl p-4">
//                     <h4 className="font-bold text-gray-900 mb-2">Keywords</h4>
//                     <p className="text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.keywords}</p>
//                   </div>
//                   <div className="bg-white border border-gray-200 rounded-xl p-4">
//                     <h4 className="font-bold text-gray-900 mb-2">ATS Compatibility</h4>
//                     <p className="text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.atsCompatibility}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="border-t p-6 bg-gray-50 rounded-b-2xl no-print">
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={onClose}
//                 className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


'use client';

import { useRef } from 'react';

interface Analysis {
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
  analysisResult?: {
    overallScore: number;
    detailedAnalysis: {
      formatting: string;
      content: string;
      keywords: string;
      atsCompatibility: string;
    };
  };
  createdAt: string;
  analyzedAt?: string;
}

interface AnalysisModalProps {
  analysis: Analysis;
  onClose: () => void;
}

export default function AnalysisModal({ analysis, onClose }: AnalysisModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    try {
      // Use browser's print to PDF functionality
      window.print();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto no-print">
        <div className="bg-white rounded-2xl max-w-7xl w-full my-8 shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 md:p-6 rounded-t-2xl z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
            <h2 className="text-xl md:text-2xl font-bold">CV Analysis Report</h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <span>📥</span>
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl px-3"
              >
                ×
              </button>
            </div>
          </div>

          {/* Printable Content - Scrollable */}
          <div id="printable-content" ref={modalRef} className="p-4 md:p-8 overflow-y-auto flex-1">
            {/* Overall Score */}
            <div className="text-center mb-6 md:mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full ${getScoreColor(analysis.overallScore)} mb-4`}>
                <span className="text-4xl md:text-5xl font-bold">{analysis.overallScore}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Overall Score</h3>
              <p className="text-sm md:text-base text-gray-600">
                Analyzed on {analysis.analyzedAt ? new Date(analysis.analyzedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : new Date(analysis.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Extracted Data Summary */}
            <div className="bg-blue-50 rounded-2xl p-4 md:p-6 mb-6 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold mb-4">Profile Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Experience</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">
                    {analysis.extractedData.totalYearsExperience} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills Detected</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">
                    {analysis.skillsDetected.length}
                  </p>
                </div>
              </div>
              
              {analysis.extractedData.experience && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Experience Overview</p>
                  <p className="text-gray-700 text-sm">{analysis.extractedData.experience}</p>
                </div>
              )}
            </div>

            {/* Two Column Layout for Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Strengths */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl md:text-2xl">💪</span>
                    Strengths
                  </h3>
                  <div className="space-y-3">
                    {analysis.strengths.map((strength, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
                        <p className="text-sm md:text-base text-gray-800">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl md:text-2xl">💡</span>
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
                        <p className="text-sm md:text-base text-gray-800">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 md:space-y-8">
                {/* Weaknesses */}
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl md:text-2xl">⚠️</span>
                    Areas for Improvement
                  </h3>
                  <div className="space-y-3">
                    {analysis.weaknesses.map((weakness, index) => (
                      <div key={index} className="bg-orange-50 border border-orange-200 rounded-xl p-3 md:p-4">
                        <p className="text-sm md:text-base text-gray-800">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                {analysis.extractedData.education.length > 0 && (
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                      <span className="text-xl md:text-2xl">🎓</span>
                      Education
                    </h3>
                    <div className="space-y-3">
                      {analysis.extractedData.education.map((edu, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-4">
                          <p className="text-sm md:text-base text-gray-800">{edu}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Full Width Sections */}
            <div className="mt-6 md:mt-8 space-y-6 md:space-y-8">
              {/* Skills Detected */}
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-xl md:text-2xl">🎯</span>
                  Skills Detected
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skillsDetected.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-purple-100 text-purple-800 rounded-full text-xs md:text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Analysis */}
              {analysis.analysisResult?.detailedAnalysis && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-xl md:text-2xl">📊</span>
                    Detailed Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
                      <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Formatting</h4>
                      <p className="text-xs md:text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.formatting}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
                      <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Content</h4>
                      <p className="text-xs md:text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.content}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
                      <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Keywords</h4>
                      <p className="text-xs md:text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.keywords}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
                      <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">ATS Compatibility</h4>
                      <p className="text-xs md:text-sm text-gray-700">{analysis.analysisResult.detailedAnalysis.atsCompatibility}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 md:p-6 bg-gray-50 rounded-b-2xl no-print">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}