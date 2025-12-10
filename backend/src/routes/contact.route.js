const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { requireAuth, permit } = require('../middleware/authMiddleware');

router.post('/', ctrl.createContact);

router.get('/admin/contact-inquiries', requireAuth, permit('admin'), ctrl.listContactInquiries);

module.exports = router;
