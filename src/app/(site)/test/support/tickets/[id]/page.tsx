'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useTicketSocket } from '@/hooks/useTicketSocket';

interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  assignedTo?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  lastMessageAt: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  senderRole: string;
  message: string;
  attachments: Array<{
    url: string;
    filename: string;
    fileType: string;
  }>;
  isInternal: boolean;
  createdAt: string;
}

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  // Initialize Socket.IO
  const {
    isConnected,
    newMessage: socketNewMessage,
    ticketUpdate,
    subscribeToTicket,
    unsubscribeFromTicket,
    emitTyping,
    emitStopTyping,
    clearNewMessage,
    clearTicketUpdate,
  } = useTicketSocket(token);

  // Fetch ticket data
  useEffect(() => {
    fetchTicket();
  }, [ticketId, fetchTicket]);

  // Subscribe to ticket updates
  useEffect(() => {
    if (isConnected && ticketId) {
      subscribeToTicket(ticketId);
    }

    return () => {
      if (ticketId) {
        unsubscribeFromTicket(ticketId);
      }
    };
  }, [isConnected, ticketId, subscribeToTicket, unsubscribeFromTicket]);

  // Handle new messages from socket
  useEffect(() => {
    if (socketNewMessage) {
      setMessages((prev) => [...prev, socketNewMessage]);
      clearNewMessage();
      scrollToBottom();
    }
  }, [socketNewMessage, clearNewMessage]);

  // Handle ticket updates
  useEffect(() => {
    if (ticketUpdate && ticket) {
      setTicket({
        ...ticket,
        ...ticketUpdate,
        assignedTo: typeof ticketUpdate.assignedTo === 'string' ? undefined : ticketUpdate.assignedTo,
      });
      clearTicketUpdate();
    }
  }, [ticketUpdate, ticket, clearTicketUpdate]);

  const fetchTicket = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/support/tickets/${ticketId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setTicket(response.data.ticket);
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  }, [ticketId, token, API_URL]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      emitTyping(ticketId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      emitStopTyping(ticketId);
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/v1/support/tickets/${ticketId}/messages`,
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setNewMessage('');
        // Message will be added via socket
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
      emitStopTyping(ticketId);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      waiting_customer: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">Ticket not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {ticket.ticketNumber}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <h2 className="text-xl text-gray-700 mb-2">{ticket.subject}</h2>
              <p className="text-sm text-gray-500">
                Created {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>

          {ticket.assignedTo && (
            <div className="text-sm text-gray-600">
              Assigned to: <span className="font-medium">{ticket.assignedTo.firstName} {ticket.assignedTo.lastName}</span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Conversation</h3>
          </div>

          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender._id === currentUserId;
              const isStaff = ['admin', 'csr', 'sales'].includes(msg.senderRole);

              return (
                <div
                  key={msg._id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-600 text-white' : isStaff ? 'bg-purple-100 text-gray-900' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">
                        {msg.sender.firstName} {msg.sender.lastName}
                      </span>
                      {isStaff && (
                        <span className="px-2 py-0.5 bg-purple-200 text-purple-800 text-xs rounded-full">
                          Staff
                        </span>
                      )}
                      {msg.isInternal && (
                        <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded-full">
                          Internal
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                    
                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.attachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 ${isCurrentUser ? 'text-blue-100 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}
                          >
                             {att.filename}
                          </a>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-xs mt-2 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {ticket.status !== 'closed' && (
            <form onSubmit={handleSendMessage} className="p-6 border-t">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}