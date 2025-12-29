'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';

export default function RecruiterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      sessionStorage.removeItem('recruiterToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      toast.success('Logged out successfully');
      router.push('/recruiter/login');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/recruiter' },
    { icon: '➕', label: 'Post Job', href: '/recruiter/jobs/create' },
    { icon: '💼', label: 'My Jobs', href: '/recruiter/jobs' },
    { icon: '📋', label: 'Applications', href: '/recruiter/applications' },
    { icon: '⚙️', label: 'Settings', href: '/recruiter/settings' },
  ];

  return (
    <>
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen flex-shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💼</span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="font-bold text-xl">Recruiter</h2>
              </div>
            )}
          </div>
        </div>

        {!isSidebarCollapsed && userInfo && (
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                {userInfo.firstName?.[0]}{userInfo.lastName?.[0]}
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{userInfo.firstName} {userInfo.lastName}</p>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-2 flex-shrink-0">
          <p className="text-xs text-gray-500 uppercase">Main Menu</p>
        </div>

        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    pathname === item.href || (item.href !== '/recruiter' && pathname?.startsWith(item.href))
                      ? 'text-purple-600 font-bold bg-purple-50'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                  }`}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && <span className="flex-1">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full text-left px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-all flex items-center gap-3"
          >
            <span className="text-xl">🚪</span>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            {isSidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Are You Sure You Want To <span className="text-red-600">Logout?</span>
            </h2>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}