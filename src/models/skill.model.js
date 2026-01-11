const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters']
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    endorsements: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound index to prevent duplicate skills per user
skillSchema.index({ user: 1, name: 1 }, { unique: true });

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;