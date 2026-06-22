const User = require('../models/User');
const FeatureFlag = require('../models/FeatureFlag');
const Content = require('../models/Content');

const seedDB = async () => {
  try {
    // 1. Seed Users
    const userCount = await User.countDocuments({});
    if (userCount === 0) {
      console.log('Seeding administrative users...');
      
      const SEEDED_ROLES = [
        { name: 'System Administrator', email: 'superadmin@mp.gov.in', role: 'SYSTEM_ADMIN', password: 'demo123', institution: null },
        { name: 'Directorate Admin', email: 'diradmin@mp.gov.in', role: 'DIRECTORATE_ADMIN', password: 'demo123', institution: null },
        { name: 'Directorate Officer', email: 'officer@mp.gov.in', role: 'DIRECTORATE_OFFICER', password: 'demo123', institution: null },
        { name: 'Museum Admin (Bhopal)', email: 'museum@mp.gov.in', role: 'MUSEUM_ADMIN', password: 'demo123', institution: 'State Museum, Bhopal' },
        { name: 'Site Incharge (Bhimbetka)', email: 'site@mp.gov.in', role: 'SITE_INCHARGE', password: 'demo123', institution: 'Bhimbetka Rock Shelters' },
        { name: 'Institute Admin (Wakankar)', email: 'institute@mp.gov.in', role: 'INSTITUTE_ADMIN', password: 'demo123', institution: 'Dr. V.S. Wakankar Institute' },
        { name: 'Trust Admin', email: 'trust@mp.gov.in', role: 'TRUST_ADMIN', password: 'demo123', institution: 'MP Heritage Development Trust' }
      ];

      for (const u of SEEDED_ROLES) {
        // password pre-save hook will hash it automatically
        await User.create(u);
      }
      console.log('Administrative users seeded successfully!');
    }

    // 2. Seed Feature Flags
    const flagCount = await FeatureFlag.countDocuments({});
    if (flagCount === 0) {
      console.log('Seeding feature flags...');
      const flags = [
        { key: 'eTicketBooking', enabled: true, description: 'Allows online portal ticket bookings' },
        { key: 'museumAudioGuide', enabled: false, description: 'Digitized museum audio tour streams' },
        { key: 'virtualTour3D', enabled: true, description: 'Interactive 3D monument walkthroughs' },
        { key: 'noticeScheduler', enabled: false, description: 'Advance scheduling of circulars/tenders' }
      ];
      await FeatureFlag.insertMany(flags);
      console.log('Feature flags seeded successfully!');
    }

    // 3. Seed initial content for museums, sites etc. to make it look full
    const contentCount = await Content.countDocuments({});
    if (contentCount === 0) {
      console.log('Seeding initial content drafts and reviews...');
      const museumUser = await User.findOne({ role: 'MUSEUM_ADMIN' });
      const siteUser = await User.findOne({ role: 'SITE_INCHARGE' });

      if (museumUser && siteUser) {
        // Create an Approved content
        const c1 = new Content({
          title: 'Prehistoric Artefact Cataloging',
          description: 'Digitized listing of stone age tools recovered in Chambal valley.',
          contentType: 'artefact',
          institution: 'State Museum, Bhopal',
          status: 'Published',
          createdBy: museumUser._id,
          metadata: { artefactsCount: 14, galleriesCount: 3 }
        });
        c1.history.push({ status: 'Draft', modifiedBy: museumUser._id, comments: 'Created draft' });
        c1.history.push({ status: 'Submitted', modifiedBy: museumUser._id, comments: 'Submitted for publication' });
        c1.history.push({ status: 'Published', modifiedBy: museumUser._id, comments: 'Directorate approval given' });
        await c1.save();

        // Create a Pending review content
        const c2 = new Content({
          title: 'Monsoon Condition Assessment 2026',
          description: 'Detailed analysis of water runoffs and structural status of shelters 3 through 8.',
          contentType: 'condition_report',
          institution: 'Bhimbetka Rock Shelters',
          status: 'Submitted',
          createdBy: siteUser._id,
          metadata: { riskLevel: 'Low', priority: 'Medium' }
        });
        c2.history.push({ status: 'Draft', modifiedBy: siteUser._id, comments: 'Formulation' });
        c2.history.push({ status: 'Submitted', modifiedBy: siteUser._id, comments: 'Submit report' });
        await c2.save();
      }
      console.log('Sample content workflows seeded successfully!');
    }

  } catch (error) {
    console.error('Database seeding error:', error.message);
  }
};

module.exports = seedDB;
