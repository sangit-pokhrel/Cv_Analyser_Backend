
// const express = require('express');
// const router = express.Router();

// const {
//   // User endpoints
//   createContact,
//   getMyInquiries,
//   getMyInquiry,
//   deleteMyInquiry,
  
//   // Admin endpoints
//   adminGetAllInquiries,
//   adminGetInquiry,
//   adminCreateInquiry,
//   adminUpdateInquiry,
//   adminDeleteInquiry,
//   adminDeleteAllInquiries
// } = require('../controllers/contact.controller');

// const { requireAuth, permit } = require('../middlewares/auth.middleware');

// // ==================== USER ROUTES ====================
// // Users can only create and view their own inquiries

// // Create new inquiry (user)
// router.post('/', requireAuth, createContact);

// // Get my inquiries (user only sees their own)
// router.get('/my-inquiries', requireAuth, getMyInquiries);

// // Get single inquiry (user only sees their own)
// router.get('/my-inquiries/:id', requireAuth, getMyInquiry);

// // Delete own inquiry
// router.delete('/my-inquiries/:id', requireAuth, deleteMyInquiry);

// // ==================== ADMIN ROUTES ====================
// // Admin has full control over all inquiries

// // Get all inquiries (admin only)
// router.get('/admin/all', requireAuth, permit('admin'), adminGetAllInquiries);

// // Get single inquiry (admin can see any)
// router.get('/admin/:id', requireAuth, permit('admin'), adminGetInquiry);

// // Create inquiry (admin can create on behalf of users)
// router.post('/admin/create', requireAuth, permit('admin'), adminCreateInquiry);

// // Update inquiry (admin can update status and all fields)
// router.put('/admin/:id', requireAuth, permit('admin'), adminUpdateInquiry);

// // Delete single inquiry (admin)
// router.delete('/admin/:id', requireAuth, permit('admin'), adminDeleteInquiry);

// // Delete all inquiries (admin only, requires confirmation)
// router.post('/admin/delete-all', requireAuth, permit('admin'), adminDeleteAllInquiries);

// module.exports = router;\



const express = require('express');
const router = express.Router();
const {requireAuth, permit} = require("../middlewares/auth.middleware")
const {
  // Public endpoint
  createContact,
  
  // User endpoints
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
} = require('../controllers/contact.controller');
// Import your auth middleware (adjust path as needed)
// const { protect, adminOnly } = require('../middleware/auth.middleware');

// For now, we'll create placeholder middleware - replace with your actual implementation
const optionalAuth = (req, res, next) => {
  // This middleware allows requests with or without authentication
  // If token is provided, it will attach user to req.user
  // Otherwise, req.user will be undefined
  
  // Your actual implementation should check for JWT token here
  // and attach decoded user to req.user if valid
  
  next();
};



// ==================== PUBLIC ROUTES ====================

// POST /api/v1/contact - Create new contact inquiry (NO AUTH REQUIRED)
// Rate limited by IP: max 3 per day, 5 min cooldown between requests
router.post('/', createContact);

// ==================== USER ROUTES (Auth Required) ====================

// GET /api/v1/contact/my - Get user's own inquiries
router.get('/my', requireAuth, getMyInquiries);

// GET /api/v1/contact/my/:id - Get specific inquiry (user's own)
router.get('/my/:id', requireAuth, getMyInquiry);

// DELETE /api/v1/contact/my/:id - Delete user's own inquiry
router.delete('/my/:id', requireAuth, deleteMyInquiry);

// ==================== ADMIN ROUTES ====================

// GET /api/v1/contact/admin - Get all inquiries (admin only)
router.get('/admin', requireAuth, permit("admin"), adminGetAllInquiries);

// GET /api/v1/contact/admin/:id - Get specific inquiry (admin only)
router.get('/admin/:id', requireAuth, permit("admin"), adminGetInquiry);

// PUT /api/v1/contact/admin/:id - Update inquiry (admin only)
router.put('/admin/:id', requireAuth, permit("admin"), adminUpdateInquiry);

// DELETE /api/v1/contact/admin/:id - Delete inquiry (admin only)
router.delete('/admin/:id', requireAuth, permit("admin"), adminDeleteInquiry);

// DELETE /api/v1/contact/admin - Delete all inquiries (admin only, requires confirmation)
router.delete('/admin', requireAuth, permit("admin"), adminDeleteAllInquiries);

// ==================== ADMIN IP MANAGEMENT ROUTES ====================

// GET /api/v1/contact/admin/blocked-ips - Get all blocked IPs
router.get('/admin/blocked-ips', requireAuth, permit("admin"), adminGetBlockedIPs);

// POST /api/v1/contact/admin/block-ip - Block an IP
router.post('/admin/block-ip', requireAuth, permit("admin"), adminBlockIP);

// DELETE /api/v1/contact/admin/unblock-ip/:ip - Unblock an IP
router.delete('/admin/unblock-ip/:ip', requireAuth, permit("admin"), adminUnblockIP);

// GET /api/v1/contact/admin/ip-stats/:ip - Get rate limit stats for an IP
router.get('/admin/ip-stats/:ip', requireAuth, permit("admin"), adminGetIPStats);

module.exports = router;