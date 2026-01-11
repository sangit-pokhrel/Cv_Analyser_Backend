

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/baseapi';
// import { toast } from 'react-toastify';

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [blockInfo, setBlockInfo] = useState<any>(null);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     // Check if already logged in
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const { data } = await api.get('/users/me');
      
//       // If logged in and is admin, redirect to admin dashboard
//       if (data.user && data.user.role === 'admin') {
//         // Set session storage for layout check
//         sessionStorage.setItem('adminToken', 'adminisloggedin');
//         router.push('/admin');
//       }
//     } catch (error) {
//       // Not logged in, stay on login page
//       sessionStorage.removeItem('adminToken');
//     }
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     setError('');
//     setIsLoading(true);
//     setAttemptsLeft(null);

//     try {
//       const { data } = await api.post('/auth/login', {
//         email,
//         password
//       });

//       console.log('Login response:', data);

//       // Check if user is admin
//       if (data.user.role !== 'admin') {
//         setError('Access denied. Admin privileges required.');
//         setIsLoading(false);
//         return;
//       }

//       // Success! Set session storage
//       sessionStorage.setItem('adminToken', 'adminisloggedin');
      
//       toast.success('Login successful!');
      
//       // Small delay to ensure storage is set
//       await new Promise(resolve => setTimeout(resolve, 100));
      
//       // Redirect to admin dashboard
//       router.push('/admin');

//     } catch (err: any) {
//       console.error('Login error:', err.response?.data);
      
//       const errorData = err.response?.data;
      
//       // Check if blocked
//       if (errorData?.isBlocked) {
//         setIsBlocked(true);
//         setBlockInfo({
//           blockedUntil: errorData.blockedUntil,
//           blockedBy: errorData.blockedBy
//         });
//         setError(errorData.message || 'Account blocked due to too many failed attempts');
//       } 
//       // Show attempts left
//       else if (errorData?.attemptsLeft !== undefined) {
//         setAttemptsLeft(errorData.attemptsLeft);
//         setError(errorData.message || `Invalid credentials. ${errorData.attemptsLeft} attempts remaining.`);
//       } 
//       // Generic error
//       else {
//         setError(errorData?.error || errorData?.message || 'Invalid email or password');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatTimeRemaining = () => {
//     if (!blockInfo?.blockedUntil) return 'Permanently blocked';
    
//     const now = new Date().getTime();
//     const blockedUntil = new Date(blockInfo.blockedUntil).getTime();
//     const timeLeft = blockedUntil - now;
    
//     if (timeLeft <= 0) {
//       setIsBlocked(false);
//       return '';
//     }
    
//     const hours = Math.floor(timeLeft / (1000 * 60 * 60));
//     const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
//     return `${hours}h ${minutes}m`;
//   };

//   if (isBlocked) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
//           <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-4xl">🚫</span>
//           </div>
//           <h1 className="text-2xl font-bold mb-2 text-red-600">Access Blocked</h1>
//           <p className="text-gray-600 mb-4">
//             Too many failed login attempts. Admin access has been temporarily blocked.
//           </p>
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
//             <p className="text-red-600 font-bold">
//               {blockInfo?.blockedUntil ? `Time Remaining: ${formatTimeRemaining()}` : 'Permanently Blocked'}
//             </p>
//             {blockInfo?.blockedBy === 'admin' && (
//               <p className="text-red-600 text-sm mt-2">
//                 Blocked by administrator
//               </p>
//             )}
//           </div>
//           <p className="text-sm text-gray-500 mb-4">
//             Please contact system administrator if you need immediate access.
//           </p>
//           <button
//             onClick={() => {
//               setIsBlocked(false);
//               setError('');
//               setPassword('');
//             }}
//             className="text-blue-500 hover:text-blue-700 text-sm font-medium"
//           >
//             ← Back to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-4xl text-white">👨‍💼</span>
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
//           <p className="text-sm text-gray-500">Career Sync Administration</p>
//         </div>

