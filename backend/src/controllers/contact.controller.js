const sanitizeHtml = require('sanitize-html');
const mongoose = require('mongoose');
const ContactInquiry = require('../models/contactInquiry.model');

const MAX_LIMIT = 200;

function isAdmin(user) {
  return user && user.role === 'admin';
}

function sanitizeFields(body = {}) {
  return {
    name: sanitizeHtml(body.name || ''),
    email: sanitizeHtml(body.email || ''),
    phone: sanitizeHtml(body.phone || ''),
    subject: sanitizeHtml(body.subject || ''),
    message: sanitizeHtml(body.message || ''),
    inquiryType: sanitizeHtml(body.inquiryType || 'general'),
    attachmentUrl: sanitizeHtml(body.attachmentUrl || ''),
  };
}

async function createContact(req, res) {
  try {
    const userId = req.user ? req.user._id : null;
    const fields = sanitizeFields(req.body);

    const obj = {
      user: userId,
      ...fields,
    };

    const saved = await ContactInquiry.create(obj);
    return res.status(201).json({ inquiry: saved });
  } catch (err) {
    console.error('createContact error', err);
    return res.status(500).json({ error: 'Unable to create contact inquiry' });
  }
}

async function getOrListContacts(req, res) {
  try {
    const id = req.params.id;

  
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid inquiry id' });
      }
      const doc = await ContactInquiry.findById(id).populate('user', 'fullName email');
      if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

      if (!isAdmin(req.user) && (!req.user || String(doc.user?._id || doc.user) !== String(req.user._id))) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return res.json({ inquiry: doc });
    }

    if (!req.user) return res.status(401).json({ error: 'Authentication required' });

    let { page = 1, limit = 50 } = req.query;
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 50));
    const skip = (page - 1) * limit;

    const filter = { deletedAt: { $exists: false } };
    if (!isAdmin(req.user)) {
      filter.user = req.user._id;
    } else {
      if (req.query.inquiryType) filter.inquiryType = sanitizeHtml(req.query.inquiryType);
      if (req.query.email) filter.email = sanitizeHtml(req.query.email);
    }

    const [docs, total] = await Promise.all([
      ContactInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user','fullName email'),
      ContactInquiry.countDocuments(filter),
    ]);

    return res.json({ page, limit, total, data: docs });
  } catch (err) {
    console.error('getOrListContacts error', err);
    return res.status(500).json({ error: 'Unable to fetch inquiries' });
  }
}

async function getContact(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id);
    if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

    // if not admin, ensure owner
    if (!isAdmin(req.user) && (!req.user || String(doc.user) !== String(req.user._id))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json({ inquiry: doc });
  } catch (err) {
    console.error('getContact error', err);
    return res.status(500).json({ error: 'Unable to retrieve inquiry' });
  }
}


async function updateContact(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id);
    if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

    // authorization: only owner or admin
    if (!isAdmin(req.user) && (!req.user || String(doc.user) !== String(req.user._id))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const fields = sanitizeFields(req.body);

    // update allowed fields only (do not allow setting 'user' or createdAt)
    const updated = await ContactInquiry.findByIdAndUpdate(
      id,
      { $set: fields },
      { new: true, runValidators: true }
    );

    return res.json({ inquiry: updated });
  } catch (err) {
    console.error('updateContact error', err);
    return res.status(500).json({ error: 'Unable to update inquiry' });
  }
}

async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id);
    if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

    // authorization: only owner or admin
    if (!isAdmin(req.user) && (!req.user || String(doc.user) !== String(req.user._id))) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await ContactInquiry.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteContact error', err);
    return res.status(500).json({ error: 'Unable to delete inquiry' });
  }
}
// listContactInquiries: admin => all, user => their own
async function listContactInquiries(req, res) {
  try {
    // pagination
    let { page = 1, limit = 50 } = req.query;
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 50));
    const skip = (page - 1) * limit;

    // require authentication for listing
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // admin sees all; users see only their own
    const filter = { deletedAt: { $exists: false } }; // exclude soft-deleted by default
    if (!isAdmin(req.user)) {
      filter.user = req.user._id;
    } else {
      // optional admin filters
      if (req.query.inquiryType) filter.inquiryType = sanitizeHtml(req.query.inquiryType);
      if (req.query.email) filter.email = sanitizeHtml(req.query.email);
    }

    const docs = await ContactInquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactInquiry.countDocuments(filter);

    return res.json({
      page,
      limit,
      total,
      data: docs,
    });
  } catch (err) {
    console.error('listContactInquiries error', err);
    return res.status(500).json({ error: 'Unable to list inquiries' });
  }
}

// deleteAllContacts: admin-only, safe confirmation token, supports soft delete (soft=true)
async function deleteAllContacts(req, res) {
  try {
    // require auth
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Forbidden: admin only' });

    const { confirmToken } = req.body || {};
    if (confirmToken !== 'DELETE_ALL') {
      return res.status(400).json({
        error: 'Missing or invalid confirmation token. Set body.confirmToken = "DELETE_ALL".'
      });
    }

    const useSoft = req.query.soft === 'true';

    // Allow optional narrowing (safer) e.g. before=2024-01-01 or inquiryType
    const filter = {};
    if (req.query.inquiryType) filter.inquiryType = sanitizeHtml(req.query.inquiryType);
    if (req.query.email) filter.email = sanitizeHtml(req.query.email);
    if (req.query.before) {
      const date = new Date(req.query.before);
      if (!isNaN(date.getTime())) filter.createdAt = { $lt: date };
    }

    if (useSoft) {
      const update = { $set: { deletedAt: new Date(), deletedBy: req.user._id } };
      const result = await ContactInquiry.updateMany(filter, update);
      return res.json({
        success: true,
        soft: true,
        matched: result.matchedCount ?? result.n ?? 0,
        modified: result.modifiedCount ?? result.nModified ?? 0
      });
    } else {
      // hard delete (transaction when available)
      let deletedCount = 0;
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          const result = await ContactInquiry.deleteMany(filter).session(session);
          deletedCount = result.deletedCount ?? result.n ?? 0;
        });
      } finally {
        session.endSession();
      }
      return res.json({ success: true, soft: false, deleted: deletedCount });
    }
  } catch (err) {
    console.error('deleteAllContacts error', err);
    return res.status(500).json({ error: 'Unable to delete inquiries' });
  }
}



module.exports = {
  createContact,
  getContact,
  listContactInquiries,
  updateContact,
  deleteContact,
  deleteAllContacts,
  getOrListContacts
};
