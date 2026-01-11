
// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';

// const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1';

// interface Stats {
//   total: number;
//   open: number;
//   in_progress: number;
//   resolved: number;
//   closed: number;
//   pending_assignment: number;
// }

// interface User {
//   _id: string;
//   firstName?: string;
//   lastName?: string;
//   email: string;
// }

// interface Agent {
//   _id: string;
//   firstName?: string;
//   lastName?: string;
//   email: string;
// }

// interface Ticket {
//   _id: string;
//   ticketNumber: string;
//   subject: string;
//   description: string;
//   status: string;
//   priority: string;
//   category: string;
//   user: User | null;
//   primaryAgent?: Agent | null;
//   assignedAgents: Array<{
//     agent: Agent;
//     status: string;
//     role: string;
//   }>;
//   pendingAgents: string[];
//   createdAt: string;
//   lastMessageAt: string;
//   messageCount: number;
//   lastMessageSender?: {
//     _id: string;
//     firstName?: string;
//     lastName?: string;
//     role: string;
//   };
// }

// export default function AdminSupport() {
//   const router = useRouter();
//   const [stats, setStats] = useState<Stats>({
//     total: 0,
//     open: 0,
//     in_progress: 0,
//     resolved: 0,
//     closed: 0,
//     pending_assignment: 0
//   });

//   const [activeTab, setActiveTab] = useState<'pending' | 'my-tickets' | 'all'>('pending');
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // Edit Modal
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
//   const [editForm, setEditForm] = useState({
//     subject: '',
//     description: '',
//     status: '',
//     priority: '',
//     category: ''
//   });
  
//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [priorityFilter, setPriorityFilter] = useState('all');
//   const [categoryFilter, setCategoryFilter] = useState('all');
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalTickets, setTotalTickets] = useState(0);
//   const limit = 10;

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   useEffect(() => {
//     fetchTickets();
//   }, [activeTab, currentPage, searchQuery, statusFilter, priorityFilter, categoryFilter]);

//   const getAccessToken = () => {
//     return document.cookie
//       .split('; ')
//       .find(row => row.startsWith('accessToken='))
//       ?.split('=')[1];
//   };

//   // GET {{base_url}}/support/admin/stats
//   const fetchStats = async () => {
//     try {
//       const token = getAccessToken();
//       const { data } = await axios.get(`${baseURL}/support/admin/stats`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setStats(data.stats || data);
//     } catch (error: any) {
//       console.error('Error fetching stats:', error);
//       toast.error('Failed to load statistics');
//     }
//   };

//   const fetchTickets = async () => {
//     try {
//       setLoading(true);
//       const token = getAccessToken();
//       let endpoint = '';
//       const params: any = {
//         page: currentPage,
//         limit
//       };

//       // Add filters (only for All Tickets and My Tickets)
//       if (activeTab !== 'pending') {
//         if (searchQuery) params.search = searchQuery;
//         if (statusFilter !== 'all') params.status = statusFilter;
//         if (priorityFilter !== 'all') params.priority = priorityFilter;
//         if (categoryFilter !== 'all') params.category = categoryFilter;
//       }

//       switch (activeTab) {
//         case 'pending':
//           // GET {{base_url}}/support/admin/tickets?status=pending_assignment
//           // Shows ALL tickets with pending_assignment status (no primary agent)
//           endpoint = `${baseURL}/support/admin/tickets`;
//           params.status = 'pending_assignment';
//           break;
          
//         case 'my-tickets':
//           // GET {{base_url}}/support/admin/tickets?primaryAgent=me
//           // Shows tickets where I AM the PRIMARY agent
//           endpoint = `${baseURL}/support/admin/tickets`;
//           params.primaryAgent = 'me'; // Backend will filter by current user
//           break;
          
//         case 'all':
//           // GET {{base_url}}/support/admin/tickets?page=1&limit=20
//           endpoint = `${baseURL}/support/admin/tickets`;
//           break;
//       }

//       const { data } = await axios.get(endpoint, {
//         headers: { 'Authorization': `Bearer ${token}` },
//         params
//       });

//       console.log(`📊 ${activeTab} Tab Response:`, {
//         endpoint,
//         params,
//         ticketCount: data.tickets?.length || 0,
//         firstTicket: data.tickets?.[0],
//         primaryAgentOfFirst: data.tickets?.[0]?.primaryAgent
//       });

//       // Handle different response structures
//       const ticketsList = data.tickets || data.data || [];
//       const pagination = data.pagination || {};
      
//       setTickets(ticketsList);
//       setTotalPages(pagination.totalPages || Math.ceil((pagination.total || ticketsList.length) / limit) || 1);
//       setTotalTickets(pagination.total || ticketsList.length);
      
//     } catch (error: any) {
//       console.error('Error fetching tickets:', error);
//       toast.error(error.response?.data?.error || 'Failed to load tickets');
//       setTickets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // POST {{base_url}}/support/admin/tickets/{{ticket_id}}/accept
//   const handleTakeOver = async (ticketId: string) => {
//     try {
//       const token = getAccessToken();
//       await axios.post(
//         `${baseURL}/support/admin/tickets/${ticketId}/accept`,
//         {},
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );
//       toast.success('✅ Ticket taken over! You are now the PRIMARY agent.');
//       fetchStats();
//       fetchTickets();
//     } catch (error: any) {
//       console.error('Error taking over ticket:', error);
//       toast.error(error.response?.data?.error || 'Failed to take over ticket');
//     }
//   };

//   const viewTicket = (ticketId: string) => {
//     router.push(`/admin/support/tickets/${ticketId}`);
//   };

//   // Open edit modal
//   const openEditModal = (ticket: Ticket) => {
//     setEditingTicket(ticket);
//     setEditForm({
//       subject: ticket.subject,
//       description: ticket.description,
//       status: ticket.status,
//       priority: ticket.priority,
//       category: ticket.category
//     });
//     setShowEditModal(true);
//   };

//   // Save ticket edits
//   const saveTicketEdits = async () => {
//     if (!editingTicket) return;

//     try {
//       const token = getAccessToken();
//       const { data } = await axios.put(
//         `${baseURL}/support/admin/tickets/${editingTicket._id}`,
//         editForm,
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );

//       toast.success('Ticket updated successfully!');
//       setShowEditModal(false);
//       setEditingTicket(null);
      
//       // Refresh tickets
//       fetchTickets();
//     } catch (error: any) {
//       console.error('Error updating ticket:', error);
//       toast.error(error.response?.data?.error || 'Failed to update ticket');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const colors: Record<string, string> = {
//       'open': 'bg-blue-500 text-white',
//       'pending_assignment': 'bg-yellow-500 text-white',
//       'in_progress': 'bg-purple-500 text-white',
//       'waiting_customer': 'bg-orange-500 text-white',
//       'resolved': 'bg-green-500 text-white',
//       'closed': 'bg-gray-500 text-white'
//     };
//     return colors[status] || 'bg-gray-500 text-white';
//   };

//   const getPriorityBadge = (priority: string) => {
//     const colors: Record<string, string> = {
//       'urgent': 'bg-red-600 text-white',
//       'high': 'bg-red-500 text-white',
//       'medium': 'bg-orange-500 text-white',
//       'low': 'bg-green-500 text-white'
//     };
//     return colors[priority] || 'bg-gray-500 text-white';
//   };

//   const formatStatus = (status: string) => {
//     return status.split('_').map(word => 
//       word.charAt(0).toUpperCase() + word.slice(1)
//     ).join(' ');
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Support Tickets</h1>
//           <p className="text-gray-600 mt-1">Manage customer support tickets</p>
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={() => router.push('/admin/support/agents')}
//             className="px-4 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600"
//           >
//             👥 View Agents
//           </button>
//           <button
//             onClick={() => router.push('/admin/support/leaderboard')}
//             className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
//           >
//             🏆 Leaderboard
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
//           <p className="text-blue-100 text-sm font-medium">Total</p>
//           <p className="text-4xl font-bold mt-2">{stats.total}</p>
//         </div>
//         <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white">
//           <p className="text-blue-100 text-sm font-medium">Open</p>
//           <p className="text-4xl font-bold mt-2">{stats.open}</p>
//         </div>
//         <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
//           <p className="text-purple-100 text-sm font-medium">In Progress</p>
//           <p className="text-4xl font-bold mt-2">{stats.in_progress}</p>
//         </div>
//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
//           <p className="text-green-100 text-sm font-medium">Resolved</p>
//           <p className="text-4xl font-bold mt-2">{stats.resolved}</p>
//         </div>
//         <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
//           <p className="text-yellow-100 text-sm font-medium">Pending</p>
//           <p className="text-4xl font-bold mt-2">{stats.pending_assignment}</p>
//         </div>
//         <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white">
//           <p className="text-gray-100 text-sm font-medium">Closed</p>
//           <p className="text-4xl font-bold mt-2">{stats.closed}</p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-6 border-b">
//         <button
//           onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
//           className={`px-6 py-3 font-bold transition-colors ${
//             activeTab === 'pending'
//               ? 'text-blue-600 border-b-2 border-blue-600'
//               : 'text-gray-600 hover:text-gray-900'
//           }`}
//         >
//           🔔 All Pending Tickets
//         </button>
//         <button
//           onClick={() => { setActiveTab('my-tickets'); setCurrentPage(1); }}
//           className={`px-6 py-3 font-bold transition-colors ${
//             activeTab === 'my-tickets'
//               ? 'text-blue-600 border-b-2 border-blue-600'
//               : 'text-gray-600 hover:text-gray-900'
//           }`}
//         >
//           📋 My Tickets
//         </button>
//         <button
//           onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
//           className={`px-6 py-3 font-bold transition-colors ${
//             activeTab === 'all'
//               ? 'text-blue-600 border-b-2 border-blue-600'
//               : 'text-gray-600 hover:text-gray-900'
//           }`}
//         >
//           📊 All Tickets
//         </button>
//       </div>