//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
//               placeholder="admin@cvsaathi.com"
//               required
//               autoComplete="email"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
//                 placeholder="Enter your password"
//                 required
//                 autoComplete="current-password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? '🙈' : '👁️'}
//               </button>
//             </div>
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {attemptsLeft !== null && attemptsLeft > 0 && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
//               <p className="text-yellow-700 text-sm font-medium">
//                 ⚠️ Warning: {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before account lockout
//               </p>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-teal-600 text-white rounded-xl py-3 px-4 font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                 Logging in...
//               </span>
//             ) : (
//               'Login as Admin'
//             )}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => router.push('/user/login')}
//             className="text-sm text-gray-500 hover:text-gray-700"
//           >
//             Not an admin? Login as user →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.app/api/v1';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const checkExistingAuth = async () => {
      const adminToken = sessionStorage.getItem('adminToken');
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (adminToken === 'adminisloggedin' && accessToken) {
        try {
          const { data } = await axios.get(`${baseURL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          const user = data.user || data;
          if (user && user.role === 'admin') {
            console.log('Already logged in as admin, redirecting...');
            window.location.href = '/admin';
          }
        } catch (error) {
          sessionStorage.removeItem('adminToken');
          document.cookie = 'accessToken=; path=/; max-age=0';
        }
      }
    };

    checkExistingAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setIsLoading(true);
    setAttemptsLeft(null);

    try {
      console.log('🔐 Step 1: Attempting login...');
      
      // Step 1: Login WITHOUT storing cookies yet
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: false // Don't store cookies yet!
      });

      console.log('✅ Step 2: Login successful');

      // Get the access token from response
      const accessToken = loginResponse.data.accessToken;
      
      if (!accessToken) {
        setError('No access token received');
        setIsLoading(false);
        return;
      }

      console.log('✅ Step 3: Access token received');

      // Step 2: Verify the role using the token BEFORE storing anything
      const verifyResponse = await axios.get(`${baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('✅ Step 4: User verification response:', verifyResponse.data);

      const user = verifyResponse.data.user || verifyResponse.data;

      // Step 3: Check if user is admin BEFORE storing
      if (user.role !== 'admin') {
        console.log('❌ Not an admin user:', user.role);
        setError('Access denied. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      console.log('✅ Step 5: Admin role verified');

      // Step 4: NOW store everything - user is verified admin
      
      // Store access token in cookie
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${40 * 60}`; // increased to 40 minutes 
      
      // Store refresh token if provided
      if (loginResponse.data.refreshToken) {
        document.cookie = `refreshToken=${loginResponse.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      }
      
      // Store session flag
      sessionStorage.setItem('adminToken', 'adminisloggedin');
      
      console.log('✅ Step 6: Tokens stored in cookies and session storage');

      toast.success('Login successful! Redirecting...');
      
      // Step 5: Redirect
      setTimeout(() => {
        console.log('🔄 Step 7: Redirecting to /admin');
        window.location.href = '/admin';
      }, 500);

    } catch (err: any) {
      console.error('❌ Login error:', err.response?.data);
      
      const errorData = err.response?.data;
      
      // Check if blocked
      if (errorData?.isBlocked) {
        setIsBlocked(true);
        setBlockInfo({
          blockedUntil: errorData.blockedUntil,
          blockedBy: errorData.blockedBy
        });
        setError(errorData.message || 'Account blocked due to too many failed attempts');
      } 
      // Show attempts left
      else if (errorData?.attemptsLeft !== undefined) {
        setAttemptsLeft(errorData.attemptsLeft);
        setError(errorData.message || `Invalid credentials. ${errorData.attemptsLeft} attempts remaining.`);
      } 
      // Generic error
      else {
        setError(errorData?.error || errorData?.message || 'Invalid email or password');
      }
      
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = () => {
    if (!blockInfo?.blockedUntil) return 'Permanently blocked';
    
    const now = new Date().getTime();
    const blockedUntil = new Date(blockInfo.blockedUntil).getTime();
    const timeLeft = blockedUntil - now;
    
    if (timeLeft <= 0) {
      setIsBlocked(false);
      return '';
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (isBlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-red-600">Access Blocked</h1>
          <p className="text-gray-600 mb-4">
            Too many failed login attempts. Admin access has been temporarily blocked.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-600 font-bold">
              {blockInfo?.blockedUntil ? `Time Remaining: ${formatTimeRemaining()}` : 'Permanently Blocked'}
            </p>
            {blockInfo?.blockedBy === 'admin' && (
              <p className="text-red-600 text-sm mt-2">
                Blocked by administrator
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Please contact system administrator if you need immediate access.
          </p>
          <button
            onClick={() => {
              setIsBlocked(false);
              setError('');
              setPassword('');
            }}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">👨‍💼</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
          <p className="text-sm text-gray-500">Career Sync Administration</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="admin@cvsaathi.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {attemptsLeft !== null && attemptsLeft > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              <p className="text-yellow-700 text-sm font-medium">
                ⚠️ Warning: {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before account lockout
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white rounded-xl py-3 px-4 font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </span>
            ) : (
              'Login as Admin'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/user/login')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Not an admin? Login as user →
          </button>
        </div>
      </div>
    </div>
  );
}