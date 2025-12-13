// // src/app/admin/layout.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import AdminSidebar from '@/components/admin/AdminSidebar';
// import AdminHeader from '@/components/admin/AdminHeader';

// export default function AdminLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const adminToken = sessionStorage.getItem('adminToken');
    
//     if (adminToken !== 'adminisloggedin') {
//       router.push('/admin/login');
//     } else {
//       setIsLoading(false);
//     }
//   }, [router]);

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


// src/app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Don't check auth for login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setIsLoading(false);
      return;
    }

    const adminToken = sessionStorage.getItem('adminToken');
    
    if (adminToken !== 'adminisloggedin') {
      router.push('/admin/login');
    } else {
      setIsLoading(false);
    }
  }, [router, isLoginPage]);

  // For login page, render without sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

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