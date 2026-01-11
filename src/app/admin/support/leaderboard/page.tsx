// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1';

// interface LeaderboardAgent {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   averageRating: number;
//   totalRatings: number;
//   totalTickets: number;
//   resolvedTickets: number;
//   avgResponseTime: number;
//   avgResolutionTime: number;
// }

// export default function Leaderboard() {
//   const router = useRouter();
//   const [agents, setAgents] = useState<LeaderboardAgent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [metric, setMetric] = useState<'rating' | 'resolved' | 'response'>('rating');
//   const [period, setPeriod] = useState('all');

//   useEffect(() => {
//     fetchLeaderboard();
//   }, [metric, period]);

//   const getAccessToken = () => {
//     return document.cookie
//       .split('; ')
//       .find(row => row.startsWith('accessToken='))
//       ?.split('=')[1];
//   };

//   const fetchLeaderboard = async () => {
//     try {
//       setLoading(true);
//       const token = getAccessToken();
//       const { data } = await axios.get(`${baseURL}/support/admin/agents/leaderboard`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//         params: { metric, period }
//       });
//       setAgents(data.leaderboard || []);
//     } catch (error: any) {
//       console.error('Error fetching leaderboard:', error);
//       toast.error(error.response?.data?.error || 'Failed to load leaderboard');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRankBadge = (rank: number) => {
//     if (rank === 1) return '🥇';
//     if (rank === 2) return '🥈';
//     if (rank === 3) return '🥉';
//     return `#${rank}`;
//   };

//   const getRoleBadge = (role: string) => {
//     const colors: Record<string, string> = {
//       'admin': 'bg-red-500 text-white',
//       'csr': 'bg-blue-500 text-white',
//       'sales': 'bg-green-500 text-white'
//     };
//     return colors[role] || 'bg-gray-500 text-white';
//   };

//   const formatTime = (minutes: number) => {
//     if (!minutes) return 'N/A';
//     if (minutes < 60) return `${Math.round(minutes)}m`;
//     const hours = Math.floor(minutes / 60);
//     const mins = Math.round(minutes % 60);
//     return `${hours}h ${mins}m`;
//   };

