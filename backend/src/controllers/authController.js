const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logAction } = require('../utils/auditLogger');

// JWT generation helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '8h'
  });
};

// Phase 1: Login check & OTP generation
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive. Please contact administrator.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins validity
    await user.save();

    res.json({
      message: 'Credentials valid. Verification code sent.',
      email: user.email,
      otpCode: otp // For demo purposes, returning OTP in API response
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Phase 2: Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otpCode } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (!user.otpCode || user.otpCode !== otpCode || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Clear OTP
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user._id);

    // Audit Login
    await logAction(user.email, user.role, 'Login', 'Authentication System');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Profile retrieval
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Profile update
exports.updateProfile = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (password) user.password = password;

    await user.save();
    
    // Audit profile change
    await logAction(user.email, user.role, 'Update Profile', 'User Settings');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout logging
exports.logout = async (req, res) => {
  try {
    if (req.user) {
      await logAction(req.user.email, req.user.role, 'Logout', 'Authentication System');
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

