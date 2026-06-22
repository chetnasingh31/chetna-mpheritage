const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect } = require('../middlewares/authMiddleware');
const { checkRole, restrictToInstitution } = require('../middlewares/rbacMiddleware');

// Get all allowed content
router.get('/', protect, contentController.getContent);

// Get single content details
router.get('/:id', protect, contentController.getContentById);

// Create content draft or submission
router.post('/', 
  protect, 
  checkRole(['MUSEUM_ADMIN', 'SITE_INCHARGE', 'INSTITUTE_ADMIN', 'TRUST_ADMIN', 'SYSTEM_ADMIN', 'DIRECTORATE_OFFICER']), 
  restrictToInstitution, 
  contentController.createContent
);

// Update content
router.put('/:id', 
  protect, 
  restrictToInstitution, 
  contentController.updateContent
);

// Delete content
router.delete('/:id', protect, contentController.deleteContent);

// Workflow state transition
router.put('/:id/workflow', protect, contentController.updateWorkflow);

module.exports = router;
