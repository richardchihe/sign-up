const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  gatheringId: {
    type: String,
    required: true
  },
  cycleId: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  hasAttended: {
    type: Boolean,
    default: false
  },
  checkedBy: {
    type: String,
    default: ''
  },
  wasRemoved: {
    type: Boolean,
    default: false
  },
  removedBy: {
    type: String,
    default: ''
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

module.exports = mongoose.model('Attendee', attendeeSchema);