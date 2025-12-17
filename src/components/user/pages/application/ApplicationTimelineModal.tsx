'use client';

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

interface ApplicationTimelineModalProps {
  application: Application;
  onClose: () => void;
}

export default function ApplicationTimelineModal({ application, onClose }: ApplicationTimelineModalProps) {
  const getStatusInfo = (status: string) => {
    const lowerStatus = status.toLowerCase();
    switch (lowerStatus) {
      case 'pending':
      case 'submitted':
        return { label: 'Application Submitted', icon: '📝', color: 'blue' };
      case 'reviewed':
        return { label: 'Application Reviewed', icon: '👀', color: 'purple' };
      case 'shortlisted':
        return { label: 'Shortlisted', icon: '⭐', color: 'yellow' };
      case 'interview':
        return { label: 'Interview Scheduled', icon: '🎤', color: 'orange' };
      case 'rejected':
        return { label: 'Application Rejected', icon: '❌', color: 'red' };
      case 'accepted':
        return { label: 'Offer Accepted', icon: '✅', color: 'green' };
      default:
        return { label: status, icon: '📌', color: 'gray' };
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' };
      case 'purple':
        return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' };
      case 'yellow':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' };
      case 'orange':
        return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' };
      case 'red':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' };
      case 'green':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-500' };
    }
  };

  // Build basic timeline
  const timeline = [
    {
      status: application.status,
      timestamp: application.appliedDate,
      note: 'Application submitted successfully'
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">Application Details</h2>
            <p className="text-gray-600">{application.job?.title}</p>
            <p className="text-sm text-gray-500">{application.job?.companyName}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-3xl hover:text-gray-600 leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Job Details */}
          <div className="mb-8 bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-semibold">{application.job?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-semibold">{application.job?.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{application.job?.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-semibold capitalize">{application.job?.jobType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary Range</p>
                <p className="font-semibold">
                  ${application.job?.salaryMin?.toLocaleString()} - ${application.job?.salaryMax?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application ID</p>
                <p className="font-mono text-sm">{application._id}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">Current Status</h3>
            <div className={`p-4 rounded-lg ${getColorClasses(getStatusInfo(application.status).color).bg}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getStatusInfo(application.status).icon}</span>
                <div>
                  <p className={`font-bold text-lg ${getColorClasses(getStatusInfo(application.status).color).text}`}>
                    {getStatusInfo(application.status).label}
                  </p>
                  <p className="text-sm text-gray-600">
                    Applied on: {new Date(application.appliedDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last updated: {new Date(application.updatedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4">Application Timeline</h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Timeline items */}
              <div className="space-y-6">
                {timeline.map((item, index) => {
                  const statusInfo = getStatusInfo(item.status);
                  const colors = getColorClasses(statusInfo.color);
                  
                  return (
                    <div key={index} className="relative pl-16">
                      {/* Timeline dot */}
                      <div className={`absolute left-0 w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center border-4 border-white shadow-md`}>
                        <span className="text-xl">{statusInfo.icon}</span>
                      </div>

                      {/* Timeline content */}
                      <div className={`p-4 rounded-lg border-l-4 ${colors.border} bg-gray-50`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold ${colors.text}`}>
                            {statusInfo.label}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(item.timestamp).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {item.note && (
                          <p className="text-gray-600 text-sm">{item.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          {application.coverLetter && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">Cover Letter</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>
          )}

          {/* Resume Link */}
          {application.resumeUrl && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3">Resume</h3>
              <a
                href={application.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>📄</span>
                View Resume
              </a>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}