// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import DashboardContent from '@/components/user/pages/DashboardContent';

// export default function UserPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const userToken = sessionStorage.getItem('userToken');
    
//     if (!userToken) {
//       router.push('/login');
//     } else {
//       setIsLoading(false);
//     }
//   }, [router]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return <DashboardContent />;
// }

'use client';

import DashboardContent from '@/components/user/pages/DashboardContent';

export default function UserPage() {
  return <DashboardContent />;
}