//       {/* Filters - Only show for My Tickets and All Tickets */}
//       {activeTab !== 'pending' && (
//         <div className="bg-gray-50 rounded-xl p-6 mb-6 border">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Search</label>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//                 placeholder="Ticket # or subject..."
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="open">Open</option>
//                 <option value="in_progress">In Progress</option>
//                 <option value="waiting_customer">Waiting Customer</option>
//                 <option value="resolved">Resolved</option>
//                 <option value="closed">Closed</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Priority</label>
//               <select
//                 value={priorityFilter}
//                 onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Priority</option>
//                 <option value="urgent">Urgent</option>
//                 <option value="high">High</option>
//                 <option value="medium">Medium</option>
//                 <option value="low">Low</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Category</label>
//               <select
//                 value={categoryFilter}
//                 onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Categories</option>
//                 <option value="technical">Technical</option>
//                 <option value="billing">Billing</option>
//                 <option value="general">General</option>
//                 <option value="feedback">Feedback</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       {loading ? (
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-600 font-medium">Loading tickets...</p>
//           </div>
//         </div>
//       ) : (
//         <>
//           {/* Pending Tickets View - Cards with Take Over Button */}
//           {activeTab === 'pending' && (
//             <>
//               {tickets.length === 0 ? (
//                 <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
//                   <div className="text-6xl mb-4">🎉</div>
//                   <p className="text-xl font-bold text-gray-900 mb-2">No Pending Tickets!</p>
//                   <p className="text-gray-600">All tickets have been assigned to agents.</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="mb-4 text-sm text-gray-600">
//                     Showing {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} waiting for an agent to take over
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {tickets.map((ticket) => (
//                       <div key={ticket._id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
//                         <div className="flex items-start justify-between mb-4">
//                           <div>
//                             <h3 className="font-bold text-lg text-blue-600">{ticket.ticketNumber}</h3>
//                             <p className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</p>
//                           </div>
//                           <div className="flex flex-col gap-2">
//                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(ticket.priority)}`}>
//                               {ticket.priority.toUpperCase()}
//                             </span>
//                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
//                               {formatStatus(ticket.status)}
//                             </span>
//                           </div>
//                         </div>
                        
//                         {/* Reply Indicator */}
//                         {ticket.lastMessageSender && (
//                           <div className="mb-3">
//                             {ticket.lastMessageSender.role === 'customer' || ticket.lastMessageSender.role === 'user' ? (
//                               <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
//                                 👤 Customer Replied
//                               </span>
//                             ) : (
//                               <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
//                                 👨‍💼 {ticket.lastMessageSender.role === 'admin' ? 'Admin' : 'Agent'} Replied
//                               </span>
//                             )}
//                           </div>
//                         )}
                        
//                         <h4 className="font-bold text-gray-900 mb-2">{ticket.subject}</h4>
//                         <p className="text-sm text-gray-600 mb-4 line-clamp-3">{ticket.description}</p>
                        
//                         <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
//                           <p className="text-gray-600"><strong>Category:</strong> {ticket.category}</p>
//                           <p className="flex items-center gap-2">
//                             <span>👤</span>
//                             <strong>{ticket.user?.firstName || 'Unknown'} {ticket.user?.lastName || ''}</strong>
//                           </p>
//                           <p className="flex items-center gap-2">
//                             <span>📧</span>
//                             <span>{ticket.user?.email || 'N/A'}</span>
//                           </p>
//                           <p className="flex items-center gap-2">
//                             <span>💬</span>
//                             <span>{ticket.messageCount || 0} messages</span>
//                           </p>
//                         </div>

//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleTakeOver(ticket._id)}
//                             className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
//                           >
//                             ✅ Take Over
//                           </button>
//                           <button
//                             onClick={() => viewTicket(ticket._id)}
//                             className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
//                           >
//                             👁️
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </>
//           )}

//           {/* My Tickets / All Tickets - Table View */}
//           {(activeTab === 'my-tickets' || activeTab === 'all') && (
//             <>
//               {tickets.length === 0 ? (
//                 <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
//                   <p className="text-gray-500 text-lg">No tickets found</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="mb-4 text-sm text-gray-600">
//                     Showing {tickets.length} of {totalTickets} tickets
//                   </div>
//                   <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//                     <div className="overflow-x-auto">
//                       <table className="w-full">
//                         <thead className="bg-gray-50 border-b">
//                           <tr>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ticket #</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Subject</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Agent</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Priority</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Messages</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Created</th>
//                             <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {tickets.map((ticket) => (
//                             <tr key={ticket._id} className="border-b hover:bg-gray-50 transition-colors">
//                               <td className="px-6 py-4">
//                                 <span className="font-bold text-blue-600">{ticket.ticketNumber}</span>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <div className="font-medium">{ticket.subject}</div>
//                                 <div className="text-xs text-gray-500">{ticket.category}</div>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <div>{ticket.user?.firstName || 'N/A'} {ticket.user?.lastName || ''}</div>
//                                 <div className="text-xs text-gray-500">{ticket.user?.email || 'N/A'}</div>
//                               </td>
//                               <td className="px-6 py-4">
//                                 {ticket.primaryAgent ? (
//                                   <div>
//                                     <div className="font-medium">{ticket.primaryAgent?.firstName || 'N/A'} {ticket.primaryAgent?.lastName || ''}</div>
//                                     <div className="text-xs text-purple-600 font-bold">PRIMARY</div>
//                                   </div>
//                                 ) : (
//                                   <span className="text-gray-400 text-sm">Unassigned</span>
//                                 )}
//                               </td>
//                               <td className="px-6 py-4">
//                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
//                                   {formatStatus(ticket.status)}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(ticket.priority)}`}>
//                                   {ticket.priority.toUpperCase()}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4">
//                                 <span className="text-sm font-medium">{ticket.messageCount || 0}</span>
//                               </td>
//                               <td className="px-6 py-4 text-sm text-gray-600">
//                                 {new Date(ticket.createdAt).toLocaleDateString()}
//                               </td>
//                               <td className="px-6 py-4">
//                                 <div className="flex gap-2">
//                                   <button
//                                     onClick={() => viewTicket(ticket._id)}
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors"
//                                   >
//                                     View
//                                   </button>
//                                   <button
//                                     onClick={() => openEditModal(ticket)}
//                                     className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors"
//                                   >
//                                     ✏️ Edit
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </>
//           )}

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-between mt-6">
//               <div className="text-sm text-gray-600">
//                 Page {currentPage} of {totalPages}
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setCurrentPage(1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   First
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <span className="px-4 py-2 font-medium">
//                   {currentPage}
//                 </span>
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//                 <button
//                   onClick={() => setCurrentPage(totalPages)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Last
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* Edit Ticket Modal */}
//       {showEditModal && editingTicket && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b">
//               <h2 className="text-2xl font-bold">Edit Ticket: {editingTicket.ticketNumber}</h2>
//             </div>

//             <div className="p-6 space-y-4">
//               {/* Subject */}
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Subject *
//                 </label>
//                 <input
//                   type="text"
//                   value={editForm.subject}
//                   onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter ticket subject"
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   value={editForm.description}
//                   onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px]"
//                   placeholder="Enter ticket description"
//                 />
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={editForm.status}
//                   onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="open">Open</option>
//                   <option value="pending_assignment">Pending Assignment</option>
//                   <option value="in_progress">In Progress</option>
//                   <option value="waiting_customer">Waiting Customer</option>
//                   <option value="resolved">Resolved</option>
//                   <option value="closed">Closed</option>
//                 </select>
//               </div>

//               {/* Priority */}
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Priority
//                 </label>
//                 <select
//                   value={editForm.priority}
//                   onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="low">Low</option>
//                   <option value="medium">Medium</option>
//                   <option value="high">High</option>
//                   <option value="urgent">Urgent</option>
//                 </select>
//               </div>

//               {/* Category */}
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-2">
//                   Category
//                 </label>
//                 <select
//                   value={editForm.category}
//                   onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="general">General</option>
//                   <option value="technical">Technical</option>
//                   <option value="billing">Billing</option>
//                   <option value="account">Account</option>
//                   <option value="feature_request">Feature Request</option>
//                   <option value="bug_report">Bug Report</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               {/* Customer Info (Read-only) */}
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-bold text-sm text-gray-700 mb-2">Customer Information</h3>
//                 <p className="text-sm">
//                   <strong>Name:</strong> {editingTicket.user?.firstName} {editingTicket.user?.lastName}
//                 </p>
//                 <p className="text-sm">
//                   <strong>Email:</strong> {editingTicket.user?.email}
//                 </p>
//               </div>
//             </div>

//             {/* Modal Actions */}
//             <div className="p-6 border-t flex gap-4">
//               <button
//                 onClick={() => {
//                   setShowEditModal(false);
//                   setEditingTicket(null);
//                 }}
//                 className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveTicketEdits}
//                 className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
//               >
//                 💾 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1';

interface Stats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  pending_assignment: number;
}

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface Agent {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  user: User | null;
  primaryAgent?: Agent | null;
  assignedAgents: Array<{
    agent: Agent;
    status: string;
    role: string;
  }>;
  pendingAgents: string[];
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
  lastMessageSender?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export default function AdminSupport() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    pending_assignment: 0
  });

  const [activeTab, setActiveTab] = useState<'pending' | 'my-tickets' | 'all'>('pending');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [editForm, setEditForm] = useState({
    subject: '',
    description: '',
    status: '',
    priority: '',
    category: ''
  });
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [activeTab, currentPage, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  // GET {{base_url}}/support/admin/stats
  const fetchStats = async () => {
    try {
      const token = getAccessToken();
      const { data } = await axios.get(`${baseURL}/support/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(data.stats || data);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      let endpoint = '';
      const params: any = {
        page: currentPage,
        limit
      };

      // Add filters (only for All Tickets and My Tickets)
      if (activeTab !== 'pending') {
        if (searchQuery) params.search = searchQuery;
        if (statusFilter !== 'all') params.status = statusFilter;
        if (priorityFilter !== 'all') params.priority = priorityFilter;
        if (categoryFilter !== 'all') params.category = categoryFilter;
      }

      switch (activeTab) {
        case 'pending':
          // GET {{base_url}}/support/admin/tickets?status=pending_assignment
          // Shows ALL tickets with pending_assignment status (no primary agent)
          endpoint = `${baseURL}/support/admin/tickets`;
          params.status = 'pending_assignment';
          break;
          
        case 'my-tickets':
          // GET {{base_url}}/support/admin/tickets?primaryAgent=me
          // Shows tickets where I AM the PRIMARY agent
          endpoint = `${baseURL}/support/admin/tickets`;
          params.primaryAgent = 'me'; // Backend will filter by current user
          break;
          
        case 'all':
          // GET {{base_url}}/support/admin/tickets?page=1&limit=20
          endpoint = `${baseURL}/support/admin/tickets`;
          break;
      }

      const { data } = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` },
        params
      });

      console.log(`📊 ${activeTab} Tab Response:`, {
        endpoint,
        params,
        ticketCount: data.tickets?.length || 0,
        firstTicket: data.tickets?.[0],
        primaryAgentOfFirst: data.tickets?.[0]?.primaryAgent
      });

      // Handle different response structures
      const ticketsList = data.tickets || data.data || [];
      const pagination = data.pagination || {};
      
      setTickets(ticketsList);
      setTotalPages(pagination.totalPages || Math.ceil((pagination.total || ticketsList.length) / limit) || 1);
      setTotalTickets(pagination.total || ticketsList.length);
      
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      toast.error(error.response?.data?.error || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // POST {{base_url}}/support/admin/tickets/{{ticket_id}}/accept
  const handleTakeOver = async (ticketId: string) => {
    try {
      const token = getAccessToken();
      await axios.post(
        `${baseURL}/support/admin/tickets/${ticketId}/accept`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success('✅ Ticket taken over! Opening ticket...');
      
      // Redirect directly to ticket detail page
      router.push(`/admin/support/tickets/${ticketId}`);
    } catch (error: any) {
      console.error('Error taking over ticket:', error);
      toast.error(error.response?.data?.error || 'Failed to take over ticket');
    }
  };

  const viewTicket = (ticketId: string) => {
    router.push(`/admin/support/tickets/${ticketId}`);
  };

  // Open edit modal
  const openEditModal = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setEditForm({
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category
    });
    setShowEditModal(true);
  };

  // Save ticket edits
  const saveTicketEdits = async () => {
    if (!editingTicket) return;

    try {
      const token = getAccessToken();
      const { data } = await axios.put(
        `${baseURL}/support/admin/tickets/${editingTicket._id}`,
        editForm,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      toast.success('Ticket updated successfully!');
      setShowEditModal(false);
      setEditingTicket(null);
      
      // Refresh tickets
      fetchTickets();
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      toast.error(error.response?.data?.error || 'Failed to update ticket');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'bg-blue-500 text-white',
      'pending_assignment': 'bg-yellow-500 text-white',
      'in_progress': 'bg-purple-500 text-white',
      'waiting_customer': 'bg-orange-500 text-white',
      'resolved': 'bg-green-500 text-white',
      'closed': 'bg-gray-500 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'urgent': 'bg-red-600 text-white',
      'high': 'bg-red-500 text-white',
      'medium': 'bg-orange-500 text-white',
      'low': 'bg-green-500 text-white'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Manage customer support tickets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/support/agents')}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600"
          >
            👥 View Agents
          </button>
          <button
            onClick={() => router.push('/admin/support/leaderboard')}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Total</p>
          <p className="text-4xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Open</p>
          <p className="text-4xl font-bold mt-2">{stats.open}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-purple-100 text-sm font-medium">In Progress</p>
          <p className="text-4xl font-bold mt-2">{stats.in_progress}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Resolved</p>
          <p className="text-4xl font-bold mt-2">{stats.resolved}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <p className="text-yellow-100 text-sm font-medium">Pending</p>
          <p className="text-4xl font-bold mt-2">{stats.pending_assignment}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white">
          <p className="text-gray-100 text-sm font-medium">Closed</p>
          <p className="text-4xl font-bold mt-2">{stats.closed}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
          className={`px-6 py-3 font-bold transition-colors ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🔔 All Pending Tickets
        </button>
        <button
          onClick={() => { setActiveTab('my-tickets'); setCurrentPage(1); }}
          className={`px-6 py-3 font-bold transition-colors ${
            activeTab === 'my-tickets'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📋 My Tickets
        </button>
        <button
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          className={`px-6 py-3 font-bold transition-colors ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 All Tickets
        </button>
      </div>

      {/* Filters - Only show for My Tickets and All Tickets */}
      {activeTab !== 'pending' && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Ticket # or subject..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_customer">Waiting Customer</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="general">General</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tickets...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Pending Tickets View - Cards with Take Over Button */}
          {activeTab === 'pending' && (
            <>
              {tickets.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-xl font-bold text-gray-900 mb-2">No Pending Tickets!</p>
                  <p className="text-gray-600">All tickets have been assigned to agents.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} waiting for an agent to take over
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.map((ticket) => (
                      <div key={ticket._id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-blue-600">{ticket.ticketNumber}</h3>
                            <p className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(ticket.priority)}`}>
                              {ticket.priority.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
                              {formatStatus(ticket.status)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Reply Indicator */}
                        {ticket.lastMessageSender && (
                          <div className="mb-3">
                            {ticket.lastMessageSender.role === 'customer' || ticket.lastMessageSender.role === 'user' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                👤 Customer Replied
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                👨‍💼 {ticket.lastMessageSender.role === 'admin' ? 'Admin' : 'Agent'} Replied
                              </span>
                            )}
                          </div>
                        )}
                        
                        <h4 className="font-bold text-gray-900 mb-2">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{ticket.description}</p>
                        
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                          <p className="text-gray-600"><strong>Category:</strong> {ticket.category}</p>
                          <p className="flex items-center gap-2">
                            <span>👤</span>
                            <strong>{ticket.user?.firstName || 'Unknown'} {ticket.user?.lastName || ''}</strong>
                          </p>
                          <p className="flex items-center gap-2">
                            <span>📧</span>
                            <span>{ticket.user?.email || 'N/A'}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span>💬</span>
                            <span>{ticket.messageCount || 0} messages</span>
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTakeOver(ticket._id)}
                            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                          >
                            ✅ Take Over
                          </button>
                          <button
                            onClick={() => viewTicket(ticket._id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                          >
                            👁️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* My Tickets / All Tickets - Table View */}
          {(activeTab === 'my-tickets' || activeTab === 'all') && (
            <>
              {tickets.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
                  <p className="text-gray-500 text-lg">No tickets found</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {tickets.length} of {totalTickets} tickets
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ticket #</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Subject</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Agent</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Priority</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Messages</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Created</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tickets.map((ticket) => (
                            <tr key={ticket._id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="font-bold text-blue-600">{ticket.ticketNumber}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium">{ticket.subject}</div>
                                <div className="text-xs text-gray-500">{ticket.category}</div>
                                
                                {/* Reply Indicator */}
                                {ticket.lastMessageSender && (
                                  <div className="mt-2">
                                    {ticket.lastMessageSender.role === 'customer' || ticket.lastMessageSender.role === 'user' || ticket.lastMessageSender.role === 'job_seeker' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                        👤 Customer Replied
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                                        👨‍💼 {ticket.lastMessageSender.role === 'admin' ? 'Admin' : 'Agent'} Replied
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div>{ticket.user?.firstName || 'N/A'} {ticket.user?.lastName || ''}</div>
                                <div className="text-xs text-gray-500">{ticket.user?.email || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4">
                                {ticket.primaryAgent ? (
                                  <div>
                                    <div className="font-medium">{ticket.primaryAgent?.firstName || 'N/A'} {ticket.primaryAgent?.lastName || ''}</div>
                                    <div className="text-xs text-purple-600 font-bold">PRIMARY</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">Unassigned</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
                                  {formatStatus(ticket.status)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(ticket.priority)}`}>
                                  {ticket.priority.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-medium">{ticket.messageCount || 0}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => viewTicket(ticket._id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => openEditModal(ticket)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors"
                                  >
                                    ✏️ Edit
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 font-medium">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && editingTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">Edit Ticket: {editingTicket.ticketNumber}</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ticket subject"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Enter ticket description"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="pending_assignment">Pending Assignment</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_customer">Waiting Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Customer Info (Read-only) */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-sm text-gray-700 mb-2">Customer Information</h3>
                <p className="text-sm">
                  <strong>Name:</strong> {editingTicket.user?.firstName} {editingTicket.user?.lastName}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {editingTicket.user?.email}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t flex gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTicket(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveTicketEdits}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}