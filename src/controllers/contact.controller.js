// const sanitizeHtml = require('sanitize-html');
// const mongoose = require('mongoose');
// const ContactInquiry = require('../models/contactInquiry.model');

// const MAX_LIMIT = 200;

// function isAdmin(user) {
//   return user && user.role === 'admin';
// }

// function sanitizeFields(body = {}) {
//   return {
//     name: sanitizeHtml(body.name || ''),
//     email: sanitizeHtml(body.email || ''),
//     phone: sanitizeHtml(body.phone || ''),
//     subject: sanitizeHtml(body.subject || ''),
//     message: sanitizeHtml(body.message || ''),
//     inquiryType: sanitizeHtml(body.inquiryType || 'general'),
//     attachmentUrl: sanitizeHtml(body.attachmentUrl || ''),
//   };
// }

// async function createContact(req, res) {
//   try {
//     const userId = req.user ? req.user._id : null;
//     const fields = sanitizeFields(req.body);

//     const obj = {
//       user: userId,
//       ...fields,
//     };

//     const saved = await ContactInquiry.create(obj);
//     return res.status(201).json({ inquiry: saved });
//   } catch (err) {
//     console.error('createContact error', err);
//     return res.status(500).json({ error: 'Unable to create contact inquiry' });
//   }
// }

// async function getOrListContacts(req, res) {
//   try {
//     const id = req.params.id;

  
//     if (id) {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ error: 'Invalid inquiry id' });
//       }
//       const doc = await ContactInquiry.findById(id).populate('user', 'fullName email');
//       if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

//       if (!isAdmin(req.user) && (!req.user || String(doc.user?._id || doc.user) !== String(req.user._id))) {
//         return res.status(403).json({ error: 'Forbidden' });
//       }
//       return res.json({ inquiry: doc });
//     }

//     if (!req.user) return res.status(401).json({ error: 'Authentication required' });

//     let { page = 1, limit = 50 } = req.query;
//     page = Math.max(1, Number(page) || 1);
//     limit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 50));
//     const skip = (page - 1) * limit;

//     const filter = { deletedAt: { $exists: false } };
//     if (!isAdmin(req.user)) {
//       filter.user = req.user._id;
//     } else {
//       if (req.query.inquiryType) filter.inquiryType = sanitizeHtml(req.query.inquiryType);
//       if (req.query.email) filter.email = sanitizeHtml(req.query.email);
//     }

//     const [docs, total] = await Promise.all([
//       ContactInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user','fullName email'),
//       ContactInquiry.countDocuments(filter),
//     ]);

//     return res.json({ page, limit, total, data: docs });
//   } catch (err) {
//     console.error('getOrListContacts error', err);
//     return res.status(500).json({ error: 'Unable to fetch inquiries' });
//   }
// }

// async function getContact(req, res) {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid inquiry id' });
//     }

//     const doc = await ContactInquiry.findById(id);
//     if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

//     // if not admin, ensure owner
//     if (!isAdmin(req.user) && (!req.user || String(doc.user) !== String(req.user._id))) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     return res.json({ inquiry: doc });
//   } catch (err) {
//     console.error('getContact error', err);
//     return res.status(500).json({ error: 'Unable to retrieve inquiry' });
//   }
// }


// async function updateContact(req, res) {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid inquiry id' });
//     }

//     const doc = await ContactInquiry.findById(id);
//     if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

//     // authorization: only owner or admin
//     if (!isAdmin(req.user) && (!req.user || String(doc.user) !== String(req.user._id))) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     const fields = sanitizeFields(req.body);

//     // update allowed fields only (do not allow setting 'user' or createdAt)
//     const updated = await ContactInquiry.findByIdAndUpdate(
//       id,
//       { $set: fields },
//       { new: true, runValidators: true }
//     );

//     return res.json({ inquiry: updated });
//   } catch (err) {
//     console.error('updateContact error', err);
//     return res.status(500).json({ error: 'Unable to update inquiry' });
//   }
// }

