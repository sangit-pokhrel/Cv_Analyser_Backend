'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:5000/api/v1';

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      console.log('🔐 Step 1: Attempting recruiter login...');
      
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

      const verifyResponse = await axios.get(`${baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log('✅ Step 4: User verification response:', verifyResponse.data);

      const user = verifyResponse.data.user || verifyResponse.data;
      console.log('User data:', user);

      // Check if user is recruiter
      if (user.role !== 'recruiter') {
        console.error('❌ Not a recruiter user:', user.role);
        toast.error('Access denied. Recruiter privileges required.');
        setError('Access denied. Recruiter privileges required.');
        setIsLoading(false);
        return;
      }

      console.log('✅ Step 5: Recruiter role verified');
      
      // Store tokens in cookies
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${45 * 60}`; 
      
      if (loginResponse.data.refreshToken) {
        document.cookie = `refreshToken=${loginResponse.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`; 
      }
      
      // Store in sessionStorage
      sessionStorage.setItem('recruiterToken', 'recruiterisloggedin');
      sessionStorage.setItem('userId', user._id);
      sessionStorage.setItem('userData', JSON.stringify(user));
      
      console.log('✅ Step 6: Tokens and user data stored');

      toast.success('Login successful! Redirecting...');
      
      console.log('🔄 Step 7: Redirecting to /recruiter');
      
      setTimeout(() => {
        router.push('/recruiter');
        router.refresh();
      }, 500);

    } catch (err: any) {
      console.error('❌ Login error:', err.response?.data);
      
      const errorData = err.response?.data;
      
      if (errorData?.isBlocked) {
        setIsBlocked(true);
        setBlockInfo({
          blockedUntil: errorData.blockedUntil,
          blockedBy: errorData.blockedBy
        });
        setError(errorData.message || 'Account blocked due to too many failed attempts');
      } 
      else if (errorData?.attemptsLeft !== undefined) {
        setAttemptsLeft(errorData.attemptsLeft);
        setError(errorData.message || `Invalid credentials. ${errorData.attemptsLeft} attempts remaining.`);
      } 
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
              <p className="text-red-600 text-sm mt-2">Blocked by administrator</p>
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
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Logging in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">💼</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Recruiter Login</h1>
          <p className="text-sm text-gray-500">Access your recruiting dashboard</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="recruiter@example.com"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
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
            className="w-full bg-purple-600 text-white rounded-xl py-3 px-4 font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login as Recruiter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to main login
          </button>
        </div>
      </div>
    </div>
  );
}