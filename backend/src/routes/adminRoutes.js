const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole } = require('../middlewares/rbacMiddleware');

// Lock all routes in this router to SYSTEM_ADMIN
router.use(protect, checkRole(['SYSTEM_ADMIN']));

// Users Management
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// System Logs
router.get('/logs', adminController.getAuditLogs);

// Feature Flags
router.get('/flags', adminController.getFeatureFlags);
router.post('/flags', adminController.updateFeatureFlag);

module.exports = router;
