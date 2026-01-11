

// 'use client';

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1';

// interface User {
//   _id: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   role: string;
//   status: string;
//   phoneNumber?: string;
//   location?: string;
//   headline?: string;
//   resumeUrl?: string;
//   profilePictureUrl?: string;
//   skills: string[];
//   isEmailVerified: boolean;
//   twoFactorEnabled: boolean;
//   lastLoginAt?: string;
//   createdAt: string;
//   updatedAt: string;
//   averageRating: number;
//   totalRatings: number;
// }

// export default function Users() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [roleFilter, setRoleFilter] = useState('All');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
  
//   // Modals
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [editForm, setEditForm] = useState<any>({});

//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const accessToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('accessToken='))
//         ?.split('=')[1];

//       const { data } = await axios.get(`${baseURL}/admin/users`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         },
//         params: {
//           page: currentPage,
//           limit: 20
//         }
//       });

//       setUsers(data.data || []);
//       setTotalPages(data.meta?.pages || 1);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       toast.error('Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewUser = (user: User) => {
//     setSelectedUser(user);
//     setShowViewModal(true);
//   };

//   const handleEditUser = (user: User) => {
//     setSelectedUser(user);
//     setEditForm({
//       firstName: user.firstName || '',
//       lastName: user.lastName || '',
//       email: user.email,
//       phoneNumber: user.phoneNumber || '',
//       location: user.location || '',
//       headline: user.headline || '',
//       resumeUrl: user.resumeUrl || '',
//       profilePictureUrl: user.profilePictureUrl || '',
//       role: user.role,
//       status: user.status,
//       skills: user.skills.join(', '),
//       isEmailVerified: user.isEmailVerified,
//       twoFactorEnabled: user.twoFactorEnabled
//     });
//     setShowEditModal(true);
//   };

//   const handleDeleteUser = (user: User) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!selectedUser) return;

//     try {
//       const accessToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('accessToken='))
//         ?.split('=')[1];

//       await axios.delete(`${baseURL}/admin/users/${selectedUser._id}`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`
//         }
//       });

//       toast.success('User deleted successfully');
//       setShowDeleteModal(false);
//       fetchUsers();
//     } catch (error: any) {
//       console.error('Error deleting user:', error);
//       toast.error(error.response?.data?.error || 'Failed to delete user');
//     }
//   };

//   const handleUpdateUser = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedUser) return;

//     try {
//       const accessToken = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('accessToken='))
//         ?.split('=')[1];

//       const updateData = {
//         firstName: editForm.firstName,
//         lastName: editForm.lastName,
//         phoneNumber: editForm.phoneNumber,
//         location: editForm.location,
//         headline: editForm.headline,
//         resumeUrl: editForm.resumeUrl,
//         profilePictureUrl: editForm.profilePictureUrl,
//         role: editForm.role,
//         status: editForm.status,
//         skills: editForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
//         isEmailVerified: editForm.isEmailVerified,
//         twoFactorEnabled: editForm.twoFactorEnabled
//       };

//       await axios.put(`${baseURL}/admin/users/${selectedUser._id}`, 
//         updateData,
//         {
//           headers: {
//             'Authorization': `Bearer ${accessToken}`
//           }
//         }
//       );

