'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// All the page imports required for the components
import DashboardContent from './pages/DashboardContent';
import MyAnalyses from './pages/MyAnalyses';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import JobMatches from './pages/JobMatches';
import Support from './pages/Support';
import Skills from './pages/Skills';
import Settings from './pages/Settings';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'My Analyses', icon: '📝' },
    { name: 'Applications', icon: '📋' },
    { name: 'Saved Jobs', icon: '💼' },
    { name: 'Job Matches', icon: '🎯' },
    { name: 'Support', icon: '💬' },
    { name: 'Skills', icon: '⚡' },
    { name: 'Settings', icon: '⚙️' },
  ];

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'My Analyses':
        return <MyAnalyses />;
      case 'Applications':
        return <Applications />;
      case 'Saved Jobs':
        return <SavedJobs />;
      case 'Job Matches':
        return <JobMatches />;
      case 'Support':
        return <Support />;
      case 'Skills':
        return <Skills />;
      case 'Settings':
        return <Settings />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F8FF]">
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative ${
          isSidebarCollapsed ? 'w-20' : 'w-80'
        }`}
      >
     
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-1/17 -right-5 transform -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-md"
        >
          <span className="text-xl text-gray-700">{isSidebarCollapsed ? '→' : '←'}</span>
        </button>

        <div className="p-6 border-b border-gray-200">
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
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${
                    isSidebarCollapsed ? 'justify-center' : 'gap-3'
                  } ${
                    activeTab === item.name
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
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
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

        <div className="p-4 border-t border-gray-200">
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

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto scale-90 origin-top-left">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}