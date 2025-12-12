'use client';

import { useState } from 'react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  posted: string;
  deadline: string;
  match: number;
}

export default function JobMatches() {
  const [currentPage, setCurrentPage] = useState(1);
  const [hasJobs, setHasJobs] = useState(true);

  const jobs: Job[] = [
    {
      id: 1,
      title: 'Senior UI/UX designer',
      company: 'TechAxis Inc Pvt Ltd',
      location: '123 street Rd Kathmandu',
      salary: 'Npr 40,000 - Npr 60,000',
      type: 'Full Time',
      posted: '01 Nov 2025',
      deadline: '5 Dec, 2025',
      match: 72,
    },
    {
      id: 2,
      title: 'Junior Full Stack Developer',
      company: 'TechAxis Inc Pvt Ltd',
      location: '123 street Rd Kathmandu',
      salary: 'Npr 40,000 - Npr 60,000',
      type: 'Full Time',
      posted: '01 Nov 2025',
      deadline: '5 Dec, 2025',
      match: 96,
    },
    {
      id: 3,
      title: 'Laravel Full Stack Developer',
      company: 'TechAxis Inc Pvt Ltd',
      location: '123 street Rd Kathmandu',
      salary: 'Npr 40,000 - Npr 60,000',
      type: 'Full Time',
      posted: '01 Nov 2025',
      deadline: '5 Dec, 2025',
      match: 57,
    },
    {
      id: 4,
      title: 'Wordpress Developer',
      company: 'TechAxis Inc Pvt Ltd',
      location: '123 street Rd Kathmandu',
      salary: 'Npr 40,000 - Npr 60,000',
      type: 'Full Time',
      posted: '01 Nov 2025',
      deadline: '5 Dec, 2025',
      match: 92,
    },
  ];

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-500';
    if (match >= 70) return 'text-green-400';
    if (match >= 50) return 'text-orange-400';
    return 'text-red-500';
  };

  if (!hasJobs) {
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
          <h2 className="text-4xl font-bold mb-4">No Any Jobs For You !</h2>
          <p className="text-xl text-gray-600 mb-8">Why not analyse cv first?</p>
          <button className="bg-blue-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-600 transition-colors">
            Start Analysis
          </button>
        </div>
      </>
    );
  }

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

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                <p className="text-gray-700 mb-2">{job.company}</p>
                <p className="text-sm text-gray-600 mb-1">📍 {job.location}</p>
                <p className="text-sm text-gray-700 font-medium">{job.salary}</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-right">
                  <span className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-2">
                    {job.type}
                  </span>
                  <p className="text-sm text-gray-600">
                    Posted : {job.posted}
                    <span className="ml-2 text-red-500">Deadline : {job.deadline}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-4xl font-bold ${getMatchColor(job.match)}`}>
                    {job.match}%
                  </p>
                  <p className="text-sm text-gray-600">match</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors whitespace-nowrap">
                    View Job
                  </button>
                  <button className="bg-orange-400 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-500 transition-colors">
                    Save
                  </button>
                </div>
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
    </>
  );
}