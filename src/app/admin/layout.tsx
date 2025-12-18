

// // src/app/admin/layout.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import AdminSidebar from '@/components/admin/AdminSidebar';
// import AdminHeader from '@/components/admin/AdminHeader';

// export default function AdminLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [isLoading, setIsLoading] = useState(true);


//   const isLoginPage = pathname === '/admin/login';

//   useEffect(() => {
//     if (isLoginPage) {
//       setIsLoading(false);
//       return;
//     }

//     const adminToken = sessionStorage.getItem('adminToken');
    
//     if (adminToken !== 'adminisloggedin') {
//       router.push('/admin/login');
//     } else {
//       setIsLoading(false);
//     }
//   }, [router, isLoginPage]);

  
//   if (isLoginPage) {
//     return <>{children}</>;
//   }

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading Admin Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       <AdminSidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminHeader />
//         <main className="flex-1 overflow-y-auto">
//           <div className="p-6">
//             <div className="max-w-[1600px] mx-auto">
//               {children}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import api from '@/lib/baseapi';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Don't check auth on login page
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    // Check authentication
    checkAuth();
  }, [pathname, isLoginPage]);

  const checkAuth = async () => {
    try {
      // Check if session storage has admin token
      const adminToken = sessionStorage.getItem('adminToken');
      
      if (!adminToken || adminToken !== 'adminisloggedin') {
        console.log('No admin token in session storage');
        router.push('/admin/login');
        return;
      }

      // Verify with API that user is actually admin
      const { data } = await api.get('/users/me');
      
      if (!data.user || data.user.role !== 'admin') {
        console.log('User is not admin:', data.user?.role);
        sessionStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      // All checks passed
      setIsAuthenticated(true);
      setIsLoading(false);

    } catch (error) {
      console.error('Auth check failed:', error);
      sessionStorage.removeItem('adminToken');
      router.push('/admin/login');
    }
  };

  // Login page - render without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect via useEffect
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated - render admin layout
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}