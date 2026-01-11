


// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { io, Socket } from 'socket.io-client';

// const baseURL = 'https://cv-analyser-backend.onrender.com/api/v1';

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   profilePictureUrl?: string;
// }

// interface Attachment {
//   url: string;
//   filename: string;
//   fileType: string;
//   fileSize: number;
// }

// interface Message {
//   _id: string;
//   sender: User;
//   senderRole: string;
//   message: string;
//   attachments: Attachment[];
//   isInternal: boolean;
//   isRead: boolean;
//   createdAt: string;
// }

// interface Ticket {
//   _id: string;
//   ticketNumber: string;
//   subject: string;
//   description: string;
//   status: string;
//   priority: string;
//   category: string;
//   user: User;
//   primaryAgent?: User;
//   assignedAgents: Array<{
//     agent: User;
//     status: string;
//     role: string;
//   }>;
//   rating?: number;
//   feedback?: string;
//   messageCount: number;
//   createdAt: string;
//   lastMessageAt: string;
// }

// export default function TicketDetail() {
//   const params = useParams();
//   const router = useRouter();
//   const ticketId = params.id as string;

//   const [ticket, setTicket] = useState<Ticket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [currentUserRole, setCurrentUserRole] = useState<string>('');
//   const [currentUserId, setCurrentUserId] = useState<string>('');
  
//   // Socket
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingUser, setTypingUser] = useState('');
  
//   // Message input
//   const [newMessage, setNewMessage] = useState('');
//   const [attachments, setAttachments] = useState<File[]>([]);
//   const [isInternal, setIsInternal] = useState(false);
  
//   // Status update
//   const [statusDropdown, setStatusDropdown] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
  
//   // Refs
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     fetchCurrentUser();
//     fetchTicketDetails();
//     initializeSocket();

//     return () => {
//       if (socket) {
//         socket.emit('unsubscribe-ticket', ticketId);
//         socket.disconnect();
//       }
//     };
//   }, [ticketId]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const getAccessToken = () => {
//     return document.cookie
//       .split('; ')
//       .find(row => row.startsWith('accessToken='))
//       ?.split('=')[1];
//   };

//   // GET /users/me - Get current user
//   const fetchCurrentUser = async () => {
//     try {
//       const token = getAccessToken();
//       const { data } = await axios.get(`${baseURL}/users/me`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setCurrentUserRole(data.user?.role || data.role || '');
//       setCurrentUserId(data.user?._id || data._id || '');
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//     }
//   };

//   const initializeSocket = () => {
//     const token = getAccessToken();
//     if (!token) return;

//     const newSocket = io('http://localhost:5000/tickets', {
//       auth: { token }
//     });

//     newSocket.on('connect', () => {
//       console.log('✅ Socket connected');
//       newSocket.emit('subscribe-ticket', ticketId);
//     });

//     newSocket.on('subscribed', (data) => {
//       console.log('✅ Subscribed to ticket:', data);
//     });

//     newSocket.on('new-message', (message: Message) => {
//       setMessages(prev => [...prev, message]);
//       scrollToBottom();
//     });

//     newSocket.on('ticket-updated', (update) => {
//       if (update.status) {
//         setTicket(prev => prev ? { ...prev, status: update.status } : null);
//       }
//     });

//     newSocket.on('user-typing', (data) => {
//       setIsTyping(true);
//       setTypingUser(data.userName);
//       setTimeout(() => setIsTyping(false), 3000);
//     });

//     newSocket.on('error', (error) => {
//       console.error('Socket error:', error);
//       toast.error(error.message);
//     });

//     setSocket(newSocket);
//   };

//   // GET {{base_url}}/support/tickets/{{ticket_id}} - Get ticket details
//   const fetchTicketDetails = async () => {
//     try {
//       setLoading(true);
//       const token = getAccessToken();
      
//       console.log('🎫 Fetching ticket:', ticketId);
      
//       const { data } = await axios.get(`${baseURL}/support/tickets/${ticketId}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
      
