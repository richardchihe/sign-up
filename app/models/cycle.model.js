const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  organizationId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  deletedAt: {
    type: Date
  },
  softDeleted: {
    type: Boolean
  }
});

module.exports = mongoose.model('Cycle', cycleSchema);