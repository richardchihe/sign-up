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
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  },
  softDeleted: {
    type: Boolean,
    default: false
  }
});

organizationSchema.pre('validate', async function() {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });

    var duplicate = await Organization.findOne({slug: this.slug});
    var extender = 1;
    while (duplicate) {
      this.slug = slugify(this.name + extender, { lower: true, strict: true });
      duplicate = await Organization.findOne({slug: this.slug});
      extender++;
    }
  }
});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;