//       console.log('✅ Ticket data received:', data);
      
//       setTicket(data.ticket);
//       setMessages(data.messages || []);
//     } catch (error: any) {
//       console.error('❌ Error fetching ticket:', error);
//       console.error('Error response:', error.response?.data);
//       toast.error(error.response?.data?.error || 'Failed to load ticket');
//       router.push('/admin/support');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleTyping = () => {
//     if (socket && ticket) {
//       socket.emit('typing', ticketId);
      
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }
      
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.emit('stop-typing', ticketId);
//       }, 2000);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
    
//     const validFiles = files.filter(file => {
//       const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
//       const maxSize = 10 * 1024 * 1024; // 10MB
      
//       if (!validTypes.includes(file.type)) {
//         toast.error(`${file.name}: Invalid file type`);
//         return false;
//       }
//       if (file.size > maxSize) {
//         toast.error(`${file.name}: File too large (max 10MB)`);
//         return false;
//       }
//       return true;
//     });

//     setAttachments(prev => [...prev, ...validFiles].slice(0, 5));
//   };

//   const removeAttachment = (index: number) => {
//     setAttachments(prev => prev.filter((_, i) => i !== index));
//   };

//   // POST {{base_url}}/support/tickets/{{ticket_id}}/messages - Send message
//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!newMessage.trim() && attachments.length === 0) {
//       toast.error('Please enter a message or attach a file');
//       return;
//     }

//     // Prevent double submission
//     if (sending) return;

//     try {
//       setSending(true);
//       const token = getAccessToken();
//       const formData = new FormData();
      
//       formData.append('message', newMessage.trim());
//       formData.append('isInternal', isInternal.toString());
      
//       attachments.forEach(file => {
//         formData.append('attachments', file);
//       });

//       await axios.post(
//         `${baseURL}/support/tickets/${ticketId}/messages`,
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       // Clear inputs immediately after successful send
//       setNewMessage('');
//       setAttachments([]);
//       setIsInternal(false);
      
//       toast.success('Message sent');
      
//       // Refresh messages after a short delay
//       setTimeout(() => {
//         fetchTicketDetails();
//       }, 500);
      
//     } catch (error: any) {
//       console.error('Error sending message:', error);
//       toast.error(error.response?.data?.error || 'Failed to send message');
//     } finally {
//       setSending(false);
//     }
//   };

//   // PUT {{base_url}}/support/admin/tickets/{{ticket_id}} - Update ticket status
//   const updateStatus = async (newStatus: string) => {
//     try {
//       const token = getAccessToken();
//       await axios.put(
//         `${baseURL}/support/admin/tickets/${ticketId}`,
//         { status: newStatus },
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );
//       setTicket(prev => prev ? { ...prev, status: newStatus } : null);
//       setStatusDropdown(false);
//       toast.success('Status updated');
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to update status');
//     }
//   };

//   // DELETE {{base_url}}/support/admin/tickets/{{ticket_id}} - Delete ticket (Admin only)
//   const deleteTicket = async () => {
//     try {
//       const token = getAccessToken();
//       await axios.delete(
//         `${baseURL}/support/admin/tickets/${ticketId}`,
//         { headers: { 'Authorization': `Bearer ${token}` } }
//       );
//       toast.success('Ticket deleted successfully');
//       router.push('/admin/support');
//     } catch (error: any) {
//       toast.error(error.response?.data?.error || 'Failed to delete ticket');
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

//   const isImage = (fileType: string) => {
//     return fileType.startsWith('image/');
//   };