//   const getMetricValue = (agent: LeaderboardAgent) => {
//     switch (metric) {
//       case 'rating':
//         return `${agent.averageRating?.toFixed(1) || '0.0'} ⭐`;
//       case 'resolved':
//         return `${agent.resolvedTickets || 0} tickets`;
//       case 'response':
//         return formatTime(agent.avgResponseTime || 0);
//       default:
//         return '';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading leaderboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">🏆 Agent Leaderboard</h1>
//           <p className="text-gray-600 mt-1">Top performing support agents</p>
//         </div>
//         <button
//           onClick={() => router.push('/admin/support/agents')}
//           className="px-6 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600"
//         >
//           👥 View All Agents
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Rank By</label>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setMetric('rating')}
//                 className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   metric === 'rating'
//                     ? 'bg-yellow-500 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 ⭐ Rating
//               </button>
//               <button
//                 onClick={() => setMetric('resolved')}
//                 className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   metric === 'resolved'
//                     ? 'bg-green-500 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 ✅ Resolved
//               </button>
//               <button
//                 onClick={() => setMetric('response')}
//                 className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
//                   metric === 'response'
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                 }`}
//               >
//                 ⚡ Response Time
//               </button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-2">Time Period</label>
//             <select
//               value={period}
//               onChange={(e) => setPeriod(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Time</option>
//               <option value="month">This Month</option>
//               <option value="week">This Week</option>
//               <option value="today">Today</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Leaderboard */}
//       <div className="space-y-4">
//         {agents.length === 0 ? (
//           <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
//             <p className="text-gray-500">No agents found</p>
//           </div>
//         ) : (
//           agents.map((agent, index) => (
//             <div
//               key={agent._id}
//               className={`bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer ${
//                 index < 3 ? 'border-2 border-yellow-400' : ''
//               }`}
//               onClick={() => router.push(`/admin/support/agents/${agent._id}`)}
//             >
//               <div className="flex items-center gap-6">
//                 {/* Rank */}
//                 <div className="text-center min-w-[80px]">
//                   <div className="text-4xl font-bold mb-1">{getRankBadge(index + 1)}</div>
//                   {index < 3 && (
//                     <span className="text-xs font-medium text-yellow-600">TOP {index + 1}</span>
//                   )}
//                 </div>

//                 {/* Avatar */}
//                 <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold">
//                   {agent.firstName?.[0]}{agent.lastName?.[0]}
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h3 className="font-bold text-xl">{agent.firstName} {agent.lastName}</h3>
//                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(agent.role)}`}>
//                       {agent.role.toUpperCase()}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 text-sm">{agent.email}</p>
//                 </div>

//                 {/* Metric Stats */}
//                 <div className="text-center min-w-[150px]">
//                   <p className="text-gray-600 text-sm font-medium mb-1">
//                     {metric === 'rating' && '⭐ Average Rating'}
//                     {metric === 'resolved' && '✅ Tickets Resolved'}
//                     {metric === 'response' && '⚡ Response Time'}
//                   </p>
//                   <p className="text-3xl font-bold text-blue-600">{getMetricValue(agent)}</p>
//                 </div>

//                 {/* Additional Stats */}
//                 <div className="grid grid-cols-3 gap-4 min-w-[300px]">
//                   <div className="text-center p-3 bg-gray-50 rounded-lg">
//                     <p className="text-xs text-gray-600 mb-1">Total</p>
//                     <p className="text-lg font-bold">{agent.totalTickets || 0}</p>
//                   </div>
//                   <div className="text-center p-3 bg-green-50 rounded-lg">
//                     <p className="text-xs text-gray-600 mb-1">Resolved</p>
//                     <p className="text-lg font-bold text-green-700">{agent.resolvedTickets || 0}</p>
//                   </div>
//                   <div className="text-center p-3 bg-yellow-50 rounded-lg">
//                     <p className="text-xs text-gray-600 mb-1">Rating</p>
//                     <p className="text-lg font-bold text-yellow-700">{agent.averageRating?.toFixed(1) || '0.0'} ⭐</p>
//                   </div>
//                 </div>

//                 {/* View Button */}
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     router.push(`/admin/support/agents/${agent._id}`);
//                   }}
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
//                 >
//                   View →
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Top 3 Podium (Optional Visual) */}
//       {agents.length >= 3 && (
//         <div className="mt-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-400">
//           <h3 className="text-2xl font-bold text-center mb-8">🏆 Top 3 Champions</h3>
//           <div className="flex justify-center items-end gap-6">
//             {/* 2nd Place */}
//             {agents[1] && (
//               <div className="text-center">
//                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-white flex items-center justify-center text-3xl font-bold mb-3 mx-auto">
//                   {agents[1].firstName?.[0]}{agents[1].lastName?.[0]}
//                 </div>
//                 <div className="bg-gray-200 rounded-lg p-4 h-32 flex flex-col justify-center">
//                   <div className="text-4xl mb-2">🥈</div>
//                   <p className="font-bold">{agents[1].firstName} {agents[1].lastName}</p>
//                   <p className="text-sm text-gray-600">{getMetricValue(agents[1])}</p>
//                 </div>
//               </div>
//             )}

//             {/* 1st Place (Taller) */}
//             {agents[0] && (
//               <div className="text-center">
//                 <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center text-4xl font-bold mb-3 mx-auto border-4 border-yellow-300">
//                   {agents[0].firstName?.[0]}{agents[0].lastName?.[0]}
//                 </div>
//                 <div className="bg-yellow-200 rounded-lg p-4 h-40 flex flex-col justify-center">
//                   <div className="text-5xl mb-2">🥇</div>
//                   <p className="font-bold text-lg">{agents[0].firstName} {agents[0].lastName}</p>
//                   <p className="text-sm text-gray-700 font-medium">{getMetricValue(agents[0])}</p>
//                 </div>
//               </div>
//             )}

//             {/* 3rd Place */}
//             {agents[2] && (
//               <div className="text-center">
//                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-3xl font-bold mb-3 mx-auto">
//                   {agents[2].firstName?.[0]}{agents[2].lastName?.[0]}
//                 </div>
//                 <div className="bg-orange-200 rounded-lg p-4 h-28 flex flex-col justify-center">
//                   <div className="text-4xl mb-2">🥉</div>
//                   <p className="font-bold">{agents[2].firstName} {agents[2].lastName}</p>
//                   <p className="text-sm text-gray-600">{getMetricValue(agents[2])}</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1';

interface LeaderboardAgent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  averageRating: number;
  totalRatings: number;
  totalTickets: number;
  resolvedTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
}

