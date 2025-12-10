
const sanitizeHtml = require('sanitize-html');
const { v4: uuidv4 } = require('uuid');
const SupportTicket = require('../models/supportTicket.model');
const SupportMessage = require('../models/supportmessage.model');

async function createTicket(req, res) {
  try {
    const subject = sanitizeHtml(req.body.subject || '', { allowedTags: [], allowedAttributes: {} });
    const description = sanitizeHtml(req.body.description || '', { allowedTags: [], allowedAttributes: {} });
    const category = req.body.category;
    const priority = req.body.priority;
    const attachmentUrl = req.body.attachmentUrl;

    const ticketNumber = `T-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*9000)+1000}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      user: req.user._id,
      subject,
      description,
      category,
      priority,
      attachmentUrl
    });

    // create an initial message for the ticket
    if (description) {
      await SupportMessage.create({
        ticket: ticket._id,
        sender: req.user._id,
        message: description,
        isAdmin: false
      });
    }

    return res.status(201).json({ ticket });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to create ticket' });
  }
}

async function listTickets(req, res) {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ data: tickets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to list tickets' });
  }
}

async function getTicket(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // authorization: owner or admin
    if (ticket.user && ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const messages = await SupportMessage.find({ ticket: ticket._id }).populate('sender','fullName email');
    return res.json({ ticket, messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to fetch ticket' });
  }
}

async function addMessage(req, res) {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // authorization: owner or admin
    if (ticket.user && ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const messageText = sanitizeHtml(req.body.message || '', { allowedTags: [], allowedAttributes: {} });
    const attachmentUrl = req.body.attachmentUrl;

    const message = await SupportMessage.create({
      ticket: ticket._id,
      sender: req.user._id,
      message: messageText,
      attachmentUrl,
      isAdmin: req.user.role === 'admin'
    });

    // optional: update ticket status/last updated
    ticket.status = req.body.status || ticket.status;
    await ticket.save();

    return res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to add message' });
  }
}

module.exports = { createTicket, listTickets, getTicket, addMessage };
