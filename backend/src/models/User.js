const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: [
      'SYSTEM_ADMIN', 
      'DIRECTORATE_ADMIN', 
      'DIRECTORATE_OFFICER', 
      'MUSEUM_ADMIN', 
      'SITE_INCHARGE', 
      'INSTITUTE_ADMIN', 
      'TRUST_ADMIN'
    ], 
    required: true 
  },
  institution: { 
    type: String, 
    default: null // Null for SYSTEM_ADMIN, DIRECTORATE_ADMIN, etc.
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  otpCode: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