// async function deleteContact(req, res) {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: 'Invalid inquiry id' });
//     }

//     const doc = await ContactInquiry.findById(id);
//     if (!doc) return res.status(404).json({ error: 'Inquiry not found' });

//     // authorization: only owner or admin
//     if (!isAdmin(req.user) && (!req.user || String(doc.user) !== String(req.user._id))) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     await ContactInquiry.findByIdAndDelete(id);
//     return res.json({ success: true });
//   } catch (err) {
//     console.error('deleteContact error', err);
//     return res.status(500).json({ error: 'Unable to delete inquiry' });
//   }
// }
// // listContactInquiries: admin => all, user => their own
// async function listContactInquiries(req, res) {
//   try {
//     // pagination
//     let { page = 1, limit = 50 } = req.query;
//     page = Math.max(1, Number(page) || 1);
//     limit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 50));
//     const skip = (page - 1) * limit;

//     // require authentication for listing
//     if (!req.user) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }

//     // admin sees all; users see only their own
//     const filter = { deletedAt: { $exists: false } }; // exclude soft-deleted by default
//     if (!isAdmin(req.user)) {
//       filter.user = req.user._id;
//     } else {
//       // optional admin filters
//       if (req.query.inquiryType) filter.inquiryType = sanitizeHtml(req.query.inquiryType);
//       if (req.query.email) filter.email = sanitizeHtml(req.query.email);
//     }

//     const docs = await ContactInquiry.find(filter)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await ContactInquiry.countDocuments(filter);

//     return res.json({
//       page,
//       limit,
//       total,
//       data: docs,
//     });
//   } catch (err) {
//     console.error('listContactInquiries error', err);
//     return res.status(500).json({ error: 'Unable to list inquiries' });
//   }
// }

// // deleteAllContacts: admin-only, safe confirmation token, supports soft delete (soft=true)
// async function deleteAllContacts(req, res) {
//   try {
//     // require auth
//     if (!req.user) return res.status(401).json({ error: 'Authentication required' });
//     if (!isAdmin(req.user)) return res.status(403).json({ error: 'Forbidden: admin only' });

//     const { confirmToken } = req.body || {};
//     if (confirmToken !== 'DELETE_ALL') {
//       return res.status(400).json({
//         error: 'Missing or invalid confirmation token. Set body.confirmToken = "DELETE_ALL".'
//       });
//     }

//     const useSoft = req.query.soft === 'true';

//     // Allow optional narrowing (safer) e.g. before=2024-01-01 or inquiryType
//     const filter = {};
//     if (req.query.inquiryType) filter.inquiryType = sanitizeHtml(req.query.inquiryType);
//     if (req.query.email) filter.email = sanitizeHtml(req.query.email);
//     if (req.query.before) {
//       const date = new Date(req.query.before);
//       if (!isNaN(date.getTime())) filter.createdAt = { $lt: date };
//     }

//     if (useSoft) {
//       const update = { $set: { deletedAt: new Date(), deletedBy: req.user._id } };
//       const result = await ContactInquiry.updateMany(filter, update);
//       return res.json({
//         success: true,
//         soft: true,
//         matched: result.matchedCount ?? result.n ?? 0,
//         modified: result.modifiedCount ?? result.nModified ?? 0
//       });
//     } else {
//       // hard delete (transaction when available)
//       let deletedCount = 0;
//       const session = await mongoose.startSession();
//       try {
//         await session.withTransaction(async () => {
//           const result = await ContactInquiry.deleteMany(filter).session(session);
//           deletedCount = result.deletedCount ?? result.n ?? 0;
//         });
//       } finally {
//         session.endSession();
//       }
//       return res.json({ success: true, soft: false, deleted: deletedCount });
//     }
//   } catch (err) {
//     console.error('deleteAllContacts error', err);
//     return res.status(500).json({ error: 'Unable to delete inquiries' });
//   }
// }



