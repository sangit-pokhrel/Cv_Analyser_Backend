

// const express = require('express');
// const router = express.Router();
// const User = require('../models/user.model');
// const Job = require('../models/job.model');
// const JobApplication = require('../models/jobApplication.model');
// const LoginAttempt = require('../models/loginAttempt.model');
// const { requireAuth, permit } = require('../middlewares/auth.middleware');

// // Existing routes
// router.get('/users', requireAuth, permit('admin'), async (req, res) => {
//   try {
//     const { page = 1, limit = 50 } = req.query;
//     const users = await User.find().select('-password').skip((page-1)*limit).limit(Math.min(200, Number(limit)));
//     return res.json({ data: users });
//   } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to list users' }); }
// });

// router.put('/users/:id/status', requireAuth, permit('admin'), async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     user.status = req.body.status || user.status;
//     await user.save();
//     return res.json({ message: 'User status updated', user: user.toJSON() });
//   } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to update status' }); }
// });

// router.get('/jobs', requireAuth, permit('admin'), async (req, res) => {
//   try {
//     const jobs = await Job.find().limit(200).populate('createdBy','fullName email');
//     return res.json({ data: jobs });
//   } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to list jobs' }); }
// });

// router.put('/applications/:id/status', requireAuth, permit('admin'), async (req, res) => {
//   try {
//     const appId = req.params.id;
//     const status = req.body.status;
//     if (!status) return res.status(400).json({ error: 'status required' });
//     const app = await JobApplication.findById(appId);
//     if (!app) return res.status(404).json({ error: 'Application not found' });
//     app.status = status;
//     if (req.body.reviewedDate) app.reviewedDate = req.body.reviewedDate;
//     if (req.body.notes) app.notes = req.body.notes;
//     await app.save();

//     return res.json({ message: 'Application updated', application: app });
//   } catch (err) { console.error(err); return res.status(500).json({ error: 'Unable to update application' }); }
// });

// // NEW: Login attempt management routes
// router.get('/blocked-users', requireAuth, permit('admin'), async (req, res) => {
//   try {
//     const blockedUsers = await LoginAttempt.find({ isBlocked: true })
//       .sort({ lastAttemptAt: -1 })
//       .limit(100);

//     return res.json({ 
//       success: true,
//       data: blockedUsers,
//       total: blockedUsers.length
//     });
//   } catch (err) { 
//     console.error(err); 
//     return res.status(500).json({ error: 'Unable to fetch blocked users' }); 
//   }
// });

// router.post('/unblock-user', requireAuth, permit('admin'), async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     if (!email) {
//       return res.status(400).json({ error: 'Email required' });
//     }

//     const loginAttempt = await LoginAttempt.findOne({ email: email.toLowerCase() });

//     if (!loginAttempt) {
//       return res.status(404).json({ error: 'No login attempt record found for this email' });
//     }

//     // Reset attempts
//     await loginAttempt.resetAttempts();

//     return res.json({ 
//       success: true,
//       message: `Login attempts reset for ${email}` 
//     });
//   } catch (err) { 
//     console.error(err); 
//     return res.status(500).json({ error: 'Unable to unblock user' }); 
//   }
// });

// router.get('/login-attempts', requireAuth, permit('admin'), async (req, res) => {
//   try {
//     const { email } = req.query;
    
//     let query = {};
//     if (email) {
//       query.email = email.toLowerCase();
//     }

//     const attempts = await LoginAttempt.find(query)
//       .sort({ lastAttemptAt: -1 })
//       .limit(50);

//     return res.json({ 
//       success: true,
//       data: attempts,
//       total: attempts.length
//     });
//   } catch (err) { 
//     console.error(err); 
//     return res.status(500).json({ error: 'Unable to fetch login attempts' }); 
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const Job = require('../models/job.model');
const JobApplication = require('../models/jobApplication.model');
const LoginAttempt = require('../models/loginAttempt.model');
const { requireAuth, permit } = require('../middlewares/auth.middleware');

// ==================== USER MANAGEMENT - FULL CRUD ====================

// GET all users (enhanced with pagination meta)
router.get('/users', requireAuth, permit('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    const limitNum = Math.min(200, Number(limit));
    
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    return res.json({ 
      success: true,
      data: users,
      meta: {
        total,
        page: Number(page),
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to list users' }); 
  }
});

// GET single user by ID
router.get('/users/:id', requireAuth, permit('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ success: true, data: user });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to fetch user' }); 
  }
});

// UPDATE user - full profile update
router.put('/users/:id', requireAuth, permit('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update all fields that are provided
    const allowedFields = [
      'firstName', 'lastName', 'phoneNumber', 'location', 'headline',
      'role', 'status', 'skills', 'resumeUrl', 'profilePictureUrl',
      'isEmailVerified', 'twoFactorEnabled'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    
    return res.json({ 
      success: true,
      message: 'User updated successfully', 
      data: user.toJSON() 
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to update user' }); 
  }
});

// UPDATE user status only (keeping for backward compatibility)
router.put('/users/:id/status', requireAuth, permit('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.status = req.body.status || user.status;
    await user.save();
    
    return res.json({ 
      success: true,
      message: 'User status updated', 
      user: user.toJSON() 
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to update status' }); 
  }
});

// DELETE user
router.delete('/users/:id', requireAuth, permit('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    
    return res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to delete user' }); 
  }
});

// ==================== JOB MANAGEMENT ====================

router.get('/jobs', requireAuth, permit('admin'), async (req, res) => {
  try {
    const jobs = await Job.find()
      .limit(200)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    return res.json({ success: true, data: jobs });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to list jobs' }); 
  }
});

// ==================== APPLICATION MANAGEMENT ====================

router.put('/applications/:id/status', requireAuth, permit('admin'), async (req, res) => {
  try {
    const appId = req.params.id;
    const status = req.body.status;
    
    if (!status) {
      return res.status(400).json({ error: 'status required' });
    }
    
    const app = await JobApplication.findById(appId);
    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    app.status = status;
    if (req.body.reviewedDate) app.reviewedDate = req.body.reviewedDate;
    if (req.body.notes) app.notes = req.body.notes;
    await app.save();

    return res.json({ 
      success: true,
      message: 'Application updated', 
      application: app 
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to update application' }); 
  }
});

// ==================== LOGIN ATTEMPT MANAGEMENT ====================

router.get('/blocked-users', requireAuth, permit('admin'), async (req, res) => {
  try {
    const blockedUsers = await LoginAttempt.find({ isBlocked: true })
      .sort({ lastAttemptAt: -1 })
      .limit(100);

    return res.json({ 
      success: true,
      data: blockedUsers,
      total: blockedUsers.length
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to fetch blocked users' }); 
  }
});

router.post('/unblock-user', requireAuth, permit('admin'), async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const loginAttempt = await LoginAttempt.findOne({ email: email.toLowerCase() });

    if (!loginAttempt) {
      return res.status(404).json({ error: 'No login attempt record found for this email' });
    }

    await loginAttempt.resetAttempts();

    return res.json({ 
      success: true,
      message: `Login attempts reset for ${email}` 
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to unblock user' }); 
  }
});

router.get('/login-attempts', requireAuth, permit('admin'), async (req, res) => {
  try {
    const { email } = req.query;
    
    let query = {};
    if (email) {
      query.email = email.toLowerCase();
    }

    const attempts = await LoginAttempt.find(query)
      .sort({ lastAttemptAt: -1 })
      .limit(50);

    return res.json({ 
      success: true,
      data: attempts,
      total: attempts.length
    });
  } catch (err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Unable to fetch login attempts' }); 
  }
});

module.exports = router;