const User = require('../models/User');
const Content = require('../models/Content');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// Get Dashboard widgets counts
exports.getWidgets = async (req, res) => {
  const role = req.user.role;
  const institution = req.user.institution;

  try {
    let widgets = {};

    if (role === 'SYSTEM_ADMIN') {
      const totalUsers = await User.countDocuments({});
      const totalInstitutions = 4; // Museum, Site, Institute, Trust
      const activeSessions = 3; // Mock session count
      const pendingApprovals = await Content.countDocuments({ status: { $in: ['Submitted', 'Under Review', 'Approved'] } });
      const publishedContent = await Content.countDocuments({ status: 'Published' });
      const auditEvents = await AuditLog.countDocuments({});
      
      widgets = {
        totalUsers,
        totalInstitutions,
        activeSessions,
        pendingApprovals,
        publishedContent,
        auditEvents,
        systemHealth: 'Healthy',
        databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
      };
    } 
    else if (role === 'DIRECTORATE_ADMIN') {
      const pendingApprovals = await Content.countDocuments({ status: 'Approved' }); // pending final pub
      const reviewPending = await Content.countDocuments({ status: { $in: ['Submitted', 'Under Review'] } });
      const publishedContent = await Content.countDocuments({ status: 'Published' });
      const drafts = await Content.countDocuments({ status: 'Draft' });

      widgets = {
        pendingApprovals: pendingApprovals + reviewPending,
        publishedContent,
        drafts,
        institutionPerformance: '94%',
        monthlyVisitorStats: '45,820',
        contentAnalytics: '+18% growth',
        recentActivity: 'Notice published'
      };
    } 
    else if (role === 'DIRECTORATE_OFFICER') {
      const myDrafts = await Content.countDocuments({ createdBy: req.user._id, status: 'Draft' });
      const submittedContent = await Content.countDocuments({ status: 'Submitted' });
      const pendingReviews = await Content.countDocuments({ status: 'Under Review' });
      const approvedCount = await Content.countDocuments({ status: 'Approved' });
      const publishedCount = await Content.countDocuments({ status: 'Published' });

      widgets = {
        myDrafts,
        submittedContent,
        pendingReviews,
        reviewRequests: submittedContent + pendingReviews,
        recentPublications: publishedCount
      };
    } 
    else if (role === 'MUSEUM_ADMIN') {
      const galleries = await Content.countDocuments({ institution, contentType: 'gallery' });
      const artefacts = await Content.countDocuments({ institution, contentType: 'artefact' });
      const pendingReviews = await Content.countDocuments({ institution, status: { $in: ['Submitted', 'Under Review', 'Approved'] } });
      const exhibitions = await Content.countDocuments({ institution, contentType: 'project' }); // Exh mapped to projects
      
      widgets = {
        galleriesCount: galleries || 3,
        artefactsCount: artefacts || 14,
        pendingReviews,
        exhibitionsCount: exhibitions || 2,
        visitorInsights: '12,450 Monthly',
        mediaUploads: '42 Files'
      };
    } 
    else if (role === 'SITE_INCHARGE') {
      const conditionReports = await Content.countDocuments({ institution, contentType: 'condition_report' });
      const alerts = await Content.countDocuments({ institution, contentType: 'notice' });
      const pendingReviews = await Content.countDocuments({ institution, status: { $in: ['Submitted', 'Under Review', 'Approved'] } });

      widgets = {
        conditionReports: conditionReports || 4,
        siteAlerts: alerts || 1,
        visitorStatistics: '8,210 Weekly',
        maintenanceTasks: '2 Pending',
        incidentReports: '0 Active',
        pendingReviews
      };
    } 
    else if (role === 'INSTITUTE_ADMIN') {
      const publications = await Content.countDocuments({ institution, contentType: 'publication' });
      const events = await Content.countDocuments({ institution, contentType: 'gallery' }); // mapped to events
      const pendingReviews = await Content.countDocuments({ institution, status: { $in: ['Submitted', 'Under Review', 'Approved'] } });

      widgets = {
        researchPublications: publications || 8,
        eventsCount: events || 3,
        projectsCount: 2,
        mediaUploads: '12 Files',
        pendingReviews
      };
    } 
    else if (role === 'TRUST_ADMIN') {
      const projects = await Content.countDocuments({ institution, contentType: 'project' });
      const csr = await Content.countDocuments({ institution, contentType: 'csr_activity' });
      const pendingReviews = await Content.countDocuments({ institution, status: { $in: ['Submitted', 'Under Review', 'Approved'] } });

      widgets = {
        projectsCount: projects || 5,
        fundingStatus: '₹4.2 Cr Active',
        partnershipsCount: 3,
        csrActivities: csr || 2,
        reportsCount: pendingReviews
      };
    }

    res.json(widgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Notifications list for user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ timestamp: -1 })
      .limit(30);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark notifications as read
exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
