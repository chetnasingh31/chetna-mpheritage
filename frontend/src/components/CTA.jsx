import React from 'react';
import OrnamentalDivider from './OrnamentalDivider';
import HeaderMandala from './HeaderMandala';

export default function CTA({ onPlanVisitClick }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="cta-section section-3d-reveal" id="section-cta" aria-labelledby="cta-heading">
      <OrnamentalDivider />
      <HeaderMandala size={420} className="bg-mandala bg-mandala-center" />
      <div className="cta-content reveal" style={{ position: 'relative', zIndex: 1 }}>
        <div className="cta-copy">
          <div className="section-label">Visit Planning</div>
          <h2 className="cta-title" id="cta-heading">
            Plan Your <em>Heritage Journey</em>
          </h2>
          <p className="cta-desc">
            Embark on an extraordinary journey through the heart of India. Discover protected prehistoric caves, ancient stupas, classical temple complexes, and world-class state museums catalogued across Madhya Pradesh with curated route maps and visitor e-tickets.
          </p>
          <ul className="cta-features-list" aria-label="Portal visitor tools">
            <li><span>✦</span> E-Tickets &amp; QR Entry</li>
            <li><span>✦</span> Route Map Travel Mappings</li>
            <li><span>✦</span> Curator Archives Circulars</li>
          </ul>
        </div>

        <div className="cta-panel" aria-label="Heritage planning actions">
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => scrollToSection('section-monuments')}>
              Explore Sites
            </button>
            <button className="btn-cta-outline" onClick={onPlanVisitClick}>
              Plan a Visit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
