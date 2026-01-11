const Skill = require('../models/skill.model');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/Apierror');
const ApiResponse = require('../../utils/Apiresponse');

// @desc    Get all skills for logged-in user
// @route   GET /api/v1/skills
// @access  Private
exports.getMySkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, skills, 'Skills retrieved successfully')
  );
});

// @desc    Add a new skill
// @route   POST /api/v1/skills
// @access  Private
exports.addSkill = asyncHandler(async (req, res) => {
  const { name, experienceLevel } = req.body;

  if (!name) {
    throw new ApiError(400, 'Skill name is required');
  }

  // Check if skill already exists for this user
  const existingSkill = await Skill.findOne({
    user: req.user._id,
    name: name.trim()
  });

  if (existingSkill) {
    throw new ApiError(400, 'You already have this skill added');
  }

  const skill = await Skill.create({
    user: req.user._id,
    name: name.trim(),
    experienceLevel: experienceLevel || 'beginner'
  });

  res.status(201).json(
    new ApiResponse(201, skill, 'Skill added successfully')
  );
});

// @desc    Update a skill
// @route   PUT /api/v1/skills/:id
// @access  Private
exports.updateSkill = asyncHandler(async (req, res) => {
  const { name, experienceLevel } = req.body;

  const skill = await Skill.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  if (name) skill.name = name.trim();
  if (experienceLevel) skill.experienceLevel = experienceLevel;

  await skill.save();

  res.status(200).json(
    new ApiResponse(200, skill, 'Skill updated successfully')
  );
});

// @desc    Delete a skill
// @route   DELETE /api/v1/skills/:id
// @access  Private
exports.deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  await skill.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Skill deleted successfully')
  );
});

// @desc    Endorse a skill (increment endorsement count)
// @route   POST /api/v1/skills/:id/endorse
// @access  Private
exports.endorseSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findById(req.params.id);

  if (!skill) {
    throw new ApiError(404, 'Skill not found');
  }

  skill.endorsements += 1;
  await skill.save();

  res.status(200).json(
    new ApiResponse(200, skill, 'Skill endorsed successfully')
  );
});