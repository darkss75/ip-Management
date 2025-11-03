const mongoose = require('mongoose');

const blockedIPSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // IPv4 validation
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        // IPv6 validation (simplified)
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Regex.test(v) || ipv6Regex.test(v);
      },
      message: 'Invalid IP address format'
    }
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true,
    length: 2
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  blockedBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  lastDetected: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
blockedIPSchema.index({ countryCode: 1, isActive: 1 });
blockedIPSchema.index({ ipAddress: 1 });
blockedIPSchema.index({ severity: 1 });
blockedIPSchema.index({ expiresAt: 1 });

// TTL index for automatic expiration
blockedIPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('BlockedIP', blockedIPSchema);