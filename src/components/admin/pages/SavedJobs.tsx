'use client';

import { useState } from 'react';

interface SavedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  deadline: string;
  posted: string;
  status: string;
  match: number;
}

export default function SavedJobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const savedJobs: SavedJob[] = [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Artova Solutions',
      location: '123 street Rd Kathmandu',
      deadline: '09 Dec, 2025',
      posted: '01 Nov 2025',
      status: 'Under Review',
      match: 92,
    },
    {
      id: 2,
      title: 'Junior Full Stack Developer',
      company: 'TechAxis Inc Pvt Ltd',
      location: '123 street Rd Kathmandu',
      deadline: '05 Dec, 2025',
      posted: '01 Nov 2025',
      status: 'Under Review',
      match: 88,
    },
    {
      id: 3,
      title: 'Wordpress Developer',
      company: 'Infotech Solutions',
      location: '123 street Rd Kathmandu',
      deadline: '11 Jan, 2026',
      posted: '01 Nov 2025',
      status: 'Under Review',
      match: 64,
    },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Saved Jobs</h1>
        <svg width="250" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 250 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Total Saved Jobs</h3>
          <p className="text-4xl font-bold">5</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Total Applied</h3>
          <p className="text-4xl font-bold">56</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 relative">
            <input
              type="text"
              placeholder="Search Job Title ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Company Name ...."
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🏢
            </span>
          </div>
          <button className="px-6 py-3 border border-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-50">
            <span>📅</span>
            Sort By Date
            <span>▼</span>
          </button>
        </div>

        <div className="space-y-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
            >
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{job.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                <p className="text-sm text-gray-600 mb-1">📍 {job.location}</p>
                <p className="text-sm text-gray-600">Deadline : {job.deadline}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">Posted : {job.posted}</p>
                <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl text-sm font-medium">
                  {job.status}
                </span>
                <div className="text-right">
                  <p
                    className={`text-3xl font-bold ${
                      job.match >= 90
                        ? 'text-green-500'
                        : job.match >= 70
                        ? 'text-green-400'
                        : 'text-orange-400'
                    }`}
                  >
                    {job.match}%
                  </p>
                  <p className="text-sm text-gray-600">match</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                  <button className="bg-red-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-red-600 transition-colors">
                    Remove
                  </button>
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