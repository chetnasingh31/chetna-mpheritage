const mongoose = require('mongoose');

const ContentHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  contentType: {
    type: String,
    enum: [
      'gallery', 
      'artefact', 
      'condition_report', 
      'notice', 
      'announcement', 
      'publication', 
      'project', 
      'partner', 
      'csr_activity', 
      'annual_report'
    ],
    required: true
  },
  institution: { type: String, required: true },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Published', 'Rejected'],
    default: 'Draft'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Dynamic content-specific data
  comments: { type: String, default: '' }, // Editorial feedback
  history: [ContentHistorySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Content', ContentSchema);
