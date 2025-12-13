'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/admin' },
    { name: 'Users', icon: '👥', path: '/admin/users' },
    { name: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { name: 'Support', icon: '💬', path: '/admin/support' },
    { name: 'Contact', icon: '📧', path: '/admin/contact' },
  ];

  return (
    <>
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative h-screen flex-shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="font-bold text-xl">CV Saathi</h2>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-2 flex-shrink-0">
          <p className="text-xs text-gray-500 uppercase">Main Menu</p>
        </div>

        <nav className="flex-1 px-4 py-2 overflow-y-auto" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <style jsx>{`
            nav::-webkit-scrollbar {
              display: none;
              width: 0;
              height: 0;
            }
          `}</style>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    pathname === item.path
                      ? 'text-teal-600 font-bold bg-teal-50'
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
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">
              Are You Sure You Want To <span className="text-red-600">Logout ?</span>
            </h2>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              <span className="font-bold">note :</span> Your current session will be terminated and you will need to login before you can access anything
            </p>
          </div>
        </div>
      )}
    </>
  );
}