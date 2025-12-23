const User = require('../models/user.model');
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcryptjs');


// POST Create user

async function createUser(req, res) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      role, 
      status,
      resumeUrl,
      skills,
      location,
      headline,
      isEmailVerified,
      phoneNumber
    } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeHtml(email.toLowerCase().trim()),
      password: password, // Will be hashed by pre-save hook
      firstName: firstName ? sanitizeHtml(firstName) : undefined,
      lastName: lastName ? sanitizeHtml(lastName) : undefined,
      role: role || 'job_seeker', // Default to 'job_seeker'
      phoneNumber: phoneNumber ? sanitizeHtml(phoneNumber) : undefined,
      status: status || 'pending_verification', // Default status
      resumeUrl: resumeUrl ? sanitizeHtml(resumeUrl) : undefined,
      skills: skills || [],
      location: location ? sanitizeHtml(location) : undefined,
      headline: headline ? sanitizeHtml(headline) : undefined,
      isEmailVerified: isEmailVerified || false
    };

    // Create new user (password will be hashed by pre-save hook)
    const newUser = new User(sanitizedData);
    await newUser.save();

    // Return user (toJSON will automatically exclude sensitive fields)
    return res.status(201).json({ 
      message: "User created successfully",
      user: newUser
    });

  } catch (err) {
    console.error("Create user error:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error", 
        details: err.message 
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(409).json({ 
        error: "User with this email already exists" 
      });
    }

    return res.status(500).json({ error: "Unable to create user" });
  }
}

//PUT Edit user as user and admin


async function updateProfile(req, res) {
  try {
    const {
      firstName,
      lastName,
      headline,
      location,
      resumeUrl,
      skills,
      email,
      phoneNumber
    } = req.body;

    // Fields that users can update in their profile
    const allowedFields = {
      firstName,
      lastName,
      headline,
      location,
      resumeUrl,
      skills,
      email,
      phoneNumber
    };

    // Remove undefined fields
    const updates = {};
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] !== undefined) {
        updates[key] = allowedFields[key] === null ? null : sanitizeHtml(String(allowedFields[key]));
      }
    });

    // Special handling for skills array
    if (skills !== undefined) {
      updates.skills = Array.isArray(skills) 
        ? skills.map(skill => sanitizeHtml(String(skill)))
        : [];
    }

    // Update user profile using the authenticated user's ID from token
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // From auth token
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ 
      message: "Profile updated successfully",
      user: updatedUser 
    });

  } catch (err) {
    console.error("Update profile error:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error", 
        details: err.message 
      });
    }

    return res.status(500).json({ error: "Unable to update profile" });
  }
}

// PUT /users/:id/profile (admin edits any user's profile)
async function updateUserProfileByAdmin(req, res) {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const {
      firstName,
      lastName,
      email,
      role,
      status,
      headline,
      location,
      resumeUrl,
      skills,
      isEmailVerified,
      twoFactorEnabled
    } = req.body;

    // Admin can update more fields than regular users
    const allowedFields = {
      firstName,
      lastName,
      email,
      role,
      status,
      headline,
      location,
      resumeUrl,
      skills,
      isEmailVerified,
      twoFactorEnabled
    };

    // Remove undefined fields and sanitize
    const updates = {};
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] !== undefined) {
        // Handle different field types
        if (key === 'skills') {
          updates[key] = Array.isArray(allowedFields[key]) 
            ? allowedFields[key].map(skill => sanitizeHtml(String(skill)))
            : [];
        } else if (key === 'isEmailVerified' || key === 'twoFactorEnabled') {
          updates[key] = Boolean(allowedFields[key]);
        } else if (key === 'email') {
          updates[key] = sanitizeHtml(String(allowedFields[key])).toLowerCase().trim();
        } else {
          updates[key] = sanitizeHtml(String(allowedFields[key]));
        }
      }
    });

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ 
      message: "User profile updated successfully by admin",
      user: updatedUser 
    });

  } catch (err) {
    console.error("Admin update user error:", err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "Validation error", 
        details: err.message 
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({ 
        error: "Email already exists" 
      });
    }

    return res.status(500).json({ error: "Unable to update user" });
  }
}



// GET /users/me
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch user" });
  }
}

// GET /users/:id (self or admin)
async function getUserById(req, res) {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /users (admin only)
async function listUsers(req, res) {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;

    const query = {};
    if (search) query.fullName = new RegExp(search, 'i');

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Math.min(limit, 200));

    return res.json({ data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to fetch users" });
  }
}

// PUT /users/me  (update base user info)
async function updateMe(req, res) {
  try {
    const allowed = ["fullName", "phoneNumber", "profilePictureUrl"];
    const updates = {};

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = sanitizeHtml(req.body[field]);
      }
    });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    return res.json({ user: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to update user" });
  }
}

// PUT /users/me/change-password
// async function changePassword(req, res) {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword)
//       return res.status(400).json({ error: "Both passwords required" });

//     const user = await User.findById(req.user._id);

//     const valid = await bcrypt.compare(currentPassword, user.password);
//     if (!valid) return res.status(400).json({ error: "Current password incorrect" });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     await user.save();

//     return res.json({ message: "Password changed successfully" });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: "Unable to change password" });
//   }
// }


// PUT /users/me/change-password
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Both passwords required" });

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);

    // Verify current password
    const valid = await user.comparePassword(currentPassword);
    if (!valid) {
      return res.status(400).json({ error: "Current password incorrect" });
    }

    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    
    // Save user (pre-save hook will hash the password)
    await user.save();

    return res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to change password" });
  }
}


// DELETE /users/me (soft delete)
async function deactivateAccount(req, res) {
  try {
    const user = await User.findById(req.user._id);

    user.status = "deactivated";
    await user.save();

    return res.json({ message: "Account deactivated" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unable to deactivate account" });
  }
}

// DELETE /users/me/hard
async function hardDeleteAccount(req, res) {
  try {
    const userId = req.user.id; 

    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Account permanently deleted" });

  } catch (err) {
    console.error("Hard delete error:", err);
    return res.status(500).json({ error: "Unable to delete account" });
  }
}


module.exports = {
  createUser,
  getMe,
  getUserById,
  listUsers,
  updateMe,
  changePassword,
  deactivateAccount,
  hardDeleteAccount,
  updateProfile,
  updateUserProfileByAdmin
};