// module.exports = {
//   createContact,
//   getContact,
//   listContactInquiries,
//   updateContact,
//   deleteContact,
//   deleteAllContacts,
//   getOrListContacts
// };


const sanitizeHtml = require('sanitize-html');
const mongoose = require('mongoose');
const ContactInquiry = require('../models/contactInquiry.model');
const ContactRateLimit = require('../models/contactRateLimit.model');
const BlockedIP = require('../models/blockedIP.model');

const MAX_LIMIT = 200;
const MAX_INQUIRIES_PER_DAY = 3;
const COOLDOWN_MINUTES = 5;
const BLOCK_AFTER_VIOLATIONS = 5; // Block IP after 5 violations

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

// Helper to get client IP
function getClientIP(req) {
  // Check various headers for the real IP (useful when behind proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can be comma-separated, take the first one
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.ip ||
         'unknown';
}

// ==================== PUBLIC ENDPOINT (No Auth Required) ====================

// CREATE - Public contact form submission with rate limiting
async function createContact(req, res) {
  try {
    const clientIP = getClientIP(req);
    
    // Check if IP is blocked
    const blockStatus = await BlockedIP.isBlocked(clientIP);
    if (blockStatus.blocked) {
      return res.status(403).json({
        error: 'Your IP has been blocked due to excessive requests.',
        reason: blockStatus.reason,
        blockedUntil: blockStatus.blockedUntil
      });
    }
    
    // Check rate limit
    const rateLimitStatus = await ContactRateLimit.checkRateLimit(
      clientIP, 
      MAX_INQUIRIES_PER_DAY, 
      COOLDOWN_MINUTES
    );
    
    if (!rateLimitStatus.allowed) {
      // Track violation attempts
      const stats = await ContactRateLimit.getStats(clientIP);
      
      // If user keeps trying after hitting limit, consider blocking
      if (rateLimitStatus.reason === 'daily_limit' && stats.todayCount >= MAX_INQUIRIES_PER_DAY + BLOCK_AFTER_VIOLATIONS) {
        await BlockedIP.blockIP(clientIP, 'Repeated rate limit violations', 24); // Block for 24 hours
        return res.status(403).json({
          error: 'Your IP has been temporarily blocked due to repeated rate limit violations.',
          blockedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
      }
      
      return res.status(429).json({
        error: rateLimitStatus.message,
        reason: rateLimitStatus.reason,
        remainingToday: rateLimitStatus.remainingToday,
        retryAfter: rateLimitStatus.retryAfter || null,
        nextAllowedAt: rateLimitStatus.nextAllowedAt
      });
    }
    
    // Validate required fields
    const fields = sanitizeFields(req.body);
    
    if (!fields.name || !fields.email || !fields.subject || !fields.message) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'subject', 'message']
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fields.email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }
    
    // Optional: Get user ID if authenticated (but not required)
    const userId = req.user ? req.user._id : null;

    const obj = {
      user: userId,
      ...fields,
      status: 'new',
      ipAddress: clientIP, // Track IP for reference
      submittedAt: new Date()
    };

    const saved = await ContactInquiry.create(obj);
    
    // Record the inquiry for rate limiting
    await ContactRateLimit.recordInquiry(clientIP);
    
    // Get updated rate limit info
    const updatedRateLimit = await ContactRateLimit.checkRateLimit(
      clientIP, 
      MAX_INQUIRIES_PER_DAY, 
      COOLDOWN_MINUTES
    );
    
    return res.status(201).json({ 
      success: true,
      inquiry: {
        id: saved._id,
        name: saved.name,
        email: saved.email,
        subject: saved.subject,
        inquiryType: saved.inquiryType,
        createdAt: saved.createdAt
      },
      rateLimit: {
        remainingToday: updatedRateLimit.remainingToday,
        nextAllowedAt: new Date(Date.now() + COOLDOWN_MINUTES * 60 * 1000)
      }
    });
  } catch (err) {
    console.error('createContact error', err);
    return res.status(500).json({ error: 'Unable to create contact inquiry' });
  }
}

