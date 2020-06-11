const mongoose = require("mongoose");
const slugify = require('slugify');

const organizationSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  seatingCapacity: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
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
    type: Boolean,
    default: false
  }
});

organizationSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});

module.exports = mongoose.model('Organization', organizationSchema);