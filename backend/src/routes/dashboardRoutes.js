const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/widgets', protect, dashboardController.getWidgets);
router.get('/notifications', protect, dashboardController.getNotifications);
router.post('/notifications/read', protect, dashboardController.markNotificationsRead);

module.exports = router;
