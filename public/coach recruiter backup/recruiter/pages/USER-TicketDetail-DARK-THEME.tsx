'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import RatingModal from '@/components/user/pages/support/RatingModel';

const baseURL = 'http://localhost:5000/api/v1';
const SOCKET_URL = 'http://localhost:5000';

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
  messageCount: number;
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showAgentNotification, setShowAgentNotification] = useState(false);
  
  // Socket
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize notification sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      notificationSoundRef.current = new Audio('/notification.mp3');
    }
  }, []);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  // Initialize Socket.IO
  const initializeSocket = () => {
    const token = getAccessToken();
    if (!token) {
      console.warn('⚠️ No token found, skipping socket connection');
      return;
    }

    console.log('🔌 Initializing Socket.IO connection...');

    const newSocket = io(`${SOCKET_URL}/tickets`, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected, ID:', newSocket.id);
      setIsConnected(true);
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
        
        // Play sound if message is from agent
        if (message.sender._id !== currentUserId && message.sender.role !== 'user' && message.sender.role !== 'job_seeker') {
          playNotificationSound();
          toast.info(`💬 ${message.sender.firstName} replied!`, {
            position: 'top-right',
            autoClose: 3000
          });
        }
        
        return [...prev, message];
      });
      scrollToBottom();
    });

    newSocket.on('ticket-updated', (update) => {
      console.log('🔄 Ticket updated via socket:', update);
      
      // Check if agent was just assigned
      if (update.primaryAgent && !ticket?.primaryAgent) {
        console.log('✅ Agent just assigned!');
        setShowAgentNotification(true);
        playNotificationSound();
        
        setTimeout(() => {
          setShowAgentNotification(false);
        }, 5000);
      }
      
      if (update.status) {
        setTicket(prev => prev ? { ...prev, status: update.status } : null);
        
        // Show rating modal if resolved
        if (update.status === 'resolved' && ticket && !ticket.rating) {
          setShowRatingModal(true);
        }
      }
      
      if (update.messageCount !== undefined) {
        setTicket(prev => prev ? { ...prev, messageCount: update.messageCount } : null);
      }
      
      // Refresh full ticket details
      fetchTicketDetails();
    });

    newSocket.on('user-typing', (data) => {
      console.log('⌨️ User typing:', data);
      if (data.userId !== currentUserId) {
        setIsTyping(true);
        setTypingUser(data.userName);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.warn('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      newSocket.emit('subscribe-ticket', ticketId);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    setSocket(newSocket);
  };

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

  const fetchCurrentUser = async () => {
    try {
      const userData = sessionStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserId(user._id);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

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
      
      // Check if ticket is resolved and not yet rated
      if (data.ticket?.status === 'resolved' && !data.ticket?.rating) {
        setShowRatingModal(true);
      }
    } catch (error: any) {
      console.error('❌ Error fetching ticket:', error);
      toast.error(error.response?.data?.error || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const playNotificationSound = () => {
    if (notificationSoundRef.current) {
      notificationSoundRef.current.play().catch(e => console.log('Could not play sound:', e));
    }
  };

  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit('typing', ticketId);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (socket && isConnected) {
        socket.emit('stop-typing', ticketId);
      }
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (attachments.length + selectedFiles.length > 5) {
        toast.error('Maximum 5 files allowed');
        return;
      }

      for (const file of selectedFiles) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} exceeds 10MB limit`);
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
    
    if (!newMessage.trim() && attachments.length === 0) {
      toast.error('Please enter a message or attach a file');
      return;
    }

    if (sending) return;

    try {
      setSending(true);
      const token = getAccessToken();
      
      if (socket && isConnected) {
        socket.emit('stop-typing', ticketId);
      }

      const formData = new FormData();
      formData.append('message', newMessage.trim());
      
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      console.log('📤 Sending message...');

      await axios.post(
        `${baseURL}/support/tickets/${ticketId}/messages`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('✅ Message sent successfully');

      // Clear inputs immediately
      setNewMessage('');
      setAttachments([]);
      
      // Message will appear via socket, but if socket fails, refresh
      if (!socket || !isConnected) {
        setTimeout(() => fetchTicketDetails(), 500);
      }
      
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    try {
      const token = getAccessToken();
      await axios.post(
        `${baseURL}/support/tickets/${ticketId}/rate`,
        { rating, feedback },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setShowRatingModal(false);
      toast.success('Thank you for your feedback!');
      router.push('/user/support');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
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
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-900 border border-red-700 rounded-lg p-6">
          <p className="text-red-200">Ticket not found</p>
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Agent Joined Notification */}
      {showAgentNotification && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👋</span>
            <div>
              <p className="font-bold text-lg">Agent Joined!</p>
              <p className="text-sm opacity-90">An agent has been assigned to your ticket</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#1e293b] rounded-2xl p-6 shadow-xl border border-slate-700 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{ticket.subject}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <p className="text-gray-400 mb-2">Ticket #{ticket.ticketNumber}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Socket Status */}
            <div className="flex items-center gap-2 bg-[#0f172a] px-3 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-300 font-medium">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            
            <button
              onClick={() => router.push('/user/support')}
              className="px-4 py-2 bg-[#0f172a] text-gray-300 rounded-lg hover:bg-slate-800 transition-colors border border-slate-700"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Agent Info */}
        {ticket.primaryAgent ? (
          <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-lg p-4">
            <p className="text-sm font-medium text-green-400 mb-1 flex items-center gap-2">
              <span>✓</span> Agent Assigned
            </p>
            <p className="text-sm text-green-300">
              {ticket.primaryAgent.firstName} {ticket.primaryAgent.lastName} ({ticket.primaryAgent.email})
            </p>
          </div>
        ) : (
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-yellow-300 flex items-center gap-2">
              <span className="animate-pulse">⏳</span>
              Waiting for agent assignment...
            </p>
          </div>
        )}
      </div>

      {/* Chat Container - MIDNIGHT BLUE THEME */}
      <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 flex flex-col" style={{ height: '600px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#0f172a' }}>
          {/* Initial Description */}
          <div className="bg-[#1e293b] border border-blue-800 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-400 mb-2">Original Message:</p>
            <p className="text-gray-300">{ticket.description}</p>
          </div>

          {/* Messages List */}
          {messages.filter(msg => !msg.isInternal).map((msg) => {
            const isOwnMessage = msg.sender._id === currentUserId;
            
            return (
              <div
                key={msg._id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%]`}>
                  {/* Sender Info */}
                  {!isOwnMessage && (
                    <p className="text-xs text-gray-500 mb-1 ml-2">
                      {msg.sender.firstName} {msg.sender.lastName}
                      {msg.sender.role !== 'job_seeker' && msg.sender.role !== 'user' && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-900 bg-opacity-50 text-purple-300 rounded text-xs border border-purple-700">
                          {msg.sender.role}
                        </span>
                      )}
                    </p>
                  )}
                  
                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-4 ${
                      isOwnMessage
                        ? 'bg-[#2563eb] text-white rounded-br-none'
                        : 'bg-[#1e293b] text-gray-200 rounded-bl-none border border-slate-700'
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
                              isOwnMessage ? 'text-blue-100' : 'text-blue-400'
                            }`}
                          >
                            📎 {file.filename}
                          </a>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${isOwnMessage ? 'text-blue-200' : 'text-gray-500'}`}>
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
          {isTyping && typingUser && (
            <div className="flex justify-start">
              <div className="bg-[#1e293b] rounded-2xl px-4 py-3 rounded-bl-none border border-slate-700">
                <p className="text-sm text-gray-400">{typingUser} is typing<span className="animate-pulse">...</span></p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {ticket.status !== 'resolved' && ticket.status !== 'closed' ? (
          <form onSubmit={sendMessage} className="border-t border-slate-800 p-4 bg-[#1e293b]">
            {/* File Previews */}
            {attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#0f172a] px-3 py-2 rounded-lg text-sm border border-slate-700">
                    <span className="text-gray-300">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-red-400 hover:text-red-300"
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
                className="px-4 py-3 bg-[#0f172a] text-gray-300 rounded-xl hover:bg-slate-800 border border-slate-700 transition-colors"
                title="Attach files"
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
                className="flex-1 px-4 py-3 bg-[#0f172a] text-gray-200 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />

              <button
                type="submit"
                disabled={sending || (!newMessage.trim() && attachments.length === 0)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? 'Sending...' : 'Send 🚀'}
              </button>
            </div>
          </form>
        ) : (
          <div className="border-t border-slate-800 p-4 bg-[#1e293b]">
            <p className="text-center text-gray-400">
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
