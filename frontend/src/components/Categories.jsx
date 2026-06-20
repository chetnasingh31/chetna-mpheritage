import React, { useRef } from 'react';
import OrnamentalDivider from './OrnamentalDivider';
import HeaderMandala from './HeaderMandala';

const CATEGORIES_DATA = [
  { id: 'cat-museums', name: 'Museums', count: '6 Catalogued', desc: 'Explore state, district, and site museums across Madhya Pradesh.', img: '/mandu.png', anchor: 'section-museums' },
  { id: 'cat-sites', name: 'Heritage Sites', count: '4+ Protected', desc: 'Discover protected monuments and archaeological sites.', img: '/khajuraho.png', anchor: 'section-monuments' },
  { id: 'cat-publications', name: 'Publications', count: 'Reports & Books', desc: 'Access reports, books, journals, and heritage publications.', img: '/publications_asset.png', anchor: 'section-publications' },
  { id: 'cat-research', name: 'Research', count: 'Studies & Papers', desc: 'Explore archaeological research and excavation studies.', img: '/bhimbetka.png', anchor: 'section-publications' },
  { id: 'cat-notices', name: 'Notices', count: 'Announcements', desc: 'View official announcements, tenders, and circulars.', img: '/stats_bg.png', anchor: 'section-notices' },
  { id: 'cat-galleries', name: 'Galleries', count: 'Digital Archives', desc: 'Browse heritage photographs and collections.', img: '/sanchi.png', anchor: 'section-publications' }
];

export default function Categories() {
  const cardRefs = useRef({});

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseMove = (e, catId) => {
    const card = cardRefs.current[catId];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 6;
    
    card.style.transform = `perspective(900px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt}deg) scale(1.03)`;
    card.style.transition = 'transform 0.1s ease';

    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${cursorX}px`);
    card.style.setProperty('--mouse-y', `${cursorY}px`);
  };

  const handleMouseLeave = (catId) => {
    const card = cardRefs.current[catId];
    if (card) {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
  };

  return (
    <section className="categories-section section-3d-reveal" id="section-categories" aria-labelledby="categories-heading">
      <OrnamentalDivider />
      <HeaderMandala size={360} className="bg-mandala bg-mandala-left" />
      <div className="section-header reveal" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-label">Discover</div>
        <h2 className="section-title" id="categories-heading">Explore by <em>Category</em></h2>
        <p className="section-desc">Museums, monuments, manuscripts, and archaeological institutions preserving Madhya Pradesh's living heritage.</p>
      </div>

      <div className="categories-grid stagger">
        {CATEGORIES_DATA.map((cat) => (
          <div 
            key={cat.id}
            ref={el => cardRefs.current[cat.id] = el}
            className="category-card reveal" 
            id={cat.id}
            onClick={() => scrollToSection(cat.anchor)}
            onMouseMove={(e) => handleMouseMove(e, cat.id)}
            onMouseLeave={() => handleMouseLeave(cat.id)}
          >
            <div className="category-card-bg" style={{ backgroundImage: `url('${cat.img}')` }}></div>
            <div className="category-card-overlay"></div>
            <div className="category-card-content">
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">{cat.count}</span>
              <p className="category-desc">{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
