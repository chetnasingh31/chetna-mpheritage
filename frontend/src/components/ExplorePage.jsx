import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Award, BookOpen, Image, Map } from 'lucide-react';
import { HERITAGE_DATA } from '../data/heritageData';

const FEATURED_HIGHLIGHTS = [
  { ...HERITAGE_DATA['bhimbetka'], title: 'Bhimbetka Rock Shelters' },
  { ...HERITAGE_DATA['sanchi'], title: 'Sanchi Stupa' },
  { ...HERITAGE_DATA['mandu'], title: 'Mandu Fort City' },
  { ...HERITAGE_DATA['udayagiri'], title: 'Udayagiri Caves' }
];

export default function ExplorePage({ onViewChange, onOpenDetails, onBookClick }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % FEATURED_HIGHLIGHTS.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + FEATURED_HIGHLIGHTS.length) % FEATURED_HIGHLIGHTS.length);
  };

  return (
    <div className="explore-page">
      {/* Cinematic Hero */}
      <section className="explore-hero">
        <button className="btn-back-nav explore-back-btn" onClick={() => onViewChange('home')}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="explore-hero-bg">
          <img src="/gwalior_fort.png" alt="Gwalior Fort Madhya Pradesh Heritage" />
          <div className="explore-hero-overlay"></div>
        </div>
        
        <div className="explore-hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="explore-hero-headers"
          >
            <span className="explore-hero-subtitle">DIRECTORATE OF ARCHAEOLOGY & MUSEUMS</span>
            <h1 className="explore-hero-title">
              Heart of India’s <br />
              Living Legacy
            </h1>
            <p className="explore-hero-desc">
              Embark on an immersive journey across millennia. Unearth ancient prehistoric art, 
              sacred monuments, and royal fort cities that speak of glory, devotion, and timeless art.
            </p>
            <div className="explore-hero-actions">
              <button className="btn-gold-primary" onClick={() => onViewChange('museums')}>
                Explore Museums <ArrowRight size={16} />
              </button>
              <button className="btn-outline-gold" onClick={() => onViewChange('home')}>
                Home Portal
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="explore-categories-sec">
        <div className="section-header-row text-center">
          <span className="section-label">THE ARCHAEOLOGICAL CANVAS</span>
          <h2 className="section-title">Explore by <em>Categories</em></h2>
          <p className="section-subtitle">Delve into the specialized facets of Madhya Pradesh's archaeological assets.</p>
        </div>

        <div className="categories-glow-grid">
          {[
            { id: 'museums', title: 'Museums', desc: 'Prehistoric tools, royal armaments, and medieval masterpieces.', icon: <Award size={24} />, image: '/indore_museum.png', view: 'museums' },
            { id: 'monuments', title: 'Monuments', desc: 'World heritage stupas, rock shelters, and fortified temples.', icon: <MapPin size={24} />, image: '/sanchi.png', view: 'home' },
            { id: 'publications', title: 'Publications', desc: 'Research papers, monographs, and archaeological excavation records.', icon: <BookOpen size={24} />, image: '/udayagiri.png', view: 'home' },
            { id: 'galleries', title: 'Galleries', desc: 'Curated physical and virtual exhibitions of ancient artifacts.', icon: <Image size={24} />, image: '/khajuraho.png', view: 'home' },
            { id: 'events', title: 'Events & News', desc: 'Heritage walks, training workshops, and exhibition openings.', icon: <Calendar size={24} />, image: '/mandu.png', view: 'home' }
          ].map((cat) => (
            <motion.div 
              key={cat.id}
              className="glow-card"
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => onViewChange(cat.view)}
            >
              <div className="glow-card-img-wrap">
                <img src={cat.image} alt={cat.title} className="glow-card-img" />
                <div className="glow-card-icon-badge">
                  {cat.icon}
                </div>
              </div>
              <div className="glow-card-body">
                <h3 className="glow-card-title">{cat.title}</h3>
                <p className="glow-card-desc">{cat.desc}</p>
                <span className="glow-card-link">
                  Explore Module <ArrowRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="explore-stats-sec">
        <div className="stats-container">
          <div className="stat-glow-box">
            <span className="stat-number">3</span>
            <span className="stat-label">UNESCO World Heritage Sites</span>
          </div>
          <div className="stat-glow-box">
            <span className="stat-number">400+</span>
            <span className="stat-label">State Protected Monuments</span>
          </div>
          <div className="stat-glow-box">
            <span className="stat-number">20+</span>
            <span className="stat-label">State & District Museums</span>
          </div>
          <div className="stat-glow-box">
            <span className="stat-number">100k+</span>
            <span className="stat-label">Catalogued Antiquities</span>
          </div>
        </div>
      </section>

      {/* Featured Heritage Highlights Carousel */}
      <section className="explore-carousel-sec">
        <div className="section-header-row text-center">
          <span className="section-label">FEATURED WONDERS</span>
          <h2 className="section-title">Heritage <em>Highlights</em></h2>
        </div>

        <div className="carousel-wrapper">
          <div className="carousel-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="carousel-slide-content"
              >
                <div className="slide-image-container">
                  <img src={FEATURED_HIGHLIGHTS[activeSlide].img} alt={FEATURED_HIGHLIGHTS[activeSlide].title} />
                  <div className="slide-image-overlay"></div>
                </div>
                
                <div className="slide-text-container">
                  <span className="slide-tag">{FEATURED_HIGHLIGHTS[activeSlide].tag}</span>
                  <h3 className="slide-title">{FEATURED_HIGHLIGHTS[activeSlide].title}</h3>
                  <p className="slide-desc">{FEATURED_HIGHLIGHTS[activeSlide].desc}</p>
                  
                  <div className="slide-meta">
                    <div className="slide-meta-item">
                      <strong>Region:</strong> {FEATURED_HIGHLIGHTS[activeSlide].region}
                    </div>
                    <div className="slide-meta-item">
                      <strong>Period:</strong> {FEATURED_HIGHLIGHTS[activeSlide].era}
                    </div>
                  </div>

                  <div className="slide-actions">
                    <button className="btn-gold-primary" onClick={() => onOpenDetails(FEATURED_HIGHLIGHTS[activeSlide].id)}>
                      Explore Details
                    </button>
                    <button className="btn-outline-gold" onClick={() => onBookClick(FEATURED_HIGHLIGHTS[activeSlide].id)}>
                      Plan a Visit
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="carousel-controls">
            <button className="btn-carousel-nav" onClick={prevSlide} aria-label="Previous Slide">
              ❮
            </button>
            <div className="carousel-indicators">
              {FEATURED_HIGHLIGHTS.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-indicator ${idx === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button className="btn-carousel-nav" onClick={nextSlide} aria-label="Next Slide">
              ❯
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
