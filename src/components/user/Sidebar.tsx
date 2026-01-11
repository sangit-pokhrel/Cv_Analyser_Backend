

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import api from '@/lib/baseapi';
// import { toast } from 'react-toastify';

// export default function UserSidebar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [userInfo, setUserInfo] = useState<any>(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [isPremiumJobSeeker, setIsPremiumJobSeeker] = useState(false);

//   useEffect(() => {
//     fetchUserProfile();
//     fetchUnreadCount();
    
//     // Poll for unread count every 30 seconds
//     const interval = setInterval(fetchUnreadCount, 30000);
    
//     return () => clearInterval(interval);
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const { data } = await api.get('/users/me');
//       const userData = data.user || data;
//       setUserInfo(userData);
      
//       // Check if user is job_seeker AND isPremium
//       const isPremium = userData.role === 'job_seeker' && userData.isPremium == true;
//       setIsPremiumJobSeeker(isPremium);
      
//       // Also store in localStorage for quick access
//       localStorage.setItem('user', JSON.stringify(userData));
//     } catch (error) {
//       console.error('Error fetching user profile:', error);
//     }
//   };

//   const getAccessToken = () => {
//     return document.cookie
//       .split('; ')
//       .find(row => row.startsWith('accessToken='))
//       ?.split('=')[1];
//   };

//   const fetchUnreadCount = async () => {
//     try {
//       const token = getAccessToken();
//       if (!token) return;
      
//       const { data } = await api.get('/support/tickets', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       setUnreadCount(data.unreadCount || 0);
//     } catch (error) {
//       console.log('Could not fetch unread count');
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       setIsLoggingOut(true);
      
//       // Call logout API
//       await api.post('/user/logout');
      
//       // Clear session storage
//       sessionStorage.removeItem('userToken');
//       sessionStorage.removeItem('userId');
//       sessionStorage.removeItem('userData');
      
//       // Clear localStorage
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('user');
      
//       // Clear cookies
//       document.cookie = 'accessToken=; path=/; max-age=0';
//       document.cookie = 'refreshToken=; path=/; max-age=0';
      
//       toast.success('Logged out successfully');
//       router.push('/user/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Even if API call fails, still logout locally
//       sessionStorage.clear();
//       localStorage.clear();
//       document.cookie = 'accessToken=; path=/; max-age=0';
//       document.cookie = 'refreshToken=; path=/; max-age=0';
//       router.push('/user/login');
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   // Define a type for menu items
//   type MenuItem = {
//     name: string;
//     icon: string;
//     path: string;
//     isPremium?: boolean;
//     hasNotification?: boolean;
//   };

//   // Base menu items (always shown)
//   const baseMenuItems: MenuItem[] = [
//     { name: 'Dashboard', icon: '📊', path: '/user' },
//     { name: 'My Analyses', icon: '📝', path: '/user/my-analyses' },
//     { name: 'Applications', icon: '📋', path: '/user/applications' },
//     { name: 'Saved Jobs', icon: '💼', path: '/user/saved-jobs' },
//     { name: 'Job Matches', icon: '🎯', path: '/user/job-matches' },
//   ];

//   // Premium features (only for job_seeker with isPremium = true)
//   const premiumMenuItems: MenuItem[] = [
//     { name: 'Interviews', icon: '📝', path: '/user/interviews', isPremium: true },
//     { name: 'Assignments', icon: '📚', path: '/user/assignments', isPremium: true },
//   ];

//   // Always shown items
//   const bottomMenuItems: MenuItem[] = [
//     { name: 'Support', icon: '💬', path: '/user/support', hasNotification: true },
//     { name: 'Skills', icon: '⚡', path: '/user/skills' },
//     { name: 'Settings', icon: '⚙️', path: '/user/settings' },
//   ];

//   // Combine menu items based on premium status
//   const menuItems: MenuItem[] = [
//     ...baseMenuItems,
//     ...(isPremiumJobSeeker ? premiumMenuItems : []),
//     ...bottomMenuItems
//   ];

//   return (
//     <>
//       <aside 
//         className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen flex-shrink-0 relative ${
//           isSidebarCollapsed ? 'w-20' : 'w-80'
//         }`}
//       >
//         {/* Collapse Button */}
//         <button
//           onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//           className="absolute top-1/16 -right-5 transform -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-blue-400 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-md"
//         >
//           <span className="text-xl text-gray-700">{isSidebarCollapsed ? '→' : '←'}</span>
//         </button>

//         <div className="p-6 border-b border-gray-200 flex-shrink-0">
//           {!isSidebarCollapsed ? (
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <span className="text-2xl">📄</span>
//               </div>
//               <div>
//                 <h2 className="font-bold text-xl">Career Sync</h2>
//                 <p className="text-xs text-gray-500">Together We Grow, Together We Improve</p>
//               </div>
//             </div>
//           ) : (
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
//               <span className="text-2xl">📄</span>
//             </div>
//           )}
//         </div>

