

// 'use client';

// import { useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import api from '@/lib/baseapi';
// import { toast } from 'react-toastify';

// export default function AdminSidebar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
      
//       // Call logout API
//       await api.post('/auth/logout');
      
//       // Clear session storage
//       sessionStorage.removeItem('adminToken');
      
//       // Clear cookies by setting them to expire
//       document.cookie = 'accessToken=; path=/; max-age=0';
//       document.cookie = 'refreshToken=; path=/; max-age=0';
      
//       toast.success('Logged out successfully');
      
//       // Redirect to login
//       router.push('/admin/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Even if API call fails, still logout locally
//       sessionStorage.removeItem('adminToken');
//       document.cookie = 'accessToken=; path=/; max-age=0';
//       document.cookie = 'refreshToken=; path=/; max-age=0';
//       router.push('/admin/login');
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const menuItems = [
//     { name: 'Dashboard', icon: '📊', path: '/admin' },
//     { name: 'Users', icon: '👥', path: '/admin/users' },
//     { name: 'Analytics', icon: '📈', path: '/admin/analytics' },
//     { name: 'Support', icon: '💬', path: '/admin/support' },
//     { name: 'Contact', icon: '📧', path: '/admin/contact' },
//   ];

//   return (
//     <>
//       <aside 
//         className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative h-screen flex-shrink-0 ${
//           isSidebarCollapsed ? 'w-20' : 'w-72'
//         }`}
//       >
//         <div className="p-6 border-b border-gray-200 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
//               <span className="text-2xl">📄</span>
//             </div>
//             {!isSidebarCollapsed && (
//               <div>
//                 <h2 className="font-bold text-xl">Career Sync</h2>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="px-4 py-2 flex-shrink-0">
//           <p className="text-xs text-gray-500 uppercase">Main Menu</p>
//         </div>

//         <nav className="flex-1 px-4 py-2 overflow-y-auto" style={{
//           scrollbarWidth: 'none',
//           msOverflowStyle: 'none',
//         }}>
//           <style jsx>{`
//             nav::-webkit-scrollbar {
//               display: none;
//               width: 0;
//               height: 0;
//             }
//           `}</style>
//           <ul className="space-y-1">
//             {menuItems.map((item) => (
//               <li key={item.name}>
//                 <button
//                   onClick={() => router.push(item.path)}
//                   className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
//                     pathname === item.path
//                       ? 'text-teal-600 font-bold bg-teal-50'
//                       : 'text-gray-700 font-medium hover:bg-gray-50'
//                   }`}
//                   title={isSidebarCollapsed ? item.name : ''}
//                 >
//                   <span className="text-xl">{item.icon}</span>
//                   {!isSidebarCollapsed && <span>{item.name}</span>}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         <div className="p-4 border-t border-gray-200 flex-shrink-0">
//           <button 
//             onClick={() => setShowLogoutModal(true)}
//             className="w-full text-left px-4 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-all flex items-center gap-3"
//           >
//             <span className="text-xl">🚪</span>
//             {!isSidebarCollapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Logout Modal */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
//             <button 
//               onClick={() => setShowLogoutModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//               disabled={isLoggingOut}
//             >
//               ✕
//             </button>
//             <h2 className="text-2xl font-bold text-center mb-4">
//               Are You Sure You Want To <span className="text-red-600">Logout ?</span>
//             </h2>
//             <div className="flex gap-4 mt-6">
//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 disabled={isLoggingOut}
//                 className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 disabled={isLoggingOut}
//                 className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {isLoggingOut ? (
//                   <>
//                     <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                     Logging out...
//                   </>
//                 ) : (
//                   'Logout'
//                 )}
//               </button>
//             </div>
//             <p className="text-xs text-gray-500 text-center mt-4">
//               <span className="font-bold">note :</span> Your current session will be terminated and you will need to login before you can access anything
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    fetchUserRole();
    
  }, []);

  const fetchUserRole = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (!token) return;

      const { data } = await axios.get('https://amused-celinka-nothingname-3b1ecdef.koyeb.app/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserRole(data.user?.role || '');
      console.log('Fetched user role:', data.user?.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      await api.post('/auth/logout');
      
      sessionStorage.removeItem('adminToken');
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';
      
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      sessionStorage.removeItem('adminToken');
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // Role checks
  const isAdmin = userRole === 'admin';
  const isAgent = userRole === 'csr' || userRole === 'sales';

  return (
    <>
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative h-screen flex-shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📄</span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="font-bold text-xl">Career Sync</h2>
              </div>
            )}
          </div>
        </div>

        {/* Main Menu Label */}
        <div className="px-4 py-2 flex-shrink-0">
          <p className="text-xs text-gray-500 uppercase">Main Menu</p>
        </div>

        {/* Navigation */}
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
            {/* 1. Dashboard */}
            <li>
              <button
                onClick={() => router.push('/admin')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  pathname === '/admin'
                    ? 'text-teal-600 font-bold bg-teal-50'
                    : 'text-gray-700 font-medium hover:bg-gray-50'
                }`}
                title={isSidebarCollapsed ? 'Dashboard' : ''}
              >
                <span className="text-xl flex-shrink-0">📊</span>
                {!isSidebarCollapsed && <span className="flex-1">Dashboard</span>}
              </button>
            </li>

            {/* 2. Users (Admin only) */}
            {isAdmin && (
              <li>
                <button
                  onClick={() => router.push('/admin/users')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    pathname === '/admin/users'
                      ? 'text-teal-600 font-bold bg-teal-50'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                  }`}
                  title={isSidebarCollapsed ? 'Users' : ''}
                >
                  <span className="text-xl flex-shrink-0">👥</span>
                  {!isSidebarCollapsed && <span className="flex-1">Users</span>}
                </button>
              </li>
            )}

            {/* 3. Analytics (Admin only) */}
            {isAdmin && (
              <li>
                <button
                  onClick={() => router.push('/admin/analytics')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    pathname === '/admin/analytics'
                      ? 'text-teal-600 font-bold bg-teal-50'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                  }`}
                  title={isSidebarCollapsed ? 'Analytics' : ''}
                >
                  <span className="text-xl flex-shrink-0">📈</span>
                  {!isSidebarCollapsed && <span className="flex-1">Analytics</span>}
                </button>
              </li>
            )}

            {/* 4. Support (Original) */}
            {/* <li>
              <button
                onClick={() => router.push('/admin/support-old')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  pathname === '/admin/support-old'
                    ? 'text-teal-600 font-bold bg-teal-50'
                    : 'text-gray-700 font-medium hover:bg-gray-50'
                }`}
                title={isSidebarCollapsed ? 'Support' : ''}
              >
                <span className="text-xl flex-shrink-0">💬</span>
                {!isSidebarCollapsed && <span className="flex-1">Support</span>}
              </button>
            </li> */}

            {/* 5. Contact */}
            <li>
              <button
                onClick={() => router.push('/admin/contact')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  pathname === '/admin/contact'
                    ? 'text-teal-600 font-bold bg-teal-50'
                    : 'text-gray-700 font-medium hover:bg-gray-50'
                }`}
                title={isSidebarCollapsed ? 'Contact' : ''}
              >
                <span className="text-xl flex-shrink-0">📧</span>
                {!isSidebarCollapsed && <span className="flex-1">Contact</span>}
              </button>
            </li>
          </ul>

          {/* BLUE SECTION - NEW SUPPORT SYSTEM */}
          <div className="bg-blue-50 rounded-lg p-3 my-4">
            {!isSidebarCollapsed && (
              <p className="text-xs font-bold text-blue-900 uppercase mb-2 px-2">
                📁 SUPPORT SYSTEM
              </p>
            )}
            <ul className="space-y-1">
              {/* Support Tickets */}
              <li>
                <button
                  onClick={() => router.push('/admin/support')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    pathname === '/admin/support' 
                      ? 'text-blue-700 font-bold bg-white shadow-sm'
                      : 'text-blue-900 font-medium hover:bg-blue-100'
                  }`}
                  title={isSidebarCollapsed ? 'Support Tickets' : ''}
                >
                  <span className="text-xl flex-shrink-0">🎫</span>
                  {!isSidebarCollapsed && <span className="flex-1">Support Tickets</span>}
                </button>
              </li>

              {/* Agents */}
              <li>
                <button
                  onClick={() => router.push('/admin/support/agents')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    pathname.startsWith('/admin/support/agents')
                      ? 'text-blue-700 font-bold bg-white shadow-sm'
                      : 'text-blue-900 font-medium hover:bg-blue-100'
                  }`}
                  title={isSidebarCollapsed ? 'Agents' : ''}
                >
                  <span className="text-xl flex-shrink-0">👨‍💼</span>
                  {!isSidebarCollapsed && <span className="flex-1">Agents</span>}
                </button>
              </li>

              {/* Leaderboard */}
              <li>
                <button
                  onClick={() => router.push('/admin/support/leaderboard')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    pathname === '/admin/support/leaderboard'
                      ? 'text-blue-700 font-bold bg-white shadow-sm'
                      : 'text-blue-900 font-medium hover:bg-blue-100'
                  }`}
                  title={isSidebarCollapsed ? 'Leaderboard' : ''}
                >
                  <span className="text-xl flex-shrink-0">🏆</span>
                  {!isSidebarCollapsed && <span className="flex-1">Leaderboard</span>}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Permissions Info */}
        {!isSidebarCollapsed && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <p className="text-xs text-gray-600 font-medium">Your Permissions:</p>
            {userRole && (
              <p className="text-xs text-gray-500 mt-1">
                Role: <span className={`font-bold ${
                  userRole === 'admin' ? 'text-red-600' : 
                  userRole === 'csr' ? 'text-blue-600' : 
                  'text-green-600'
                }`}>{userRole.toUpperCase()}</span>
              </p>
            )}
            {isAgent && (
              <p className="text-xs text-gray-500 mt-1">❌ No delete access</p>
            )}
          </div>
        )}

        {/* Logout Button */}
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
              disabled={isLoggingOut}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-center mb-4">
              Are You Sure You Want To <span className="text-red-600">Logout ?</span>
            </h2>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Logging out...
                  </>
                ) : (
                  'Logout'
                )}
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