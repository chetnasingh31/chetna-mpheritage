const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const FeatureFlag = require('../models/FeatureFlag');
const { logAction } = require('../utils/auditLogger');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a user
exports.createUser = async (req, res) => {
  const { name, email, password, role, institution, status } = req.body;

  try {
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      institution: role === 'SYSTEM_ADMIN' || role === 'DIRECTORATE_ADMIN' || role === 'DIRECTORATE_OFFICER' ? null : institution,
      status: status || 'active'
    });

    await user.save();

    await logAction(req.user.email, req.user.role, 'Create User', user.email, { role: user.role, institution: user.institution });

    res.status(210).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user settings
exports.updateUser = async (req, res) => {
  const { name, role, institution, status, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    if (password) user.password = password;

    if (role) {
      user.institution = role === 'SYSTEM_ADMIN' || role === 'DIRECTORATE_ADMIN' || role === 'DIRECTORATE_OFFICER' ? null : institution;
    } else if (institution !== undefined) {
      user.institution = institution;
    }

    await user.save();

    await logAction(req.user.email, req.user.role, 'Update User Info', user.email, { updatedFields: req.body });

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institution: user.institution,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    await User.deleteOne({ _id: req.params.id });

    await logAction(req.user.email, req.user.role, 'Delete User', user.email);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View Full Audit Logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Feature Flags control
exports.getFeatureFlags = async (req, res) => {
  try {
    const flags = await FeatureFlag.find({});
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateFeatureFlag = async (req, res) => {
  const { key, enabled } = req.body;

  try {
    let flag = await FeatureFlag.findOne({ key });
    if (!flag) {
      flag = new FeatureFlag({ key, enabled });
    } else {
      flag.enabled = enabled;
    }

    await flag.save();

    await logAction(req.user.email, req.user.role, 'Update Feature Flag', `${key}: ${enabled}`);

    res.json(flag);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
