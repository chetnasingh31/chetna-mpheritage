const Content = require('../models/Content');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { logAction } = require('../utils/auditLogger');

// Create content (Draft or Submitted)
exports.createContent = async (req, res) => {
  const { title, description, contentType, metadata, submit } = req.body;
  const institution = req.user.institution || req.body.institution;

  if (!institution) {
    return res.status(400).json({ message: 'Institution must be specified' });
  }

  try {
    const status = submit ? 'Submitted' : 'Draft';
    const content = new Content({
      title,
      description,
      contentType,
      institution,
      status,
      metadata: metadata || {},
      createdBy: req.user._id
    });

    content.history.push({
      status,
      modifiedBy: req.user._id,
      comments: submit ? 'Initial Submission' : 'Draft Created'
    });

    await content.save();

    // Log Action
    await logAction(req.user.email, req.user.role, 'Create Content', `${contentType}: ${title}`, { id: content._id, status });

    // Send notifications if submitted
    if (submit) {
      // Notify Directorate Officers
      const officers = await User.find({ role: 'DIRECTORATE_OFFICER' });
      for (const officer of officers) {
        await Notification.create({
          recipient: officer._id,
          message: `New content submitted for review: "${title}" from ${institution}`
        });
      }
    }

    res.status(210).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get content list (with strict RBAC filters)
exports.getContent = async (req, res) => {
  try {
    let query = {};

    // Enforce institution boundary: Institution admins can only view their own institution's data
    if (!['SYSTEM_ADMIN', 'DIRECTORATE_ADMIN', 'DIRECTORATE_OFFICER'].includes(req.user.role)) {
      query.institution = req.user.institution;
    }

    const contentList = await Content.find(query)
      .populate('createdBy', 'name email role')
      .sort({ updatedAt: -1 });

    res.json(contentList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single content
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('createdBy', 'name email role');
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // RBAC access check
    if (!['SYSTEM_ADMIN', 'DIRECTORATE_ADMIN', 'DIRECTORATE_OFFICER'].includes(req.user.role)) {
      if (content.institution !== req.user.institution) {
        return res.status(403).json({ message: 'Access Denied: You cannot view this institution\'s data' });
      }
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update content details (Before publication)
exports.updateContent = async (req, res) => {
  const { title, description, metadata, submit } = req.body;

  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Role check & institution boundary check
    if (!['SYSTEM_ADMIN', 'DIRECTORATE_ADMIN'].includes(req.user.role)) {
      if (content.institution !== req.user.institution) {
        return res.status(403).json({ message: 'Access Denied: Cannot modify other institution\'s data' });
      }
      // Institution user can only edit if status is Draft or Rejected
      if (!['Draft', 'Rejected'].includes(content.status)) {
        return res.status(400).json({ message: 'Cannot edit content in review or published state' });
      }
    }

    if (title) content.title = title;
    if (description) content.description = description;
    if (metadata) content.metadata = { ...content.metadata, ...metadata };

    const status = submit ? 'Submitted' : content.status;
    if (submit) {
      content.status = 'Submitted';
      content.history.push({
        status: 'Submitted',
        modifiedBy: req.user._id,
        comments: 'Content Submitted/Resubmitted for Review'
      });

      // Notify Directorate Officers
      const officers = await User.find({ role: 'DIRECTORATE_OFFICER' });
      for (const officer of officers) {
        await Notification.create({
          recipient: officer._id,
          message: `Resubmitted content for review: "${content.title}" from ${content.institution}`
        });
      }
    }

    await content.save();

    await logAction(req.user.email, req.user.role, 'Update Content', `${content.contentType}: ${content.title}`, { id: content._id, status });

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Content
exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Enforce rules: Only Creator can delete draft, only System Admin can delete any
    if (req.user.role !== 'SYSTEM_ADMIN') {
      if (content.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access Denied: Only creator or SYSTEM_ADMIN can delete content.' });
      }
      if (content.status !== 'Draft') {
        return res.status(400).json({ message: 'Cannot delete content that is submitted or published.' });
      }
    }

    await Content.deleteOne({ _id: req.params.id });

    await logAction(req.user.email, req.user.role, 'Delete Content', `${content.contentType}: ${content.title}`);

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Workflow State Transition Controller
exports.updateWorkflow = async (req, res) => {
  const { action, comments } = req.body; // Action can be: 'review', 'recommend', 'approve', 'reject', 'publish', 'override'
  
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const prevStatus = content.status;
    let nextStatus = content.status;

    // WORKFLOW VALIDATIONS BASED ON ROLE
    if (action === 'review') {
      // Directorate Officer puts content Under Review
      if (req.user.role !== 'DIRECTORATE_OFFICER') {
        return res.status(403).json({ message: 'Only Directorate Reviewer can place content in Under Review status' });
      }
      if (content.status !== 'Submitted') {
        return res.status(400).json({ message: 'Can only review submitted content' });
      }
      nextStatus = 'Under Review';
    } 
    else if (action === 'recommend') {
      // Directorate Officer recommends approval (sets state to Approved)
      if (req.user.role !== 'DIRECTORATE_OFFICER') {
        return res.status(403).json({ message: 'Only Directorate Reviewer can recommend approval' });
      }
      if (!['Submitted', 'Under Review'].includes(content.status)) {
        return res.status(400).json({ message: 'Can only recommend submitted or under-review content' });
      }
      nextStatus = 'Approved';
      
      // Notify Directorate Admins
      const admins = await User.find({ role: 'DIRECTORATE_ADMIN' });
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          message: `Content recommendation ready for final approval: "${content.title}" from ${content.institution}`
        });
      }
    } 
    else if (action === 'publish') {
      // Directorate Admin publishes Approved content
      if (!['DIRECTORATE_ADMIN', 'SYSTEM_ADMIN'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Only Directorate Admin or System Admin can publish content' });
      }
      if (content.status !== 'Approved' && req.user.role !== 'SYSTEM_ADMIN') {
        return res.status(400).json({ message: 'Only approved content can be published' });
      }
      nextStatus = 'Published';
    } 
    else if (action === 'reject') {
      // Officer or Directorate Admin can reject back to Creator (Resubmit status / Draft)
      if (!['DIRECTORATE_OFFICER', 'DIRECTORATE_ADMIN', 'SYSTEM_ADMIN'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized role to reject content' });
      }
      nextStatus = 'Rejected';
    } 
    else if (action === 'override') {
      // System Admin override capability
      if (req.user.role !== 'SYSTEM_ADMIN') {
        return res.status(403).json({ message: 'Only System Admin can override approvals' });
      }
      nextStatus = req.body.overrideStatus || 'Published';
    } 
    else {
      return res.status(400).json({ message: 'Invalid workflow action' });
    }

    content.status = nextStatus;
    if (comments) content.comments = comments;
    
    content.history.push({
      status: nextStatus,
      modifiedBy: req.user._id,
      comments: comments || `${action.toUpperCase()} action taken`
    });

    await content.save();

    // Log Workflow action
    await logAction(
      req.user.email, 
      req.user.role, 
      `Workflow Transition (${action})`, 
      `${content.contentType}: ${content.title}`, 
      { from: prevStatus, to: nextStatus, comments }
    );

    // Notify the creator about the state change
    await Notification.create({
      recipient: content.createdBy,
      message: `Your content "${content.title}" status has changed from ${prevStatus} to ${nextStatus}. Comments: ${comments || 'None'}`
    });

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
