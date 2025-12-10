const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contact.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

router.post('/', ctrl.createContact);

router.get('/admin/contact-inquiries', requireAuth, permit('admin'), ctrl.listContactInquiries);

module.exports = router;
