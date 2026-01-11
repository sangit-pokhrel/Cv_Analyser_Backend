const { verifyAccessToken } = require('../../utils/jwt.utils');
const User = require('../models/user.model');
const SupportTicket = require('../models/supportTicket.model');
const SupportMessage = require('../models/supportMessage.model');
const { invalidateMessagesCache } = require('../services/ticket.service');


function initializeTicketSocket(io) {
  // Ticket namespace
  const ticketNamespace = io.of('/tickets');
  
  ticketNamespace.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      const payload = verifyAccessToken(token);
      const user = await User.findById(payload.sub);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: ' + error.message));
    }
  });
  
  ticketNamespace.on('connection', (socket) => {
    console.log(`✅ Ticket socket connected: ${socket.id} - User: ${socket.user.email}`);
    
    // Join user's personal room
    socket.join(`user:${socket.user._id}`);
    
    // If admin/staff, join staff room
    if (['admin', 'csr', 'sales'].includes(socket.user.role)) {
      socket.join('staff');
      console.log(`👮 Staff member joined: ${socket.user.email}`);
    }
    
    // Subscribe to specific ticket
    socket.on('subscribe-ticket', async (ticketId) => {
      try {
        const ticket = await SupportTicket.findById(ticketId);
        
        if (!ticket) {
          socket.emit('error', { message: 'Ticket not found' });
          return;
        }
        
        // Check permission
        const isOwner = ticket.user.toString() === socket.user._id.toString();
        const isStaff = ['admin', 'csr', 'sales'].includes(socket.user.role);
        
        if (!isOwner && !isStaff) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }
        
        socket.join(`ticket:${ticketId}`);
        console.log(`📡 User ${socket.user.email} subscribed to ticket ${ticketId}`);
        
        socket.emit('subscribed', { ticketId, message: 'Subscribed to ticket updates' });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    // Unsubscribe from ticket
    socket.on('unsubscribe-ticket', (ticketId) => {
      socket.leave(`ticket:${ticketId}`);
      console.log(`📴 User ${socket.user.email} unsubscribed from ticket ${ticketId}`);
    });
    
    // User is typing
    socket.on('typing', (ticketId) => {
      socket.to(`ticket:${ticketId}`).emit('user-typing', {
        userId: socket.user._id,
        userName: `${socket.user.firstName} ${socket.user.lastName}`,
        ticketId
      });
    });
    
    // User stopped typing
    socket.on('stop-typing', (ticketId) => {
      socket.to(`ticket:${ticketId}`).emit('user-stop-typing', {
        userId: socket.user._id,
        ticketId
      });
    });
    
    // Mark messages as read
    socket.on('mark-read', async ({ ticketId }) => {
      try {
        await SupportMessage.updateMany(
          { 
            ticket: ticketId, 
            sender: { $ne: socket.user._id },
            isRead: false 
          },
          { 
            isRead: true,
            readAt: new Date()
          }
        );
        
        socket.to(`ticket:${ticketId}`).emit('messages-read', { ticketId });
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Ticket socket disconnected: ${socket.id}`);
    });
  });
  
  return ticketNamespace;
}


function broadcastNewMessage(io, ticketId, message) {
  io.of('/tickets').to(`ticket:${ticketId}`).emit('new-message', message);
}

function broadcastTicketUpdate(io, ticketId, update) {
  io.of('/tickets').to(`ticket:${ticketId}`).emit('ticket-updated', update);
}


function notifyStaffNewTicket(io, ticket) {
  io.of('/tickets').to('staff').emit('new-ticket', ticket);
}


function notifyTicketAssignment(io, userId, ticket) {
  io.of('/tickets').to(`user:${userId}`).emit('ticket-assigned', ticket);
}

module.exports = {
  initializeTicketSocket,
  broadcastNewMessage,
  broadcastTicketUpdate,
  notifyStaffNewTicket,
  notifyTicketAssignment
};