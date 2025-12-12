// src/components/admin/pages/MyAnalyses.tsx
'use client';

import { useState } from 'react';

interface Analysis {
  id: number;
  title: string;
  date: string;
  keywords: number;
  score: number;
}

export default function MyAnalyses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const analyses: Analysis[] = [
    { id: 1, title: 'Full Stack Developer', date: 'Nov 8, 2025', keywords: 42, score: 78 },
    { id: 2, title: 'Full Stack Developer', date: 'Nov 8, 2025', keywords: 42, score: 92 },
    { id: 3, title: 'Full Stack Developer', date: 'Nov 8, 2025', keywords: 42, score: 92 },
    { id: 4, title: 'Full Stack Developer', date: 'Nov 7, 2025', keywords: 38, score: 85 },
    { id: 5, title: 'Frontend Developer', date: 'Nov 6, 2025', keywords: 35, score: 88 },
  ];

  const totalPages = 5;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome Back Sangit</h1>
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

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Total Analyses</h3>
          <p className="text-4xl font-bold">5</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Average Score</h3>
          <p className="text-4xl font-bold">80</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Best Score</h3>
          <p className="text-4xl font-bold">95</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium mb-1">Top Skill</h3>
          <p className="text-2xl font-bold">Javascript</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search Analysis"
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

        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div>
                <h4 className="font-bold text-lg mb-1">{analysis.title}</h4>
                <p className="text-sm text-gray-600">{analysis.date}</p>
                <p className="text-sm text-gray-600">Keywords: {analysis.keywords}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    analysis.score >= 90 ? 'text-green-500' : 
                    analysis.score >= 80 ? 'text-green-400' : 
                    'text-yellow-500'
                  }`}>
                    {analysis.score}
                  </p>
                  <p className="text-sm text-gray-600">ATS Score</p>
                </div>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                  View Details
                </button>
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