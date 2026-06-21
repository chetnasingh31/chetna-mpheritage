import React, { useEffect, useState, useRef } from 'react';
import OrnamentalDivider from './OrnamentalDivider';

const STATS = [
  {
    key: 'unesco',
    target: 3,
    suffix: '',
    label: 'UNESCO Sites',
    desc: 'World Heritage Sites recognized in Madhya Pradesh',
  },
  {
    key: 'sites',
    target: 450,
    suffix: '+',
    label: 'Heritage Sites Listed',
    desc: 'Notable monuments and sites under state protection',
  },
  {
    key: 'museums',
    target: 12,
    suffix: '+',
    label: 'Museums Catalogued',
    desc: 'State, site, and regional museums catalogued',
  },
  {
    key: 'districts',
    target: 55,
    suffix: '',
    label: 'Districts Mapped',
    desc: 'Districts covered in archaeological mapping',
  },
];

export default function Stats() {
  const sectionRef = useRef(null);
  const [counts, setCounts] = useState({ unesco: 0, sites: 0, museums: 0, districts: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateAll();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateAll = () => {
    STATS.forEach((stat, index) => {
      animateSingle(stat.key, stat.target, 1300 + index * 180);
    });
  };

  const animateSingle = (key, target, duration) => {
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      
      setCounts(prev => ({ ...prev, [key]: current }));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  return (
    <section 
      className="stats-band section-3d-reveal" 
      id="section-stats" 
      ref={sectionRef} 
      role="region" 
      aria-label="Heritage portal statistics"
    >
      <OrnamentalDivider />
      <div className="stats-shell" style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'stretch', flexWrap: 'nowrap', width: '100%' }}>
          {/* Left Column: Stats Details and Counters */}
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <div className="stats-header reveal" style={{ marginBottom: '32px' }}>
              <div className="section-label">At a Glance</div>
              <h2 className="stats-title" style={{ margin: 0 }}>Madhya Pradesh Heritage Coverage</h2>
            </div>

            <div className="stats-inner">
              {STATS.map((stat) => (
                <div className="stat-block reveal" key={stat.key} style={{ padding: '24px 16px' }}>
                  <div className="stat-number" id={`stat-${stat.key}`}>
                    {counts[stat.key]}{stat.suffix && <span>{stat.suffix}</span>}
                  </div>
                  <div className="stat-label" style={{ marginTop: '8px' }}>{stat.label}</div>
                  <div className="stat-desc" style={{ marginTop: '8px' }}>{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Featured Research / Mapping Image */}
          <div 
            className="reveal-right" 
            style={{ 
              flex: '0 0 350px', 
              position: 'relative', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              border: '1px solid rgba(201,168,76,0.15)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            <img 
              src="/stats_featured.png" 
              alt="Heritage survey tools and blueprints" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} 
            />
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'linear-gradient(to top, rgba(13,11,8,0.95) 0%, rgba(13,11,8,0.4) 60%, transparent 100%)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-end', 
                padding: '32px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--gold)', fontWeight: '700' }}>
                Systematic Documentation
              </span>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '24px', color: 'var(--text-primary)', margin: '8px 0 0 0', fontWeight: '500' }}>
                Mapping &amp; Preservation
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4', margin: 0 }}>
                Every protected site is carefully surveyed, photographed, and archived under the Madhya Pradesh Protection of Monuments Act.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
