const AuditLog = require('../models/AuditLog');

const logAction = async (userEmail, role, action, target = '', details = {}) => {
  try {
    await AuditLog.create({
      user: userEmail,
      role,
      action,
      target,
      details,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Audit Logging Failed:', error.message);
  }
};

module.exports = { logAction };