//       toast.success('User updated successfully');
//       setShowEditModal(false);
//       fetchUsers();
//     } catch (error: any) {
//       console.error('Error updating user:', error);
//       toast.error(error.response?.data?.error || 'Failed to update user');
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const colors: Record<string, string> = {
//       'active': 'bg-green-500 text-white',
//       'pending_verification': 'bg-yellow-500 text-white',
//       'verified': 'bg-blue-500 text-white',
//       'deactivated': 'bg-red-500 text-white',
//       'rejected': 'bg-gray-500 text-white'
//     };
//     return colors[status] || 'bg-gray-500 text-white';
//   };

//   const getRoleBadge = (role: string) => {
//     const colors: Record<string, string> = {
//       'admin': 'bg-purple-100 text-purple-600',
//       'job_seeker': 'bg-blue-100 text-blue-600',
//       'employer': 'bg-green-100 text-green-600',
//       'csr': 'bg-orange-100 text-orange-600',
//       'sales': 'bg-pink-100 text-pink-600',
//       'user': 'bg-gray-100 text-gray-600'
//     };
//     return colors[role] || 'bg-gray-100 text-gray-600';
//   };

//   // Filter users
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = 
//       user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       user.phoneNumber?.includes(searchQuery) ||
//       user.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
//     const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
//     return matchesSearch && matchesStatus && matchesRole;
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-2">User Management</h1>
//       <p className="text-gray-600 mb-6">Manage and maintain all users in the system</p>

//       {/* Filters */}
//       <div className="bg-orange-50 rounded-xl p-6 mb-6">
//         <h3 className="font-bold text-lg mb-4">Filter Users</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Search (email/name/phone/location)
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
//               <option value="active">Active</option>
//               <option value="pending_verification">Pending Verification</option>
//               <option value="verified">Verified</option>
//               <option value="deactivated">Deactivated</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//             <select 
//               value={roleFilter}
//               onChange={(e) => setRoleFilter(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
//             >
//               <option>All</option>
//               <option value="admin">Admin</option>
//               <option value="job_seeker">Job Seeker</option>
//               <option value="employer">Employer</option>
//               <option value="csr">CSR</option>
//               <option value="sales">Sales</option>
//               <option value="user">User</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold">Users ({filteredUsers.length} total)</h2>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Verified</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Last Login</th>
//                 <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
//                     No users found
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((user) => (
//                   <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="px-6 py-4 text-sm">
//                       {user.firstName || user.lastName 
//                         ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
//                         : 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 text-sm">{user.email}</td>
//                     <td className="px-6 py-4 text-sm">{user.phoneNumber || 'N/A'}</td>
//                     <td className="px-6 py-4 text-sm">{user.location || 'N/A'}</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
//                         {user.role.replace('_', ' ').toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
//                         {user.status.replace('_', ' ').toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 rounded text-xs ${user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                         {user.isEmailVerified ? '✓ Yes' : '✗ No'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm">
//                       {user.lastLoginAt 
//                         ? new Date(user.lastLoginAt).toLocaleDateString()
//                         : 'Never'}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button 
//                           onClick={() => handleViewUser(user)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Details"
//                         >
//                           👁️
//                         </button>
//                         <button 
//                           onClick={() => handleEditUser(user)}
//                           className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                           title="Edit"
//                         >
//                           ✏️
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteUser(user)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {filteredUsers.length > 0 && (
//           <div className="flex justify-center items-center gap-2 p-6">
//             <button 
//               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
//             >
//               Prev
//             </button>
//             <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
//             <button 
//               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>

//       {/* View Modal - Shows ALL fields */}
//       {showViewModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl max-w-4xl w-full p-8 my-8 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//               <h2 className="text-2xl font-bold">Complete User Details</h2>
//               <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
//                 ×
//               </button>
//             </div>
            
//             <div className="grid grid-cols-2 gap-6">
//               <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
//                 <h3 className="font-bold text-lg mb-2">Basic Information</h3>
//               </div>
              
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">User ID</p>
//                 <p className="font-mono text-sm">{selectedUser._id}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Email</p>
//                 <p className="font-medium">{selectedUser.email}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">First Name</p>
//                 <p className="font-medium">{selectedUser.firstName || <span className="text-gray-400 italic">Not set</span>}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Last Name</p>
//                 <p className="font-medium">{selectedUser.lastName || <span className="text-gray-400 italic">Not set</span>}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Phone Number</p>
//                 <p className="font-medium">{selectedUser.phoneNumber || <span className="text-gray-400 italic">Not set</span>}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Location</p>
//                 <p className="font-medium">{selectedUser.location || <span className="text-gray-400 italic">Not set</span>}</p>
//               </div>
              
//               <div className="col-span-2">
//                 <p className="text-sm text-gray-600 font-medium">Headline</p>
//                 <p className="font-medium">{selectedUser.headline || <span className="text-gray-400 italic">Not set</span>}</p>
//               </div>

//               <div className="col-span-2 bg-green-50 p-4 rounded-lg mt-4">
//                 <h3 className="font-bold text-lg mb-2">Account Settings</h3>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Role</p>
//                 <p className="font-medium">{selectedUser.role}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Status</p>
//                 <p className="font-medium">{selectedUser.status}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Email Verified</p>
//                 <p className="font-medium">{selectedUser.isEmailVerified ? '✓ Yes' : '✗ No'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">2FA Enabled</p>
//                 <p className="font-medium">{selectedUser.twoFactorEnabled ? '✓ Yes' : '✗ No'}</p>
//               </div>

//               <div className="col-span-2 bg-purple-50 p-4 rounded-lg mt-4">
//                 <h3 className="font-bold text-lg mb-2">Profile URLs</h3>
//               </div>

//               <div className="col-span-2">
//                 <p className="text-sm text-gray-600 font-medium">Resume URL</p>
//                 <p className="font-medium break-all">{selectedUser.resumeUrl || <span className="text-gray-400 italic">Not set</span>}</p>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-sm text-gray-600 font-medium">Profile Picture URL</p>
//                 <p className="font-medium break-all">{selectedUser.profilePictureUrl || <span className="text-gray-400 italic">Not set</span>}</p>
//               </div>

//               <div className="col-span-2 bg-orange-50 p-4 rounded-lg mt-4">
//                 <h3 className="font-bold text-lg mb-2">Skills & Ratings</h3>
//               </div>

//               <div className="col-span-2">
//                 <p className="text-sm text-gray-600 font-medium mb-2">Skills</p>
//                 {selectedUser.skills.length > 0 ? (
//                   <div className="flex flex-wrap gap-2">
//                     {selectedUser.skills.map((skill, index) => (
//                       <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 ) : (
//                   <span className="text-gray-400 italic">No skills added</span>
//                 )}
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Average Rating</p>
//                 <p className="font-medium">{selectedUser.averageRating > 0 ? `⭐ ${selectedUser.averageRating}` : 'Not rated'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Total Ratings</p>
//                 <p className="font-medium">{selectedUser.totalRatings}</p>
//               </div>

//               <div className="col-span-2 bg-gray-50 p-4 rounded-lg mt-4">
//                 <h3 className="font-bold text-lg mb-2">Timestamps</h3>
//               </div>

//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Created At</p>
//                 <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Updated At</p>
//                 <p className="font-medium">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-600 font-medium">Last Login</p>
//                 <p className="font-medium">
//                   {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : 'Never logged in'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal - ALL fields editable */}
//       {showEditModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl max-w-4xl w-full p-8 my-8 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//               <h2 className="text-2xl font-bold">Edit User - All Fields</h2>
//               <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
//                 ×
//               </button>
//             </div>
            
//             <form onSubmit={handleUpdateUser} className="space-y-6">
//               {/* Basic Information */}
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h3 className="font-bold mb-4">Basic Information</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">First Name</label>
//                     <input
//                       type="text"
//                       value={editForm.firstName}
//                       onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="Enter first name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Last Name</label>
//                     <input
//                       type="text"
//                       value={editForm.lastName}
//                       onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="Enter last name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Email (Read-only)</label>
//                     <input
//                       type="email"
//                       value={editForm.email}
//                       disabled
//                       className="w-full px-4 py-2 border rounded-lg bg-gray-100"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Phone Number</label>
//                     <input
//                       type="text"
//                       value={editForm.phoneNumber}
//                       onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="Enter phone number"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Location</label>
//                     <input
//                       type="text"
//                       value={editForm.location}
//                       onChange={(e) => setEditForm({...editForm, location: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="Enter location"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <label className="block text-sm font-medium mb-2">Headline</label>
//                     <input
//                       type="text"
//                       value={editForm.headline}
//                       onChange={(e) => setEditForm({...editForm, headline: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="Enter headline"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Account Settings */}
//               <div className="bg-green-50 p-4 rounded-lg">
//                 <h3 className="font-bold mb-4">Account Settings</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Role</label>
//                     <select
//                       value={editForm.role}
//                       onChange={(e) => setEditForm({...editForm, role: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="job_seeker">Job Seeker</option>
//                       <option value="employer">Employer</option>
//                       <option value="admin">Admin</option>
//                       <option value="csr">CSR</option>
//                       <option value="sales">Sales</option>
//                       <option value="user">User</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Status</label>
//                     <select
//                       value={editForm.status}
//                       onChange={(e) => setEditForm({...editForm, status: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                     >
//                       <option value="active">Active</option>
//                       <option value="pending_verification">Pending Verification</option>
//                       <option value="verified">Verified</option>
//                       <option value="deactivated">Deactivated</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm.isEmailVerified}
//                         onChange={(e) => setEditForm({...editForm, isEmailVerified: e.target.checked})}
//                         className="w-4 h-4"
//                       />
//                       <span className="text-sm font-medium">Email Verified</span>
//                     </label>
//                   </div>
//                   <div>
//                     <label className="flex items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={editForm.twoFactorEnabled}
//                         onChange={(e) => setEditForm({...editForm, twoFactorEnabled: e.target.checked})}
//                         className="w-4 h-4"
//                       />
//                       <span className="text-sm font-medium">2FA Enabled</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* URLs */}
//               <div className="bg-purple-50 p-4 rounded-lg">
//                 <h3 className="font-bold mb-4">Profile URLs</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Resume URL</label>
//                     <input
//                       type="url"
//                       value={editForm.resumeUrl}
//                       onChange={(e) => setEditForm({...editForm, resumeUrl: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="https://example.com/resume.pdf"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Profile Picture URL</label>
//                     <input
//                       type="url"
//                       value={editForm.profilePictureUrl}
//                       onChange={(e) => setEditForm({...editForm, profilePictureUrl: e.target.value})}
//                       className="w-full px-4 py-2 border rounded-lg"
//                       placeholder="https://example.com/profile.jpg"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Skills */}
//               <div className="bg-orange-50 p-4 rounded-lg">
//                 <h3 className="font-bold mb-4">Skills</h3>
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
//                   <textarea
//                     value={editForm.skills}
//                     onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
//                     className="w-full px-4 py-2 border rounded-lg"
//                     rows={3}
//                     placeholder="JavaScript, React, Node.js, Python"
//                   />
//                   <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
//                 </div>
//               </div>
              
//               <div className="flex gap-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700"
//                 >
//                   Save All Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {showDeleteModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-8">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-3xl">⚠️</span>
//               </div>
//               <h2 className="text-2xl font-bold mb-2">Delete User</h2>
//               <p className="text-gray-600">
//                 Are you sure you want to permanently delete <strong>{selectedUser.email}</strong>? 
//                 This action cannot be undone and will remove all associated data.
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

const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1';

interface User {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  phoneNumber?: string;
  location?: string;
  headline?: string;
  resumeUrl?: string;
  profilePictureUrl?: string;
  skills: string[];
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  totalRatings: number;
  agentRatings: any[];
  failedLoginAttempts: number;
  lockUntil?: string;
  tokenVersion: number;
  passwordResetToken?: string;
  passwordResetExpires?: string;
}

interface UserStats {
  total: number;
  active: number;
  pending: number;
  verified: number;
  admins: number;
  jobSeekers: number;
  employers: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    pending: 0,
    verified: 0,
    admins: 0,
    jobSeekers: 0,
    employers: 0
  });
  
  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  // Refs for click outside
  const viewModalRef = useRef<HTMLDivElement>(null);
  const editModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  useEffect(() => {
    // Calculate stats whenever users change
    calculateStats();
  }, [users]);

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
    };

    if (showViewModal || showEditModal || showDeleteModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showViewModal, showEditModal, showDeleteModal]);

  const calculateStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const pending = users.filter(u => u.status === 'pending_verification').length;
    const verified = users.filter(u => u.status === 'verified').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const jobSeekers = users.filter(u => u.role === 'job_seeker').length;
    const employers = users.filter(u => u.role === 'employer').length;

    setStats({ total, active, pending, verified, admins, jobSeekers, employers });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      const { data } = await axios.get(`${baseURL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          page: currentPage,
          limit: 20
        }
      });

      setUsers(data.data || []);
      setTotalPages(data.meta?.pages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      location: user.location || '',
      headline: user.headline || '',
      resumeUrl: user.resumeUrl || '',
      profilePictureUrl: user.profilePictureUrl || '',
      role: user.role,
      status: user.status,
      skills: user.skills.join(', '),
      isEmailVerified: user.isEmailVerified,
      twoFactorEnabled: user.twoFactorEnabled
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      await axios.delete(`${baseURL}/admin/users/${selectedUser._id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      const updateData = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
        location: editForm.location,
        headline: editForm.headline,
        resumeUrl: editForm.resumeUrl,
        profilePictureUrl: editForm.profilePictureUrl,
        role: editForm.role,
        status: editForm.status,
        skills: editForm.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        isEmailVerified: editForm.isEmailVerified,
        twoFactorEnabled: editForm.twoFactorEnabled
      };

      await axios.put(`${baseURL}/users/${selectedUser._id}`, 
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.error || 'Failed to update user');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-500 text-white',
      'pending_verification': 'bg-yellow-500 text-white',
      'verified': 'bg-blue-500 text-white',
      'deactivated': 'bg-red-500 text-white',
      'rejected': 'bg-gray-500 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-purple-100 text-purple-600',
      'job_seeker': 'bg-blue-100 text-blue-600',
      'employer': 'bg-green-100 text-green-600',
      'csr': 'bg-orange-100 text-orange-600',
      'sales': 'bg-pink-100 text-pink-600',
      'user': 'bg-gray-100 text-gray-600'
    };
    return colors[role] || 'bg-gray-100 text-gray-600';
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.includes(searchQuery) ||
      user.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">User Management</h1>
      <p className="text-gray-600 mb-6">Manage and maintain all users in the system</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold mt-2">{stats.active}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending Verification</p>
              <p className="text-3xl font-bold mt-2">{stats.pending}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Verified Users</p>
              <p className="text-3xl font-bold mt-2">{stats.verified}</p>
            </div>
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Admins</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.admins}</p>
            </div>
            <span className="text-3xl">👨‍💼</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Job Seekers</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.jobSeekers}</p>
            </div>
            <span className="text-3xl">🔍</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Employers</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.employers}</p>
            </div>
            <span className="text-3xl">🏢</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-orange-50 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Filter Users</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search (email/name/phone/location)
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
              <option value="active">Active</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="deactivated">Deactivated</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>All</option>
              <option value="admin">Admin</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="csr">CSR</option>
              <option value="sales">Sales</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table with MORE COLUMNS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Users ({filteredUsers.length} total)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Headline</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Verified</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">2FA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Skills</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {user.firstName || user.lastName 
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{user.phoneNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{user.location || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm max-w-xs truncate" title={user.headline || ''}>
                      {user.headline || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getRoleBadge(user.role)}`}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadge(user.status)}`}>
                        {user.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isEmailVerified ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${user.twoFactorEnabled ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.twoFactorEnabled ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {user.skills.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {user.averageRating > 0 ? `⭐ ${user.averageRating.toFixed(1)}` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {user.lastLoginAt 
                        ? new Date(user.lastLoginAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex justify-center items-center gap-2 p-6">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* View Modal - LANDSCAPE MODE - Click outside to close */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={viewModalRef}
            className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Fixed Header - Not scrollable */}
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <div>
                <h2 className="text-3xl font-bold">Complete User Profile</h2>
                <p className="text-gray-500 text-sm mt-1">All fields from User Model</p>
              </div>
              <button 
                onClick={() => setShowViewModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* COLUMN 1 - Personal Information */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border-l-4 border-blue-500">
                    <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
                      <span>👤</span> Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-blue-700 font-semibold uppercase">User ID</p>
                        <p className="font-mono text-sm bg-white p-2 rounded mt-1">{selectedUser._id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 font-semibold uppercase">Email</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 font-semibold uppercase">First Name</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.firstName || <span className="text-gray-400 italic">Not set</span>}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 font-semibold uppercase">Last Name</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.lastName || <span className="text-gray-400 italic">Not set</span>}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 font-semibold uppercase">Phone Number</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.phoneNumber || <span className="text-gray-400 italic">Not set</span>}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 font-semibold uppercase">Location</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.location || <span className="text-gray-400 italic">Not set</span>}</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-700 font-semibold uppercase">Headline</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.headline || <span className="text-gray-400 italic">Not set</span>}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile URLs */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border-l-4 border-purple-500">
                    <h3 className="font-bold text-lg mb-4 text-purple-900 flex items-center gap-2">
                      <span>🔗</span> Profile URLs
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-purple-700 font-semibold uppercase">Resume URL</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 break-all text-sm">
                          {selectedUser.resumeUrl || <span className="text-gray-400 italic">Not set</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-purple-700 font-semibold uppercase">Profile Picture URL</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 break-all text-sm">
                          {selectedUser.profilePictureUrl || <span className="text-gray-400 italic">Not set</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2 - Account & Security */}
                <div className="space-y-6">
                  {/* Account Settings */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border-l-4 border-green-500">
                    <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center gap-2">
                      <span>⚙️</span> Account Settings
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-green-700 font-semibold uppercase">Role</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(selectedUser.role)}`}>
                            {selectedUser.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 font-semibold uppercase">Status</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedUser.status)}`}>
                            {selectedUser.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700 font-semibold uppercase">Email Verified</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs ${selectedUser.isEmailVerified ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {selectedUser.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-5 rounded-xl border-l-4 border-red-500">
                    <h3 className="font-bold text-lg mb-4 text-red-900 flex items-center gap-2">
                      <span>🔒</span> Security Settings
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-red-700 font-semibold uppercase">Two Factor Auth (2FA)</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">
                          <span className={`px-3 py-1 rounded-full text-xs ${selectedUser.twoFactorEnabled ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                            {selectedUser.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-red-700 font-semibold uppercase">2FA Secret</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 text-sm">
                          {selectedUser.twoFactorSecret ? '••••••••••••' : <span className="text-gray-400 italic">Not set</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-red-700 font-semibold uppercase">Failed Login Attempts</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">
                          <span className={`px-3 py-1 rounded ${selectedUser.failedLoginAttempts > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {selectedUser.failedLoginAttempts} attempts
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-red-700 font-semibold uppercase">Account Lock Until</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 text-sm">
                          {selectedUser.lockUntil ? new Date(selectedUser.lockUntil).toLocaleString() : <span className="text-gray-400 italic">Not locked</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-red-700 font-semibold uppercase">Token Version</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.tokenVersion}</p>
                      </div>
                      <div>
                        <p className="text-xs text-red-700 font-semibold uppercase">Password Reset Token</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 text-sm">
                          {selectedUser.passwordResetToken ? '••••••••••••' : <span className="text-gray-400 italic">Not set</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-red-700 font-semibold uppercase">Reset Token Expires</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 text-sm">
                          {selectedUser.passwordResetExpires ? new Date(selectedUser.passwordResetExpires).toLocaleString() : <span className="text-gray-400 italic">N/A</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3 - Skills, Ratings & Timestamps */}
                <div className="space-y-6">
                  {/* Skills */}
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-xl border-l-4 border-orange-500">
                    <h3 className="font-bold text-lg mb-4 text-orange-900 flex items-center gap-2">
                      <span>💡</span> Skills & Expertise
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-orange-700 font-semibold uppercase mb-2">Skills</p>
                        {selectedUser.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2 bg-white p-3 rounded">
                            {selectedUser.skills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic bg-white p-3 rounded">No skills added</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl border-l-4 border-yellow-500">
                    <h3 className="font-bold text-lg mb-4 text-yellow-900 flex items-center gap-2">
                      <span>⭐</span> Ratings & Reviews
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-yellow-700 font-semibold uppercase">Average Rating</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">
                          {selectedUser.averageRating > 0 
                            ? <span className="text-2xl">⭐ {selectedUser.averageRating.toFixed(1)}</span>
                            : <span className="text-gray-400 italic">Not rated yet</span>
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-700 font-semibold uppercase">Total Ratings</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.totalRatings} ratings</p>
                      </div>
                      <div>
                        <p className="text-xs text-yellow-700 font-semibold uppercase">Agent Ratings Count</p>
                        <p className="font-medium bg-white p-2 rounded mt-1">{selectedUser.agentRatings?.length || 0} reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border-l-4 border-gray-500">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                      <span>🕐</span> Activity Timeline
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-700 font-semibold uppercase">Account Created</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 text-sm">{new Date(selectedUser.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-semibold uppercase">Last Updated</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 text-sm">{new Date(selectedUser.updatedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-700 font-semibold uppercase">Last Login</p>
                        <p className="font-medium bg-white p-2 rounded mt-1 text-sm">
                          {selectedUser.lastLoginAt 
                            ? new Date(selectedUser.lastLoginAt).toLocaleString() 
                            : <span className="text-gray-400 italic">Never logged in</span>
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - LANDSCAPE MODE - Click outside to close - Fixed Header */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={editModalRef}
            className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b bg-white">
              <div>
                <h2 className="text-3xl font-bold">Edit User Profile</h2>
                <p className="text-gray-500 text-sm mt-1">Modify all user information</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleUpdateUser} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* COLUMN 1 - Personal Information */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border-l-4 border-blue-500">
                      <h3 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
                        <span>👤</span> Personal Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-blue-700 font-semibold uppercase mb-1">Email (Read-only)</label>
                          <input
                            type="email"
                            value={editForm.email}
                            disabled
                            className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-700 font-semibold uppercase mb-1">First Name</label>
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-700 font-semibold uppercase mb-1">Last Name</label>
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter last name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-700 font-semibold uppercase mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={editForm.phoneNumber}
                            onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-700 font-semibold uppercase mb-1">Location</label>
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-blue-700 font-semibold uppercase mb-1">Headline</label>
                          <textarea
                            value={editForm.headline}
                            onChange={(e) => setEditForm({...editForm, headline: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Professional headline"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border-l-4 border-purple-500">
                      <h3 className="font-bold text-lg mb-4 text-purple-900 flex items-center gap-2">
                        <span>🔗</span> Profile URLs
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-purple-700 font-semibold uppercase mb-1">Resume URL</label>
                          <input
                            type="url"
                            value={editForm.resumeUrl}
                            onChange={(e) => setEditForm({...editForm, resumeUrl: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                            placeholder="https://example.com/resume.pdf"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-purple-700 font-semibold uppercase mb-1">Profile Picture URL</label>
                          <input
                            type="url"
                            value={editForm.profilePictureUrl}
                            onChange={(e) => setEditForm({...editForm, profilePictureUrl: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                            placeholder="https://example.com/photo.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2 - Account Settings */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border-l-4 border-green-500">
                      <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center gap-2">
                        <span>⚙️</span> Account Settings
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-green-700 font-semibold uppercase mb-1">Role</label>
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                          >
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                            <option value="admin">Admin</option>
                            <option value="csr">CSR (Customer Support)</option>
                            <option value="sales">Sales</option>
                            <option value="user">User</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-green-700 font-semibold uppercase mb-1">Status</label>
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                          >
                            <option value="active">Active</option>
                            <option value="pending_verification">Pending Verification</option>
                            <option value="verified">Verified</option>
                            <option value="deactivated">Deactivated</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.isEmailVerified}
                              onChange={(e) => setEditForm({...editForm, isEmailVerified: e.target.checked})}
                              className="w-5 h-5 text-green-600"
                            />
                            <span className="text-sm font-medium text-green-900">Email Verified</span>
                          </label>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.twoFactorEnabled}
                              onChange={(e) => setEditForm({...editForm, twoFactorEnabled: e.target.checked})}
                              className="w-5 h-5 text-green-600"
                            />
                            <span className="text-sm font-medium text-green-900">Two-Factor Authentication</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 3 - Skills */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-xl border-l-4 border-orange-500">
                      <h3 className="font-bold text-lg mb-4 text-orange-900 flex items-center gap-2">
                        <span>💡</span> Skills & Expertise
                      </h3>
                      <div>
                        <label className="block text-xs text-orange-700 font-semibold uppercase mb-1">
                          Skills (comma-separated)
                        </label>
                        <textarea
                          value={editForm.skills}
                          onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                          rows={8}
                          placeholder="JavaScript, React, Node.js, Python, MongoDB..."
                        />
                        <p className="text-xs text-orange-600 mt-2">💡 Separate skills with commas</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl border-l-4 border-yellow-500">
                      <h3 className="font-bold text-lg mb-4 text-yellow-900 flex items-center gap-2">
                        <span>ℹ️</span> Read-Only Info
                      </h3>
                      <div className="space-y-2 text-sm text-yellow-800 bg-white p-3 rounded">
                        <p>⭐ Average Rating: {selectedUser.averageRating.toFixed(1)}</p>
                        <p>📊 Total Ratings: {selectedUser.totalRatings}</p>
                        <p>🔢 Token Version: {selectedUser.tokenVersion}</p>
                        <p>❌ Failed Attempts: {selectedUser.failedLoginAttempts}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer Buttons */}
              <div className="flex gap-4 p-6 border-t bg-white">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel Changes
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-bold hover:from-teal-700 hover:to-teal-800 transition-colors shadow-lg"
                >
                  💾 Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal - Click outside to close */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div ref={deleteModalRef} className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Delete User</h2>
              <p className="text-gray-600">
                Are you sure you want to permanently delete <strong>{selectedUser.email}</strong>? 
                This action cannot be undone and will remove all associated data.
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