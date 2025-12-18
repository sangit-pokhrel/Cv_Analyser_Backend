// 'use client';

// import { useState } from 'react';

// interface ContactQuery {
//   id: number;
//   message: string;
//   contactId: string;
//   date: string;
//   priority: 'Low' | 'Medium' | 'High';
//   status: 'Open' | 'Closed';
// }

// export default function Contact() {
//   const [searchContactId, setSearchContactId] = useState('');
//   const [searchDate, setSearchDate] = useState('');
//   const [searchEmail, setSearchEmail] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const queries: ContactQuery[] = [
//     {
//       id: 1,
//       message: 'Analysis page is not getting loaded.',
//       contactId: 'TKT-001-A06',
//       date: '2025-11-09 ( 11:03 AM )',
//       priority: 'Low',
//       status: 'Open',
//     },
//     {
//       id: 2,
//       message: 'Analysis page is not getting loaded.',
//       contactId: 'TKT-001-A06',
//       date: '2025-11-09 ( 11:03 AM )',
//       priority: 'Low',
//       status: 'Open',
//     },
//   ];

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-2">
//         Contact Queries ({' '}
//         <span className="text-orange-500">568</span> |{' '}
//         <span className="text-blue-500">30</span> |{' '}
//         <span className="text-red-500">90</span> )
//       </h1>
//       <p className="text-gray-600 mb-6">Manage The contact queries by responding to them.</p>

