import React, { useState } from 'react';

export default function Navbar({ onSearchClick, onStaffLoginClick, isAdmin, onLogout, onReplicaClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div
        className="nav-logo"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setMenuOpen(false);
        }}
      >
        <div className="nav-logo-emblem">मध्य</div>
        <div className="nav-logo-text">
          <span className="nav-logo-title">MP HERITAGE</span>
          <span className="nav-logo-sub">Directorate of Archaeology</span>
        </div>
      </div>

      <button 
        className="nav-hamburger" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          {menuOpen ? (
            <path d="M6 18 18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <ul className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
        <li className="nav-item-dropdown">
          <a href="#section-categories" onClick={(e) => { e.preventDefault(); scrollToSection('section-categories'); }}>
            <b>EXPLORE <span style={{ fontSize: '8px', marginLeft: '3px' }}>▼</span></b>
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => scrollToSection('section-museums')}>Museums</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => scrollToSection('section-monuments')}>Sites &amp; Monuments</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={onReplicaClick || (() => scrollToSection('section-publications'))}>Publications &amp; Replicas</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => scrollToSection('section-publications')}>Galleries</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => scrollToSection('section-notices')}>Events</button>
            </li>
          </ul>
        </li>
        <li className="nav-item-dropdown">
          <a href="#section-museums" onClick={(e) => { e.preventDefault(); scrollToSection('section-museums'); }}>
            <b>INSTITUTIONS <span style={{ fontSize: '8px', marginLeft: '3px' }}>▼</span></b>
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => scrollToSection('section-publications')}>Research</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => scrollToSection('section-publications')}>Wakankar Institute</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => scrollToSection('section-cta')}>Heritage Trust</button>
            </li>
          </ul>
        </li>
        <li>
          <a href="#section-notices" onClick={(e) => { e.preventDefault(); scrollToSection('section-notices'); }}>
            <b>NOTICES</b>
          </a>
        </li>
        <li>
          <a href="#section-publications" onClick={(e) => { e.preventDefault(); scrollToSection('section-publications'); }}>
            <b>ABOUT</b>
          </a>
        </li>
        <li>
          <a href="#footer" onClick={(e) => { e.preventDefault(); scrollToSection('footer'); }}>
            <b>CONTACT</b>
          </a>
        </li>
      </ul>

      <div className="nav-actions">
        <button className="btn-search" id="btn-search" onClick={onSearchClick} aria-label="Search">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <button
          className="btn-login"
          id="btn-staff-login"
          onClick={onStaffLoginClick}
          style={isAdmin ? {
            background: 'linear-gradient(135deg, #2e643c, #1a4225)',
            color: '#7EC49A',
            border: '1px solid rgba(46,100,60,0.4)'
          } : {}}
        >
          {isAdmin ? 'Admin Desk' : 'Staff Login'}
        </button>
        {isAdmin && (
          <button
            className="btn-login"
            onClick={onLogout}
            style={{
              background: 'rgba(139,26,26,0.1)',
              color: '#E87070',
              border: '1px solid rgba(139,26,26,0.3)',
              marginLeft: '8px'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
