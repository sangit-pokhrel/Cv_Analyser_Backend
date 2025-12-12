'use client';

import { useState } from 'react';

interface Application {
  id: number;
  title: string;
  company: string;
  appliedDate: string;
  deadline: string;
  status: 'Under Review' | 'Rejected' | 'Accepted' | 'Interview';
  match: number;
}

export default function Applications() {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const applications: Application[] = [
    {
      id: 1,
      title: 'Junior Full Stack Developer',
      company: 'TechAxis Inc Pvt Ltd',
      appliedDate: 'Nov 8, 2025',
      deadline: 'Dec 15, 2025',
      status: 'Under Review',
      match: 92,
    },
    {
      id: 2,
      title: 'Junior Full Stack Developer',
      company: 'TechAxis Inc Pvt Ltd',
      appliedDate: 'Nov 8, 2025',
      deadline: 'Dec 15, 2025',
      status: 'Rejected',
      match: 92,
    },
    {
      id: 3,
      title: 'Junior Full Stack Developer',
      company: 'TechAxis Inc Pvt Ltd',
      appliedDate: 'Nov 8, 2025',
      deadline: 'Dec 15, 2025',
      status: 'Accepted',
      match: 92,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review':
        return 'bg-blue-100 text-blue-600';
      case 'Rejected':
        return 'bg-red-500 text-white';
      case 'Accepted':
        return 'bg-green-500 text-white';
      case 'Interview':
        return 'bg-orange-400 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

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
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Total Applications</h3>
          <p className="text-4xl font-bold">5</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Under Review</h3>
          <p className="text-4xl font-bold">5</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Interview</h3>
          <p className="text-4xl font-bold">3</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Accepted/Rejected</h3>
          <p className="text-4xl font-bold">
            <span className="text-green-500">5</span>/<span className="text-red-500">6</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-3 mb-6 flex-wrap">
          {['ALL', 'Under Review', 'Accepted', 'Rejected', 'Interview'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-xl font-medium transition-colors ${
                activeFilter === filter
                  ? filter === 'ALL'
                    ? 'bg-blue-500 text-white'
                    : filter === 'Under Review'
                    ? 'bg-blue-400 text-white'
                    : filter === 'Accepted'
                    ? 'bg-green-500 text-white'
                    : filter === 'Rejected'
                    ? 'bg-red-500 text-white'
                    : 'bg-orange-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div>
                <h4 className="font-bold text-lg mb-1">{application.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{application.company}</p>
                <p className="text-sm text-gray-600">
                  Applied Date : {application.appliedDate}
                  <span className="ml-4 text-red-500">Deadline : {application.deadline}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-6 py-2 rounded-xl font-medium ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-500">{application.match}%</p>
                  <p className="text-sm text-gray-600">Match</p>
                </div>
              </div>
            </div>
          ))}
        </div>

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
      </div>
    </>
  );
}