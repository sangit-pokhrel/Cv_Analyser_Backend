'use client';

import { useState, useEffect } from 'react';

export default function RecruiterHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs, candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <span className="text-xl">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {userInfo?.firstName?.[0]}{userInfo?.lastName?.[0]}
          </div>
          <div>
            <p className="font-bold text-sm">{userInfo?.firstName} {userInfo?.lastName}</p>
            <p className="text-xs text-gray-500">Recruiter</p>
          </div>
        </div>
      </div>
    </header>
  );
}