//         {/* User Info with Premium Badge */}
//         {!isSidebarCollapsed && userInfo && (
//           <div className="p-4 border-b border-gray-200 flex-shrink-0">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
//                 {userInfo.firstName?.[0]}{userInfo.lastName?.[0]}
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2">
//                   <p className="font-bold text-sm">{userInfo.firstName} {userInfo.lastName}</p>
//                   {isPremiumJobSeeker && (
//                     <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
//                       ⭐ PRO
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-500">{userInfo.email}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <nav className="flex-1 px-4 py-6 overflow-y-auto">
//           <ul className="space-y-2">
//             {menuItems.map((item) => (
//               <li key={item.name}>
//                 <button
//                   onClick={() => router.push(item.path)}
//                   className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center relative ${
//                     isSidebarCollapsed ? 'justify-center' : 'gap-3'
//                   } ${
//                     pathname === item.path || (item.path !== '/user' && pathname?.startsWith(item.path))
//                       ? 'text-blue-600 font-bold border-l-4 border-blue-600 bg-blue-50'
//                       : 'text-gray-700 font-medium hover:bg-gray-50'
//                   }`}
//                   title={isSidebarCollapsed ? item.name : ''}
//                 >
//                   <span className="text-xl flex-shrink-0">{item.icon}</span>
//                   {!isSidebarCollapsed && (
//                     <div className="flex items-center gap-2 flex-1">
//                       <span>{item.name}</span>
//                       {item.isPremium && (
//                         <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded">
//                           PRO
//                         </span>
//                       )}
//                     </div>
//                   )}
                  
//                   {/* Notification Badge for Support */}
//                   {item.hasNotification && unreadCount > 0 && (
//                     <span className="absolute top-2 left-8 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
//                       {unreadCount > 9 ? '9+' : unreadCount}
//                     </span>
//                   )}
//                 </button>
//               </li>
//             ))}
//           </ul>

//           {/* Premium Upgrade CTA - Only show if NOT premium */}
//           {!isSidebarCollapsed && !isPremiumJobSeeker && (
//             <div className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
//               <div className="text-center mb-4">
//                 <span className="text-3xl mb-2 block">⭐</span>
//                 <p className="text-sm font-bold text-gray-800 mb-2">
//                   Upgrade to Premium
//                 </p>
//                 <p className="text-xs text-gray-600 leading-relaxed">
//                   Get access to Interviews & Assignments to boost your career!
//                 </p>
//               </div>
//               <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl py-3 px-4 font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md flex items-center justify-center gap-2">
//                 <span>🚀</span>
//                 Upgrade Now
//               </button>
//             </div>
//           )}

//           {/* Recruiter/Coach CTA - Only if not already premium */}
//           {!isSidebarCollapsed && (
//             <div className="mt-4 bg-gray-50 rounded-2xl p-6">
//               <p className="text-sm text-center mb-4 leading-relaxed">
//                 Are You Planning On Becoming<br />A Recruiter/Career Coach ?
//               </p>
//               <button className="w-full bg-blue-500 text-white rounded-xl py-3 px-4 font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
//                 <span>🔗</span>
//                 Join Now
//               </button>
//             </div>
//           )}
//         </nav>

//         <div className="p-4 border-t border-gray-200 flex-shrink-0">
//           <button 
//             onClick={() => setShowLogoutModal(true)}
//             className={`w-full bg-yellow-400 text-black rounded-xl py-3 px-4 font-bold hover:bg-yellow-500 transition-colors flex items-center ${
//               isSidebarCollapsed ? 'justify-center' : 'justify-center gap-2'
//             }`}
//             title={isSidebarCollapsed ? 'Logout' : ''}
//           >
//             <span>🚪</span>
//             {!isSidebarCollapsed && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Logout Confirmation Modal */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-4xl">👋</span>
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 Logout Confirmation
//               </h2>
//               <p className="text-gray-600">
//                 Are you sure you want to logout? You'll need to sign in again to access your account.
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 disabled={isLoggingOut}
//                 className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 disabled={isLoggingOut}
//                 className="flex-1 px-6 py-3 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
//               >
//                 {isLoggingOut ? 'Logging out...' : 'Logout'}
//               </button>
//             </div>
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

