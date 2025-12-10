const sanitizeHtml = require('sanitize-html');
const ContactInquiry = require('../models/contactInquiry.model');

async function createContact(req, res) {
  try {
    const name = sanitizeHtml(req.body.name || '');
    const email = sanitizeHtml(req.body.email || '');
    const phone = sanitizeHtml(req.body.phone || '');
    const subject = sanitizeHtml(req.body.subject || '');
    const message = sanitizeHtml(req.body.message || '');
    const inquiryType = req.body.inquiryType || 'general';
    const attachmentUrl = req.body.attachmentUrl;

    const obj = {
      user: req.user ? req.user._id : null,
      name, email, phone, subject, message, inquiryType, attachmentUrl
    };

    const saved = await ContactInquiry.create(obj);
    // optional: send automated acknowledgement email (enqueue)
    return res.status(201).json({ inquiry: saved });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to create contact inquiry' });
  }
}

async function listContactInquiries(req, res) {
  try {
    // admin only
    const { page = 1, limit = 50 } = req.query;
    const docs = await ContactInquiry.find().sort({ createdAt: -1 }).skip((page-1)*limit).limit(Math.min(200, Number(limit)));
    return res.json({ data: docs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to list inquiries' });
  }
}

module.exports = { createContact, listContactInquiries };