//   // Check permissions
//   const isAdmin = currentUserRole === 'admin';
//   const canDelete = isAdmin; // Only admin can delete
//   const canEdit = ['admin', 'csr', 'sales'].includes(currentUserRole); // All staff can edit

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading ticket...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!ticket) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <p className="text-xl font-bold text-red-600">Ticket not found</p>
//           <button
//             onClick={() => router.push('/admin/support')}
//             className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//           >
//             Back to Support
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b px-6 py-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => router.push('/admin/support')}
//               className="text-gray-600 hover:text-gray-900"
//             >
//               ← Back
//             </button>
//             <div>
//               <div className="flex items-center gap-3">
//                 <h1 className="text-2xl font-bold">{ticket.ticketNumber}</h1>
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(ticket.priority)}`}>
//                   {ticket.priority.toUpperCase()}
//                 </span>
//                 {canEdit && (
//                   <div className="relative">
//                     <button
//                       onClick={() => setStatusDropdown(!statusDropdown)}
//                       className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)} cursor-pointer hover:opacity-80`}
//                     >
//                       {formatStatus(ticket.status)} ▼
//                     </button>
//                     {statusDropdown && (
//                       <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]">
//                         {['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'].map(status => (
//                           <button
//                             key={status}
//                             onClick={() => updateStatus(status)}
//                             className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
//                           >
//                             {formatStatus(status)}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {!canEdit && (
//                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
//                     {formatStatus(ticket.status)}
//                   </span>
//                 )}
//               </div>
//               <p className="text-gray-600 mt-1">{ticket.subject}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             {canDelete && (
//               <button
//                 onClick={() => setShowDeleteModal(true)}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
//               >
//                 🗑️ Delete
//               </button>
//             )}
//             <div className="text-right text-sm text-gray-600">
//               <p>💬 {ticket.messageCount} messages</p>
//               <p>🕐 {new Date(ticket.createdAt).toLocaleString()}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 flex overflow-hidden">
//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {messages.map((message) => {
//               const isStaff = ['admin', 'csr', 'sales'].includes(message.senderRole);
//               const isCurrentUser = message.sender._id === currentUserId;

//               return (
//                 <div key={message._id} className="space-y-2">
//                   {/* Reply Tag */}
//                   {isStaff && !message.isInternal && (
//                     <div className="flex items-center gap-2">
//                       <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
//                         👨‍💼 {message.senderRole === 'admin' ? 'Admin' : 'Agent'} Replied
//                       </span>
//                     </div>
//                   )}
//                   {!isStaff && (
//                     <div className="flex items-center gap-2">
//                       <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
//                         👤 Customer Replied
//                       </span>
//                     </div>
//                   )}
                  
//                   <div className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`max-w-[70%] ${message.isInternal ? 'w-full max-w-full' : ''}`}>
//                       {/* Internal Note Styling */}
//                       {message.isInternal ? (
//                         <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 rounded-lg p-4 shadow-sm">
//                           <div className="flex items-center gap-2 mb-2">
//                             <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
//                               🔒 INTERNAL NOTE
//                             </span>
//                             <span className="text-sm font-medium text-gray-700">
//                               {message.sender.firstName} {message.sender.lastName}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               {new Date(message.createdAt).toLocaleTimeString()}
//                             </span>
//                           </div>
//                           <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
                          
//                           {/* Attachments for internal notes */}
//                           {message.attachments && message.attachments.length > 0 && (
//                             <div className="mt-3 space-y-2">
//                               {message.attachments.map((att, idx) => (
//                                 <div key={idx}>
//                                   {isImage(att.fileType) ? (
//                                     <img
//                                       src={att.url}
//                                       alt={att.filename}
//                                       className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
//                                       onClick={() => window.open(att.url, '_blank')}
//                                     />
//                                   ) : (
//                                     <a
//                                       href={att.url}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="flex items-center gap-2 px-3 py-2 bg-white rounded hover:bg-orange-50"
//                                     >
//                                       📎 {att.filename}
//                                     </a>
//                                   )}
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         /* Regular Message */
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <span className="text-sm font-medium">
//                               {message.sender.firstName} {message.sender.lastName}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               {new Date(message.createdAt).toLocaleTimeString()}
//                             </span>
//                           </div>
//                           <div className={`rounded-lg p-4 shadow-sm ${
//                             isStaff 
//                               ? 'bg-blue-500 text-white' 
//                               : 'bg-white border'
//                           }`}>
//                             <p className="whitespace-pre-wrap">{message.message}</p>
                            
