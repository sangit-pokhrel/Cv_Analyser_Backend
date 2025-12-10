const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/support.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

router.post('/tickets', requireAuth, ctrl.createTicket);

router.get('/tickets', requireAuth, ctrl.listTickets);

router.get('/tickets/:id', requireAuth, ctrl.getTicket);

router.post('/tickets/:id/messages', requireAuth, ctrl.addMessage);

module.exports = router;
