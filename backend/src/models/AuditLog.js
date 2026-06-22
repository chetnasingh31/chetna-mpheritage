const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  target: { type: String, default: '' },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
