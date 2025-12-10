const sanitizeHtml = require('sanitize-html');
const UserProfile = require('../models/userProfile.model');

async function getMyProfile(req, res) {
  try {
    const profile = await UserProfile.findOne({ user: req.user._id });
    return res.json({ profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to fetch profile' });
  }
}

async function upsertProfile(req, res) {
  try {
    const payload = {
      bio: req.body.bio ? sanitizeHtml(req.body.bio) : undefined,
      skills: Array.isArray(req.body.skills) ? req.body.skills : (req.body.skills ? [req.body.skills] : []),
      experienceYears: req.body.experienceYears,
      education: req.body.education,
      location: req.body.location,
      resumeUrl: req.body.resumeUrl,
      cvFileUrl: req.body.cvFileUrl,
      linkedinUrl: req.body.linkedinUrl,
      portfolioUrl: req.body.portfolioUrl,
      preferences: req.body.preferences || {}
    };

    let profile = await UserProfile.findOne({ user: req.user._id });
    if (profile) {
      Object.assign(profile, payload);
      await profile.save();
    } else {
      profile = await UserProfile.create(Object.assign({ user: req.user._id }, payload));
    }

    return res.json({ profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Unable to save profile' });
  }
}

module.exports = { getMyProfile, upsertProfile };
