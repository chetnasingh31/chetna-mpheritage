const mongoose = require('mongoose');

const FeatureFlagSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  enabled: { type: Boolean, default: true },
  description: { type: String, default: '' }
});

module.exports = mongoose.model('FeatureFlag', FeatureFlagSchema);
