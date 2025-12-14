
// const sanitizeHtml = require('sanitize-html');
// const { v4: uuidv4 } = require('uuid');
// const SupportTicket = require('../models/supportTicket.model');
// const SupportMessage = require('../models/supportmessage.model');

// async function createTicket(req, res) {
//   try {
//     const subject = sanitizeHtml(req.body.subject || '', { allowedTags: [], allowedAttributes: {} });
//     const description = sanitizeHtml(req.body.description || '', { allowedTags: [], allowedAttributes: {} });
//     const category = req.body.category;
//     const priority = req.body.priority;
//     const attachmentUrl = req.body.attachmentUrl;

//     const ticketNumber = `T-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*9000)+1000}`;

//     const ticket = await SupportTicket.create({
//       ticketNumber,
//       user: req.user._id,
//       subject,
//       description,
//       category,
//       priority,
//       attachmentUrl
//     });

//     // create an initial message for the ticket
//     if (description) {
//       await SupportMessage.create({
//         ticket: ticket._id,
//         sender: req.user._id,
//         message: description,
//         isAdmin: false
//       });
//     }

//     return res.status(201).json({ ticket });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to create ticket' });
//   }
// }

// async function listTickets(req, res) {
//   try {
//     const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
//     return res.json({ data: tickets });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to list tickets' });
//   }
// }

// async function getTicket(req, res) {
//   try {
//     const ticket = await SupportTicket.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

//     // authorization: owner or admin
//     if (ticket.user && ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     const messages = await SupportMessage.find({ ticket: ticket._id }).populate('sender','fullName email');
//     return res.json({ ticket, messages });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to fetch ticket' });
//   }
// }

// async function addMessage(req, res) {
//   try {
//     const ticket = await SupportTicket.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

//     // authorization: owner or admin
//     if (ticket.user && ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     const messageText = sanitizeHtml(req.body.message || '', { allowedTags: [], allowedAttributes: {} });
//     const attachmentUrl = req.body.attachmentUrl;

//     const message = await SupportMessage.create({
//       ticket: ticket._id,
//       sender: req.user._id,
//       message: messageText,
//       attachmentUrl,
//       isAdmin: req.user.role === 'admin'
//     });

//     // optional: update ticket status/last updated
//     ticket.status = req.body.status || ticket.status;
//     await ticket.save();

//     return res.status(201).json({ message });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Unable to add message' });
//   }
// }

// module.exports = { createTicket, listTickets, getTicket, addMessage };
const sanitizeHtml = require('sanitize-html');
const SupportTicket = require('../models/supportTicket.model');
const SupportMessage = require('../models/supportMessage.model');
const User = require('../models/user.model');
const { uploadBufferToS3 } = require('../../utils/storageS3');
const ticketQueue = require('../queues/ticketQueue');
const {
  getTicketById,
  invalidateTicketCache,
  getTicketMessages,
  invalidateMessagesCache,
  getTicketStats,
  invalidateStatsCache
} = require('../services/ticket.service');
const {
  broadcastNewMessage,
  broadcastTicketUpdate,
  notifyStaffNewTicket,
  notifyTicketAssignment
} = require('../sockets/ticket.sockets');

// ==================== USER ENDPOINTS ====================

/**
 * Create new ticket
 * POST /support/tickets
 */
async function createTicket(req, res) {
  try {
    const subject = sanitizeHtml(req.body.subject || '', { 
      allowedTags: [], 
      allowedAttributes: {} 
    });
    
    const description = sanitizeHtml(req.body.description || '', { 
      allowedTags: [], 
      allowedAttributes: {} 
    });
    
    if (!subject || !description) {
      return res.status(400).json({ 
        success: false,
        error: 'Subject and description are required' 
      });
    }

    const category = req.body.category || 'general';
    const priority = req.body.priority || 'medium';

    const count = await SupportTicket.countDocuments();
    const ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      user: req.user._id,
      subject,
      description,
      category,
      priority,
      status: 'open'
    });

    await ticket.populate('user', 'email firstName lastName role');

    await SupportMessage.create({
      ticket: ticket._id,
      sender: req.user._id,
      senderRole: req.user.role,
      message: description,
      isInternal: false
    });

    try {
      await ticketQueue.add('send-email', {
        type: 'ticket_created_user',
        ticketId: ticket._id,
        userId: req.user._id
      });

      await ticketQueue.add('send-email', {
        type: 'ticket_created_agents',
        ticketId: ticket._id
      });
    } catch (emailError) {
      console.warn('Failed to queue emails:', emailError.message);
    }

    if (global.io) {
      notifyStaffNewTicket(global.io, ticket);
    }

    invalidateStatsCache();

    console.log(`✅ Ticket created: ${ticket.ticketNumber} by ${req.user.email}`);

    return res.status(201).json({ 
      success: true,
      ticket,
      message: 'Ticket created successfully'
    });
  } catch (err) {
    console.error('Create ticket error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to create ticket',
      details: err.message
    });
  }
}