//       <div className="grid grid-cols-3 gap-4 mb-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Contact Id
//           </label>
//           <input
//             type="text"
//             placeholder="Enter contact Id"
//             value={searchContactId}
//             onChange={(e) => setSearchContactId(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Date
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Select Date"
//               value={searchDate}
//               onChange={(e) => setSearchDate(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//             <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
//               📅
//             </span>
//           </div>
//         </div>
//         <div className="flex items-end gap-2">
//           <div className="flex-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               User Email
//             </label>
//             <input
//               type="text"
//               value={searchEmail}
//               onChange={(e) => setSearchEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>
//           <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
//             <span>➕</span>
//             New Ticket
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {queries.map((query) => (
//           <div
//             key={query.id}
//             className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex-1">
//                 <h3 className="font-bold text-lg mb-2">{query.message}</h3>
//                 <p className="text-sm text-gray-600">
//                   <span className="font-medium">{query.contactId}</span>
//                   <span className="mx-2">•</span>
//                   {query.date}
//                 </p>
//                 <div className="flex gap-2 mt-3">
//                   <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
//                     ✏️
//                   </button>
//                   <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
//                     🗑️
//                   </button>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <span className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium">
//                   {query.priority}
//                 </span>
//                 <span className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium">
//                   {query.status}
//                 </span>
//                 <button className="bg-orange-400 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-500 transition-colors">
//                   Issue Details
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-center items-center gap-2 mt-8">
//         <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
//           Prev
//         </button>
//         {[1, 2, 3, 4, 5].map((page) => (
//           <button
//             key={page}
//             onClick={() => setCurrentPage(page)}
//             className={`px-4 py-2 rounded-lg transition-colors ${
//               currentPage === page
//                 ? 'bg-blue-500 text-white'
//                 : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//         <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = 'http://localhost:5000/api/v1';

// interface Contact {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   subject: string;
//   message: string;
//   inquiryType: string;
//   attachmentUrl?: string;
//   status: string;
//   priority: string;
//   assignedTo?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ContactStats {
//   total: number;
//   open: number;
//   inProgress: number;
//   closed: number;
//   highPriority: number;
//   mediumPriority: number;
//   lowPriority: number;
// }

// export default function Contact() {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [priorityFilter, setPriorityFilter] = useState('All');
//   const [inquiryTypeFilter, setInquiryTypeFilter] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [stats, setStats] = useState<ContactStats>({
//     total: 0,
//     open: 0,
//     inProgress: 0,
//     closed: 0,
//     highPriority: 0,
//     mediumPriority: 0,
//     lowPriority: 0
//   });

//   // Modals
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
//   const [editForm, setEditForm] = useState<any>({});
//   const [createForm, setCreateForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: '',
//     inquiryType: 'general',
//     attachmentUrl: '',
//     status: 'open',
//     priority: 'medium'
//   });

//   // Refs for click outside
//   const viewModalRef = useRef<HTMLDivElement>(null);
//   const editModalRef = useRef<HTMLDivElement>(null);
//   const deleteModalRef = useRef<HTMLDivElement>(null);
//   const createModalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     fetchContacts();
//   }, [currentPage]);

//   useEffect(() => {
//     calculateStats();
//   }, [contacts]);

//   // Click outside to close modals
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (viewModalRef.current && !viewModalRef.current.contains(event.target as Node)) {
//         setShowViewModal(false);
//       }
//       if (editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
//         setShowEditModal(false);
//       }
//       if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
//         setShowDeleteModal(false);
//       }
//       if (createModalRef.current && !createModalRef.current.contains(event.target as Node)) {
//         setShowCreateModal(false);
//       }
//     };

//     if (showViewModal || showEditModal || showDeleteModal || showCreateModal) {
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => document.removeEventListener('mousedown', handleClickOutside);
//     }
//   }, [showViewModal, showEditModal, showDeleteModal, showCreateModal]);

//   const calculateStats = () => {
//     const total = contacts.length;
//     const open = contacts.filter(c => c.status === 'open').length;
//     const inProgress = contacts.filter(c => c.status === 'in_progress').length;
//     const closed = contacts.filter(c => c.status === 'closed').length;
//     const highPriority = contacts.filter(c => c.priority === 'high').length;
//     const mediumPriority = contacts.filter(c => c.priority === 'medium').length;
//     const lowPriority = contacts.filter(c => c.priority === 'low').length;

//     setStats({ total, open, inProgress, closed, highPriority, mediumPriority, lowPriority });
//   };

//   const fetchContacts = async () => {
//     try {
//       setLoading(true);
//       const accessToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('accessToken='))
//         ?.split('=')[1];

//       const { data } = await axios.get(`${baseURL}/contact`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         },
//         params: {
//           page: currentPage,
//           limit: 20
//         }
//       });

//       setContacts(data.data || []);
//       setTotalPages(data.meta?.pages || 1);
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//       toast.error('Failed to load contacts');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewContact = (contact: Contact) => {
//     setSelectedContact(contact);
//     setShowViewModal(true);
//   };

//   const handleEditContact = (contact: Contact) => {
//     setSelectedContact(contact);
//     setEditForm({
//       name: contact.name,
//       email: contact.email,
//       phone: contact.phone || '',
//       subject: contact.subject,
//       message: contact.message,
//       inquiryType: contact.inquiryType,
//       attachmentUrl: contact.attachmentUrl || '',
//       status: contact.status,
//       priority: contact.priority,
//       assignedTo: contact.assignedTo || ''
//     });
//     setShowEditModal(true);
//   };

//   const handleDeleteContact = (contact: Contact) => {
//     setSelectedContact(contact);
//     setShowDeleteModal(true);
//   };

//   const handleCreateContact = () => {
//     setShowCreateModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedContact) return;

//     try {
//       const accessToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('accessToken='))
//         ?.split('=')[1];

//       await axios.delete(`${baseURL}/contact/${selectedContact._id}`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       toast.success('Contact deleted successfully');
//       setShowDeleteModal(false);
//       fetchContacts();
//     } catch (error: any) {
//       console.error('Error deleting contact:', error);
//       toast.error(error.response?.data?.error || 'Failed to delete contact');
//     }
//   };

//   const handleUpdateContact = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedContact) return;

//     try {
//       const accessToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('accessToken='))
//         ?.split('=')[1];

//       await axios.put(`${baseURL}/contact/${selectedContact._id}`, 
//         editForm,
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         }
//       );

//       toast.success('Contact updated successfully');
//       setShowEditModal(false);
//       fetchContacts();
//     } catch (error: any) {
//       console.error('Error updating contact:', error);
//       toast.error(error.response?.data?.error || 'Failed to update contact');
//     }
//   };

//   const handleSubmitCreate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const accessToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('accessToken='))
//         ?.split('=')[1];

//       await axios.post(`${baseURL}/contact`, 
//         createForm,
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         }
//       );

//       toast.success('Contact created successfully');
//       setShowCreateModal(false);
//       setCreateForm({
//         name: '',
//         email: '',
//         phone: '',
//         subject: '',
//         message: '',
//         inquiryType: 'general',
//         attachmentUrl: '',
//         status: 'open',
//         priority: 'medium'
//       });
//       fetchContacts();
//     } catch (error: any) {
//       console.error('Error creating contact:', error);
//       toast.error(error.response?.data?.error || 'Failed to create contact');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const colors: Record<string, string> = {
//       'open': 'bg-blue-500 text-white',
//       'in_progress': 'bg-yellow-500 text-white',
//       'closed': 'bg-green-500 text-white',
//       'resolved': 'bg-purple-500 text-white'
//     };
//     return colors[status] || 'bg-gray-500 text-white';
//   };

//   const getPriorityBadge = (priority: string) => {
//     const colors: Record<string, string> = {
//       'high': 'bg-red-500 text-white',
//       'medium': 'bg-orange-500 text-white',
//       'low': 'bg-green-500 text-white'
//     };
//     return colors[priority] || 'bg-gray-500 text-white';
//   };

//   // Filter contacts
//   const filteredContacts = contacts.filter(contact => {
//     const matchesSearch = 
//       contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       contact.phone?.includes(searchQuery);
    
//     const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;
//     const matchesPriority = priorityFilter === 'All' || contact.priority === priorityFilter;
//     const matchesType = inquiryTypeFilter === 'All' || contact.inquiryType === inquiryTypeFilter;
    
//     return matchesSearch && matchesStatus && matchesPriority && matchesType;
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading contacts...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-2">
//         Contact Queries Management
//       </h1>
//       <p className="text-gray-600 mb-6">Manage and respond to contact inquiries from users</p>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-blue-100 text-sm font-medium">Total Queries</p>
//               <p className="text-3xl font-bold mt-2">{stats.total}</p>
//             </div>
//             <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               <span className="text-3xl">📧</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-orange-100 text-sm font-medium">Open</p>
//               <p className="text-3xl font-bold mt-2">{stats.open}</p>
//             </div>
//             <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               <span className="text-3xl">📬</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-yellow-100 text-sm font-medium">In Progress</p>
//               <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
//             </div>
//             <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               <span className="text-3xl">⏳</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-green-100 text-sm font-medium">Closed</p>
//               <p className="text-3xl font-bold mt-2">{stats.closed}</p>
//             </div>
//             <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
//               <span className="text-3xl">✅</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Priority Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-red-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">High Priority</p>
//               <p className="text-2xl font-bold text-red-600 mt-1">{stats.highPriority}</p>
//             </div>
//             <span className="text-3xl">🔴</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-orange-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Medium Priority</p>
//               <p className="text-2xl font-bold text-orange-600 mt-1">{stats.mediumPriority}</p>
//             </div>
//             <span className="text-3xl">🟠</span>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-green-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-600 text-sm font-medium">Low Priority</p>
//               <p className="text-2xl font-bold text-green-600 mt-1">{stats.lowPriority}</p>
//             </div>
//             <span className="text-3xl">🟢</span>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-orange-50 rounded-xl p-6 mb-6">
//         <h3 className="font-bold text-lg mb-4">Filter Contacts</h3>
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Search (name/email/subject/phone)
//             </label>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Type to search..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//             <select 
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             >
//               <option>All</option>
//               <option value="open">Open</option>
//               <option value="in_progress">In Progress</option>
//               <option value="closed">Closed</option>
//               <option value="resolved">Resolved</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
//             <select 
//               value={priorityFilter}
//               onChange={(e) => setPriorityFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             >
//               <option>All</option>
//               <option value="high">High</option>
//               <option value="medium">Medium</option>
//               <option value="low">Low</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
//             <select 
//               value={inquiryTypeFilter}
//               onChange={(e) => setInquiryTypeFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             >
//               <option>All</option>
//               <option value="general">General</option>
//               <option value="sales">Sales</option>
//               <option value="support">Support</option>
//               <option value="technical">Technical</option>
//               <option value="billing">Billing</option>
//             </select>
//           </div>
//           <div className="flex items-end">
//             <button 
//               onClick={handleCreateContact}
//               className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
//             >
//               <span>➕</span>
//               New Contact
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Contacts List */}
//       <div className="space-y-4">
//         {filteredContacts.length === 0 ? (
//           <div className="bg-white rounded-xl p-12 text-center text-gray-500">
//             No contacts found
//           </div>
//         ) : (
//           filteredContacts.map((contact) => (
//             <div
//               key={contact._id}
//               className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-3 mb-2">
//                     <h3 className="font-bold text-lg">{contact.subject}</h3>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(contact.priority)}`}>
//                       {contact.priority.toUpperCase()}
//                     </span>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
//                       {contact.status.replace('_', ' ').toUpperCase()}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 mb-3 line-clamp-2">{contact.message}</p>
//                   <div className="flex items-center gap-4 text-sm text-gray-500">
//                     <span className="font-medium">👤 {contact.name}</span>
//                     <span>📧 {contact.email}</span>
//                     {contact.phone && <span>📱 {contact.phone}</span>}
//                     <span>📂 {contact.inquiryType}</span>
//                     <span>🕐 {new Date(contact.createdAt).toLocaleDateString()}</span>
//                   </div>
//                   <div className="flex gap-2 mt-4">
//                     <button 
//                       onClick={() => handleViewContact(contact)}
//                       className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
//                     >
//                       👁️ View Details
//                     </button>
//                     <button 
//                       onClick={() => handleEditContact(contact)}
//                       className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
//                     >
//                       ✏️ Edit
//                     </button>
//                     <button 
//                       onClick={() => handleDeleteContact(contact)}
//                       className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
//                     >
//                       🗑️ Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Pagination */}
//       {filteredContacts.length > 0 && (
//         <div className="flex justify-center items-center gap-2 mt-8">
//           <button 
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
//           >
//             Prev
//           </button>
//           <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
//           <button 
//             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* View Modal */}
//       {showViewModal && selectedContact && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div 
//             ref={viewModalRef}
//             className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//           >
//             <div className="flex justify-between items-center p-6 border-b bg-white">
//               <div>
//                 <h2 className="text-3xl font-bold">Contact Details</h2>
//                 <p className="text-gray-500 text-sm mt-1">Complete inquiry information</p>
//               </div>
//               <button 
//                 onClick={() => setShowViewModal(false)} 
//                 className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
//               >
//                 ×
//               </button>
//             </div>

//             <div className="overflow-y-auto flex-1 p-6">
//               <div className="grid grid-cols-2 gap-6">
//                 {/* Contact Info */}
//                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border-l-4 border-blue-500">
//                   <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
//                     <span>👤</span> Contact Information
//                   </h3>
//                   <div className="space-y-3">
//                     <div>
//                       <p className="text-xs text-blue-700 font-semibold uppercase">Name</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1">{selectedContact.name}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-blue-700 font-semibold uppercase">Email</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1">{selectedContact.email}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-blue-700 font-semibold uppercase">Phone</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1">{selectedContact.phone || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-blue-700 font-semibold uppercase">Inquiry Type</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1 capitalize">{selectedContact.inquiryType}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Status Info */}
//                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border-l-4 border-green-500">
//                   <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center gap-2">
//                     <span>⚙️</span> Status & Priority
//                   </h3>
//                   <div className="space-y-3">
//                     <div>
//                       <p className="text-xs text-green-700 font-semibold uppercase">Status</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedContact.status)}`}>
//                           {selectedContact.status.replace('_', ' ').toUpperCase()}
//                         </span>
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-green-700 font-semibold uppercase">Priority</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadge(selectedContact.priority)}`}>
//                           {selectedContact.priority.toUpperCase()}
//                         </span>
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-green-700 font-semibold uppercase">Assigned To</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1">{selectedContact.assignedTo || 'Unassigned'}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-green-700 font-semibold uppercase">Contact ID</p>
//                       <p className="font-mono text-sm bg-white p-2 rounded mt-1">{selectedContact._id}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Message */}
//                 <div className="col-span-2 bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border-l-4 border-purple-500">
//                   <h3 className="font-bold text-lg mb-4 text-purple-900 flex items-center gap-2">
//                     <span>💬</span> Inquiry Details
//                   </h3>
//                   <div className="space-y-3">
//                     <div>
//                       <p className="text-xs text-purple-700 font-semibold uppercase">Subject</p>
//                       <p className="font-medium bg-white p-3 rounded mt-1">{selectedContact.subject}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-purple-700 font-semibold uppercase">Message</p>
//                       <p className="font-medium bg-white p-3 rounded mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
//                     </div>
//                     {selectedContact.attachmentUrl && (
//                       <div>
//                         <p className="text-xs text-purple-700 font-semibold uppercase">Attachment</p>
//                         <a 
//                           href={selectedContact.attachmentUrl} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="font-medium bg-white p-3 rounded mt-1 block text-blue-600 hover:underline break-all"
//                         >
//                           {selectedContact.attachmentUrl}
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Timestamps */}
//                 <div className="col-span-2 bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border-l-4 border-gray-500">
//                   <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
//                     <span>🕐</span> Timeline
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-gray-700 font-semibold uppercase">Created At</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1 text-sm">{new Date(selectedContact.createdAt).toLocaleString()}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-700 font-semibold uppercase">Last Updated</p>
//                       <p className="font-medium bg-white p-2 rounded mt-1 text-sm">{new Date(selectedContact.updatedAt).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {showEditModal && selectedContact && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div 
//             ref={editModalRef}
//             className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//           >
//             <div className="flex justify-between items-center p-6 border-b bg-white">
//               <div>
//                 <h2 className="text-3xl font-bold">Edit Contact</h2>
//                 <p className="text-gray-500 text-sm mt-1">Update inquiry information</p>
//               </div>
//               <button 
//                 onClick={() => setShowEditModal(false)} 
//                 className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleUpdateContact} className="flex flex-col flex-1 overflow-hidden">
//               <div className="overflow-y-auto flex-1 p-6">
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Name</label>
//                     <input
//                       type="text"
//                       value={editForm.name}
//                       onChange={(e) => setEditForm({...editForm, name: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Email</label>
//                     <input
//                       type="email"
//                       value={editForm.email}
//                       onChange={(e) => setEditForm({...editForm, email: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Phone</label>
//                     <input
//                       type="text"
//                       value={editForm.phone}
//                       onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Inquiry Type</label>
//                     <select
//                       value={editForm.inquiryType}
//                       onChange={(e) => setEditForm({...editForm, inquiryType: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="general">General</option>
//                       <option value="sales">Sales</option>
//                       <option value="support">Support</option>
//                       <option value="technical">Technical</option>
//                       <option value="billing">Billing</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Status</label>
//                     <select
//                       value={editForm.status}
//                       onChange={(e) => setEditForm({...editForm, status: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="open">Open</option>
//                       <option value="in_progress">In Progress</option>
//                       <option value="closed">Closed</option>
//                       <option value="resolved">Resolved</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Priority</label>
//                     <select
//                       value={editForm.priority}
//                       onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="low">Low</option>
//                       <option value="medium">Medium</option>
//                       <option value="high">High</option>
//                     </select>
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Subject</label>
//                     <input
//                       type="text"
//                       value={editForm.subject}
//                       onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       required
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Message</label>
//                     <textarea
//                       value={editForm.message}
//                       onChange={(e) => setEditForm({...editForm, message: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       rows={4}
//                       required
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Attachment URL (optional)</label>
//                     <input
//                       type="url"
//                       value={editForm.attachmentUrl}
//                       onChange={(e) => setEditForm({...editForm, attachmentUrl: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="https://example.com/file.pdf"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Assigned To (optional)</label>
//                     <input
//                       type="text"
//                       value={editForm.assignedTo}
//                       onChange={(e) => setEditForm({...editForm, assignedTo: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="Admin username or email"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 p-6 border-t bg-white">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-bold hover:from-teal-700 hover:to-teal-800 transition-colors shadow-lg"
//                 >
//                   💾 Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Create Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div 
//             ref={createModalRef}
//             className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
//           >
//             <div className="flex justify-between items-center p-6 border-b bg-white">
//               <div>
//                 <h2 className="text-3xl font-bold">Create New Contact</h2>
//                 <p className="text-gray-500 text-sm mt-1">Add a new inquiry manually</p>
//               </div>
//               <button 
//                 onClick={() => setShowCreateModal(false)} 
//                 className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSubmitCreate} className="flex flex-col flex-1 overflow-hidden">
//               <div className="overflow-y-auto flex-1 p-6">
//                 <div className="grid grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Name *</label>
//                     <input
//                       type="text"
//                       value={createForm.name}
//                       onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Email *</label>
//                     <input
//                       type="email"
//                       value={createForm.email}
//                       onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Phone</label>
//                     <input
//                       type="text"
//                       value={createForm.phone}
//                       onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="+1234567890"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Inquiry Type</label>
//                     <select
//                       value={createForm.inquiryType}
//                       onChange={(e) => setCreateForm({...createForm, inquiryType: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="general">General</option>
//                       <option value="sales">Sales</option>
//                       <option value="support">Support</option>
//                       <option value="technical">Technical</option>
//                       <option value="billing">Billing</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Status</label>
//                     <select
//                       value={createForm.status}
//                       onChange={(e) => setCreateForm({...createForm, status: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="open">Open</option>
//                       <option value="in_progress">In Progress</option>
//                       <option value="closed">Closed</option>
//                       <option value="resolved">Resolved</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Priority</label>
//                     <select
//                       value={createForm.priority}
//                       onChange={(e) => setCreateForm({...createForm, priority: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="low">Low</option>
//                       <option value="medium">Medium</option>
//                       <option value="high">High</option>
//                     </select>
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Subject *</label>
//                     <input
//                       type="text"
//                       value={createForm.subject}
//                       onChange={(e) => setCreateForm({...createForm, subject: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="Brief description of the inquiry"
//                       required
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Message *</label>
//                     <textarea
//                       value={createForm.message}
//                       onChange={(e) => setCreateForm({...createForm, message: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       rows={4}
//                       placeholder="Detailed message..."
//                       required
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Attachment URL (optional)</label>
//                     <input
//                       type="url"
//                       value={createForm.attachmentUrl}
//                       onChange={(e) => setCreateForm({...createForm, attachmentUrl: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="https://example.com/file.pdf"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4 p-6 border-t bg-white">
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateModal(false)}
//                   className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg"
//                 >
//                   ➕ Create Contact
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && selectedContact && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div ref={deleteModalRef} className="bg-white rounded-2xl max-w-md w-full p-8">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-3xl">⚠️</span>
//               </div>
//               <h2 className="text-2xl font-bold mb-2">Delete Contact</h2>
//               <p className="text-gray-600">
//                 Are you sure you want to delete this contact inquiry from <strong>{selectedContact.name}</strong>? 
//                 This action cannot be undone.
//               </p>
//             </div>
            
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
//               >
//                 Delete Permanently
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'http://localhost:5000/api/v1';

