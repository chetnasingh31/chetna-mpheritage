import React, { useRef } from 'react';
import OrnamentalDivider from './OrnamentalDivider';
import HeaderMandala from './HeaderMandala';

const MONUMENTS_DATA = [
  { id: 'bhimbetka', name: 'Bhimbetka Rock Shelters', era: 'Prehistoric · 30,000 BCE', desc: 'A UNESCO World Heritage Site known for prehistoric cave paintings and early human habitation.', img: '/bhimbetka.png', featured: true, tag: 'UNESCO World Heritage' },
  { id: 'sanchi', name: 'Sanchi Stupa', era: 'Early Historic · 3rd c. BCE', desc: 'One of India\'s most important Buddhist monuments built around the Great Stupa.', img: '/sanchi.png', featured: false },
  { id: 'udayagiri', name: 'Udayagiri Caves', era: 'Gupta Era · 5th Century CE', desc: 'Ancient rock-cut caves featuring Gupta-period sculptures and inscriptions.', img: '/udayagiri.png', featured: false },
  { id: 'mandu', name: 'Mandu (Mandavgarh)', era: 'Medieval · 15th Century', desc: 'Historic fortified city known for Afghan architecture and monuments like Jahaz Mahal.', img: '/mandu.png', featured: false, colSpan: '2 / 4' }
];

export default function Monuments({ onOpenDetails }) {
  const cardRefs = useRef({});

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // featured cards get slightly smaller tilt
    const maxTilt = id === 'bhimbetka' ? 4 : 6;
    card.style.transform = `perspective(1200px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`;
    card.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = (id) => {
    const card = cardRefs.current[id];
    if (card) {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
  };

  return (
    <section className="monuments-section section-3d-reveal" id="section-monuments" aria-labelledby="monuments-heading">
      <OrnamentalDivider />
      <HeaderMandala size={300} className="bg-mandala bg-mandala-right" />
      <div className="section-header-row reveal" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <div className="section-label">Destinations</div>
          <h2 className="section-title" id="monuments-heading">Notable Sites &amp; <em>Monuments</em></h2>
        </div>
      </div>

      <div className="monuments-grid">
        {MONUMENTS_DATA.map((mon) => (
          <div 
            key={mon.id}
            ref={el => cardRefs.current[mon.id] = el}
            className={`monument-card ${mon.featured ? 'featured' : ''} reveal`}
            id={`card-${mon.id}`}
            style={mon.colSpan ? { gridColumn: mon.colSpan } : {}}
            onMouseMove={(e) => handleMouseMove(e, mon.id)}
            onMouseLeave={() => handleMouseLeave(mon.id)}
          >
            <img src={mon.img} alt={mon.name} className="monument-img" loading="lazy" />
            <div className="monument-overlay"></div>
            {mon.tag && <div className="monument-badge">{mon.tag}</div>}
            <div className="monument-content">
              <span className="monument-era-tag">{mon.era}</span>
              <h3 className="monument-name">{mon.name}</h3>
              <p className="monument-desc">{mon.desc}</p>
              <button className="btn-card-action" onClick={() => onOpenDetails(mon.id)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
