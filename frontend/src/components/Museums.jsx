import React, { useRef } from 'react';
import OrnamentalDivider from './OrnamentalDivider';
import HeaderMandala from './HeaderMandala';

const MUSEUMS_DATA = [
  { id: 'museum-bhopal', name: 'State Museum, Bhopal', tag: 'State Museum', desc: 'Illustrated folio from a palm-leaf Kalpa Sutra manuscript.', img: '/bhopal_museum.png' },
  { id: 'museum-indore', name: 'Central Museum, Indore', tag: 'District Museum', desc: 'Collections related to the Paramara period and Malwa heritage.', img: '/indore_museum.png' },
  { id: 'museum-gwalior', name: 'Gujari Mahal Museum', tag: 'District Museum', desc: 'Artifacts housed within the historic Gujari Mahal complex.', img: '/gwalior_museum_asset.png' },
  { id: 'museum-sanchi', name: 'Sanchi Museum', tag: 'Site Museum', desc: 'Sculptures and fragments from the Buddhist complex.', img: '/sanchi.png' },
  { id: 'museum-khajuraho', name: 'Khajuraho Museum', tag: 'Site Museum', desc: 'Temple sculptures and Chandela-period artifacts.', img: '/khajuraho.png' },
  { id: 'museum-dhubela', name: 'Dhubela Museum', tag: 'Local Museum', desc: 'Bundela-era history and regional heritage collections.', img: '/mandu.png' }
];

export default function Museums({ onOpenDetails }) {
  const cardRefs = useRef({});

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 5;
    
    card.style.transform = `perspective(900px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt}deg) scale(1.03)`;
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
    <section className="museums-section section-3d-reveal" id="section-museums" aria-labelledby="museums-heading">
      <OrnamentalDivider />
      <HeaderMandala size={340} className="bg-mandala bg-mandala-left" />
      <div className="section-header-row reveal" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <div className="section-label">Collections</div>
          <h2 className="section-title" id="museums-heading">Featured <em>Museums</em></h2>
        </div>
      </div>

      <div className="museums-scroll stagger">
        {MUSEUMS_DATA.map((mus) => (
          <div 
            key={mus.id}
            ref={el => cardRefs.current[mus.id] = el}
            className="museum-card reveal" 
            id={mus.id}
            onMouseMove={(e) => handleMouseMove(e, mus.id)}
            onMouseLeave={() => handleMouseLeave(mus.id)}
          >
            <div className="museum-img-wrap">
              <div className="museum-card-bg" style={{ backgroundImage: `url('${mus.img}')` }}></div>
              <div className="museum-card-overlay"></div>
            </div>
            <div className="museum-body">
              <span className="museum-tag">{mus.tag}</span>
              <h3 className="museum-name">{mus.name}</h3>
              <p className="museum-desc" style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '6px 0 12px', lineHeight: 1.4 }}>
                {mus.desc}
              </p>
              <button className="btn-card-action" onClick={() => onOpenDetails(mus.id)}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
