'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin' },
    { name: 'My Analyses', icon: '📝', path: '/admin/my-analyses' },
    { name: 'Applications', icon: '📋', path: '/admin/applications' },
    { name: 'Saved Jobs', icon: '💼', path: '/admin/saved-jobs' },
    { name: 'Job Matches', icon: '🎯', path: '/admin/job-matches' },
    { name: 'Support', icon: '💬', path: '/admin/support' },
    { name: 'Skills', icon: '⚡', path: '/admin/skills' },
    { name: 'Settings', icon: '⚙️', path: '/admin/settings' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative h-screen flex-shrink-0 ${
        isSidebarCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute top-1/17 -right-5 transform -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-blue-400 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-md"
      >
        <span className="text-xl text-gray-700">{isSidebarCollapsed ? '→' : '←'}</span>
      </button>

      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            <div>
              <h2 className="font-bold text-xl">CV Saathi</h2>
              <p className="text-xs text-gray-500">Together We Grow, Together We Improve</p>
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-2xl">📄</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => router.push(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                  isSidebarCollapsed ? 'justify-center' : 'gap-3'
                } ${
                  pathname === item.path
                    ? 'text-blue-600 font-bold border-l-4 border-blue-600 bg-blue-50'
                    : 'text-gray-700 font-medium hover:bg-gray-50'
                }`}
                title={isSidebarCollapsed ? item.name : ''}
              >
                <span className="text-xl">{item.icon}</span>
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>

        {!isSidebarCollapsed && (
          <div className="mt-4 bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-center mb-4 leading-relaxed">
              Are You Planning On Becoming<br />A Recruiter/Career Coach ?
            </p>
            <button className="w-full bg-blue-500 text-white rounded-xl py-3 px-4 font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <span>🔗</span>
              Join Now
            </button>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <button 
          onClick={handleLogout}
          className={`w-full bg-yellow-400 text-black rounded-xl py-3 px-4 font-bold hover:bg-yellow-500 transition-colors flex items-center ${
            isSidebarCollapsed ? 'justify-center' : 'justify-center gap-2'
          }`}
          title={isSidebarCollapsed ? 'Logout' : ''}
        >
          <span>🚪</span>
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}