// ==================== USER ENDPOINTS (Auth Required) ====================

// GET MY INQUIRIES - Users can only see their own
async function getMyInquiries(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let { page = 1, limit = 50 } = req.query;
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 50));
    const skip = (page - 1) * limit;

    const filter = { 
      user: req.user._id,
      deletedAt: { $exists: false } 
    };

    const [docs, total] = await Promise.all([
      ContactInquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ContactInquiry.countDocuments(filter),
    ]);

    return res.json({ 
      success: true,
      page, 
      limit, 
      total, 
      data: docs 
    });
  } catch (err) {
    console.error('getMyInquiries error', err);
    return res.status(500).json({ error: 'Unable to fetch your inquiries' });
  }
}

// GET SINGLE INQUIRY - Users can only see their own
async function getMyInquiry(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id);
    if (!doc) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (!req.user || String(doc.user) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own inquiries' });
    }

    return res.json({ 
      success: true,
      inquiry: doc 
    });
  } catch (err) {
    console.error('getMyInquiry error', err);
    return res.status(500).json({ error: 'Unable to retrieve inquiry' });
  }
}

// DELETE OWN INQUIRY - Users can delete their own inquiries
async function deleteMyInquiry(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id);
    if (!doc) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    if (!req.user || String(doc.user) !== String(req.user._id)) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own inquiries' });
    }

    await ContactInquiry.findByIdAndDelete(id);
    return res.json({ 
      success: true,
      message: 'Inquiry deleted successfully' 
    });
  } catch (err) {
    console.error('deleteMyInquiry error', err);
    return res.status(500).json({ error: 'Unable to delete inquiry' });
  }
}

// ==================== ADMIN ENDPOINTS ====================

// ADMIN - Get all inquiries with filters
async function adminGetAllInquiries(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    let { page = 1, limit = 50 } = req.query;
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 50));
    const skip = (page - 1) * limit;

    const filter = { deletedAt: { $exists: false } };

    if (req.query.status) {
      filter.status = sanitizeHtml(req.query.status);
    }
    if (req.query.inquiryType) {
      filter.inquiryType = sanitizeHtml(req.query.inquiryType);
    }
    if (req.query.email) {
      filter.email = { $regex: sanitizeHtml(req.query.email), $options: 'i' };
    }

    const [docs, total] = await Promise.all([
      ContactInquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email'),
      ContactInquiry.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      page,
      limit,
      total,
      data: docs,
      meta: {
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('adminGetAllInquiries error', err);
    return res.status(500).json({ error: 'Unable to fetch inquiries' });
  }
}

// ADMIN - Get single inquiry (any inquiry)
async function adminGetInquiry(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id).populate('user', 'firstName lastName email');
    if (!doc) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    return res.json({ 
      success: true,
      inquiry: doc 
    });
  } catch (err) {
    console.error('adminGetInquiry error', err);
    return res.status(500).json({ error: 'Unable to retrieve inquiry' });
  }
}

// ADMIN - Update inquiry (can update status and all fields)
async function adminUpdateInquiry(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id);
    if (!doc) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const fields = sanitizeFields(req.body);
    const updateData = { ...fields };
    
    if (req.body.status) {
      if (!['new', 'contacted', 'resolved'].includes(req.body.status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      updateData.status = req.body.status;
    }

    const updated = await ContactInquiry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName email');

    return res.json({ 
      success: true,
      inquiry: updated 
    });
  } catch (err) {
    console.error('adminUpdateInquiry error', err);
    return res.status(500).json({ error: 'Unable to update inquiry' });
  }
}

// ADMIN - Delete inquiry
async function adminDeleteInquiry(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid inquiry id' });
    }

    const doc = await ContactInquiry.findById(id);
    if (!doc) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    await ContactInquiry.findByIdAndDelete(id);
    return res.json({ 
      success: true,
      message: 'Inquiry deleted successfully' 
    });
  } catch (err) {
    console.error('adminDeleteInquiry error', err);
    return res.status(500).json({ error: 'Unable to delete inquiry' });
  }
}

