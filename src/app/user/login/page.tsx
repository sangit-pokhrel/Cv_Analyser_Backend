
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/baseapi';
// import { useAuth } from '@/hooks/useAuth';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.app/api/v1';
// export default function UserLoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   // const [isLoading, setIsLoading] = useState(false);
//   const {isLoading, isAuthenticated, setIsLoading, setIsAuthenticated} = useAuth();
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//     const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
//   const [isBlocked, setIsBlocked] = useState(false);
//   const [blockInfo, setBlockInfo] = useState<any>(null);
//   const [showPassword, setShowPassword] = useState(false);



//   // const handleLogin = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setError('');
//   //   setIsLoading(true);

//   //   try {
//   //     const { data } = await api.post('/auth/login', {
//   //       email,
//   //       password,
//   //     });

//   //     if (data.accessToken && data.user) {
//   //       document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${60 * 60 * 5}`;
//   //       sessionStorage.setItem('userId', data.user._id);
//   //       sessionStorage.setItem('userData', JSON.stringify(data.user));
//   //       setIsAuthenticated(true)
//   //       router.replace('/user');
//   //     } else {
//   //       setError('Invalid response from server');
//   //     }
//   //   } catch (err: any) {
//   //     console.error('Login error:', err);
//   //     setError(err.response?.data?.message || 'Login failed. Please try again.');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//     const handleLogin = async (e: React.FormEvent) => {
//       e.preventDefault();
      
//       setError('');
//       setIsLoading(true);
//       setAttemptsLeft(null);
  
//       try {
//         console.log('🔐 Step 1: Attempting login...');
        
//         // Step 1: Login WITHOUT storing cookies yet
//         const loginResponse = await axios.post(`${baseURL}/auth/login`, {
//           email,
//           password
//         }, {
//           withCredentials: false
//         });
  
//         console.log('✅ Step 2: Login successful');
  
//         // Get the access token from response
//         const accessToken = loginResponse.data.accessToken;
        
//         if (!accessToken) {
//           setError('No access token received');
//           setIsLoading(false);
//           return;
//         }
  
//         console.log('✅ Step 3: Access token received');
  
//         // Step 2: Verify the role using the token BEFORE storing anything
//         const verifyResponse = await axios.get(`${baseURL}/users/me`, {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         });
  
//         console.log('✅ Step 4: User verification response:', verifyResponse.data);
  
//         const user = verifyResponse.data.user || verifyResponse.data;
//         console.log(user)
//         // Step 3: Check if user is admin BEFORE storing
//         if((user.role === 'user' || user.role === 'job_seeker' || user.role === 'admin' || user.role === 'csr') && user.isEmailVerified === 'verified' && user.status === 'verified') {
//           // Step 4: NOW store everything - user is verified
        
//         // Store access token in cookie
//         document.cookie = `accessToken=${accessToken}; path=/; max-age=${15 * 60}`; 
        
//         // Store refresh token if provided
//         if (loginResponse.data.refreshToken) {
//           document.cookie = `refreshToken=${loginResponse.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`; 
//         }
        
//         // Store session flag
//         sessionStorage.setItem('adminToken', 'adminisloggedin');
        
//         console.log('✅ Step 6: Tokens stored in cookies and session storage');
  
//         toast.success('Login successful! Redirecting...');
        
//         // Step 5: Redirect
//         setTimeout(() => {
//           console.log('🔄 Step 7: Redirecting to /user');
//           window.location.href = '/user';
//           // router.push("/user")
//         }, 500);
//         }
//         else{
//           toast.error("Please check your role and account status before logging in . ")
//           setIsLoading(false)
//           return
//         }


//         console.log('✅ Step 5: User role verified');
  
        
  
//       } catch (err: any) {
//         console.error('❌ Login error:', err.response?.data);
        
//         const errorData = err.response?.data;
        