/**
 * List user's tickets
 * GET /support/tickets
 */
async function listUserTickets(req, res) {
  try {
    const { page = 1, limit = 20, status, priority, category } = req.query;

    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);

    const [tickets, total] = await Promise.all([
      SupportTicket.find(query)
        .populate('primaryAgent', 'email firstName lastName')
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SupportTicket.countDocuments(query)
    ]);

    return res.json({ 
      success: true,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      data: tickets 
    });
  } catch (err) {
    console.error('List tickets error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to list tickets' 
    });
  }
}

/**
 * Get single ticket with messages
 * GET /support/tickets/:id
 */
// async function getTicket(req, res) {
//   try {
//     const ticket = await getTicketById(req.params.id);
    
//     if (!ticket) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Ticket not found' 
//       });
//     }

//     const isOwner = ticket.user._id.toString() === req.user._id.toString();
//     const isStaff = ['admin', 'csr', 'sales'].includes(req.user.role);

//     if (!isOwner && !isStaff) {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Forbidden' 
//       });
//     }

//     const messages = await getTicketMessages(ticket._id);

//     return res.json({ 
//       success: true,
//       ticket, 
//       messages 
//     });
//   } catch (err) {
//     console.error('Get ticket error:', err);
//     return res.status(500).json({ 
//       success: false,
//       error: 'Unable to fetch ticket' 
//     });
//   }
// }

/**
 * Get single ticket with messages
 * GET /support/tickets/:id
 */
async function getTicket(req, res) {
  try {
    // Validate ticket ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ticket ID format'
      });
    }

    // Try cache first
    let ticket;
    try {
      ticket = await getTicketById(req.params.id);
    } catch (cacheError) {
      console.warn('Cache error, fetching from DB:', cacheError.message);
      // Fallback to direct DB query
      ticket = await SupportTicket.findById(req.params.id)
        .populate('user', 'email firstName lastName role')
        .populate('primaryAgent', 'email firstName lastName role averageRating totalRatings')
        .populate('assignedAgents.agent', 'email firstName lastName role');
    }
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    // Authorization: owner or staff
    const isOwner = ticket.user._id.toString() === req.user._id.toString();
    const isStaff = ['admin', 'csr', 'sales'].includes(req.user.role);

    // Check if user is an assigned agent
    const isAssignedAgent = ticket.assignedAgents.some(
      aa => aa.agent._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isStaff && !isAssignedAgent) {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden - You do not have access to this ticket' 
      });
    }

    // Get messages (try cache, fallback to DB)
    let messages;
    try {
      messages = await getTicketMessages(ticket._id);
    } catch (cacheError) {
      console.warn('Message cache error, fetching from DB:', cacheError.message);
      messages = await SupportMessage.find({ ticket: ticket._id })
        .populate('sender', 'email firstName lastName role')
        .sort({ createdAt: 1 });
    }

    // Filter internal messages for non-staff users
    if (!isStaff) {
      messages = messages.filter(msg => !msg.isInternal);
    }

    return res.json({ 
      success: true,
      ticket, 
      messages 
    });
  } catch (err) {
    console.error('Get ticket error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to fetch ticket',
      details: err.message
    });
  }
}

/**
 * Add message to ticket
 * POST /support/tickets/:id/messages
 */
