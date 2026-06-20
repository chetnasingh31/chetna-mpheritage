import React, { useRef } from 'react';
import OrnamentalDivider from './OrnamentalDivider';
import HeaderMandala from './HeaderMandala';

export default function Research() {
  const cardRefs = useRef({});

  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 5;
    
    card.style.transform = `perspective(900px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`;
    card.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
  };

  const features = [
    { icon: '🔍', title: 'Excavation Reports', desc: 'Detailed monographs of archaeological excavations in Malwa & Bundelkhand' },
    { icon: '📖', title: 'Research Papers', desc: 'Scholarly journals cataloguing rock art, epigraphy, and historic structures' },
    { icon: '🏛️', title: 'Digital Archives', desc: 'High-resolution digitizations of palm-leaf manuscripts and copper plates' },
    { icon: '🛡️', title: 'Dr. V.S. Wakankar Cell', desc: 'Academic works commemorating pioneering pre-historic archaeological research' }
  ];

  return (
    <section className="replica-section section-3d-reveal" id="section-publications" aria-labelledby="publications-heading">
      <OrnamentalDivider />
      <HeaderMandala size={380} className="bg-mandala bg-mandala-right" />
      <div className="replica-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div className="replica-visual reveal-left">
          <div className="replica-img-frame" style={{ border: '1px solid rgba(201,168,76,0.3)' }}>
            <img src="/publications_asset.png" alt="State Archives and archaeological publications" loading="lazy" />
          </div>
        </div>

        <div className="replica-content reveal-right">
          <div className="section-label">Stewardship</div>
          <h2 className="section-title" id="publications-heading">Research &amp;<br /><em>Digital Publications</em></h2>
          <p className="section-desc" style={{ maxWidth: '100%' }}>
            Access official excavations reports, research papers, historic journals, and rare manuscripts digitized under the supervision of the Directorate of Archaeology, Archives &amp; Museums.
          </p>

          <div className="replica-features">
            {features.map((feat, index) => (
              <div 
                key={index}
                ref={el => cardRefs.current[index] = el}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className="replica-feature"
                style={{ cursor: 'pointer' }}
              >
                <div className="replica-feature-icon">{feat.icon}</div>
                <div className="replica-feature-title">{feat.title}</div>
                <div className="replica-feature-desc">{feat.desc}</div>
              </div>
            ))}
          </div>

          <button className="btn-replica" onClick={() => alert('Digital Archives database loading... Ready to browse.')}>
            Browse Publications
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
