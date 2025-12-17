// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import api from '@/lib/baseapi';
// import { useTicketSocket } from '@/hooks/useTicketSocket';
// import RatingModal from '@/components/user/pages/support/RatingModel';

// interface Ticket {
//   rating: any;
//   _id: string;
//   ticketNumber: string;
//   subject: string;
//   description: string;
//   status: string;
//   priority: string;
//   category: string;
//   user: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//   };
//   primaryAgent?: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// interface Message {
//   _id: string;
//   sender: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     role: string;
//   };
//   message: string;
//   attachments?: Array<{
//     url: string;
//     filename: string;
//     fileType: string;
//   }>;
//   isInternal: boolean;
//   createdAt: string;
// }

// export default function TicketDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const ticketId = params.id as string;
  
//   const [ticket, setTicket] = useState<Ticket | null>(null);
//   const [allMessages, setAllMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [attachments, setAttachments] = useState<File[]>([]);
//   const [showRatingModal, setShowRatingModal] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState('');
//   const [typingUser, setTypingUser] = useState<string | null>(null);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Get token
//   const token = typeof window !== 'undefined' 
//     ? document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || null
//     : null;

//   // Socket connection using YOUR hook
//   const { 
//     isConnected, 
//     newMessage: socketNewMessage, 
//     ticketUpdate,
//     subscribeToTicket, 
//     unsubscribeFromTicket,
//     emitTyping,
//     emitStopTyping,
//     markAsRead,
//     clearNewMessage,
//     clearTicketUpdate
//   } = useTicketSocket(token);

//   useEffect(() => {
//     fetchTicketDetails();
    
//     // Get current user ID
//     const userData = sessionStorage.getItem('userData');
//     if (userData) {
//       const user = JSON.parse(userData);
//       setCurrentUserId(user._id);
//     }

//     // Subscribe to ticket
//     if (ticketId) {
//       subscribeToTicket(ticketId);
//     }

//     return () => {
//       if (ticketId) {
//         unsubscribeFromTicket(ticketId);
//       }
//     };
//   }, [ticketId]);

//   // Handle new socket message
//   useEffect(() => {
//     if (socketNewMessage) {
//       console.log('Adding new socket message:', socketNewMessage);
//       setAllMessages(prev => {
//         // Check if message already exists
//         if (prev.some(m => m._id === socketNewMessage._id)) {
//           return prev;
//         }
//         return [...prev, socketNewMessage];
//       });
//       clearNewMessage();
//     }
//   }, [socketNewMessage]);

//   // Handle ticket updates
//   useEffect(() => {
//     if (ticketUpdate) {
//       console.log('Ticket updated:', ticketUpdate);
      
//       // Refresh ticket details
//       fetchTicketDetails();
      
//       // Show rating modal if resolved
//       if (ticketUpdate.status === 'resolved' && ticket && !ticket.rating) {
//         setShowRatingModal(true);
//       }
      
//       clearTicketUpdate();
//     }
//   }, [ticketUpdate]);

//   useEffect(() => {
//     // Scroll to bottom when messages change
//     scrollToBottom();
//   }, [allMessages]);

//   useEffect(() => {
//     // Mark messages as read when viewing
//     if (allMessages.length > 0 && ticketId) {
//       markAsRead(ticketId);
//     }
//   }, [allMessages, ticketId]);

//   const fetchTicketDetails = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get(`/support/tickets/${ticketId}`);
//       setTicket(data.ticket || data.data);
//       setAllMessages(data.messages || []);
      
//       // Check if ticket is resolved and not yet rated
//       if ((data.ticket?.status === 'resolved' || data.data?.status === 'resolved') && 
//           !(data.ticket?.rating || data.data?.rating)) {
//         setShowRatingModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching ticket:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleTyping = () => {
//     emitTyping(ticketId);
    
//     // Clear existing timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }
    
//     // Stop typing after 2 seconds of no input
//     typingTimeoutRef.current = setTimeout(() => {
//       emitStopTyping(ticketId);
//     }, 2000);
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files);
      
//       // Validate: max 5 files
//       if (files.length + selectedFiles.length > 5) {
//         alert('Maximum 5 files allowed');
//         return;
//       }

//       // Validate: 10MB each
//       for (const file of selectedFiles) {
//         if (file.size > 10 * 1024 * 1024) {
//           alert(`File ${file.name} exceeds 10MB limit`);
//           return;
//         }
//       }

//       setFiles([...files, ...selectedFiles]);
//     }
//   };