async function addMessage(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    const isOwner = ticket.user.toString() === req.user._id.toString();
    const isStaff = ['admin', 'csr', 'sales'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden' 
      });
    }

    const messageText = sanitizeHtml(req.body.message || '', { 
      allowedTags: [], 
      allowedAttributes: {} 
    });

    if (!messageText) {
      return res.status(400).json({ 
        success: false,
        error: 'Message is required' 
      });
    }

    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const url = await uploadBufferToS3(
            file.buffer,
            file.originalname,
            file.mimetype,
            'ticket-attachments'
          );
          
          attachments.push({
            url,
            filename: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size
          });
        } catch (uploadError) {
          console.error('File upload error:', uploadError);
        }
      }
    }

    const message = await SupportMessage.create({
      ticket: ticket._id,
      sender: req.user._id,
      senderRole: req.user.role,
      message: messageText,
      attachments,
      isInternal: req.body.isInternal === 'true' && isStaff
    });

    await message.populate('sender', 'email firstName lastName role');

    if (req.body.status && isStaff) {
      ticket.status = req.body.status;
      await ticket.save();
      invalidateTicketCache(ticket._id);
    }

    invalidateMessagesCache(ticket._id);
    invalidateTicketCache(ticket._id);

    if (global.io) {
      broadcastNewMessage(global.io, ticket._id, message);
    }

    try {
      await ticketQueue.add('send-email', {
        type: 'new_message',
        ticketId: ticket._id,
        messageId: message._id
      });
    } catch (emailError) {
      console.warn('Failed to queue email:', emailError.message);
    }

    console.log(`💬 Message added to ticket ${ticket.ticketNumber} by ${req.user.email}`);

    return res.status(201).json({ 
      success: true,
      message,
      ticket: {
        _id: ticket._id,
        status: ticket.status,
        lastMessageAt: ticket.lastMessageAt
      }
    });
  } catch (err) {
    console.error('Add message error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to add message',
      details: err.message
    });
  }
}

/**
 * Rate ticket
 * POST /support/tickets/:id/rate
 */
/**
 * Rate ticket (rates the primary agent)
 * POST /support/tickets/:id/rate
 */
async function rateTicket(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('primaryAgent', 'email firstName lastName averageRating totalRatings');
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    // Only ticket owner can rate
    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden' 
      });
    }

    // Can only rate resolved/closed tickets
    if (!['resolved', 'closed'].includes(ticket.status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Can only rate resolved or closed tickets' 
      });
    }

    // Check if already rated
    if (ticket.rating) {
      return res.status(400).json({ 
        success: false,
        error: 'You have already rated this ticket' 
      });
    }

    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        error: 'Rating must be between 1 and 5' 
      });
    }

    // Must have a primary agent assigned
    if (!ticket.primaryAgent) {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot rate - no agent was assigned to this ticket' 
      });
    }

    // Save rating to ticket
    ticket.rating = rating;
    if (feedback) {
      ticket.feedback = sanitizeHtml(feedback, { 
        allowedTags: [], 
        allowedAttributes: {} 
      });
    }
    await ticket.save();

    // ==================== ADD RATING TO AGENT PROFILE ====================
    const agent = await User.findById(ticket.primaryAgent._id);
    
    if (agent) {
      // Add rating to agent's profile
      agent.agentRatings.push({
        ticket: ticket._id,
        rating: rating,
        feedback: ticket.feedback,
        ratedBy: req.user._id,
        ratedAt: new Date()
      });

      // Recalculate average rating
      agent.calculateAverageRating();
      
      await agent.save();

      console.log(`⭐ Agent ${agent.firstName} rated ${rating}/5 (avg: ${agent.averageRating})`);
    }

    invalidateTicketCache(ticket._id);
    invalidateStatsCache();

    return res.json({ 
      success: true,
      message: 'Thank you for your feedback!',
      ticket,
      agent: {
        _id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        averageRating: agent.averageRating,
        totalRatings: agent.totalRatings
      }
    });
  } catch (err) {
    console.error('Rate ticket error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to rate ticket',
      details: err.message
    });
  }
}
/**
 * Reopen ticket
 * POST /support/tickets/:id/reopen
 */
async function reopenTicket(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    if (ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden' 
      });
    }

    if (ticket.status !== 'closed') {
      return res.status(400).json({ 
        success: false,
        error: 'Can only reopen closed tickets' 
      });
    }

    ticket.status = 'open';
    ticket.reopenedCount += 1;
    ticket.closedAt = null;
    await ticket.save();

    await SupportMessage.create({
      ticket: ticket._id,
      sender: req.user._id,
      senderRole: req.user.role,
      message: req.body.reason || 'Ticket reopened by user',
      isInternal: false
    });

    invalidateTicketCache(ticket._id);
    invalidateMessagesCache(ticket._id);
    invalidateStatsCache();

    if (global.io) {
      broadcastTicketUpdate(global.io, ticket._id, { status: 'open' });
    }

    return res.json({ 
      success: true,
      message: 'Ticket reopened successfully',
      ticket
    });
  } catch (err) {
    console.error('Reopen ticket error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to reopen ticket' 
    });
  }
}

// ==================== STAFF ENDPOINTS ====================

/**
 * List all tickets (Admin/CSR/Sales)
 * GET /support/admin/tickets
 */