export default function Leaderboard() {
  const router = useRouter();
  const [agents, setAgents] = useState<LeaderboardAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<'rating' | 'resolved' | 'response'>('rating');
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [metric, period]);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const { data } = await axios.get(`${baseURL}/support/admin/agents/leaderboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { metric, period }
      });
      
      console.log('🏆 Leaderboard API Response:', {
        metric,
        period,
        data,
        leaderboard: data.leaderboard,
        count: data.leaderboard?.length || 0
      });
      
      setAgents(data.leaderboard || []);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast.error(error.response?.data?.error || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-red-500 text-white',
      'csr': 'bg-blue-500 text-white',
      'sales': 'bg-green-500 text-white'
    };
    return colors[role] || 'bg-gray-500 text-white';
  };

  const formatTime = (minutes: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getMetricValue = (agent: LeaderboardAgent) => {
    switch (metric) {
      case 'rating':
        return `${agent.averageRating?.toFixed(1) || '0.0'} ⭐`;
      case 'resolved':
        return `${agent.resolvedTickets || 0} tickets`;
      case 'response':
        return formatTime(agent.avgResponseTime || 0);
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">🏆 Agent Leaderboard</h1>
          <p className="text-gray-600 mt-1">Top performing support agents</p>
        </div>
        <button
          onClick={() => router.push('/admin/support/agents')}
          className="px-6 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600"
        >
          👥 View All Agents
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rank By</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMetric('rating')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  metric === 'rating'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ⭐ Rating
              </button>
              <button
                onClick={() => setMetric('resolved')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  metric === 'resolved'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ✅ Resolved
              </button>
              <button
                onClick={() => setMetric('response')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  metric === 'response'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ⚡ Response Time
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
              <option value="today">Today</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        {agents.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
            <p className="text-gray-500">No agents found</p>
          </div>
        ) : (
          agents.map((agent, index) => (
            <div
              key={agent._id}
              className={`bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer ${
                index < 3 ? 'border-2 border-yellow-400' : ''
              }`}
              onClick={() => router.push(`/admin/support/agents/${agent._id}`)}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className="text-center min-w-[80px]">
                  <div className="text-4xl font-bold mb-1">{getRankBadge(index + 1)}</div>
                  {index < 3 && (
                    <span className="text-xs font-medium text-yellow-600">TOP {index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold">
                  {agent.firstName?.[0]}{agent.lastName?.[0]}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-xl">{agent.firstName} {agent.lastName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(agent.role)}`}>
                      {agent.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{agent.email}</p>
                </div>

                {/* Metric Stats */}
                <div className="text-center min-w-[150px]">
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {metric === 'rating' && '⭐ Average Rating'}
                    {metric === 'resolved' && '✅ Tickets Resolved'}
                    {metric === 'response' && '⚡ Response Time'}
                  </p>
                  <p className="text-3xl font-bold text-blue-600">{getMetricValue(agent)}</p>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-3 gap-4 min-w-[300px]">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-lg font-bold">{agent.totalTickets || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Resolved</p>
                    <p className="text-lg font-bold text-green-700">{agent.resolvedTickets || 0}</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Rating</p>
                    <p className="text-lg font-bold text-yellow-700">{agent.averageRating?.toFixed(1) || '0.0'} ⭐</p>
                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/support/agents/${agent._id}`);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  View →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Top 3 Podium (Optional Visual) */}
      {agents.length >= 3 && (
        <div className="mt-12 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8 border-2 border-yellow-400">
          <h3 className="text-2xl font-bold text-center mb-8">🏆 Top 3 Champions</h3>
          <div className="flex justify-center items-end gap-6">
            {/* 2nd Place */}
            {agents[1] && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-white flex items-center justify-center text-3xl font-bold mb-3 mx-auto">
                  {agents[1].firstName?.[0]}{agents[1].lastName?.[0]}
                </div>
                <div className="bg-gray-200 rounded-lg p-4 h-32 flex flex-col justify-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <p className="font-bold">{agents[1].firstName} {agents[1].lastName}</p>
                  <p className="text-sm text-gray-600">{getMetricValue(agents[1])}</p>
                </div>
              </div>
            )}

            {/* 1st Place (Taller) */}
            {agents[0] && (
              <div className="text-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center text-4xl font-bold mb-3 mx-auto border-4 border-yellow-300">
                  {agents[0].firstName?.[0]}{agents[0].lastName?.[0]}
                </div>
                <div className="bg-yellow-200 rounded-lg p-4 h-40 flex flex-col justify-center">
                  <div className="text-5xl mb-2">🥇</div>
                  <p className="font-bold text-lg">{agents[0].firstName} {agents[0].lastName}</p>
                  <p className="text-sm text-gray-700 font-medium">{getMetricValue(agents[0])}</p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {agents[2] && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center text-3xl font-bold mb-3 mx-auto">
                  {agents[2].firstName?.[0]}{agents[2].lastName?.[0]}
                </div>
                <div className="bg-orange-200 rounded-lg p-4 h-28 flex flex-col justify-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <p className="font-bold">{agents[2].firstName} {agents[2].lastName}</p>
                  <p className="text-sm text-gray-600">{getMetricValue(agents[2])}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}