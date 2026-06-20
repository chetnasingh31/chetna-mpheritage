import React from 'react';

export default function Hero({ latestNotice, onPlanVisitClick, onShopClick }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <div className="hero-bg">
        <video
          className="hero-bg-video"
          src="/heritage-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
      <div className="hero-mandala-wrap" aria-hidden="true">
        <div className="hero-ring"><span className="hero-ring-dot"></span></div>
        <div className="hero-ring"><span className="hero-ring-dot"></span></div>
        <div className="hero-ring"><span className="hero-ring-dot"></span></div>
        <div className="hero-ring"><span className="hero-ring-dot"></span></div>
        <div className="hero-ring"></div>
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-overlay-bottom"></div>

      <div className="hero-content">

        <h1 className="hero-title" id="hero-title">
          Discover the Heritage<br />of <em>Madhya Pradesh</em>
        </h1>

        <div className="hero-cta">
          <button className="btn-primary-hero" onClick={() => scrollToSection('section-monuments')}>
            Explore Heritage
          </button>
          <button className="btn-primary-hero" onClick={onShopClick}>
            Shop Authentic Replicas
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <div className="hero-stat-item">
          <div className="hero-stat-num">3</div>
          <div className="hero-stat-label">UNESCO Sites</div>
        </div>
        <div className="hero-stat-item">
          <div className="hero-stat-num">55</div>
          <div className="hero-stat-label">Districts</div>
        </div>
        <div className="hero-stat-item">
          <div className="hero-stat-num">6+</div>
          <div className="hero-stat-label">Museums</div>
        </div>
      </div>

      <div
        className="hero-scroll-indicator"
        style={{ cursor: 'pointer' }}
        onClick={() => scrollToSection('section-notices')}
      >
        <span className="hero-scroll-text">Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}

