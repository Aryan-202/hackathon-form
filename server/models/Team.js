const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  regNo: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  leader: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  members: [memberSchema],
  status: {
    type: String,
    enum: ['registered', 'qualified'],
    default: 'registered',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for better query performance
teamSchema.index({ 'leader.email': 1 });
teamSchema.index({ 'members.email': 1 });
teamSchema.index({ status: 1 });

module.exports = mongoose.model('Team', teamSchema);