// const express = require('express');
// const router = express.Router();
// const { authenticate } = require('../middlewares/auth.middleware');
// const {
//   getMySkills,
//   addSkill,
//   updateSkill,
//   deleteSkill,
//   endorseSkill
// } = require('../controllers/skill.controller');

// // All routes require authentication
// router.use(authenticate);

// // Get all skills & Add skill
// router.route('/')
//   .get(getMySkills)
//   .post(addSkill);

// // Update & Delete skill
// router.route('/:id')
//   .put(updateSkill)
//   .delete(deleteSkill);

// // Endorse skill
// router.post('/:id/endorse', endorseSkill);

// module.exports = router;



const express = require('express');
const router = express.Router();

// Try different auth middleware imports based on your setup
// Uncomment the one that matches your project structure:

// Option 1: If your middleware is named 'authenticate'
// const { authenticate } = require('../middlewares/auth.middleware');

// Option 2: If your middleware is named 'auth' or 'protect'
// const { auth } = require('../middlewares/auth.middleware');
// const { protect } = require('../middlewares/auth.middleware');

// Option 3: If it's a default export
// const authenticate = require('../middlewares/auth.middleware');

// Option 4: If you're using verifyAccessToken from JWT utils
const { verifyAccessToken } = require('../../utils/jwt.utils');
const User = require('../models/user.model');

// Custom auth middleware if none of the above work
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const {
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill,
  endorseSkill
} = require('../controllers/skill.controller');

// All routes require authentication
router.use(authenticate);

// Get all skills & Add skill
router.route('/')
  .get(getMySkills)
  .post(addSkill);

// Update & Delete skill
router.route('/:id')
  .put(updateSkill)
  .delete(deleteSkill);

// Endorse skill
router.post('/:id/endorse', endorseSkill);

module.exports = router;