async function listAllTickets(req, res) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      priority, 
      category,
      userId,
      search
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (userId) query.user = userId;
    
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tickets, total] = await Promise.all([
      SupportTicket.find(query)
        .populate('user', 'email firstName lastName role')
        .populate('primaryAgent', 'email firstName lastName role')
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      SupportTicket.countDocuments(query)
    ]);

    return res.json({ 
      success: true,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      data: tickets 
    });
  } catch (err) {
    console.error('List all tickets error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to list tickets' 
    });
  }
}

/**
 * Update ticket
 * PUT /support/admin/tickets/:id
 */
async function updateTicket(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    const allowedUpdates = ['status', 'priority', 'category', 'tags', 'internalNotes'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(ticket, updates);
    await ticket.save();

    invalidateTicketCache(ticket._id);
    invalidateStatsCache();

    if (global.io) {
      broadcastTicketUpdate(global.io, ticket._id, updates);
    }

    await ticket.populate('user primaryAgent assignedAgents.agent');

    return res.json({ 
      success: true,
      message: 'Ticket updated successfully',
      ticket
    });
  } catch (err) {
    console.error('Update ticket error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to update ticket',
      details: err.message
    });
  }
}

/**
 * Delete ticket
 * DELETE /support/admin/tickets/:id
 */
async function deleteTicket(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    await SupportMessage.deleteMany({ ticket: ticket._id });
    await ticket.deleteOne();

    invalidateTicketCache(ticket._id);
    invalidateMessagesCache(ticket._id);
    invalidateStatsCache();

    return res.json({ 
      success: true,
      message: 'Ticket and all messages deleted successfully' 
    });
  } catch (err) {
    console.error('Delete ticket error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to delete ticket' 
    });
  }
}

/**
 * Get statistics
 * GET /support/admin/stats
 */
async function getStats(req, res) {
  try {
    const { userId } = req.query;
    const stats = await getTicketStats(userId);

    return res.json({ 
      success: true,
      stats
    });
  } catch (err) {
    console.error('Get stats error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to fetch statistics' 
    });
  }
}

/**
 * Assign ticket (backward compatibility)
 * POST /support/admin/tickets/:id/assign
 */
