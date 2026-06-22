import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Ticket, Shield, Share2, Compass, Maximize2 } from 'lucide-react';
import { HERITAGE_DATA } from '../data/heritageData';

// Custom artifacts for each museum to show in details
const MUSEUM_ARTIFACTS = {
  'museum-bhopal': [
    { title: 'Kalpa Sutra Folio', desc: '14th-century palm-leaf manuscript with vibrant gold leaf details.', img: '/bhopal_museum.png' },
    { title: 'Narmada Valley Stone Age Axe', desc: 'Prehistoric hand-axe dating back roughly 200,000 years.', img: '/bhimbetka.png' },
    { title: 'Paramara Shiva Statue', desc: 'Exquisite 11th-century polished black basalt sculpture.', img: '/udayagiri.png' },
    { title: 'Kushana Coin Hoard', desc: 'Gold and copper coins showcasing royal lineage and Greco-Roman influences.', img: '/gwalior_museum_asset.png' }
  ],
  'museum-indore': [
    { title: 'Durga Mahishasuramardini', desc: 'Paramara dynasty stone carving showing the triumph over the buffalo demon.', img: '/indore_museum.png' },
    { title: 'Copper Plate Grant', desc: 'Royal charter engraved on copper sheets, depicting land donations.', img: '/sanchi.png' },
    { title: 'Maheshwar Terracottas', desc: 'Delicate clay figurines representing regional mother goddess cults.', img: '/mandu.png' }
  ],
  'museum-gwalior': [
    { title: 'Gyraspur Shalabhanjika', desc: 'The "Mona Lisa of Indian Sculpture," famous for its detailed anatomy and grace.', img: '/gwalior_museum_asset.png' },
    { title: 'Pawaya Ganesha', desc: 'A monumental terracotta sculpture of Ganesha dating to the 4th century CE.', img: '/bhopal_museum.png' },
    { title: 'Tomar Dynasty Swords', desc: 'Finely forged steel weaponry belonging to Gwalior’s royal house.', img: '/mandu.png' }
  ],
  'museum-sanchi': [
    { title: 'Original Lion Capital of Ashoka', desc: '3rd-century BCE polished sandstone capital featuring four Asiatic lions.', img: '/sanchi.png' },
    { title: 'Yakshi Bracket Figure', desc: 'A tree-goddess carving designed as a gateway support bracket.', img: '/khajuraho.png' },
    { title: 'Buddhist Relic Caskets', desc: 'Steatite containers that held the sacred relics of Sariputra and Maudgalyayana.', img: '/udayagiri.png' }
  ],
  'museum-khajuraho': [
    { title: 'Celestial Dancer (Surasundari)', desc: '10th-century Chandela sculpture showing a dancer adjusting her anklet.', img: '/khajuraho.png' },
    { title: 'Colossal Varaha Sculpture', desc: 'Monolithic representation of Vishnu\'s boar incarnation covered in carvings.', img: '/sanchi.png' },
    { title: 'Chandela Royal Inscription', desc: 'Stone slab tracing the family line from the Moon god.', img: '/mandu.png' }
  ],
  'museum-dhubela': [
    { title: 'Bundela Royal Armory', desc: 'Chainmail suits, swords, and spiked helmets used by Maharaja Chhatrasal’s guard.', img: '/mandu.png' },
    { title: 'Maharaja Chhatrasal Portrait', desc: 'Bundeli school miniature painting depicting the Maharaja in court.', img: '/indore_museum.png' },
    { title: 'Shakti Stone Panels', desc: 'Medieval panels depicting local feminine energies and protective mothers.', img: '/bhopal_museum.png' }
  ]
};

