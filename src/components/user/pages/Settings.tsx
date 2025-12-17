
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/baseapi';
// import { toast } from 'react-toastify';

// interface UserProfile {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber?: string;
//   role: string;
//   status: string;
//   skills: string[];
//   isEmailVerified: boolean;
//   twoFactorEnabled: boolean;
//   lastLoginAt?: string;
//   createdAt: string;
//   agentRatings?: any[];
//   averageRating?: number;
//   totalRatings?: number;
// }

// export default function Settings() {
//   const router = useRouter();
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
  
//   // Modals
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  
//   // Form data
//   const [editData, setEditData] = useState({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     headline: '',
//     location: '',
//     resumeUrl: '',
//     profilePictureUrl: '',
//     // Admin only fields
//     role: '',
//     status: '',
//     isEmailVerified: false,
//     twoFactorEnabled: false
//   });
  
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: '',
//     showCurrent: false,
//     showNew: false,
//     showConfirm: false
//   });
  
//   const [passwordValidation, setPasswordValidation] = useState({
//     minLength: false,
//     hasUpperCase: false,
//     hasLowerCase: false,
//     hasNumber: false,
//     hasSpecialChar: false,
//     isValid: false
//   });
  
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get('/users/me');
//       const userData = data.user || data;
//       setProfile(userData);
      