interface Contact {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  inquiryType?: string;
  status?: string;
  attachmentUrl?: string;
  user?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  total: number;
  new: number;
  contacted: number;
  resolved: number;
}

export default function Contact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    new: 0,
    contacted: 0,
    resolved: 0
  });

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general',
    attachmentUrl: '',
    status: 'new'
  });

  // Refs for click outside
  const viewModalRef = useRef<HTMLDivElement>(null);
  const editModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);
  const createModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContacts();
  }, [currentPage]);

  useEffect(() => {
    calculateStats();
  }, [contacts]);

  // Click outside to close modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewModalRef.current && !viewModalRef.current.contains(event.target as Node)) {
        setShowViewModal(false);
      }
      if (editModalRef.current && !editModalRef.current.contains(event.target as Node)) {
        setShowEditModal(false);
      }
      if (deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setShowDeleteModal(false);
      }
      if (createModalRef.current && !createModalRef.current.contains(event.target as Node)) {
        setShowCreateModal(false);
      }
    };

    if (showViewModal || showEditModal || showDeleteModal || showCreateModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showViewModal, showEditModal, showDeleteModal, showCreateModal]);

  const calculateStats = () => {
    const total = contacts.length;
    const newContacts = contacts.filter(c => c.status === 'new').length;
    const contacted = contacts.filter(c => c.status === 'contacted').length;
    const resolved = contacts.filter(c => c.status === 'resolved').length;

    setStats({ total, new: newContacts, contacted, resolved });
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      // Admin endpoint
      const { data } = await axios.get(`${baseURL}/contact/admin/all`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          page: currentPage,
          limit: 20
        }
      });

      // Normalize data - add defaults if missing
      const normalizedContacts = (data.data || data || []).map((contact: Contact) => ({
        ...contact,
        status: contact.status || 'new',
        inquiryType: contact.inquiryType || 'general'
      }));

      setContacts(normalizedContacts);
      setTotalPages(data.meta?.pages || 1);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setEditForm({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      subject: contact.subject || '',
      message: contact.message || '',
      inquiryType: contact.inquiryType || 'general',
      attachmentUrl: contact.attachmentUrl || '',
      status: contact.status || 'new'
    });
    setShowEditModal(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const handleCreateContact = () => {
    setShowCreateModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedContact) return;

    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      // Admin delete endpoint
      await axios.delete(`${baseURL}/contact/admin/${selectedContact._id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      toast.success('Contact deleted successfully');
      setShowDeleteModal(false);
      fetchContacts();
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      toast.error(error.response?.data?.error || 'Failed to delete contact');
    }
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      // Admin update endpoint
      await axios.put(`${baseURL}/contact/admin/${selectedContact._id}`, 
        editForm,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      toast.success('Contact updated successfully');
      setShowEditModal(false);
      fetchContacts();
    } catch (error: any) {
      console.error('Error updating contact:', error);
      toast.error(error.response?.data?.error || 'Failed to update contact');
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      // Admin create endpoint
      await axios.post(`${baseURL}/contact/admin/create`, 
        createForm,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      toast.success('Contact created successfully');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general',
        attachmentUrl: '',
        status: 'new'
      });
      fetchContacts();
    } catch (error: any) {
      console.error('Error creating contact:', error);
      toast.error(error.response?.data?.error || 'Failed to create contact');
    }
  };

  const getStatusBadge = (status?: string) => {
    const safeStatus = status || 'new';
    const colors: Record<string, string> = {
      'new': 'bg-blue-500 text-white',
      'contacted': 'bg-yellow-500 text-white',
      'resolved': 'bg-green-500 text-white'
    };
    return colors[safeStatus] || 'bg-gray-500 text-white';
  };

  const formatStatus = (status?: string) => {
    return (status || 'new').toUpperCase();
  };

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter;
    const matchesType = inquiryTypeFilter === 'All' || contact.inquiryType === inquiryTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        Contact Queries Management
      </h1>
      <p className="text-gray-600 mb-6">Manage and respond to contact inquiries from users</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Queries</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">📧</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">New</p>
              <p className="text-3xl font-bold mt-2">{stats.new}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">📬</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Contacted</p>
              <p className="text-3xl font-bold mt-2">{stats.contacted}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Resolved</p>
              <p className="text-3xl font-bold mt-2">{stats.resolved}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-orange-50 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Filter Contacts</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search (name/email/subject/phone)
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>All</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
            <select 
              value={inquiryTypeFilter}
              onChange={(e) => setInquiryTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>All</option>
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership</option>
              <option value="feedback">Feedback</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleCreateContact}
              className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>➕</span>
              New Contact
            </button>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500">
            No contacts found
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{contact.subject || 'No Subject'}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(contact.status)}`}>
                      {formatStatus(contact.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{contact.message || 'No message'}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium">👤 {contact.name || 'Anonymous'}</span>
                    <span>📧 {contact.email}</span>
                    {contact.phone && <span>📱 {contact.phone}</span>}
                    <span>📂 {contact.inquiryType || 'general'}</span>
                    <span>🕐 {new Date(contact.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={() => handleViewContact(contact)}
                      className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      👁️ View Details
                    </button>
                    <button 
                      onClick={() => handleEditContact(contact)}
                      className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteContact(contact)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredContacts.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
          >
            Prev
          </button>
          <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={viewModalRef}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <div>
                <h2 className="text-3xl font-bold">Contact Details</h2>
                <p className="text-gray-500 text-sm mt-1">Complete inquiry information</p>
              </div>
              <button 
                onClick={() => setShowViewModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Contact Info */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border-l-4 border-blue-500">
                  <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
                    <span>👤</span> Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-blue-700 font-semibold uppercase">Name</p>
                      <p className="font-medium bg-white p-2 rounded mt-1">{selectedContact.name || 'Anonymous'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 font-semibold uppercase">Email</p>
                      <p className="font-medium bg-white p-2 rounded mt-1">{selectedContact.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 font-semibold uppercase">Phone</p>
                      <p className="font-medium bg-white p-2 rounded mt-1">{selectedContact.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-700 font-semibold uppercase">Inquiry Type</p>
                      <p className="font-medium bg-white p-2 rounded mt-1 capitalize">{selectedContact.inquiryType || 'general'}</p>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border-l-4 border-green-500">
                  <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center gap-2">
                    <span>⚙️</span> Status Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-green-700 font-semibold uppercase">Status</p>
                      <p className="font-medium bg-white p-2 rounded mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedContact.status)}`}>
                          {formatStatus(selectedContact.status)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-semibold uppercase">Contact ID</p>
                      <p className="font-mono text-sm bg-white p-2 rounded mt-1">{selectedContact._id}</p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="col-span-2 bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border-l-4 border-purple-500">
                  <h3 className="font-bold text-lg mb-4 text-purple-900 flex items-center gap-2">
                    <span>💬</span> Inquiry Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-purple-700 font-semibold uppercase">Subject</p>
                      <p className="font-medium bg-white p-3 rounded mt-1">{selectedContact.subject || 'No subject'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 font-semibold uppercase">Message</p>
                      <p className="font-medium bg-white p-3 rounded mt-1 whitespace-pre-wrap">{selectedContact.message || 'No message'}</p>
                    </div>
                    {selectedContact.attachmentUrl && (
                      <div>
                        <p className="text-xs text-purple-700 font-semibold uppercase">Attachment</p>
                        <a 
                          href={selectedContact.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium bg-white p-3 rounded mt-1 block text-blue-600 hover:underline break-all"
                        >
                          {selectedContact.attachmentUrl}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="col-span-2 bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border-l-4 border-gray-500">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <span>🕐</span> Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-700 font-semibold uppercase">Created At</p>
                      <p className="font-medium bg-white p-2 rounded mt-1 text-sm">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 font-semibold uppercase">Last Updated</p>
                      <p className="font-medium bg-white p-2 rounded mt-1 text-sm">{new Date(selectedContact.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={editModalRef}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <div>
                <h2 className="text-3xl font-bold">Edit Contact</h2>
                <p className="text-gray-500 text-sm mt-1">Update inquiry information</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateContact} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                    <select
                      value={editForm.inquiryType}
                      onChange={(e) => setEditForm({...editForm, inquiryType: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="general">General</option>
                      <option value="support">Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="sales">Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({...editForm, subject: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={editForm.message}
                      onChange={(e) => setEditForm({...editForm, message: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={4}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Attachment URL (optional)</label>
                    <input
                      type="url"
                      value={editForm.attachmentUrl}
                      onChange={(e) => setEditForm({...editForm, attachmentUrl: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="https://example.com/file.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 p-6 border-t bg-white">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-bold hover:from-teal-700 hover:to-teal-800 transition-colors shadow-lg"
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={createModalRef}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <div>
                <h2 className="text-3xl font-bold">Create New Contact</h2>
                <p className="text-gray-500 text-sm mt-1">Add a new inquiry manually</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="text"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                    <select
                      value={createForm.inquiryType}
                      onChange={(e) => setCreateForm({...createForm, inquiryType: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="general">General</option>
                      <option value="support">Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="sales">Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={createForm.status}
                      onChange={(e) => setCreateForm({...createForm, status: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      value={createForm.subject}
                      onChange={(e) => setCreateForm({...createForm, subject: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Brief description of the inquiry"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      value={createForm.message}
                      onChange={(e) => setCreateForm({...createForm, message: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={4}
                      placeholder="Detailed message..."
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Attachment URL (optional)</label>
                    <input
                      type="url"
                      value={createForm.attachmentUrl}
                      onChange={(e) => setCreateForm({...createForm, attachmentUrl: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="https://example.com/file.pdf"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 p-6 border-t bg-white">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg"
                >
                  ➕ Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={deleteModalRef} className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Delete Contact</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this contact inquiry from <strong>{selectedContact.name || selectedContact.email}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}