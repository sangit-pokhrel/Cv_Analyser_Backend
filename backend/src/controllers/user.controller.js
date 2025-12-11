const User = require('../models/user.model');
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcryptjs');

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
async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "Both passwords required" });

    const user = await User.findById(req.user._id);

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: "Current password incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

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
  getMe,
  getUserById,
  listUsers,
  updateMe,
  changePassword,
  deactivateAccount,
  hardDeleteAccount
};