//                             {/* Attachments */}
//                             {message.attachments && message.attachments.length > 0 && (
//                               <div className="mt-3 space-y-2">
//                                 {message.attachments.map((att, idx) => (
//                                   <div key={idx}>
//                                     {isImage(att.fileType) ? (
//                                       <img
//                                         src={att.url}
//                                         alt={att.filename}
//                                         className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
//                                         onClick={() => window.open(att.url, '_blank')}
//                                       />
//                                     ) : (
//                                       <a
//                                         href={att.url}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className={`flex items-center gap-2 px-3 py-2 rounded ${
//                                           isStaff ? 'bg-blue-600' : 'bg-gray-100'
//                                         } hover:opacity-80`}
//                                       >
//                                         📎 {att.filename}
//                                       </a>
//                                     )}
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
            
//             {/* Typing Indicator */}
//             {isTyping && (
//               <div className="flex items-center gap-2 text-sm text-gray-500 italic">
//                 <div className="flex gap-1">
//                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
//                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
//                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
//                 </div>
//                 {typingUser} is typing...
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="border-t bg-white p-4">
//             {/* Attachments Preview */}
//             {attachments.length > 0 && (
//               <div className="mb-3 flex flex-wrap gap-2">
//                 {attachments.map((file, idx) => (
//                   <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
//                     <span>📎 {file.name}</span>
//                     <button
//                       onClick={() => removeAttachment(idx)}
//                       className="text-red-500 hover:text-red-700 font-bold"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
            
//             <form onSubmit={sendMessage} className="flex gap-2">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 multiple
//                 accept="image/*,application/pdf"
//                 className="hidden"
//               />
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//                 disabled={sending}
//               >
//                 📎
//               </button>
//               <input
//                 type="text"
//                 value={newMessage}
//                 onChange={(e) => {
//                   setNewMessage(e.target.value);
//                   handleTyping();
//                 }}
//                 placeholder="Type your message..."
//                 className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                 disabled={sending}
//               />
//               <label className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-lg cursor-pointer hover:bg-orange-200 border border-orange-300">
//                 <input
//                   type="checkbox"
//                   checked={isInternal}
//                   onChange={(e) => setIsInternal(e.target.checked)}
//                   className="w-4 h-4"
//                 />
//                 <span className="text-sm font-medium text-orange-700">🔒 Internal</span>
//               </label>
//               <button
//                 type="submit"
//                 disabled={sending || (!newMessage.trim() && attachments.length === 0)}
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {sending ? 'Sending...' : 'Send'}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="w-80 bg-white border-l p-6 overflow-y-auto">
//           <h3 className="font-bold text-lg mb-4">Ticket Details</h3>
          
//           {/* Customer Info */}
//           <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//             <h4 className="font-bold text-sm text-blue-900 mb-2">👤 Customer</h4>
//             <p className="font-medium">{ticket.user.firstName} {ticket.user.lastName}</p>
//             <p className="text-sm text-gray-600">{ticket.user.email}</p>
//           </div>

//           {/* Agent Info */}
//           {ticket.primaryAgent && (
//             <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
//               <h4 className="font-bold text-sm text-purple-900 mb-2">👨‍💼 Primary Agent</h4>
//               <p className="font-medium">{ticket.primaryAgent.firstName} {ticket.primaryAgent.lastName}</p>
//               <p className="text-sm text-gray-600">{ticket.primaryAgent.email}</p>
//             </div>
//           )}

//           {/* Ticket Info */}
//           <div className="space-y-3 text-sm mb-4">
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <span className="font-medium text-gray-700 block mb-1">Category:</span>
//               <p>{ticket.category}</p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <span className="font-medium text-gray-700 block mb-1">Created:</span>
//               <p>{new Date(ticket.createdAt).toLocaleString()}</p>
//             </div>
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <span className="font-medium text-gray-700 block mb-1">Last Activity:</span>
//               <p>{new Date(ticket.lastMessageAt).toLocaleString()}</p>
//             </div>
//           </div>

