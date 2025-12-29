'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function RecruiterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, {
        email,
        password
      }, { withCredentials: false });

      const accessToken = loginResponse.data.accessToken;
      const verifyResponse = await axios.get(`${baseURL}/users/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      const user = verifyResponse.data.user || verifyResponse.data;

      if (user.role !== 'recruiter') {
        toast.error('Access denied. Recruiter privileges required.');
        setIsLoading(false);
        return;
      }

      document.cookie = `accessToken=${accessToken}; path=/; max-age=${45 * 60}`;
      sessionStorage.setItem('recruiterToken', 'recruiterisloggedin');
      sessionStorage.setItem('userId', user._id);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', accessToken);

      toast.success('Login successful!');
      setTimeout(() => {
        router.push('/recruiter');
        router.refresh();
      }, 500);

    } catch (err: any) {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">💼</span>
          </div>
          <h1 className="text-2xl font-bold">Recruiter Login</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white rounded-xl py-3 font-bold hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login as Recruiter'}
          </button>
        </form>
      </div>
    </div>
  );
}