export default function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCoachRecruiterModal, setShowCoachRecruiterModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPremiumJobSeeker, setIsPremiumJobSeeker] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUnreadCount();
    
    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get('/users/me');
      const userData = data.user || data;
      setUserInfo(userData);
      
      // Check if user is job_seeker AND isPremium
      const isPremium = userData.role === 'job_seeker' && userData.isPremium == true;
      setIsPremiumJobSeeker(isPremium);
      
      // Also store in localStorage for quick access
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  const fetchUnreadCount = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;
      
      const { data } = await api.get('/support/tickets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.log('Could not fetch unread count');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call logout API
      await api.post('/user/logout');
      
      // Clear session storage
      sessionStorage.removeItem('userToken');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userData');
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Clear cookies
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';
      
      toast.success('Logged out successfully');
      router.push('/user/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, still logout locally
      sessionStorage.clear();
      localStorage.clear();
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';
      router.push('/user/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCoachRecruiterClick = () => {
    setShowCoachRecruiterModal(true);
  };

  const handleYesSupport = () => {
    setShowCoachRecruiterModal(false);
    router.push('/user/support');
  };

  const handleCancelModal = () => {
    setShowCoachRecruiterModal(false);
  };

  // Define a type for menu items
  type MenuItem = {
    name: string;
    icon: string;
    path: string;
    isPremium?: boolean;
    hasNotification?: boolean;
  };

  // Base menu items (always shown)
  const baseMenuItems: MenuItem[] = [
    { name: 'Dashboard', icon: '📊', path: '/user' },
    { name: 'My Analyses', icon: '📝', path: '/user/my-analyses' },
    { name: 'Applications', icon: '📋', path: '/user/applications' },
    { name: 'Saved Jobs', icon: '💼', path: '/user/saved-jobs' },
    { name: 'Job Matches', icon: '🎯', path: '/user/job-matches' },
  ];

  // Premium features (only for job_seeker with isPremium = true)
  const premiumMenuItems: MenuItem[] = [
    { name: 'Interviews', icon: '📝', path: '/user/interviews', isPremium: true },
    { name: 'Assignments', icon: '📚', path: '/user/assignments', isPremium: true },
  ];

  // Always shown items
  const bottomMenuItems: MenuItem[] = [
    { name: 'Support', icon: '💬', path: '/user/support', hasNotification: true },
    { name: 'Skills', icon: '⚡', path: '/user/skills' },
    { name: 'Settings', icon: '⚙️', path: '/user/settings' },
  ];

  // Combine menu items based on premium status
  const menuItems: MenuItem[] = [
    ...baseMenuItems,
    ...(isPremiumJobSeeker ? premiumMenuItems : []),
    ...bottomMenuItems
  ];

  return (
    <>
      <aside 
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen flex-shrink-0 relative ${
          isSidebarCollapsed ? 'w-20' : 'w-80'
        }`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-1/16 -right-5 transform -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-blue-400 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all shadow-md"
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
                <h2 className="font-bold text-xl">Career Sync</h2>
                <p className="text-xs text-gray-500">Together We Grow, Together We Improve</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-2xl">📄</span>
            </div>
          )}
        </div>

        {/* User Info with Premium Badge */}
        {!isSidebarCollapsed && userInfo && (
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {userInfo.firstName?.[0]}{userInfo.lastName?.[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{userInfo.firstName} {userInfo.lastName}</p>
                  {isPremiumJobSeeker && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      ⭐ PRO
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{userInfo.email}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center relative ${
                    isSidebarCollapsed ? 'justify-center' : 'gap-3'
                  } ${
                    pathname === item.path || (item.path !== '/user' && pathname?.startsWith(item.path))
                      ? 'text-blue-600 font-bold border-l-4 border-blue-600 bg-blue-50'
                      : 'text-gray-700 font-medium hover:bg-gray-50'
                  }`}
                  title={isSidebarCollapsed ? item.name : ''}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {!isSidebarCollapsed && (
                    <div className="flex items-center gap-2 flex-1">
                      <span>{item.name}</span>
                      {item.isPremium && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold rounded">
                          PRO
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Notification Badge for Support */}
                  {item.hasNotification && unreadCount > 0 && (
                    <span className="absolute top-2 left-8 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Premium Upgrade CTA - Only show if NOT premium */}
          {!isSidebarCollapsed && !isPremiumJobSeeker && (
            <div className="mt-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
              <div className="text-center mb-4">
                <span className="text-3xl mb-2 block">⭐</span>
                <p className="text-sm font-bold text-gray-800 mb-2">
                  Upgrade to Premium
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Get access to Interviews & Assignments to boost your career!
                </p>
              </div>
              <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl py-3 px-4 font-bold hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md flex items-center justify-center gap-2">
                <span>🚀</span>
                Upgrade Now
              </button>
            </div>
          )}

          {/* Recruiter/Coach CTA */}
          {!isSidebarCollapsed && (
            <div className="mt-4 bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-center mb-4 leading-relaxed">
                Are You Planning On Becoming<br />A Recruiter/Career Coach ?
              </p>
              <button 
                onClick={handleCoachRecruiterClick}
                className="w-full bg-blue-500 text-white rounded-xl py-3 px-4 font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>🔗</span>
                Join Now
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button 
            onClick={() => setShowLogoutModal(true)}
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Logout Confirmation
              </h2>
              <p className="text-gray-600">
                Are you sure you want to logout? You'll need to sign in again to access your account.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-6 py-3 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coach/Recruiter Modal */}
      {showCoachRecruiterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💼</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
              Become a Coach or Recruiter
            </h2>

            {/* Message */}
            <p className="text-center text-gray-600 mb-6 leading-relaxed">
              To register as a <strong>Career Coach</strong> or <strong>Recruiter</strong>, you'll need to create a support ticket. 
              Our team will guide you through the registration process.
            </p>

            {/* Question */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-center text-blue-900 font-semibold">
                Would you like to chat with the support team about this?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleYesSupport}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>💬</span>
                Yes, Chat Now
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}