import React, { useState } from 'react';
import { HERITAGE_DATA } from '../data/heritageData';

export default function DetailDrawer({ id, onClose, onBook }) {
  const [activeTab, setActiveTab] = useState('overview');
  const data = HERITAGE_DATA[id];

  if (!data) return null;

  const handleBookClick = () => {
    onClose();
    // Small delay to let the drawer close transition finish smoothly before opening the booking modal
    setTimeout(() => {
      onBook(id);
    }, 350);
  };

  return (
    <div className="detail-drawer open" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="drawer-content">
        <button className="btn-drawer-close" onClick={onClose} aria-label="Close details">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="drawer-hero">
          <img src={data.img} alt={data.title} />
          <div className="drawer-hero-overlay"></div>
          <div className="drawer-hero-content">
            <span className="drawer-tag">{data.tag}</span>
            <h2 className="drawer-title" id="drawer-title">{data.title}</h2>
            <p className="drawer-meta">
              {data.location} · {data.era.split(' · ')[0]}
            </p>
          </div>
        </div>

        <div className="drawer-tabs">
          <button 
            id="tab-btn-overview"
            className={`drawer-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            id="tab-btn-visitor"
            className={`drawer-tab ${activeTab === 'visitor' ? 'active' : ''}`}
            onClick={() => setActiveTab('visitor')}
          >
            Visitor Info
          </button>
          <button 
            id="tab-btn-highlights"
            className={`drawer-tab ${activeTab === 'highlights' ? 'active' : ''}`}
            onClick={() => setActiveTab('highlights')}
          >
            Highlights
          </button>
        </div>

        <div className="drawer-body">
          {/* Overview Tab Content */}
          <div className={`drawer-tab-content ${activeTab === 'overview' ? 'active' : ''}`} id="drawer-tab-overview">
            <p className="drawer-desc">{data.desc}</p>
            <div className="drawer-details-grid">
              <div className="drawer-detail-item">
                <strong>Region</strong>
                <span>{data.region}</span>
              </div>
              <div className="drawer-detail-item">
                <strong>Era / Period</strong>
                <span>{data.era}</span>
              </div>
              <div className="drawer-detail-item">
                <strong>Type</strong>
                <span>{data.type}</span>
              </div>
              <div className="drawer-detail-item">
                <strong>Coordinates</strong>
                <span style={{ fontFamily: 'monospace' }}>{data.coordinates}</span>
              </div>
            </div>
          </div>

          {/* Visitor Info Tab Content */}
          <div className={`drawer-tab-content ${activeTab === 'visitor' ? 'active' : ''}`} id="drawer-tab-visitor">
            <div className="visitor-info-list">
              <div className="visitor-info-item">
                <div className="visitor-icon" aria-hidden="true">⏱</div>
                <div>
                  <strong>Opening Hours</strong>
                  <p>{data.hours}</p>
                </div>
              </div>
              <div className="visitor-info-item">
                <div className="visitor-icon" aria-hidden="true">🎫</div>
                <div>
                  <strong>Entry Fees</strong>
                  <p>{data.fees}</p>
                </div>
              </div>
              <div className="visitor-info-item">
                <div className="visitor-icon" aria-hidden="true">🚗</div>
                <div>
                  <strong>How to Reach</strong>
                  <p>{data.reach}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Tab Content */}
          <div className={`drawer-tab-content ${activeTab === 'highlights' ? 'active' : ''}`} id="drawer-tab-highlights">
            <ul className="highlights-list">
              {data.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="drawer-footer">
          <button className="btn-drawer-action" onClick={handleBookClick}>
            Plan a Visit &amp; Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
