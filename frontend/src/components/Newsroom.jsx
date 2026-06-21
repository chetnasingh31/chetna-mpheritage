import React, { useRef } from 'react';
import OrnamentalDivider from './OrnamentalDivider';
import HeaderMandala from './HeaderMandala';

const FILTERS = [
  { value: 'all', label: 'All Notices' },
  { value: 'Tender', label: 'Tenders' },
  { value: 'Recruitment', label: 'Recruitments' },
  { value: 'Circular', label: 'Circulars' },
  { value: 'EOI', label: 'EOIs' },
  { value: 'General Notice', label: 'General Notice' },
];

export default function Newsroom({ notices, activeCategory, onCategoryChange }) {
  const cardRefs = useRef({});

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 5;

    card.style.transform = `perspective(900px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt}deg) scale(1.02)`;
    card.style.transition = 'transform 0.1s ease';
  };

  const handleMouseLeave = (id) => {
    const card = cardRefs.current[id];
    if (card) {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
    }
  };

  const getBadgeClass = (category) => {
    switch (category.toLowerCase()) {
      case 'tender': return 'badge-tender';
      case 'recruitment': return 'badge-recruitment';
      case 'circular': return 'badge-circular';
      case 'eoi': return 'badge-eoi';
      default: return 'badge-notice';
    }
  };

  const getCategoryCount = (category) => {
    if (category === 'all') return notices.length;
    return notices.filter(n => n.category.toLowerCase() === category.toLowerCase()).length;
  };

  const filtered = activeCategory === 'all'
    ? notices
    : notices.filter(n => n.category.toLowerCase() === activeCategory.toLowerCase());

  const handleReadMore = (notice, categoryPrefix) => {
    alert(`${categoryPrefix}: ${notice.title}\n\nPublished: ${notice.date}\nCategory: ${notice.category}\n\nThis is an official announcement from the Directorate of Archaeology, Govt. of Madhya Pradesh.`);
  };

  return (
    <section className="notices-section section-3d-reveal" id="section-notices" aria-labelledby="notices-heading">
      <OrnamentalDivider />
      <HeaderMandala size={320} className="bg-mandala bg-mandala-right" />
      <div className="notices-inner" style={{ position: 'relative', zIndex: 1 }}>
        <div className="section-header-row reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginBottom: '24px' }}>
          <div>
            <div className="section-label">Newsroom</div>
            <h2 className="section-title" id="notices-heading" style={{ margin: 0 }}>Latest <em>notices</em></h2>
          </div>
          <button className="newsroom-view-all" onClick={() => onCategoryChange('all')} aria-label="View all notices">
            View all
          </button>
        </div>

        <div style={{ display: 'flex', gap: '32px', marginTop: '24px', flexWrap: 'wrap' }}>
          {/* Left Column: Visual Banner Card */}
          <div
            className="reveal-left"
            style={{
              flex: '1 1 300px',
              minHeight: '280px',
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid rgba(201,168,76,0.15)',
              boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
            }}
          >
            <img
              src="/newsroom_banner.png"
              alt="Archaeological site excavation and heritage conservation work under progress"
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13,11,8,0.95) 0%, rgba(13,11,8,0.3) 60%, transparent 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '24px'
              }}
            >
              <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2.5px', color: '#FFFFFF', fontWeight: '700' }}>
                Bulletins &amp; Tenders
              </span>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '22px', color: '#FFFFFF', margin: '6px 0 0 0', fontWeight: '500' }}>
                Official Updates
              </h3>
              <p style={{ fontSize: '12px', color: '#FFFFFF', marginTop: '8px', lineHeight: '1.4', margin: 0 }}>
                Explore notices, excavation permits, recruitment announcements, and active tenders issued by the Directorate.
              </p>
            </div>
          </div>

          {/* Right Column: Notices Content */}
          <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', minWidth: '320px', overflow: 'hidden' }}>
            <div className="newsroom-filters reveal" aria-label="Notice categories" style={{ margin: '0 0 20px 0', flexWrap: 'wrap' }}>
              {FILTERS.map((filter) => {
                const count = getCategoryCount(filter.value);
                return (
                  <button
                    key={filter.value}
                    className={`filter-pill ${activeCategory === filter.value ? 'active' : ''}`}
                    onClick={() => onCategoryChange(filter.value)}
                    aria-pressed={activeCategory === filter.value}
                  >
                    <span>{filter.label}</span>
                    <span className="filter-count">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="notices-grid stagger">
              {filtered.length === 0 ? (
                <div className="notice-empty-state" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <div className="notice-empty-title">No notices in this category</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Try another category or view all published announcements.</p>
                  <button className="notice-empty-action" onClick={() => onCategoryChange('all')} style={{ marginTop: '12px' }}>
                    View All Notices
                  </button>
                </div>
              ) : (
                filtered.map((notice) => {
                  const categoryPrefix = notice.category === 'General Notice' ? 'Notice' : notice.category;
                  const noticeId = notice.id || notice._id;
                  return (
                    <div
                      key={noticeId}
                      ref={el => cardRefs.current[noticeId] = el}
                      onMouseMove={(e) => handleMouseMove(e, noticeId)}
                      onMouseLeave={() => handleMouseLeave(noticeId)}
                      className="notice-card reveal"
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '200px' }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span className={`notice-badge ${getBadgeClass(notice.category)}`}>
                            {notice.category}
                          </span>
                          <span className="notice-date-top" style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            {notice.date}
                          </span>
                        </div>
                        <p className="notice-title" style={{ fontWeight: '600', fontSize: '15px', color: 'var(--text-primary)', marginBottom: '12px', lineHeight: '1.4' }}>
                          {categoryPrefix}: {notice.title}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: '12px', marginTop: '12px' }}>
                        <p className="notice-date" style={{ margin: 0, fontSize: '11px' }}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" />
                          </svg>
                          {notice.date}
                        </p>
                        <button
                          className="notice-read-more"
                          onClick={() => handleReadMore(notice, categoryPrefix)}
                          style={{ background: 'none', border: 'none', padding: 0, color: 'var(--gold)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                          Read more ➔
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