// ADMIN - Delete all inquiries (with confirmation)
async function adminDeleteAllInquiries(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { confirmToken } = req.body || {};
    if (confirmToken !== 'DELETE_ALL') {
      return res.status(400).json({
        error: 'Missing or invalid confirmation token. Set body.confirmToken = "DELETE_ALL".'
      });
    }

    const filter = { deletedAt: { $exists: false } };

    if (req.query.status) {
      filter.status = sanitizeHtml(req.query.status);
    }
    if (req.query.inquiryType) {
      filter.inquiryType = sanitizeHtml(req.query.inquiryType);
    }
    if (req.query.before) {
      const date = new Date(req.query.before);
      if (!isNaN(date.getTime())) {
        filter.createdAt = { $lt: date };
      }
    }

    const result = await ContactInquiry.deleteMany(filter);
    
    return res.json({ 
      success: true,
      deleted: result.deletedCount || 0,
      message: `${result.deletedCount || 0} inquiries deleted successfully`
    });
  } catch (err) {
    console.error('adminDeleteAllInquiries error', err);
    return res.status(500).json({ error: 'Unable to delete inquiries' });
  }
}

// ==================== ADMIN - IP Management ====================

// ADMIN - Get all blocked IPs
async function adminGetBlockedIPs(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    let { page = 1, limit = 50 } = req.query;
    page = Math.max(1, Number(page) || 1);
    limit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 50));
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      BlockedIP.find()
        .sort({ blockedAt: -1 })
        .skip(skip)
        .limit(limit),
      BlockedIP.countDocuments(),
    ]);

    return res.json({
      success: true,
      page,
      limit,
      total,
      data: docs
    });
  } catch (err) {
    console.error('adminGetBlockedIPs error', err);
    return res.status(500).json({ error: 'Unable to fetch blocked IPs' });
  }
}

// ADMIN - Block an IP manually
async function adminBlockIP(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { ip, reason, durationHours } = req.body;
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    const blocked = await BlockedIP.blockIP(
      ip, 
      reason || 'Manually blocked by admin',
      durationHours || null
    );

    return res.json({
      success: true,
      message: `IP ${ip} has been blocked`,
      data: blocked
    });
  } catch (err) {
    console.error('adminBlockIP error', err);
    return res.status(500).json({ error: 'Unable to block IP' });
  }
}

// ADMIN - Unblock an IP
async function adminUnblockIP(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { ip } = req.params;
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    const result = await BlockedIP.unblockIP(ip);
    
    if (!result) {
      return res.status(404).json({ error: 'IP not found in blocked list' });
    }

    return res.json({
      success: true,
      message: `IP ${ip} has been unblocked`
    });
  } catch (err) {
    console.error('adminUnblockIP error', err);
    return res.status(500).json({ error: 'Unable to unblock IP' });
  }
}

// ADMIN - Get rate limit stats for an IP
async function adminGetIPStats(req, res) {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { ip } = req.params;
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    const stats = await ContactRateLimit.getStats(ip);
    const blockStatus = await BlockedIP.isBlocked(ip);

    return res.json({
      success: true,
      ip,
      stats,
      blocked: blockStatus
    });
  } catch (err) {
    console.error('adminGetIPStats error', err);
    return res.status(500).json({ error: 'Unable to get IP stats' });
  }
}

module.exports = {
  // Public endpoint (no auth required)
  createContact,
  
  // User endpoints (auth required)
  getMyInquiries,
  getMyInquiry,
  deleteMyInquiry,
  
  // Admin endpoints
  adminGetAllInquiries,
  adminGetInquiry,
  adminUpdateInquiry,
  adminDeleteInquiry,
  adminDeleteAllInquiries,
  
  // Admin IP management
  adminGetBlockedIPs,
  adminBlockIP,
  adminUnblockIP,
  adminGetIPStats
};