async function assignTicket(req, res) {
  try {
    const { agentId, agentEmail } = req.body;

    if (!agentId && !agentEmail) {
      return res.status(400).json({ 
        success: false,
        error: 'Either agentId or agentEmail is required' 
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    let agent;

    if (agentEmail) {
      agent = await User.findOne({ 
        email: agentEmail.toLowerCase().trim(),
        role: { $in: ['admin', 'csr', 'sales'] }
      });

      if (!agent) {
        return res.status(404).json({ 
          success: false,
          error: 'Agent not found with that email'
        });
      }
    } else {
      agent = await User.findOne({
        _id: agentId,
        role: { $in: ['admin', 'csr', 'sales'] }
      });

      if (!agent) {
        return res.status(404).json({ 
          success: false,
          error: 'Agent not found with that ID'
        });
      }
    }

    ticket.primaryAgent = agent._id;
    ticket.status = 'in_progress';
    
    const existingAssignment = ticket.assignedAgents.find(
      aa => aa.agent.toString() === agent._id.toString()
    );

    if (!existingAssignment) {
      ticket.assignedAgents.push({
        agent: agent._id,
        status: 'accepted',
        role: 'primary',
        assignedAt: new Date(),
        respondedAt: new Date()
      });
    }

    await ticket.save();

    invalidateTicketCache(ticket._id);
    invalidateStatsCache();

    if (global.io) {
      notifyTicketAssignment(global.io, agent._id, ticket);
      broadcastTicketUpdate(global.io, ticket._id, { 
        primaryAgent: agent._id,
        status: 'in_progress'
      });
    }

    await ticket.populate('primaryAgent', 'email firstName lastName');

    return res.json({ 
      success: true,
      message: `Ticket assigned to ${agent.firstName} ${agent.lastName}`,
      ticket,
      agent: {
        _id: agent._id,
        email: agent.email,
        firstName: agent.firstName,
        lastName: agent.lastName,
        role: agent.role
      }
    });
  } catch (err) {
    console.error('Assign ticket error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to assign ticket',
      details: err.message
    });
  }
}

/**
 * Bulk update tickets
 * POST /support/admin/tickets/bulk-update
 */
async function bulkUpdateTickets(req, res) {
  try {
    const { ticketIds, updates } = req.body;

    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Ticket IDs array is required' 
      });
    }

    const allowedUpdates = ['status', 'priority'];
    const validUpdates = {};

    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        validUpdates[field] = updates[field];
      }
    });

    if (Object.keys(validUpdates).length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No valid updates provided' 
      });
    }

    const result = await SupportTicket.updateMany(
      { _id: { $in: ticketIds } },
      { $set: validUpdates }
    );

    ticketIds.forEach(id => invalidateTicketCache(id));
    invalidateStatsCache();

    return res.json({ 
      success: true,
      message: `${result.modifiedCount} tickets updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Bulk update error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to update tickets' 
    });
  }
}

/**
 * Search agents
 * GET /support/admin/agents/search
 */
async function searchAgents(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }

    const agents = await User.find({
      role: { $in: ['admin', 'csr', 'sales'] },
      status: 'active',
      $or: [
        { email: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } }
      ]
    })
    .select('_id email firstName lastName role')
    .limit(10)
    .sort({ firstName: 1 });

    return res.json({
      success: true,
      data: agents
    });
  } catch (err) {
    console.error('Search agents error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to search agents'
    });
  }
}

/**
 * List all agents
 * GET /support/admin/agents
 */
async function listAllAgents(req, res) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      status,
      search 
    } = req.query;

    const query = {
      role: { $in: ['admin', 'csr', 'sales'] },
      _id: { $ne: req.user._id }
    };

    if (role && ['admin', 'csr', 'sales'].includes(role)) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const agents = await User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'supporttickets',
          localField: '_id',
          foreignField: 'primaryAgent',
          as: 'assignedTickets'
        }
      },
      {
        $addFields: {
          totalAssigned: { $size: '$assignedTickets' },
          openTickets: {
            $size: {
              $filter: {
                input: '$assignedTickets',
                as: 'ticket',
                cond: { $eq: ['$$ticket.status', 'open'] }
              }
            }
          },
          inProgressTickets: {
            $size: {
              $filter: {
                input: '$assignedTickets',
                as: 'ticket',
                cond: { $eq: ['$$ticket.status', 'in_progress'] }
              }
            }
          },
          resolvedTickets: {
            $size: {
              $filter: {
                input: '$assignedTickets',
                as: 'ticket',
                cond: { $eq: ['$$ticket.status', 'resolved'] }
              }
            }
          }
        }
      },
      {
        $project: {
          password: 0,
          twoFactorSecret: 0,
          failedLoginAttempts: 0,
          lockUntil: 0,
          assignedTickets: 0
        }
      },
      { $sort: { firstName: 1 } },
      { $skip: skip },
      { $limit: Number(limit) }
    ]);

    const total = await User.countDocuments(query);

    return res.json({
      success: true,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      },
      data: agents
    });
  } catch (err) {
    console.error('List agents error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to list agents',
      details: err.message
    });
  }
}

/**
 * Get agent details
 * GET /support/admin/agents/:id
 */
// async function getAgentDetails(req, res) {
//   try {
//     const agent = await User.findOne({
//       _id: req.params.id,
//       role: { $in: ['admin', 'csr', 'sales'] }
//     }).select('-password -twoFactorSecret -failedLoginAttempts -lockUntil');

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         error: 'Agent not found'
//       });
//     }

//     const [ticketStats, recentTickets] = await Promise.all([
//       SupportTicket.aggregate([
//         { $match: { primaryAgent: agent._id } },
//         {
//           $facet: {
//             byStatus: [
//               { $group: { _id: '$status', count: { $sum: 1 } } }
//             ],
//             byPriority: [
//               { $group: { _id: '$priority', count: { $sum: 1 } } }
//             ],
//             byCategory: [
//               { $group: { _id: '$category', count: { $sum: 1 } } }
//             ],
//             avgMetrics: [
//               {
//                 $group: {
//                   _id: null,
//                   avgResponseTime: { $avg: '$responseTime' },
//                   avgResolutionTime: { $avg: '$resolutionTime' },
//                   avgRating: { $avg: '$rating' },
//                   totalTickets: { $sum: 1 }
//                 }
//               }
//             ]
//           }
//         }
//       ]),
//       SupportTicket.find({ primaryAgent: agent._id })
//         .populate('user', 'email firstName lastName')
//         .sort({ lastMessageAt: -1 })
//         .limit(10)
//         .select('ticketNumber subject status priority category lastMessageAt')
//     ]);

//     const stats = {
//       byStatus: ticketStats[0].byStatus.reduce((acc, curr) => {
//         acc[curr._id] = curr.count;
//         return acc;
//       }, {}),
//       byPriority: ticketStats[0].byPriority.reduce((acc, curr) => {
//         acc[curr._id] = curr.count;
//         return acc;
//       }, {}),
//       byCategory: ticketStats[0].byCategory.reduce((acc, curr) => {
//         acc[curr._id] = curr.count;
//         return acc;
//       }, {}),
//       overall: ticketStats[0].avgMetrics[0] || {
//         avgResponseTime: 0,
//         avgResolutionTime: 0,
//         avgRating: 0,
//         totalTickets: 0
//       }
//     };

//     return res.json({
//       success: true,
//       agent,
//       stats,
//       recentTickets
//     });
//   } catch (err) {
//     console.error('Get agent details error:', err);
//     return res.status(500).json({
//       success: false,
//       error: 'Unable to fetch agent details',
//       details: err.message
//     });
//   }
// }

/**
 * Get agent details with ratings
 * GET /support/admin/agents/:id
 */
async function getAgentDetails(req, res) {
  try {
    const agent = await User.findOne({
      _id: req.params.id,
      role: { $in: ['admin', 'csr', 'sales'] }
    })
    .select('-password -twoFactorSecret -failedLoginAttempts -lockUntil')
    .populate('agentRatings.ticket', 'ticketNumber subject')
    .populate('agentRatings.ratedBy', 'firstName lastName email');

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    const [ticketStats, recentTickets] = await Promise.all([
      SupportTicket.aggregate([
        { $match: { primaryAgent: agent._id } },
        {
          $facet: {
            byStatus: [
              { $group: { _id: '$status', count: { $sum: 1 } } }
            ],
            byPriority: [
              { $group: { _id: '$priority', count: { $sum: 1 } } }
            ],
            byCategory: [
              { $group: { _id: '$category', count: { $sum: 1 } } }
            ],
            avgMetrics: [
              {
                $group: {
                  _id: null,
                  avgResponseTime: { $avg: '$responseTime' },
                  avgResolutionTime: { $avg: '$resolutionTime' },
                  totalTickets: { $sum: 1 }
                }
              }
            ]
          }
        }
      ]),
      SupportTicket.find({ primaryAgent: agent._id })
        .populate('user', 'email firstName lastName')
        .sort({ lastMessageAt: -1 })
        .limit(10)
        .select('ticketNumber subject status priority category lastMessageAt rating')
    ]);

    const stats = {
      byStatus: ticketStats[0].byStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byPriority: ticketStats[0].byPriority.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byCategory: ticketStats[0].byCategory.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      overall: ticketStats[0].avgMetrics[0] || {
        avgResponseTime: 0,
        avgResolutionTime: 0,
        totalTickets: 0
      }
    };

    // Rating breakdown
    const ratingBreakdown = {
      5: agent.agentRatings.filter(r => r.rating === 5).length,
      4: agent.agentRatings.filter(r => r.rating === 4).length,
      3: agent.agentRatings.filter(r => r.rating === 3).length,
      2: agent.agentRatings.filter(r => r.rating === 2).length,
      1: agent.agentRatings.filter(r => r.rating === 1).length
    };

    return res.json({
      success: true,
      agent,
      stats,
      ratings: {
        average: agent.averageRating,
        total: agent.totalRatings,
        breakdown: ratingBreakdown,
        recent: agent.agentRatings.slice(-10).reverse() // Last 10 ratings
      },
      recentTickets
    });
  } catch (err) {
    console.error('Get agent details error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch agent details',
      details: err.message
    });
  }
}

/**
 * Get agent leaderboard
 * GET /support/admin/agents/leaderboard
 */
// async function getAgentLeaderboard(req, res) {
//   try {
//     const { period = 'all', metric = 'resolved' } = req.query;

//     let dateFilter = {};
//     if (period !== 'all') {
//       const now = new Date();
//       let startDate;

//       switch (period) {
//         case 'today':
//           startDate = new Date(now.setHours(0, 0, 0, 0));
//           break;
//         case 'week':
//           startDate = new Date(now.setDate(now.getDate() - 7));
//           break;
//         case 'month':
//           startDate = new Date(now.setMonth(now.getMonth() - 1));
//           break;
//         default:
//           startDate = new Date(0);
//       }

//       dateFilter = { createdAt: { $gte: startDate } };
//     }

//     const leaderboard = await User.aggregate([
//       {
//         $match: {
//           role: { $in: ['admin', 'csr', 'sales'] },
//           status: 'active'
//         }
//       },
//       {
//         $lookup: {
//           from: 'supporttickets',
//           let: { agentId: '$_id' },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ['$primaryAgent', '$$agentId'] },
//                 ...dateFilter
//               }
//             }
//           ],
//           as: 'tickets'
//         }
//       },
//       {
//         $addFields: {
//           totalTickets: { $size: '$tickets' },
//           resolvedTickets: {
//             $size: {
//               $filter: {
//                 input: '$tickets',
//                 as: 'ticket',
//                 cond: { $eq: ['$$ticket.status', 'resolved'] }
//               }
//             }
//           },
//           avgResponseTime: { $avg: '$tickets.responseTime' },
//           avgResolutionTime: { $avg: '$tickets.resolutionTime' },
//           avgRating: { $avg: '$tickets.rating' }
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           email: 1,
//           firstName: 1,
//           lastName: 1,
//           role: 1,
//           totalTickets: 1,
//           resolvedTickets: 1,
//           avgResponseTime: { $round: ['$avgResponseTime', 2] },
//           avgResolutionTime: { $round: ['$avgResolutionTime', 2] },
//           avgRating: { $round: ['$avgRating', 2] }
//         }
//       },
//       {
//         $sort: metric === 'resolved' 
//           ? { resolvedTickets: -1 }
//           : metric === 'rating'
//           ? { avgRating: -1 }
//           : metric === 'response'
//           ? { avgResponseTime: 1 }
//           : { totalTickets: -1 }
//       }
//     ]);

//     return res.json({
//       success: true,
//       period,
//       metric,
//       leaderboard
//     });
//   } catch (err) {
//     console.error('Get leaderboard error:', err);
//     return res.status(500).json({
//       success: false,
//       error: 'Unable to fetch leaderboard',
//       details: err.message
//     });
//   }
// }

// ==================== MULTI-AGENT ENDPOINTS ====================


/**
 * Get agent leaderboard with ratings
 * GET /support/admin/agents/leaderboard
 */
async function getAgentLeaderboard(req, res) {
  try {
    const { period = 'all', metric = 'rating' } = req.query;

    let dateFilter = {};
    if (period !== 'all') {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0);
      }

      dateFilter = { createdAt: { $gte: startDate } };
    }

    const leaderboard = await User.aggregate([
      {
        $match: {
          role: { $in: ['admin', 'csr', 'sales'] },
          status: 'active'
        }
      },
      {
        $lookup: {
          from: 'supporttickets',
          let: { agentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$primaryAgent', '$$agentId'] },
                ...dateFilter
              }
            }
          ],
          as: 'tickets'
        }
      },
      {
        $addFields: {
          totalTickets: { $size: '$tickets' },
          resolvedTickets: {
            $size: {
              $filter: {
                input: '$tickets',
                as: 'ticket',
                cond: { $eq: ['$$ticket.status', 'resolved'] }
              }
            }
          },
          avgResponseTime: { $avg: '$tickets.responseTime' },
          avgResolutionTime: { $avg: '$tickets.resolutionTime' }
        }
      },
      {
        $project: {
          _id: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          role: 1,
          totalTickets: 1,
          resolvedTickets: 1,
          avgResponseTime: { $round: ['$avgResponseTime', 2] },
          avgResolutionTime: { $round: ['$avgResolutionTime', 2] },
          averageRating: { $round: ['$averageRating', 1] },
          totalRatings: 1
        }
      },
      {
        $sort: metric === 'rating'
          ? { averageRating: -1, totalRatings: -1 }
          : metric === 'resolved' 
          ? { resolvedTickets: -1 }
          : metric === 'response'
          ? { avgResponseTime: 1 }
          : { totalTickets: -1 }
      }
    ]);

    return res.json({
      success: true,
      period,
      metric,
      leaderboard
    });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch leaderboard',
      details: err.message
    });
  }
}
/**
 * Accept ticket
 * POST /support/admin/tickets/:id/accept
 */
async function acceptTicket(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    const isPending = ticket.pendingAgents.some(
      agentId => agentId.toString() === req.user._id.toString()
    );

    if (!isPending) {
      return res.status(400).json({ 
        success: false,
        error: 'This ticket was not assigned to you' 
      });
    }

    const alreadyAccepted = ticket.assignedAgents.some(
      aa => aa.agent.toString() === req.user._id.toString() && aa.status === 'accepted'
    );

    if (alreadyAccepted) {
      return res.status(400).json({ 
        success: false,
        error: 'You have already accepted this ticket' 
      });
    }

    const isPrimary = !ticket.primaryAgent;

    ticket.assignedAgents.push({
      agent: req.user._id,
      status: 'accepted',
      role: isPrimary ? 'primary' : 'collaborator',
      assignedAt: new Date(),
      respondedAt: new Date()
    });

    if (isPrimary) {
      ticket.primaryAgent = req.user._id;
      ticket.status = 'in_progress';
    }

    ticket.pendingAgents = ticket.pendingAgents.filter(
      agentId => agentId.toString() !== req.user._id.toString()
    );

    await ticket.save();

    invalidateTicketCache(ticket._id);
    invalidateStatsCache();

    try {
      await ticketQueue.add('send-email', {
        type: 'agent_accepted',
        ticketId: ticket._id,
        agentId: req.user._id
      });
    } catch (emailError) {
      console.warn('Failed to queue email:', emailError.message);
    }

    if (global.io) {
      broadcastTicketUpdate(global.io, ticket._id, {
        status: ticket.status,
        assignedAgents: ticket.assignedAgents,
        primaryAgent: ticket.primaryAgent
      });
    }

    await ticket.populate('user primaryAgent assignedAgents.agent');

    return res.json({
      success: true,
      message: isPrimary 
        ? 'Ticket accepted! You are now the primary agent.' 
        : 'Ticket accepted! You are now collaborating on this ticket.',
      ticket,
      role: isPrimary ? 'primary' : 'collaborator'
    });
  } catch (err) {
    console.error('Accept ticket error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to accept ticket',
      details: err.message
    });
  }
}

/**
 * Decline ticket
 * POST /support/admin/tickets/:id/decline
 */
async function declineTicket(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found' 
      });
    }

    const isPending = ticket.pendingAgents.some(
      agentId => agentId.toString() === req.user._id.toString()
    );

    if (!isPending) {
      return res.status(400).json({ 
        success: false,
        error: 'This ticket was not assigned to you' 
      });
    }

    ticket.assignedAgents.push({
      agent: req.user._id,
      status: 'declined',
      role: 'collaborator',
      assignedAt: new Date(),
      respondedAt: new Date()
    });

    ticket.pendingAgents = ticket.pendingAgents.filter(
      agentId => agentId.toString() !== req.user._id.toString()
    );

    await ticket.save();

    invalidateTicketCache(ticket._id);

    return res.json({
      success: true,
      message: 'Ticket declined'
    });
  } catch (err) {
    console.error('Decline ticket error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to decline ticket',
      details: err.message
    });
  }
}

/**
 * List pending tickets
 * GET /support/admin/tickets/pending-my-response
 */
async function listPendingTickets(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const tickets = await SupportTicket.find({
      pendingAgents: req.user._id,
      status: 'pending_assignment'
    })
    .populate('user', 'email firstName lastName')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

    const total = await SupportTicket.countDocuments({
      pendingAgents: req.user._id,
      status: 'pending_assignment'
    });

    return res.json({
      success: true,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: tickets
    });
  } catch (err) {
    console.error('List pending tickets error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to list pending tickets'
    });
  }
}

/**
 * Get agent reviews/ratings
 * GET /support/admin/agents/:id/reviews
 */
async function getAgentReviews(req, res) {
  try {
    const { page = 1, limit = 20, rating } = req.query;

    const agent = await User.findOne({
      _id: req.params.id,
      role: { $in: ['admin', 'csr', 'sales'] }
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found'
      });
    }

    let reviews = agent.agentRatings;

    // Filter by rating if specified
    if (rating) {
      reviews = reviews.filter(r => r.rating === Number(rating));
    }

    // Sort by most recent
    reviews.sort((a, b) => new Date(b.ratedAt) - new Date(a.ratedAt));

    // Paginate
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedReviews = reviews.slice(skip, skip + Number(limit));

    // Populate references
    await User.populate(paginatedReviews, [
      { path: 'ticket', select: 'ticketNumber subject category' },
      { path: 'ratedBy', select: 'firstName lastName email' }
    ]);

    return res.json({
      success: true,
      meta: {
        total: reviews.length,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(reviews.length / Number(limit))
      },
      agent: {
        _id: agent._id,
        firstName: agent.firstName,
        lastName: agent.lastName,
        averageRating: agent.averageRating,
        totalRatings: agent.totalRatings
      },
      reviews: paginatedReviews
    });
  } catch (err) {
    console.error('Get agent reviews error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to fetch reviews',
      details: err.message
    });
  }
}

module.exports = { 
  // User endpoints
  createTicket, 
  listUserTickets, 
  getTicket, 
  addMessage,
  rateTicket,
  reopenTicket,
  
  // Staff endpoints
  listAllTickets,
  updateTicket,
  deleteTicket,
  getStats,
  assignTicket,
  bulkUpdateTickets,
  searchAgents,
  listAllAgents,
  getAgentDetails,
  getAgentLeaderboard,
  
  // Multi-agent endpoints
  acceptTicket,
  declineTicket,
  listPendingTickets,
  getAgentReviews
};