export default function MuseumDetailPage({ museumId, onBack, onBookClick }) {
  const data = HERITAGE_DATA[museumId];
  const artifacts = MUSEUM_ARTIFACTS[museumId] || [];
  const [selectedArtifact, setSelectedArtifact] = useState(null);

  if (!data) {
    return (
      <div className="detail-error-state">
        <h2>Museum Not Found</h2>
        <button className="btn-gold-primary" onClick={onBack}>Back to Listings</button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="museum-detail-page">
      {/* Detail Hero Section */}
      <section className="detail-hero">
        <div className="detail-hero-bg">
          <img src={data.img} alt={data.title} />
          <div className="detail-hero-overlay"></div>
        </div>

        <div className="detail-hero-content-wrap">
          <button className="btn-back-nav" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Museums
          </button>
          
          <div className="detail-hero-main">
            <span className="detail-tag-badge">{data.tag}</span>
            <h1 className="detail-main-title">{data.title}</h1>
            <p className="detail-meta-row">
              <span className="meta-item"><MapPin size={14} /> {data.location}</span>
              <span className="meta-item"><Clock size={14} /> {data.era}</span>
            </p>
          </div>

          <div className="detail-quick-actions">
            <button className="btn-gold-primary" onClick={() => onBookClick(data.id)}>
              Book Entry Tickets
            </button>
            <button className="btn-outline-white-icon" onClick={handleShare} aria-label="Share page">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="detail-main-grid">
        {/* Left Column: History, Collections */}
        <div className="detail-info-column">
          <div className="detail-section-card">
            <h2 className="detail-sec-title">Historical Legacy</h2>
            <p className="detail-full-desc">{data.desc}</p>

            <h3 className="detail-sub-title">Timeline & Origin</h3>
            <div className="legacy-timeline">
              <div className="timeline-node">
                <div className="node-indicator"></div>
                <div className="node-content">
                  <strong>Origin Era</strong>
                  <p>{data.era}</p>
                </div>
              </div>
              <div className="timeline-node">
                <div className="node-indicator"></div>
                <div className="node-content">
                  <strong>Modern Restoration</strong>
                  <p>Documented, preserved and catalogued by the Directorate of Archaeology.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Core Collections Grid */}
          <div className="detail-section-card">
            <h2 className="detail-sec-title">Exhibition Highlights</h2>
            <p className="detail-sec-intro">Click on any core antiquity to view details and high-resolution visuals.</p>

            <div className="artifacts-masonry">
              {artifacts.map((art, idx) => (
                <div 
                  key={idx} 
                  className="artifact-card"
                  onClick={() => setSelectedArtifact(art)}
                >
                  <div className="artifact-img-wrap">
                    <img src={art.img} alt={art.title} />
                    <div className="artifact-hover-overlay">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                  <div className="artifact-info">
                    <h4 className="artifact-title">{art.title}</h4>
                    <p className="artifact-desc">{art.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visitor Info, Nearby */}
        <div className="detail-sidebar-column">
          <div className="sidebar-card visitor-card">
            <h3 className="sidebar-card-title">Visitor Information</h3>
            
            <div className="sidebar-info-row">
              <div className="info-icon"><Clock size={18} /></div>
              <div className="info-text">
                <strong>Opening Hours</strong>
                <p>{data.hours}</p>
              </div>
            </div>

            <div className="sidebar-info-row">
              <div className="info-icon"><Ticket size={18} /></div>
              <div className="info-text">
                <strong>Entry Fees</strong>
                <p>{data.fees}</p>
              </div>
            </div>

            <div className="sidebar-info-row">
              <div className="info-icon"><Compass size={18} /></div>
              <div className="info-text">
                <strong>How to Reach</strong>
                <p>{data.reach}</p>
              </div>
            </div>

            <div className="sidebar-info-row">
              <div className="info-icon"><Shield size={18} /></div>
              <div className="info-text">
                <strong>Museum Rules</strong>
                <p>Photography requires permits. Food and beverages are not allowed inside galleries.</p>
              </div>
            </div>
          </div>

          {/* Coordinates / Map Card */}
          <div className="sidebar-card location-card">
            <h3 className="sidebar-card-title">Geographic Location</h3>
            <div className="coordinates-display">
              <MapPin size={16} />
              <code>{data.coordinates}</code>
            </div>
            <div className="mini-map-visual">
              <div className="mini-map-dot"></div>
              <span>Madhya Pradesh GPS Grid</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setSelectedArtifact(null)}
          >
            <button className="btn-lightbox-close" onClick={() => setSelectedArtifact(null)}>✕</button>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="lightbox-box"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedArtifact.img} alt={selectedArtifact.title} />
              <div className="lightbox-caption">
                <h3>{selectedArtifact.title}</h3>
                <p>{selectedArtifact.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
