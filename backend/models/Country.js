const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 2
  },
  flag: {
    type: String,
    default: ''
  },
  serverCount: {
    type: Number,
    default: 0
  },
  blockedIPCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
countrySchema.index({ code: 1 });
countrySchema.index({ name: 1 });
countrySchema.index({ isActive: 1 });

module.exports = mongoose.model('Country', countrySchema);