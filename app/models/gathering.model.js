const mongoose = require("mongoose");

const gatheringSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  organizationId: {
    type: String,
    required: true
  },
  cycleId: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  seatingCapacity: {
    type: String,
    required: true
  },
  description: {
    type: [String]
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isOpen: {
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

module.exports = mongoose.model('Gathering', gatheringSchema);