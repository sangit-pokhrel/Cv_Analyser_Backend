// 'use client';

// import { useState } from 'react';

// interface Ticket {
//   id: number;
//   title: string;
//   ticketId: string;
//   date: string;
//   priority: 'Low' | 'Medium' | 'High';
//   status: 'Open' | 'Closed';
// }

// export default function Support() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const tickets: Ticket[] = [
//     {
//       id: 1,
//       title: 'Analysis page is not getting loaded.',
//       ticketId: 'TKT-001-A06',
//       date: '2025-11-09 ( 11:03 AM )',
//       priority: 'Low',
//       status: 'Open',
//     },
//     {
//       id: 2,
//       title: 'Analysis page is not getting loaded.',
//       ticketId: 'TKT-001-A06',
//       date: '2025-11-09 ( 11:03 AM )',
//       priority: 'Low',
//       status: 'Open',
//     },
//   ];

//   return (
//     <>
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2">Support Ticket</h1>
//         <p className="text-gray-600">
//           Got some issues? Just let us know via support ticket , we here to resolve it
//         </p>
//         <svg width="450" height="12" className="mt-2">
//           <path
//             d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 360 6 T 400 6 T 450 6"
//             stroke="#000"
//             strokeWidth="2"
//             fill="none"
//           />
//         </svg>
//       </div>

//       <div className="flex justify-end mb-6">
//         <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
//           <span>➕</span>
//           New Ticket
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//         <div className="flex gap-4 mb-6">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Search Ticket Title or Ticket Id ..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//               🔍
//             </span>
//           </div>
//           <button className="px-6 py-3 border border-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-50">
//             <span>📅</span>
//             Sort By Date
//             <span>▼</span>
//           </button>
//         </div>

//         <div className="space-y-4">
//           {tickets.map((ticket) => (
//             <div
//               key={ticket.id}
//               className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
//             >
//               <div className="flex-1">
//                 <h4 className="font-bold text-lg mb-2">{ticket.title}</h4>
//                 <p className="text-sm text-gray-600 mb-1">
//                   <span className="font-medium">{ticket.ticketId}</span>
//                   <span className="mx-2">•</span>
//                   {ticket.date}
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium">
//                   {ticket.priority}
//                 </span>
//                 <span className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium">
//                   {ticket.status}
//                 </span>
//                 <button className="bg-orange-400 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-500 transition-colors">
//                   Ticket Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-center items-center gap-2 mt-8">
//           <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
//             Prev
//           </button>
//           {[1, 2, 3, 4, 5].map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-4 py-2 rounded-lg transition-colors ${
//                 currentPage === page
//                   ? 'bg-blue-500 text-white'
//                   : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//           <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
//             Next
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'pending_assignment' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  primaryAgent?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function Support() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTickets();
  }, [currentPage]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/support/tickets', {
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      setTickets(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTickets();
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get('/support/tickets', {
        params: {
          search: searchQuery,
          page: 1,
          limit: 10,
        },
      });
      setTickets(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'pending_assignment':
        return 'bg-blue-500 text-white';
      case 'in_progress':
        return 'bg-purple-500 text-white';
      case 'waiting_customer':
        return 'bg-yellow-500 text-white';
      case 'resolved':
        return 'bg-green-500 text-white';
      case 'closed':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Support Ticket</h1>
        <p className="text-gray-600">
          Got some issues? Just let us know via support ticket, we're here to resolve it
        </p>
        <svg width="450" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 360 6 T 400 6 T 450 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/user/support/create')}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          New Ticket
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search Ticket Title or Ticket Id ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              🔍
            </button>
          </div>
          <button className="px-6 py-3 border border-gray-300 rounded-xl flex items-center gap-2 hover:bg-gray-50">
            <span>📅</span>
            Sort By Date
            <span>▼</span>
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tickets found</p>
            <button
              onClick={() => router.push('/user/support/create')}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="p-4 bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-lg mb-2">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{ticket.ticketNumber}</span>
                      <span className="mx-2">•</span>
                      {new Date(ticket.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    {ticket.primaryAgent && (
                      <p className="text-sm text-gray-600">
                        Agent: {ticket.primaryAgent.name}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                    <button
                      onClick={() => router.push(`/user/support/${ticket._id}`)}
                      className="bg-orange-400 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-500 transition-colors"
                    >
                      Ticket Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}