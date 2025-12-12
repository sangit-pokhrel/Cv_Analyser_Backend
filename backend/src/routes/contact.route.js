const express = require('express');
const router = express.Router();

const {
  createContact,
  getOrListContacts,
  updateContact,
  deleteContact,
  deleteAllContacts
} = require('../controllers/contact.controller');

const { requireAuth } = require('../middlewares/auth.middleware');

// Create (if you want public create, remove requireAuth here)
router.post('/', requireAuth, createContact);

// Get single by id (must come BEFORE the list route)
router.get('/:id', requireAuth, getOrListContacts);

// List (admin => all, user => only theirs)
router.get('/', requireAuth, getOrListContacts);

// Update
router.put('/:id', requireAuth, updateContact);

// Delete single
router.delete('/:id', requireAuth, deleteContact);

// Admin-only bulk delete
router.post('/delete-all', requireAuth, deleteAllContacts);

module.exports = router;
