'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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

interface TicketUpdate {
  status?: string;
  priority?: string;
  assignedTo?: string;
}

export function useTicketSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [newMessage, setNewMessage] = useState<Message | null>(null);
  const [ticketUpdate, setTicketUpdate] = useState<TicketUpdate | null>(null);

  useEffect(() => {
    if (!token) return;

    // Connect to ticket namespace
    const ticketSocket = io(`${SOCKET_URL}/tickets`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    ticketSocket.on('connect', () => {
      console.log('✅ Ticket socket connected:', ticketSocket.id);
      setIsConnected(true);
    });

    ticketSocket.on('disconnect', () => {
      console.log('❌ Ticket socket disconnected');
      setIsConnected(false);
    });

    ticketSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    // Listen for new messages
    ticketSocket.on('new-message', (message: Message) => {
      console.log('📨 New message received:', message);
      setNewMessage(message);
    });

    // Listen for ticket updates
    ticketSocket.on('ticket-updated', (update: TicketUpdate) => {
      console.log('🔄 Ticket updated:', update);
      setTicketUpdate(update);
    });

    // Listen for new ticket assignments
    ticketSocket.on('ticket-assigned', (ticket) => {
      console.log('🎯 Ticket assigned to you:', ticket);
      // You can show a notification here
    });

    // Listen for new tickets (staff only)
    ticketSocket.on('new-ticket', (ticket) => {
      console.log('🎫 New ticket created:', ticket);
      // Show notification to staff
    });

    // Typing indicators
    ticketSocket.on('user-typing', ({ userName, ticketId }) => {
      console.log(`⌨️  ${userName} is typing...`);
    });

    ticketSocket.on('user-stop-typing', ({ ticketId }) => {
      console.log('User stopped typing');
    });

    setSocket(ticketSocket);

    return () => {
      ticketSocket.disconnect();
    };
  }, [token]);

  // Subscribe to a specific ticket
  const subscribeToTicket = useCallback((ticketId: string) => {
    if (socket && isConnected) {
      socket.emit('subscribe-ticket', ticketId);
      console.log(`📡 Subscribing to ticket: ${ticketId}`);
    }
  }, [socket, isConnected]);

  // Unsubscribe from ticket
  const unsubscribeFromTicket = useCallback((ticketId: string) => {
    if (socket) {
      socket.emit('unsubscribe-ticket', ticketId);
      console.log(`📴 Unsubscribed from ticket: ${ticketId}`);
    }
  }, [socket]);

  // Emit typing indicator
  const emitTyping = useCallback((ticketId: string) => {
    if (socket) {
      socket.emit('typing', ticketId);
    }
  }, [socket]);

  const emitStopTyping = useCallback((ticketId: string) => {
    if (socket) {
      socket.emit('stop-typing', ticketId);
    }
  }, [socket]);

  // Mark messages as read
  const markAsRead = useCallback((ticketId: string) => {
    if (socket) {
      socket.emit('mark-read', { ticketId });
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    newMessage,
    ticketUpdate,
    subscribeToTicket,
    unsubscribeFromTicket,
    emitTyping,
    emitStopTyping,
    markAsRead,
    clearNewMessage: () => setNewMessage(null),
    clearTicketUpdate: () => setTicketUpdate(null),
  };
}