//       // Set edit data with all fields
//       setEditData({
//         firstName: userData.firstName || '',
//         lastName: userData.lastName || '',
//         phoneNumber: userData.phoneNumber || '',
//         headline: userData.headline || '',
//         location: userData.location || '',
//         resumeUrl: userData.resumeUrl || '',
//         profilePictureUrl: userData.profilePictureUrl || '',
//         // Admin only fields
//         role: userData.role || '',
//         status: userData.status || '',
//         isEmailVerified: userData.isEmailVerified || false,
//         twoFactorEnabled: userData.twoFactorEnabled || false
//       });
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       toast.error('Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateProfile = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       setSubmitting(true);
//       const { data } = await api.put('/users/me/', editData);
      
//       // Refresh profile after update
//       await fetchProfile();
//       toast.success('Profile updated successfully! 🎉');
//       setShowEditModal(false);
//     } catch (error: any) {
//       console.error('Error updating profile:', error);
//       toast.error(error.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const validatePassword = (password: string) => {
//     const validation = {
//       minLength: password.length >= 6,
//       hasUpperCase: /[A-Z]/.test(password),
//       hasLowerCase: /[a-z]/.test(password),
//       hasNumber: /\d/.test(password),
//       hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
//       isValid: password.length >= 6
//     };
//     setPasswordValidation(validation);
//   };

//   const handleChangePassword = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       toast.error('Passwords do not match');
//       return;
//     }
    
//     if (passwordData.newPassword.length < 6) {
//       toast.error('Password must be at least 6 characters');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       await api.put('/users/me/change-password', {
//         currentPassword: passwordData.currentPassword,
//         newPassword: passwordData.newPassword
//       });
      
//       toast.success('Password changed successfully! 🎉');
//       setShowPasswordModal(false);
//       setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', showCurrent: false, showNew: false, showConfirm: false });
//     } catch (error: any) {
//       console.error('Error changing password:', error);
//       toast.error(error.response?.data?.message || 'Failed to change password');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeactivate = async () => {
//     try {
//       setSubmitting(true);
//       await api.delete('/users/me/deactivate');
      
//       toast.success('Account deactivated successfully');
      
//       // Clear session and redirect
//       document.cookie = 'accessToken=; path=/; max-age=0';
//       sessionStorage.clear();
//       router.push('/user/login');
//     } catch (error: any) {
//       console.error('Error deactivating account:', error);
//       toast.error(error.response?.data?.message || 'Failed to deactivate account');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       setSubmitting(true);
//       await api.delete('/users/me/delete');
      
//       toast.success('Account deleted successfully');
      
//       // Clear session and redirect
//       document.cookie = 'accessToken=; path=/; max-age=0';
//       sessionStorage.clear();
//       router.push('/user/login');
//     } catch (error: any) {
//       console.error('Error deleting account:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete account');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     return status === 'active' ? 'text-green-600' : 'text-red-600';
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading settings...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
//         <p className="text-gray-600">Manage your profile and preferences</p>
//         <svg width="280" height="12" className="mt-2">
//           <path
//             d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6"
//             stroke="#000"
//             strokeWidth="2"
//             fill="none"
//           />
//         </svg>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Profile Information */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Basic Info */}
//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold">Profile Information</h2>
//               <button
//                 onClick={() => setShowEditModal(true)}
//                 className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
//               >
//                 Edit
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profile?.firstName || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   value={profile?.lastName || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                 <input
//                   type="email"
//                   value={profile?.email || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   value={profile?.phoneNumber || 'Not provided'}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   value={profile?.role || ''}
//                   disabled
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 capitalize"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Account Status & Security */}
//           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//             <h2 className="text-2xl font-bold mb-6">Account Status & Security</h2>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-sm text-gray-600 mb-1">Account Status</p>
//                 <p className={`text-lg font-bold capitalize ${getStatusColor(profile?.status || '')}`}>
//                   {profile?.status || 'Unknown'}
//                 </p>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-sm text-gray-600 mb-1">Email Verified</p>
//                 <p className={`text-lg font-bold ${profile?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
//                   {profile?.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
//                 </p>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-sm text-gray-600 mb-1">Two-Factor Auth</p>
//                 <p className={`text-lg font-bold ${profile?.twoFactorEnabled ? 'text-green-600' : 'text-gray-600'}`}>
//                   {profile?.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
//                 </p>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4">
//                 <p className="text-sm text-gray-600 mb-1">Total Skills</p>
//                 <p className="text-lg font-bold text-blue-600">
//                   {profile?.skills?.length || 0}
//                 </p>
//               </div>

//               {profile?.lastLoginAt && (
//                 <div className="col-span-2 bg-gray-50 rounded-xl p-4">
//                   <p className="text-sm text-gray-600 mb-1">Last Login</p>
//                   <p className="text-lg font-bold text-gray-900">
//                     {new Date(profile.lastLoginAt).toLocaleString('en-US', {
//                       year: 'numeric',
//                       month: 'long',
//                       day: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </p>
//                 </div>
//               )}

//               <div className="col-span-2 bg-gray-50 rounded-xl p-4">
//                 <p className="text-sm text-gray-600 mb-1">Member Since</p>
//                 <p className="text-lg font-bold text-gray-900">
//                   {new Date(profile?.createdAt || '').toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}
//                 </p>
//               </div>

//               {/* Agent Rating Stats (if applicable) */}
//               {profile?.role === 'csr' || profile?.role === 'admin' || profile?.role === 'sales' ? (
//                 <div className="col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
//                   <p className="text-sm text-purple-700 mb-2 font-medium">Agent Performance</p>
//                   <div className="flex items-center gap-6">
//                     <div>
//                       <p className="text-xs text-gray-600">Average Rating</p>
//                       <p className="text-2xl font-bold text-purple-600">
//                         {profile?.averageRating?.toFixed(1) || '0.0'} ⭐
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-600">Total Ratings</p>
//                       <p className="text-2xl font-bold text-purple-600">
//                         {profile?.totalRatings || 0}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </div>

//         {/* Account Actions */}
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-fit">
//           <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
//           <div className="space-y-3">
//             <button
//               onClick={() => setShowPasswordModal(true)}
//               className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
//             >
//               <span>🔒</span>
//               Change Password
//             </button>
            
//             <button
//               onClick={() => router.push('/user/skills')}
//               className="w-full bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
//             >
//               <span>🎯</span>
//               Manage Skills
//             </button>
            
//             <button
//               onClick={() => setShowDeactivateModal(true)}
//               className="w-full bg-orange-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
//             >
//               <span>⏸️</span>
//               Deactivate Account
//             </button>
            
//             <button
//               onClick={() => setShowDeleteModal(true)}
//               className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 mt-6"
//             >
//               <span>🗑️</span>
//               Delete Account
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-xl">
//             <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold">Edit Profile</h2>
//                 <button
//                   onClick={() => setShowEditModal(false)}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
            
//             <form onSubmit={handleUpdateProfile} className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 {/* Basic Information */}
//                 <div className="md:col-span-2">
//                   <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
//                     Basic Information
//                   </h3>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     First Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={editData.firstName}
//                     onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={editData.lastName}
//                     onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email <span className="text-gray-500 text-xs">(Read-only)</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={profile?.email || ''}
//                     disabled
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     value={editData.phoneNumber}
//                     onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Enter phone number"
//                   />
//                 </div>

//                 {/* Professional Information */}
//                 <div className="md:col-span-2 mt-4">
//                   <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
//                     Professional Information
//                   </h3>
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Headline
//                   </label>
//                   <input
//                     type="text"
//                     value={editData.headline}
//                     onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., Full Stack Developer | React & Node.js Specialist"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Location
//                   </label>
//                   <input
//                     type="text"
//                     value={editData.location}
//                     onChange={(e) => setEditData({ ...editData, location: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., New York, USA"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Resume URL
//                   </label>
//                   <input
//                     type="url"
//                     value={editData.resumeUrl}
//                     onChange={(e) => setEditData({ ...editData, resumeUrl: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="https://example.com/resume.pdf"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Profile Picture URL
//                   </label>
//                   <input
//                     type="url"
//                     value={editData.profilePictureUrl}
//                     onChange={(e) => setEditData({ ...editData, profilePictureUrl: e.target.value })}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="https://example.com/profile.jpg"
//                   />
//                 </div>

//                 {/* Admin Only Fields */}
//                 {profile?.role === 'admin' && (
//                   <>
//                     <div className="md:col-span-2 mt-4">
//                       <h3 className="text-lg font-bold text-red-600 mb-4 pb-2 border-b border-red-200">
//                         Admin Controls
//                       </h3>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Role
//                       </label>
//                       <select
//                         value={editData.role}
//                         onChange={(e) => setEditData({ ...editData, role: e.target.value })}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="job_seeker">Job Seeker</option>
//                         <option value="employer">Employer</option>
//                         <option value="admin">Admin</option>
//                         <option value="csr">Customer Service Rep</option>
//                         <option value="sales">Sales</option>
//                         <option value="user">User</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Account Status
//                       </label>
//                       <select
//                         value={editData.status}
//                         onChange={(e) => setEditData({ ...editData, status: e.target.value })}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="active">Active</option>
//                         <option value="pending_verification">Pending Verification</option>
//                         <option value="verified">Verified</option>
//                         <option value="deactivated">Deactivated</option>
//                         <option value="rejected">Rejected</option>
//                       </select>
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={editData.isEmailVerified}
//                           onChange={(e) => setEditData({ ...editData, isEmailVerified: e.target.checked })}
//                           className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                         <span className="text-sm font-medium text-gray-700">
//                           Email Verified
//                         </span>
//                       </label>
//                     </div>

//                     <div className="md:col-span-2">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={editData.twoFactorEnabled}
//                           onChange={(e) => setEditData({ ...editData, twoFactorEnabled: e.target.checked })}
//                           className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                         <span className="text-sm font-medium text-gray-700">
//                           Two-Factor Authentication Enabled
//                         </span>
//                       </label>
//                     </div>
//                   </>
//                 )}

//                 {/* Read-only Information */}
//                 <div className="md:col-span-2 mt-4">
//                   <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
//                     Account Information <span className="text-xs text-gray-500 font-normal">(Read-only)</span>
//                   </h3>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Role
//                   </label>
//                   <input
//                     type="text"
//                     value={profile?.role || 'N/A'}
//                     disabled
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 capitalize"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Status
//                   </label>
//                   <input
//                     type="text"
//                     value={profile?.status || 'N/A'}
//                     disabled
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 capitalize"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Member Since
//                   </label>
//                   <input
//                     type="text"
//                     value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
//                     disabled
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Last Login
//                   </label>
//                   <input
//                     type="text"
//                     value={profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : 'N/A'}
//                     disabled
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
//                 >
//                   {submitting ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Change Password Modal */}
//       {showPasswordModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
//             <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            
//             <form onSubmit={handleChangePassword}>
//               <div className="space-y-4 mb-6">
//                 {/* Current Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Current Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={passwordData.showCurrent ? 'text' : 'password'}
//                       value={passwordData.currentPassword}
//                       onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
//                       className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setPasswordData({ ...passwordData, showCurrent: !passwordData.showCurrent })}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                     >
//                       {passwordData.showCurrent ? '🙈' : '👁️'}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={passwordData.showNew ? 'text' : 'password'}
//                       value={passwordData.newPassword}
//                       onChange={(e) => {
//                         setPasswordData({ ...passwordData, newPassword: e.target.value });
//                         validatePassword(e.target.value);
//                       }}
//                       className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 ${
//                         passwordData.newPassword && passwordValidation.isValid
//                           ? 'border-green-500 focus:ring-green-500'
//                           : passwordData.newPassword
//                           ? 'border-red-500 focus:ring-red-500'
//                           : 'border-gray-300 focus:ring-blue-500'
//                       }`}
//                       required
//                       minLength={6}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setPasswordData({ ...passwordData, showNew: !passwordData.showNew })}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                     >
//                       {passwordData.showNew ? '🙈' : '👁️'}
//                     </button>
//                   </div>
                  
//                   {/* Password Requirements */}
//                   {passwordData.newPassword && (
//                     <div className="mt-2 space-y-1">
//                       <p className={`text-xs flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
//                         {passwordValidation.minLength ? '✓' : '✗'} At least 6 characters
//                       </p>
//                       <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
//                         {passwordValidation.hasUpperCase ? '✓' : '○'} One uppercase letter (recommended)
//                       </p>
//                       <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
//                         {passwordValidation.hasLowerCase ? '✓' : '○'} One lowercase letter (recommended)
//                       </p>
//                       <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
//                         {passwordValidation.hasNumber ? '✓' : '○'} One number (recommended)
//                       </p>
//                       <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
//                         {passwordValidation.hasSpecialChar ? '✓' : '○'} One special character (recommended)
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Confirm New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm New Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={passwordData.showConfirm ? 'text' : 'password'}
//                       value={passwordData.confirmPassword}
//                       onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
//                       className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 ${
//                         passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword
//                           ? 'border-green-500 focus:ring-green-500'
//                           : passwordData.confirmPassword
//                           ? 'border-red-500 focus:ring-red-500'
//                           : 'border-gray-300 focus:ring-blue-500'
//                       }`}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setPasswordData({ ...passwordData, showConfirm: !passwordData.showConfirm })}
//                       className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                     >
//                       {passwordData.showConfirm ? '🙈' : '👁️'}
//                     </button>
//                   </div>
//                   {passwordData.confirmPassword && (
//                     <p className={`text-xs mt-1 ${
//                       passwordData.newPassword === passwordData.confirmPassword
//                         ? 'text-green-600'
//                         : 'text-red-600'
//                     }`}>
//                       {passwordData.newPassword === passwordData.confirmPassword
//                         ? '✓ Passwords match'
//                         : '✗ Passwords do not match'}
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowPasswordModal(false);
//                     setPasswordData({ 
//                       currentPassword: '', 
//                       newPassword: '', 
//                       confirmPassword: '',
//                       showCurrent: false,
//                       showNew: false,
//                       showConfirm: false
//                     });
//                     setPasswordValidation({
//                       minLength: false,
//                       hasUpperCase: false,
//                       hasLowerCase: false,
//                       hasNumber: false,
//                       hasSpecialChar: false,
//                       isValid: false
//                     });
//                   }}
//                   className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting || !passwordValidation.minLength || passwordData.newPassword !== passwordData.confirmPassword}
//                   className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {submitting ? 'Changing...' : 'Change Password'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Deactivate Account Modal */}
//       {showDeactivateModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
//             <h2 className="text-2xl font-bold mb-4 text-orange-600">Deactivate Account</h2>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to deactivate your account? You can reactivate it later by logging in again.
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDeactivateModal(false)}
//                 className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeactivate}
//                 disabled={submitting}
//                 className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
//               >
//                 {submitting ? 'Deactivating...' : 'Deactivate'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Account Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
//             <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Account</h2>
//             <p className="text-gray-600 mb-6">
//               ⚠️ <strong>Warning:</strong> This action cannot be undone! All your data will be permanently deleted.
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={submitting}
//                 className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
//               >
//                 {submitting ? 'Deleting...' : 'Delete Forever'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  status: string;
  skills: string[];
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  agentRatings?: any[];
  averageRating?: number;
  totalRatings?: number;
}

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  
  // Form data
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    headline: '',
    location: '',
    resumeUrl: '',
    profilePictureUrl: '',
    // Admin only fields
    role: '',
    status: '',
    isEmailVerified: false,
    twoFactorEnabled: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false
  });
  
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValid: false
  });
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/me');
      const userData = data.user || data;
      setProfile(userData);
      
      // Set edit data with all fields
      setEditData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phoneNumber: userData.phoneNumber || '',
        headline: userData.headline || '',
        location: userData.location || '',
        resumeUrl: userData.resumeUrl || '',
        profilePictureUrl: userData.profilePictureUrl || '',
        // Admin only fields
        role: userData.role || '',
        status: userData.status || '',
        isEmailVerified: userData.isEmailVerified || false,
        twoFactorEnabled: userData.twoFactorEnabled || false
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      const { data } = await api.put('/users/profile', editData);
      
      // Refresh profile after update
      await fetchProfile();
      toast.success('Profile updated successfully! 🎉');
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const validatePassword = (password: string) => {
    const validation = {
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isValid: password.length >= 6
    };
    setPasswordValidation(validation);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await api.put('/users/me/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast.success('Password changed successfully! 🎉');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '', showCurrent: false, showNew: false, showConfirm: false });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      setSubmitting(true);
      await api.delete('/users/deactivate');
      
      toast.success('Account deactivated successfully');
      
      // Clear session and redirect
      document.cookie = 'accessToken=; path=/; max-age=0';
      sessionStorage.clear();
      router.push('/user/login');
    } catch (error: any) {
      console.error('Error deactivating account:', error);
      toast.error(error.response?.data?.message || 'Failed to deactivate account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await api.delete('/users/delete');
      
      toast.success('Account deleted successfully');
      
      // Clear session and redirect
      document.cookie = 'accessToken=; path=/; max-age=0';
      sessionStorage.clear();
      router.push('/user/login');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
        <svg width="280" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Profile Information</h2>
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profile?.firstName || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profile?.lastName || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile?.phoneNumber || 'Not provided'}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profile?.role || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 capitalize"
                />
              </div>
            </div>
          </div>

          {/* Account Status & Security */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">Account Status & Security</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Account Status</p>
                <p className={`text-lg font-bold capitalize ${getStatusColor(profile?.status || '')}`}>
                  {profile?.status || 'Unknown'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Email Verified</p>
                <p className={`text-lg font-bold ${profile?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {profile?.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Two-Factor Auth</p>
                <p className={`text-lg font-bold ${profile?.twoFactorEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                  {profile?.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Total Skills</p>
                <p className="text-lg font-bold text-blue-600">
                  {profile?.skills?.length || 0}
                </p>
              </div>

              {profile?.lastLoginAt && (
                <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Last Login</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(profile.lastLoginAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              <div className="col-span-2 bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(profile?.createdAt || '').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Agent Rating Stats (if applicable) */}
              {profile?.role === 'csr' || profile?.role === 'admin' || profile?.role === 'sales' ? (
                <div className="col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-purple-700 mb-2 font-medium">Agent Performance</p>
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {profile?.averageRating?.toFixed(1) || '0.0'} ⭐
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Total Ratings</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {profile?.totalRatings || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-fit">
          <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>🔒</span>
              Change Password
            </button>
            
            <button
              onClick={() => router.push('/user/skills')}
              className="w-full bg-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <span>🎯</span>
              Manage Skills
            </button>
            
            <button
              onClick={() => setShowDeactivateModal(true)}
              className="w-full bg-orange-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
            >
              <span>⏸️</span>
              Deactivate Account
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <span>🗑️</span>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full my-8 shadow-xl">
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Basic Information */}
                <div className="md:col-span-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                    Basic Information
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editData.phoneNumber}
                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-gray-500 text-xs">(Read-only)</span>
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Professional Information */}
                <div className="md:col-span-3 mt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                    Professional Information
                  </h3>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={editData.headline}
                    onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Full Stack Developer | React & Node.js Specialist"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., New York, USA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume URL
                  </label>
                  <input
                    type="url"
                    value={editData.resumeUrl}
                    onChange={(e) => setEditData({ ...editData, resumeUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    value={editData.profilePictureUrl}
                    onChange={(e) => setEditData({ ...editData, profilePictureUrl: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/profile.jpg"
                  />
                </div>

                {/* Admin Only Fields */}
                {profile?.role === 'admin' && (
                  <>
                    <div className="md:col-span-3 mt-4">
                      <h3 className="text-lg font-bold text-red-600 mb-4 pb-2 border-b border-red-200">
                        Admin Controls
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={editData.role}
                        onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="job_seeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                        <option value="admin">Admin</option>
                        <option value="csr">Customer Service Rep</option>
                        <option value="sales">Sales</option>
                        <option value="user">User</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Status
                      </label>
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="pending_verification">Pending Verification</option>
                        <option value="verified">Verified</option>
                        <option value="deactivated">Deactivated</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Security Settings
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editData.isEmailVerified}
                            onChange={(e) => setEditData({ ...editData, isEmailVerified: e.target.checked })}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Email Verified
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editData.twoFactorEnabled}
                            onChange={(e) => setEditData({ ...editData, twoFactorEnabled: e.target.checked })}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Two-Factor Auth
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* Read-only Information */}
                <div className="md:col-span-3 mt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                    Account Information <span className="text-xs text-gray-500 font-normal">(Read-only)</span>
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile?.role || 'N/A'}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 capitalize"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <input
                    type="text"
                    value={profile?.status || 'N/A'}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 capitalize"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Login
                  </label>
                  <input
                    type="text"
                    value={profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : 'N/A'}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            
            <form onSubmit={handleChangePassword}>
              <div className="space-y-4 mb-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.showCurrent ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordData({ ...passwordData, showCurrent: !passwordData.showCurrent })}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordData.showCurrent ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.showNew ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, newPassword: e.target.value });
                        validatePassword(e.target.value);
                      }}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 ${
                        passwordData.newPassword && passwordValidation.isValid
                          ? 'border-green-500 focus:ring-green-500'
                          : passwordData.newPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordData({ ...passwordData, showNew: !passwordData.showNew })}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordData.showNew ? '🙈' : '👁️'}
                    </button>
                  </div>
                  
                  {/* Password Requirements */}
                  {passwordData.newPassword && (
                    <div className="mt-2 space-y-1">
                      <p className={`text-xs flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.minLength ? '✓' : '✗'} At least 6 characters
                      </p>
                      <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.hasUpperCase ? '✓' : '○'} One uppercase letter (recommended)
                      </p>
                      <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.hasLowerCase ? '✓' : '○'} One lowercase letter (recommended)
                      </p>
                      <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.hasNumber ? '✓' : '○'} One number (recommended)
                      </p>
                      <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidation.hasSpecialChar ? '✓' : '○'} One special character (recommended)
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={passwordData.showConfirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 ${
                        passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword
                          ? 'border-green-500 focus:ring-green-500'
                          : passwordData.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordData({ ...passwordData, showConfirm: !passwordData.showConfirm })}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {passwordData.showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {passwordData.confirmPassword && (
                    <p className={`text-xs mt-1 ${
                      passwordData.newPassword === passwordData.confirmPassword
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {passwordData.newPassword === passwordData.confirmPassword
                        ? '✓ Passwords match'
                        : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ 
                      currentPassword: '', 
                      newPassword: '', 
                      confirmPassword: '',
                      showCurrent: false,
                      showNew: false,
                      showConfirm: false
                    });
                    setPasswordValidation({
                      minLength: false,
                      hasUpperCase: false,
                      hasLowerCase: false,
                      hasNumber: false,
                      hasSpecialChar: false,
                      isValid: false
                    });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !passwordValidation.minLength || passwordData.newPassword !== passwordData.confirmPassword}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">Deactivate Account</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate your account? You can reactivate it later by logging in again.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Account</h2>
            <p className="text-gray-600 mb-6">
              ⚠️ <strong>Warning:</strong> This action cannot be undone! All your data will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}