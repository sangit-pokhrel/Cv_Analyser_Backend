// const express = require('express');
// const router = express.Router();

// const {
//   createContact,
//   getOrListContacts,
//   updateContact,
//   deleteContact,
//   deleteAllContacts
// } = require('../controllers/contact.controller');

// const { requireAuth } = require('../middlewares/auth.middleware');

// // Create (if you want public create, remove requireAuth here)
// router.post('/', requireAuth, createContact);

// // Get single by id (must come BEFORE the list route)
// router.get('/:id', requireAuth, getOrListContacts);

// // List (admin => all, user => only theirs)
// router.get('/', requireAuth, getOrListContacts);

// // Update
// router.put('/:id', requireAuth, updateContact);

// // Delete single
// router.delete('/:id', requireAuth, deleteContact);

// // Admin-only bulk delete
// router.post('/delete-all', requireAuth, deleteAllContacts);

// module.exports = router;
const express = require('express');
const router = express.Router();

const {
  // User endpoints
  createContact,
  getMyInquiries,
  getMyInquiry,
  deleteMyInquiry,
  
  // Admin endpoints
  adminGetAllInquiries,
  adminGetInquiry,
  adminCreateInquiry,
  adminUpdateInquiry,
  adminDeleteInquiry,
  adminDeleteAllInquiries
} = require('../controllers/contact.controller');

const { requireAuth, permit } = require('../middlewares/auth.middleware');

// ==================== USER ROUTES ====================
// Users can only create and view their own inquiries

// Create new inquiry (user)
router.post('/', requireAuth, createContact);

// Get my inquiries (user only sees their own)
router.get('/my-inquiries', requireAuth, getMyInquiries);

// Get single inquiry (user only sees their own)
router.get('/my-inquiries/:id', requireAuth, getMyInquiry);

// Delete own inquiry
router.delete('/my-inquiries/:id', requireAuth, deleteMyInquiry);

// ==================== ADMIN ROUTES ====================
// Admin has full control over all inquiries

// Get all inquiries (admin only)
router.get('/admin/all', requireAuth, permit('admin'), adminGetAllInquiries);

// Get single inquiry (admin can see any)
router.get('/admin/:id', requireAuth, permit('admin'), adminGetInquiry);

// Create inquiry (admin can create on behalf of users)
router.post('/admin/create', requireAuth, permit('admin'), adminCreateInquiry);

// Update inquiry (admin can update status and all fields)
router.put('/admin/:id', requireAuth, permit('admin'), adminUpdateInquiry);

// Delete single inquiry (admin)
router.delete('/admin/:id', requireAuth, permit('admin'), adminDeleteInquiry);

// Delete all inquiries (admin only, requires confirmation)
router.post('/admin/delete-all', requireAuth, permit('admin'), adminDeleteAllInquiries);

module.exports = router;