//           {/* Rating */}
//           {ticket.rating && (
//             <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//               <h4 className="font-bold text-sm text-yellow-900 mb-2">⭐ Rating</h4>
//               <div className="flex items-center gap-1 mb-2">
//                 {[1, 2, 3, 4, 5].map(star => (
//                   <span key={star} className={star <= ticket.rating! ? 'text-yellow-500 text-xl' : 'text-gray-300 text-xl'}>
//                     ⭐
//                   </span>
//                 ))}
//                 <span className="ml-2 font-bold">{ticket.rating}/5</span>
//               </div>
//               {ticket.feedback && (
//                 <p className="text-sm text-gray-700 italic">"{ticket.feedback}"</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
//             <h2 className="text-2xl font-bold text-center mb-4">
//               Delete Ticket?
//             </h2>
//             <p className="text-center text-gray-600 mb-6">
//               Are you sure you want to delete ticket <strong>{ticket.ticketNumber}</strong>? This action cannot be undone.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   setShowDeleteModal(false);
//                   deleteTicket();
//                 }}
//                 className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
//               >
//                 Delete
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
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

const baseURL = 'https://cv-analyser-backend.onrender.com/api/v1';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
}

interface Attachment {
  url: string;
  filename: string;
  fileType: string;
  fileSize: number;
}

interface Message {
  _id: string;
  sender: User;
  senderRole: string;
  message: string;
  attachments: Attachment[];
  isInternal: boolean;
  isRead: boolean;
  createdAt: string;
}

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  user: User;
  primaryAgent?: User;
  assignedAgents: Array<{
    agent: User;
    status: string;
    role: string;
  }>;
  rating?: number;
  feedback?: string;
  messageCount: number;
  createdAt: string;
  lastMessageAt: string;
}