//   const removeFile = (index: number) => {
//     setFiles(files.filter((_, i) => i !== index));
//   };

//   const sendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!newMessage.trim() && files.length === 0) return;

//     try {
//       setSending(true);
//       emitStopTyping(ticketId);

//       const formData = new FormData();
//       if (newMessage.trim()) {
//         formData.append('message', newMessage.trim());
//       }
      
//       files.forEach(file => {
//         formData.append('files', file);
//       });

//       await api.post(`/support/tickets/${ticketId}/messages`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Clear input
//       setNewMessage('');
//       setFiles([]);
      
//       // The message will be added via socket 'new-message' event
//     } catch (error) {
//       console.error('Error sending message:', error);
//       alert('Failed to send message');
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleRatingSubmit = async (rating: number, feedback: string) => {
//     try {
//       await api.post(`/support/tickets/${ticketId}/rate`, {
//         rating,
//         feedback,
//       });
      
//       setShowRatingModal(false);
//       alert('Thank you for your feedback!');
//       router.push('/user/support');
//     } catch (error) {
//       console.error('Error submitting rating:', error);
//       alert('Failed to submit rating');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'open':
//       case 'pending_assignment':
//         return 'bg-blue-500 text-white';
//       case 'in_progress':
//         return 'bg-purple-500 text-white';
//       case 'waiting_customer':
//         return 'bg-yellow-500 text-white';
//       case 'resolved':
//         return 'bg-green-500 text-white';
//       case 'closed':
//         return 'bg-gray-500 text-white';
//       default:
//         return 'bg-gray-500 text-white';
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'urgent':
//         return 'bg-red-500 text-white';
//       case 'high':
//         return 'bg-orange-500 text-white';
//       case 'medium':
//         return 'bg-yellow-500 text-white';
//       case 'low':
//         return 'bg-green-500 text-white';
//       default:
//         return 'bg-gray-500 text-white';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading ticket...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!ticket) {
//     return (
//       <div className="max-w-4xl mx-auto p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <p className="text-red-600">Ticket not found</p>
//           <button
//             onClick={() => router.push('/user/support')}
//             className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//           >
//             Back to Support
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <h1 className="text-2xl font-bold">{ticket.subject}</h1>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
//                 {ticket.status.replace('_', ' ').toUpperCase()}
//               </span>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
//                 {ticket.priority}
//               </span>
//             </div>
//             <p className="text-gray-600 mb-2">Ticket #{ticket.ticketNumber}</p>
//             <p className="text-sm text-gray-500">
//               Created: {new Date(ticket.createdAt).toLocaleString()}
//             </p>
//           </div>
          
//           <div className="flex items-center gap-3">
//             {/* Socket Status */}
//             <div className="flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
//               <span className="text-sm text-gray-600">
//                 {isConnected ? 'Live' : 'Offline'}
//               </span>
//             </div>
            
//             <button
//               onClick={() => router.push('/user/support')}
//               className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               ← Back
//             </button>
//           </div>
//         </div>

//         {/* Agent Info */}
//         {ticket.primaryAgent ? (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <p className="text-sm font-medium text-green-900 mb-1">
//               ✓ Agent Assigned
//             </p>
//             <p className="text-sm text-green-700">
//               {ticket.primaryAgent.firstName} {ticket.primaryAgent.lastName} ({ticket.primaryAgent.email})
//             </p>
//           </div>
//         ) : (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <p className="text-sm text-yellow-700 flex items-center gap-2">
//               <span className="animate-pulse">⏳</span>
//               Waiting for agent assignment...
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Chat Container */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {/* Initial Description */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-sm font-medium text-blue-900 mb-2">Original Message:</p>
//             <p className="text-blue-800">{ticket.description}</p>
//           </div>

//           {/* Messages List */}
//           {allMessages.filter(msg => !msg.isInternal).map((msg) => {
//             const isOwnMessage = msg.sender._id === currentUserId;
            
//             return (
//               <div
//                 key={msg._id}
//                 className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
//                   {/* Sender Info */}
//                   {!isOwnMessage && (
//                     <p className="text-xs text-gray-500 mb-1 ml-2">
//                       {msg.sender.firstName} {msg.sender.lastName}
//                       {msg.sender.role !== 'user' && (
//                         <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
//                           {msg.sender.role}
//                         </span>
//                       )}
//                     </p>
//                   )}
                  
//                   {/* Message Bubble */}
//                   <div
//                     className={`rounded-2xl p-4 ${
//                       isOwnMessage
//                         ? 'bg-blue-500 text-white rounded-br-none'
//                         : 'bg-gray-100 text-gray-900 rounded-bl-none'
//                     }`}
//                   >
//                     <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    
//                     {/* Attachments */}
//                     {msg.attachments && msg.attachments.length > 0 && (
//                       <div className="mt-3 space-y-2">
//                         {msg.attachments.map((file, idx) => (
//                           <a
//                             key={idx}
//                             href={file.url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className={`block text-sm underline ${
//                               isOwnMessage ? 'text-white' : 'text-blue-600'
//                             }`}
//                           >
//                             📎 {file.filename}
//                           </a>
//                         ))}
//                       </div>
//                     )}
                    
//                     <p className={`text-xs mt-2 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
//                       {new Date(msg.createdAt).toLocaleTimeString('en-US', {
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {/* Typing Indicator */}
//           {typingUser && (
//             <div className="flex justify-start">
//               <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none">
//                 <p className="text-sm text-gray-600">{typingUser} is typing...</p>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>

//         {/* Message Input */}
//         {ticket.status !== 'resolved' && ticket.status !== 'closed' ? (
//           <form onSubmit={sendMessage} className="border-t border-gray-200 p-4">
//             {/* File Previews */}
//             {files.length > 0 && (
//               <div className="mb-3 flex flex-wrap gap-2">
//                 {files.map((file, idx) => (
//                   <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
//                     <span className="text-gray-700">{file.name}</span>
//                     <button
//                       type="button"
//                       onClick={() => removeFile(idx)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="flex gap-3">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 multiple
//                 accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
//                 onChange={handleFileSelect}
//                 className="hidden"
//               />
              
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2"
//                 title="Attach files"
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
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//               <button
//                 type="submit"
//                 disabled={sending || (!newMessage.trim() && files.length === 0)}
//                 className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {sending ? 'Sending...' : 'Send'}
//               </button>
//             </div>
//           </form>
//         ) : (
//           <div className="border-t border-gray-200 p-4 bg-gray-50">
//             <p className="text-center text-gray-600">
//               This ticket is {ticket.status}. No new messages can be sent.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Rating Modal */}
//       {showRatingModal && (
//         <RatingModal
//           ticketId={ticketId}
//           onSubmit={handleRatingSubmit}
//           onClose={() => setShowRatingModal(false)}
//         />
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { useTicketSocket } from '@/hooks/useTicketSocket';
import RatingModal from '@/components/user/pages/support/RatingModel';

interface Ticket {
  rating: any;
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  primaryAgent?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  message: string;
  attachments?: Array<{
    url: string;
    filename: string;
    fileType: string;
  }>;
  isInternal: boolean;
  createdAt: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showAgentNotification, setShowAgentNotification] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get token
  const token = typeof window !== 'undefined' 
    ? document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || null
    : null;

  // Socket connection
  const { 
    isConnected, 
    newMessage: socketNewMessage, 
    ticketUpdate,
    subscribeToTicket, 
    unsubscribeFromTicket,
    emitTyping,
    emitStopTyping,
    markAsRead,
    clearNewMessage,
    clearTicketUpdate
  } = useTicketSocket(token);

  useEffect(() => {
    fetchTicketDetails();
    
    // Get current user ID
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user._id);
    }

    // Subscribe to ticket
    if (ticketId) {
      subscribeToTicket(ticketId);
    }

    return () => {
      if (ticketId) {
        unsubscribeFromTicket(ticketId);
      }
    };
  }, [ticketId]);

  // Handle new socket message - REAL-TIME
  useEffect(() => {
    if (socketNewMessage) {
      console.log('📨 Adding new socket message:', socketNewMessage);
      setAllMessages(prev => {
        // Check if message already exists
        if (prev.some(m => m._id === socketNewMessage._id)) {
          return prev;
        }
        return [...prev, socketNewMessage];
      });
      clearNewMessage();
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [socketNewMessage]);

  // Handle ticket updates - REAL-TIME (agent assignment, status change)
  useEffect(() => {
    if (ticketUpdate) {
      console.log('🔄 Ticket updated:', ticketUpdate);
      
      // Check if agent was just assigned
      if (ticketUpdate.assignedTo && !ticket?.primaryAgent) {
        console.log('✅ Agent just assigned!');
        setShowAgentNotification(true);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowAgentNotification(false);
        }, 5000);
      }
      
      // Refresh ticket details to get updated info
      fetchTicketDetails();
      
      // Show rating modal if resolved
      if (ticketUpdate.status === 'resolved' && ticket && !ticket.rating) {
        setShowRatingModal(true);
      }
      
      clearTicketUpdate();
    }
  }, [ticketUpdate, ticket]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [allMessages]);

  useEffect(() => {
    // Mark messages as read when viewing
    if (allMessages.length > 0 && ticketId) {
      markAsRead(ticketId);
    }
  }, [allMessages, ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/support/tickets/${ticketId}`);
      setTicket(data.ticket || data.data);
      setAllMessages(data.messages || []);
      
      // Check if ticket is resolved and not yet rated
      if ((data.ticket?.status === 'resolved' || data.data?.status === 'resolved') && 
          !(data.ticket?.rating || data.data?.rating)) {
        setShowRatingModal(true);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    emitTyping(ticketId);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(ticketId);
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate: max 5 files
      if (attachments.length + selectedFiles.length > 5) {
        alert('Maximum 5 files allowed');
        return;
      }

      // Validate: 10MB each
      for (const file of selectedFiles) {
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 10MB limit`);
          return;
        }
      }

      setAttachments([...attachments, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessageText.trim() && attachments.length === 0) return;

    try {
      setSending(true);
      emitStopTyping(ticketId);

      const formData = new FormData();
      
      // Add message text
      if (newMessageText.trim()) {
        formData.append('message', newMessageText.trim());
      }
      
      // Add files with correct field name 'files' (not 'attachments')
      attachments.forEach(file => {
        formData.append('files', file);
      });

      console.log('Sending message with attachments:', attachments.length);

      const response = await api.post(`/support/tickets/${ticketId}/messages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Message sent successfully:', response.data);

      // Clear input
      setNewMessageText('');
      setAttachments([]);
      
      // The message will be added via socket 'new-message' event
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    try {
      await api.post(`/support/tickets/${ticketId}/rate`, {
        rating,
        feedback,
      });
      
      setShowRatingModal(false);
      alert('Thank you for your feedback!');
      router.push('/user/support');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">Ticket not found</p>
          <button
            onClick={() => router.push('/user/support')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Agent Joined Notification */}
      {showAgentNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👋</span>
            <div>
              <p className="font-bold">Agent Joined!</p>
              <p className="text-sm">An agent has been assigned to your ticket</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{ticket.subject}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <p className="text-gray-600 mb-2">Ticket #{ticket.ticketNumber}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Socket Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            
            <button
              onClick={() => router.push('/user/support')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Agent Info */}
        {ticket.primaryAgent ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-900 mb-1">
              ✓ Agent Assigned
            </p>
            <p className="text-sm text-green-700">
              {ticket.primaryAgent.firstName} {ticket.primaryAgent.lastName} ({ticket.primaryAgent.email})
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700 flex items-center gap-2">
              <span className="animate-pulse">⏳</span>
              Waiting for agent assignment...
            </p>
          </div>
        )}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Initial Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Original Message:</p>
            <p className="text-blue-800">{ticket.description}</p>
          </div>

          {/* Messages List */}
          {allMessages.filter(msg => !msg.isInternal).map((msg) => {
            const isOwnMessage = msg.sender._id === currentUserId;
            
            return (
              <div
                key={msg._id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {/* Sender Info */}
                  {!isOwnMessage && (
                    <p className="text-xs text-gray-500 mb-1 ml-2">
                      {msg.sender.firstName} {msg.sender.lastName}
                      {msg.sender.role !== 'job_seeker' && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {msg.sender.role}
                        </span>
                      )}
                    </p>
                  )}
                  
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 ${
                      isOwnMessage
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((file, idx) => (
                          <a
                            key={idx}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block text-sm underline ${
                              isOwnMessage ? 'text-white' : 'text-blue-600'
                            }`}
                          >
                            📎 {file.filename}
                          </a>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typingUser && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none">
                <p className="text-sm text-gray-600">{typingUser} is typing...</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {ticket.status !== 'resolved' && ticket.status !== 'closed' ? (
          <form onSubmit={sendMessage} className="border-t border-gray-200 p-4">
            {/* File Previews */}
            {attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm">
                    <span className="text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2"
                title="Attach files"
              >
                📎
              </button>

              <input
                type="text"
                value={newMessageText}
                onChange={(e) => {
                  setNewMessageText(e.target.value);
                  handleTyping();
                }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={sending || (!newMessageText.trim() && attachments.length === 0)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <p className="text-center text-gray-600">
              This ticket is {ticket.status}. No new messages can be sent.
            </p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          ticketId={ticketId}
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
}