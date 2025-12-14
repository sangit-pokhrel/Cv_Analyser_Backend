const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  // User endpoints
  createTicket,
  listUserTickets,
  getTicket,
  addMessage,
  rateTicket,
  reopenTicket,
  
  // Staff endpoints
  listAllTickets,
  updateTicket,
  deleteTicket,
  getStats,
  assignTicket,
  bulkUpdateTickets,
  searchAgents,
  listAllAgents,
  getAgentDetails,
  getAgentLeaderboard,
  getAgentReviews,
  
  // Multi-agent endpoints
  acceptTicket,
  declineTicket,
  listPendingTickets
} = require('../controllers/support.controller');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// Multer configuration for ticket attachments
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Max 5 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, PNG, GIF, WEBP) and PDF files are allowed'));
    }
  }
});

// Error handler for multer
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'Each file must be less than 10MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        message: 'Maximum 5 files allowed'
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: 'Upload error',
      message: err.message
    });
  }
  next();
}

// ==================== USER ROUTES ====================

// Create ticket
router.post('/tickets', requireAuth, createTicket);

// List user's tickets
router.get('/tickets', requireAuth, listUserTickets);

// Get single ticket with messages
router.get('/tickets/:id', requireAuth, getTicket);

// Add message to ticket (with optional file attachments)
router.post(
  '/tickets/:id/messages',
  requireAuth,
  upload.array('attachments', 5),
  handleMulterError,
  addMessage
);

// Rate ticket
router.post('/tickets/:id/rate', requireAuth, rateTicket);

// Reopen closed ticket
router.post('/tickets/:id/reopen', requireAuth, reopenTicket);

// ==================== MULTI-AGENT ROUTES ====================

// List tickets pending agent's response (MUST come before /admin/tickets)
router.get(
  '/admin/tickets/pending-my-response',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  listPendingTickets
);

// Accept ticket (agent)
router.post(
  '/admin/tickets/:id/accept',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  acceptTicket
);

// Decline ticket (agent)
router.post(
  '/admin/tickets/:id/decline',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  declineTicket
);

// ==================== STAFF ROUTES ====================

// List all tickets (Admin/CSR/Sales)
router.get(
  '/admin/tickets',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  listAllTickets
);

// Get ticket statistics
router.get(
  '/admin/stats',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  getStats
);

// Update ticket
router.put(
  '/admin/tickets/:id',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  updateTicket
);

// Assign ticket to agent
router.post(
  '/admin/tickets/:id/assign',
  requireAuth,
  permit('admin', 'csr'),
  assignTicket
);

// Bulk update tickets
router.post(
  '/admin/tickets/bulk-update',
  requireAuth,
  permit('admin'),
  bulkUpdateTickets
);

// Delete ticket (Admin only)
router.delete(
  '/admin/tickets/:id',
  requireAuth,
  permit('admin'),
  deleteTicket
);

// ==================== AGENT MANAGEMENT ROUTES ====================

// Search agents (for auto-complete)
router.get(
  '/admin/agents/search',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  searchAgents
);

// Get agent leaderboard
router.get(
  '/admin/agents/leaderboard',
  requireAuth,
  permit('admin', 'csr'),
  getAgentLeaderboard
);

// List all agents
router.get(
  '/admin/agents',
  requireAuth,
  permit('admin', 'csr'),
  listAllAgents
);

// Get agent details
router.get(
  '/admin/agents/:id',
  requireAuth,
  permit('admin', 'csr'),
  getAgentDetails
);

// Get agent reviews
router.get(
  '/admin/agents/:id/reviews',
  requireAuth,
  permit('admin', 'csr', 'sales'),
  getAgentReviews
);

module.exports = router;