export default function TicketDetail() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  // Socket
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  
  // Message input
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isInternal, setIsInternal] = useState(false);
  
  // Status update
  const [statusDropdown, setStatusDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchTicketDetails();
    initializeSocket();

    return () => {
      if (socket) {
        socket.emit('unsubscribe-ticket', ticketId);
        socket.disconnect();
      }
    };
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  // GET /users/me - Get current user
  const fetchCurrentUser = async () => {
    try {
      const token = getAccessToken();
      const { data } = await axios.get(`${baseURL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCurrentUserRole(data.user?.role || data.role || '');
      setCurrentUserId(data.user?._id || data._id || '');
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const initializeSocket = () => {
    const token = getAccessToken();
    if (!token) {
      console.warn('⚠️ No token found, skipping socket connection');
      return;
    }

    console.log('🔌 Initializing Socket.IO connection...');

    const newSocket = io('http://localhost:5000/tickets', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected, ID:', newSocket.id);
      newSocket.emit('subscribe-ticket', ticketId);
    });

    newSocket.on('subscribed', (data) => {
      console.log('✅ Subscribed to ticket:', ticketId, data);
    });

    newSocket.on('new-message', (message: Message) => {
      console.log('📨 New message received via socket:', message);
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(m => m._id === message._id);
        if (exists) {
          console.log('⚠️ Message already exists, skipping');
          return prev;
        }
        return [...prev, message];
      });
      scrollToBottom();
    });

    newSocket.on('ticket-updated', (update) => {
      console.log('🔄 Ticket updated via socket:', update);
      if (update.status) {
        setTicket(prev => prev ? { ...prev, status: update.status } : null);
      }
      if (update.messageCount !== undefined) {
        setTicket(prev => prev ? { ...prev, messageCount: update.messageCount } : null);
      }
    });

    newSocket.on('user-typing', (data) => {
      console.log('⌨️ User typing:', data);
      setIsTyping(true);
      setTypingUser(data.userName);
      setTimeout(() => setIsTyping(false), 3000);
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('❌ Socket disconnected:', reason);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      newSocket.emit('subscribe-ticket', ticketId);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      toast.error(error.message || 'Socket connection error');
    });

    setSocket(newSocket);
  };

  // GET {{base_url}}/support/tickets/{{ticket_id}} - Get ticket details
  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      
      console.log('🎫 Fetching ticket:', ticketId);
      
      const { data } = await axios.get(`${baseURL}/support/tickets/${ticketId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('✅ Ticket data received:', data);
      
      setTicket(data.ticket);
      setMessages(data.messages || []);
    } catch (error: any) {
      console.error('❌ Error fetching ticket:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to load ticket');
      router.push('/admin/support');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (socket && ticket) {
      socket.emit('typing', ticketId);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop-typing', ticketId);
      }, 2000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (max 10MB)`);
        return false;
      }
      return true;
    });

    setAttachments(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // POST {{base_url}}/support/tickets/{{ticket_id}}/messages - Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() && attachments.length === 0) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    // Prevent double submission
    if (sending) return;

    try {
      setSending(true);
      const token = getAccessToken();
      const formData = new FormData();
      
      formData.append('message', newMessage.trim());
      formData.append('isInternal', isInternal.toString());
      
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await axios.post(
        `${baseURL}/support/tickets/${ticketId}/messages`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('✅ Message sent response:', response.data);

      // Clear inputs immediately after successful send
      setNewMessage('');
      setAttachments([]);
      setIsInternal(false);
      
      // Don't show toast if socket is connected (message will appear via socket)
      if (!socket || !socket.connected) {
        toast.success('Message sent');
        // Only refresh if socket isn't working
        setTimeout(() => {
          fetchTicketDetails();
        }, 500);
      }
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // PUT {{base_url}}/support/admin/tickets/{{ticket_id}} - Update ticket status
  const updateStatus = async (newStatus: string) => {
    try {
      const token = getAccessToken();
      await axios.put(
        `${baseURL}/support/admin/tickets/${ticketId}`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setTicket(prev => prev ? { ...prev, status: newStatus } : null);
      setStatusDropdown(false);
      toast.success('Status updated');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  // DELETE {{base_url}}/support/admin/tickets/{{ticket_id}} - Delete ticket (Admin only)
  const deleteTicket = async () => {
    try {
      const token = getAccessToken();
      await axios.delete(
        `${baseURL}/support/admin/tickets/${ticketId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success('Ticket deleted successfully');
      router.push('/admin/support');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete ticket');
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

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  // Check permissions
  const isAdmin = currentUserRole === 'admin';
  const canDelete = isAdmin; // Only admin can delete
  const canEdit = ['admin', 'csr', 'sales'].includes(currentUserRole); // All staff can edit

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-bold text-red-600">Ticket not found</p>
          <button
            onClick={() => router.push('/admin/support')}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back to Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/support')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{ticket.ticketNumber}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityBadge(ticket.priority)}`}>
                  {ticket.priority.toUpperCase()}
                </span>
                {canEdit && (
                  <div className="relative">
                    <button
                      onClick={() => setStatusDropdown(!statusDropdown)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)} cursor-pointer hover:opacity-80`}
                    >
                      {formatStatus(ticket.status)} ▼
                    </button>
                    {statusDropdown && (
                      <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[200px]">
                        {['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'].map(status => (
                          <button
                            key={status}
                            onClick={() => updateStatus(status)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                          >
                            {formatStatus(status)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!canEdit && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(ticket.status)}`}>
                    {formatStatus(ticket.status)}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-1">{ticket.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
              >
                🗑️ Delete
              </button>
            )}
            <div className="text-right text-sm text-gray-600">
              <p>💬 {ticket.messageCount} messages</p>
              <p>🕐 {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => {
              const isStaff = ['admin', 'csr', 'sales'].includes(message.senderRole);
              const isCurrentUser = message.sender._id === currentUserId;

              return (
                <div key={message._id} className="space-y-2">
                  {/* Reply Tag */}
                  {isStaff && !message.isInternal && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        👨‍💼 {message.senderRole === 'admin' ? 'Admin' : 'Agent'} Replied
                      </span>
                    </div>
                  )}
                  {!isStaff && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        👤 Customer Replied
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${message.isInternal ? 'w-full max-w-full' : ''}`}>
                      {/* Internal Note Styling */}
                      {message.isInternal ? (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-400 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                              🔒 INTERNAL NOTE
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                              {message.sender.firstName} {message.sender.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
                          
                          {/* Attachments for internal notes */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {message.attachments.map((att, idx) => (
                                <div key={idx}>
                                  {isImage(att.fileType) ? (
                                    <img
                                      src={att.url}
                                      alt={att.filename}
                                      className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                                      onClick={() => window.open(att.url, '_blank')}
                                    />
                                  ) : (
                                    <a
                                      href={att.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-3 py-2 bg-white rounded hover:bg-orange-50"
                                    >
                                      📎 {att.filename}
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Regular Message */
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {message.sender.firstName} {message.sender.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className={`rounded-lg p-4 shadow-sm ${
                            isStaff 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border'
                          }`}>
                            <p className="whitespace-pre-wrap">{message.message}</p>
                            
                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((att, idx) => (
                                  <div key={idx}>
                                    {isImage(att.fileType) ? (
                                      <img
                                        src={att.url}
                                        alt={att.filename}
                                        className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                                        onClick={() => window.open(att.url, '_blank')}
                                      />
                                    ) : (
                                      <a
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-2 px-3 py-2 rounded ${
                                          isStaff ? 'bg-blue-600' : 'bg-gray-100'
                                        } hover:opacity-80`}
                                      >
                                        📎 {att.filename}
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-gray-500 italic">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
                {typingUser} is typing...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t bg-white p-4">
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    <span>📎 {file.name}</span>
                    <button
                      onClick={() => removeAttachment(idx)}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*,application/pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                disabled={sending}
              >
                📎
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={sending}
              />
              <label className="flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-lg cursor-pointer hover:bg-orange-200 border border-orange-300">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-orange-700">🔒 Internal</span>
              </label>
              <button
                type="submit"
                disabled={sending || (!newMessage.trim() && attachments.length === 0)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l p-6 overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Ticket Details</h3>
          
          {/* Customer Info */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold text-sm text-blue-900 mb-2">👤 Customer</h4>
            <p className="font-medium">{ticket.user.firstName} {ticket.user.lastName}</p>
            <p className="text-sm text-gray-600">{ticket.user.email}</p>
          </div>

          {/* Agent Info */}
          {ticket.primaryAgent && (
            <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-bold text-sm text-purple-900 mb-2">👨‍💼 Primary Agent</h4>
              <p className="font-medium">{ticket.primaryAgent.firstName} {ticket.primaryAgent.lastName}</p>
              <p className="text-sm text-gray-600">{ticket.primaryAgent.email}</p>
            </div>
          )}

          {/* Ticket Info */}
          <div className="space-y-3 text-sm mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700 block mb-1">Category:</span>
              <p>{ticket.category}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700 block mb-1">Created:</span>
              <p>{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700 block mb-1">Last Activity:</span>
              <p>{new Date(ticket.lastMessageAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Rating */}
          {ticket.rating && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-bold text-sm text-yellow-900 mb-2">⭐ Rating</h4>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={star <= ticket.rating! ? 'text-yellow-500 text-xl' : 'text-gray-300 text-xl'}>
                    ⭐
                  </span>
                ))}
                <span className="ml-2 font-bold">{ticket.rating}/5</span>
              </div>
              {ticket.feedback && (
                <p className="text-sm text-gray-700 italic">"{ticket.feedback}"</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Delete Ticket?
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete ticket <strong>{ticket.ticketNumber}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  deleteTicket();
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}