//         // Check if blocked
//         if (errorData?.isBlocked) {
//           setIsBlocked(true);
//           setBlockInfo({
//             blockedUntil: errorData.blockedUntil,
//             blockedBy: errorData.blockedBy
//           });
//           setError(errorData.message || 'Account blocked due to too many failed attempts');
//         } 
//         // Show attempts left
//         else if (errorData?.attemptsLeft !== undefined) {
//           setAttemptsLeft(errorData.attemptsLeft);
//           setError(errorData.message || `Invalid credentials. ${errorData.attemptsLeft} attempts remaining.`);
//         } 
//         // Generic error
//         else {
//           setError(errorData?.error || errorData?.message || 'Invalid email or password');
//         }
        
//         setIsLoading(false);
//       }
//     };
  
//     const formatTimeRemaining = () => {
//       if (!blockInfo?.blockedUntil) return 'Permanently blocked';
      
//       const now = new Date().getTime();
//       const blockedUntil = new Date(blockInfo.blockedUntil).getTime();
//       const timeLeft = blockedUntil - now;
      
//       if (timeLeft <= 0) {
//         setIsBlocked(false);
//         return '';
//       }
      
//       const hours = Math.floor(timeLeft / (1000 * 60 * 60));
//       const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      
//       return `${hours}h ${minutes}m`;
//     };



//       if (isBlocked) {
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


//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-4xl">📄</span>
//           </div>
//           <h1 className="text-2xl font-bold mb-2">Career Sync</h1>
//           <p className="text-sm text-gray-500">Together We Grow, Together We Improve</p>
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
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-blue-600 text-white rounded-xl py-3 px-4 font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.app/api/v1';

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {isLoading, isAuthenticated, setIsLoading, setIsAuthenticated} = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockInfo, setBlockInfo] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setIsLoading(true);
    setAttemptsLeft(null);

    try {
      console.log('🔐 Step 1: Attempting user login...');
      
      // Step 1: Login
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: false
      });

      console.log('✅ Step 2: Login successful');

      const accessToken = loginResponse.data.accessToken;
      
      if (!accessToken) {
        setError('No access token received');
        setIsLoading(false);
        return;
      }

      console.log('✅ Step 3: Access token received');

      // Step 2: Verify the user
      const verifyResponse = await axios.get(`${baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('✅ Step 4: User verification response:', verifyResponse.data);

      const user = verifyResponse.data.user || verifyResponse.data;
      console.log('User data:', user);

      // Step 3: Check if user has correct role and is verified
      if (
        (user.role === 'user' || user.role === 'job_seeker' || user.role === 'admin' || user.role === 'csr') && 
        user.isEmailVerified === true && 
        user.status === 'verified'
      ) {
        console.log('✅ Step 5: User role and status verified');
        
        // Store access token in cookie
        document.cookie = `accessToken=${accessToken}; path=/; max-age=${45 * 60}`; 
        
        // Store refresh token if provided
        if (loginResponse.data.refreshToken) {
          document.cookie = `refreshToken=${loginResponse.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`; 
        }
        
        // Store user session info
        sessionStorage.setItem('userId', user._id);
        sessionStorage.setItem('userData', JSON.stringify(user));
        
        console.log('✅ Step 6: Tokens and user data stored');

        toast.success('Login successful! Redirecting...');
        
        setIsAuthenticated(true);
        
        // Step 4: Redirect to user dashboard
        console.log('🔄 Step 7: Redirecting to /user');
        
        // Use router.push with replace for client-side navigation
        setTimeout(() => {
          router.push('/user');
          router.refresh(); // Force a refresh to ensure new auth state
        }, 500);
        
      } else {
        console.error('❌ User verification failed:', {
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          status: user.status
        });
        
        toast.error('Please check your role and account status before logging in.');
        setError('Account not verified or incorrect role.');
        setIsLoading(false);
        return;
      }

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
            Too many failed login attempts. Your access has been temporarily blocked.
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Logging in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Career Sync</h1>
          <p className="text-sm text-gray-500">Together We Grow, Together We Improve</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
              required
              disabled={isLoading}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 pr-12"
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {attemptsLeft !== null && attemptsLeft > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
              ⚠️ Warning: {attemptsLeft} login {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white rounded-xl py-3 px-4 font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}