// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = 'https://cv-analyser-backend.onrender.com/api/v1';

// interface Agent {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   averageRating: number;
//   totalRatings: number;
//   totalAssigned: number;
//   openTickets: number;
//   inProgressTickets: number;
//   resolvedTickets: number;
// }

// export default function AgentsList() {
//   const router = useRouter();
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [roleFilter, setRoleFilter] = useState('all');

//   useEffect(() => {
//     fetchAgents();
//   }, [searchQuery, roleFilter]);

//   const getAccessToken = () => {
//     return document.cookie
//       .split('; ')
//       .find(row => row.startsWith('accessToken='))
//       ?.split('=')[1];
//   };

//   const fetchAgents = async () => {
//     try {
//       setLoading(true);
//       const token = getAccessToken();
//       const params: any = {};
//       if (searchQuery) params.search = searchQuery;
//       if (roleFilter !== 'all') params.role = roleFilter;

//       const { data } = await axios.get(`${baseURL}/support/admin/agents`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//         params
//       });
//       setAgents(data.data || []);
//     } catch (error: any) {
//       console.error('Error fetching agents:', error);
//       toast.error(error.response?.data?.error || 'Failed to load agents');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRoleBadge = (role: string) => {
//     const colors: Record<string, string> = {
//       'admin': 'bg-red-500 text-white',
//       'csr': 'bg-blue-500 text-white',
//       'sales': 'bg-green-500 text-white'
//     };
//     return colors[role] || 'bg-gray-500 text-white';
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading agents...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Support Agents</h1>
//           <p className="text-gray-600 mt-1">Manage your support team</p>
//         </div>
//         <button
//           onClick={() => router.push('/admin/support/leaderboard')}
//           className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
//         >
//           🏆 View Leaderboard
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-gray-50 rounded-xl p-6 mb-6 border">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-2">Search Agents</label>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Name or email..."
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-2">Role</label>
//             <select
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Roles</option>
//               <option value="admin">Admin</option>
//               <option value="csr">CSR</option>
//               <option value="sales">Sales</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Agents Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {agents.length === 0 ? (
//           <div className="col-span-full text-center py-12">
//             <p className="text-gray-500">No agents found</p>
//           </div>
//         ) : (
//           agents.map((agent) => (
//             <div
//               key={agent._id}
//               className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
//               onClick={() => router.push(`/admin/support/agents/${agent._id}`)}
//             >
//               {/* Header */}
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
//                     {agent.firstName?.[0]}{agent.lastName?.[0]}
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-lg">{agent.firstName} {agent.lastName}</h3>
//                     <p className="text-sm text-gray-600">{agent.email}</p>
//                   </div>
//                 </div>
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(agent.role)}`}>
//                   {agent.role.toUpperCase()}
//                 </span>
//               </div>

//               {/* Rating */}
//               <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-1">
//                     {[1, 2, 3, 4, 5].map(star => (
//                       <span
//                         key={star}
//                         className={star <= Math.round(agent.averageRating || 0) ? 'text-yellow-500' : 'text-gray-300'}
//                       >
//                         ⭐
//                       </span>
//                     ))}
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-lg">{agent.averageRating?.toFixed(1) || '0.0'}</p>
//                     <p className="text-xs text-gray-600">{agent.totalRatings || 0} ratings</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div className="p-3 bg-blue-50 rounded-lg">
//                   <p className="text-blue-600 font-medium">Total</p>
//                   <p className="text-2xl font-bold text-blue-900">{agent.totalAssigned || 0}</p>
//                 </div>
//                 <div className="p-3 bg-green-50 rounded-lg">
//                   <p className="text-green-600 font-medium">Resolved</p>
//                   <p className="text-2xl font-bold text-green-900">{agent.resolvedTickets || 0}</p>
//                 </div>
//                 <div className="p-3 bg-orange-50 rounded-lg">
//                   <p className="text-orange-600 font-medium">Open</p>
//                   <p className="text-2xl font-bold text-orange-900">{agent.openTickets || 0}</p>
//                 </div>
//                 <div className="p-3 bg-purple-50 rounded-lg">
//                   <p className="text-purple-600 font-medium">In Progress</p>
//                   <p className="text-2xl font-bold text-purple-900">{agent.inProgressTickets || 0}</p>
//                 </div>
//               </div>

//               {/* View Profile Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   router.push(`/admin/support/agents/${agent._id}`);
//                 }}
//                 className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
//               >
//                 View Profile →
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'https://cv-analyser-backend.onrender.com/api/v1';

interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  averageRating: number;
  totalRatings: number;
  totalAssigned: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
}

export default function AgentsList() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchAgents();
  }, [searchQuery, roleFilter]);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== 'all') params.role = roleFilter;

      const { data } = await axios.get(`${baseURL}/support/admin/agents`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params
      });
      
      console.log('🔍 Agents API Response:', data);
      setAgents(data.agents || []);
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      toast.error(error.response?.data?.error || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-red-500 text-white',
      'csr': 'bg-blue-500 text-white',
      'sales': 'bg-green-500 text-white'
    };
    return colors[role] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Agents</h1>
          <p className="text-gray-600 mt-1">Manage your support team</p>
        </div>
        <button
          onClick={() => router.push('/admin/support/leaderboard')}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
        >
          🏆 View Leaderboard
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Agents</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name or email..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="csr">CSR</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No agents found</p>
          </div>
        ) : (
          agents.map((agent) => (
            <div
              key={agent._id}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/support/agents/${agent._id}`)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
                    {agent.firstName?.[0]}{agent.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{agent.firstName} {agent.lastName}</h3>
                    <p className="text-sm text-gray-600">{agent.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(agent.role)}`}>
                  {agent.role.toUpperCase()}
                </span>
              </div>

              {/* Rating */}
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={star <= Math.round(agent.averageRating || 0) ? 'text-yellow-500' : 'text-gray-300'}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{agent.averageRating?.toFixed(1) || '0.0'}</p>
                    <p className="text-xs text-gray-600">{agent.totalRatings || 0} ratings</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{agent.totalAssigned || 0}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-green-600 font-medium">Resolved</p>
                  <p className="text-2xl font-bold text-green-900">{agent.resolvedTickets || 0}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-orange-600 font-medium">Open</p>
                  <p className="text-2xl font-bold text-orange-900">{agent.openTickets || 0}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-purple-600 font-medium">In Progress</p>
                  <p className="text-2xl font-bold text-purple-900">{agent.inProgressTickets || 0}</p>
                </div>
              </div>

              {/* View Profile Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/support/agents/${agent._id}`);
                }}
                className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                View Profile →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}