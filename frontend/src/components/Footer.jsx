import React from 'react';

export default function Footer() {
  return (
    <footer className="footer section-3d-reveal" id="footer" role="contentinfo">
      <div className="section-divider-glow divider-top"></div>
      <div className="footer-grid">
        {/* Brand column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-emblem">मध्य</div>
            <span className="footer-logo-text-title">MP Heritage</span>
          </div>
          <p className="footer-brand-desc">
            Official portal of the Directorate of Archaeology, Archives &amp; Museums, Government of Madhya Pradesh. Preserving and celebrating the cultural legacy of the Heart of India.
          </p>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📍</span>
            <span className="footer-contact-text">Directorate of Archaeology, Archives &amp; Museums,<br />Bhopal, Madhya Pradesh</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📞</span>
            <span className="footer-contact-text">+91-755-0000000</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">✉️</span>
            <span className="footer-contact-text">contact-archaeology@mp.gov.in</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="footer-col-title">Quick Links</div>
          <ul className="footer-links">
            <li><a href="#section-museums">Museums</a></li>
            <li><a href="#section-monuments">Sites &amp; Monuments</a></li>
            <li><a href="#section-publications">Publications</a></li>
            <li><a href="#section-notices">Notices</a></li>
            <li><a href="#section-publications">Research</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Government Officers Directory accessible under secure admin login.'); }}>Officers</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <div className="footer-col-title">Policies &amp; Help</div>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Screen reader & policy accessibility statements are compliant with GIGW.'); }}>Accessibility Statement</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Enabling Screen Reader Mode...'); }}>Screen Reader Access</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Copyright policy: Content licensed under creative commons BY-NC 4.0.'); }}>Copyright Policy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Hyperlinking guidelines policy.'); }}>Hyperlinking Policy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy statement.'); }}>Privacy Policy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Terms &amp; conditions.'); }}>Terms &amp; Conditions</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Disclaimer.'); }}>Disclaimer</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('RTI act information portal.'); }}>RTI</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Site layout map.'); }}>Sitemap</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); alert('Feedback system.'); }}>Feedback</a></li>
          </ul>
        </div>

        {/* Information Manager contact */}
        <div>
          <div className="footer-col-title">Management</div>
          <ul className="footer-links">
            <li style={{ color: 'var(--text-dim)', fontSize: '12px', lineHeight: '1.6' }}>
              <strong>Web Info Manager:</strong><br />
              Smt. R. Sharma<br />
              Directorate of Archaeology, MP
            </li>
            <li style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '12px', lineHeight: '1.6' }}>
              <strong>Department:</strong><br />
              Directorate of Archaeology, Archives &amp; Museums
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copyright">
          © 2026 Directorate of Archaeology, Archives &amp; Museums, Government of Madhya Pradesh. Content owned by the Directorate of Archaeology, Archives &amp; Museums, Govt. of Madhya Pradesh.
        </p>
        <nav className="footer-gov-links" aria-label="Government portal links">
          <a href="https://nic.in" target="_blank" rel="noopener noreferrer">NIC</a>
          <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer">India.gov.in</a>
          <a href="https://mp.gov.in" target="_blank" rel="noopener noreferrer">mp.gov.in</a>
          <a href="https://asi.nic.in" target="_blank" rel="noopener noreferrer">ASI</a>
          <a href="https://mptourism.com" target="_blank" rel="noopener noreferrer">MP Tourism</a>
        </nav>
      </div>
    </footer>
  );
}
