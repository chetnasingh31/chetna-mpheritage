import React, { useState } from 'react';

export default function AdminDashboard({ notices, onClose, onNoticeUpdate, onLogout }) {
  const [category, setCategory] = useState('Tender');
  const [title, setTitle] = useState('');
  
  // Format today's date as default (e.g. "19 June 2026")
  const getFormattedDate = () => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  const [date, setDate] = useState(getFormattedDate());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    setIsSubmitting(true);
    const newNotice = { category, title: title.trim(), date: date.trim() };

    // Simulate small latency for realistic feel
    await new Promise(resolve => setTimeout(resolve, 400));

    const localNotices = JSON.parse(localStorage.getItem('mp_heritage_notices') || '[]');
    const nextId = localNotices.length > 0 ? Math.max(...localNotices.map(n => n.id || 0)) + 1 : 1;
    const noticeToSave = { id: nextId, ...newNotice, createdAt: new Date() };
    
    localNotices.unshift(noticeToSave);
    localStorage.setItem('mp_heritage_notices', JSON.stringify(localNotices));
    
    setTitle('');
    setDate(getFormattedDate());
    onNoticeUpdate();
    setIsSubmitting(false);
    alert('Announcement published successfully.');
  };

  const handleDelete = async (id, mongoId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    const targetId = mongoId || id;
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 300));

    let localNotices = JSON.parse(localStorage.getItem('mp_heritage_notices') || '[]');
    localNotices = localNotices.filter((n) => n.id !== id && n._id !== targetId);
    localStorage.setItem('mp_heritage_notices', JSON.stringify(localNotices));
    onNoticeUpdate();
  };

  return (
    <div id="admin-drawer" className="detail-drawer open" role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className="drawer-content" style={{ maxWidth: '480px', paddingTop: '60px' }}>
        <button className="btn-drawer-close" onClick={onClose} aria-label="Close dashboard">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
        
        <div className="drawer-body" style={{ padding: '24px' }}>
          <div style={{ borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '16px', marginBottom: '24px' }}>
            <span className="drawer-tag" style={{ background: 'rgba(46,100,60,0.2)', color: '#7EC49A', borderColor: 'rgba(46,100,60,0.4)' }}>
              Active Session
            </span>
            <h2 className="drawer-title" id="admin-title" style={{ fontSize: '28px' }}>Admin Dashboard</h2>
            <p className="drawer-meta">Notice &amp; Announcement Portal</p>
          </div>

          <h3 className="login-form-label" style={{ fontSize: '12px', marginBottom: '12px' }}>Add New Announcement</h3>
          <form id="add-notice-form" onSubmit={handlePublish} style={{ marginBottom: '32px' }}>
            <div className="login-form-group">
              <label className="login-form-label">Category</label>
              <select 
                className="login-form-input" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ background: '#ffffff', color: '#000000', cursor: 'pointer' }} 
                required
              >
                <option value="Tender">Tender</option>
                <option value="Recruitment">Recruitment</option>
                <option value="Circular">Circular</option>
                <option value="EOI">EOI</option>
                <option value="General Notice">General Notice</option>
              </select>
            </div>
            <div className="login-form-group">
              <label className="login-form-label">Title / Description</label>
              <input 
                type="text" 
                className="login-form-input" 
                placeholder="Conservation works at Bagh Caves" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>
            <div className="login-form-group">
              <label className="login-form-label">Date</label>
              <input 
                type="text" 
                className="login-form-input" 
                placeholder="e.g. 8 June 2026" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required 
              />
            </div>
            <button 
              type="submit" 
              className="btn-login-submit" 
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Notice'}
            </button>
          </form>

          <h3 className="login-form-label" style={{ fontSize: '12px', borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '20px', marginBottom: '12px' }}>
            Manage Existing Notices
          </h3>
          <div id="admin-notices-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notices.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center', padding: '10px' }}>
                No active announcements found.
              </div>
            ) : (
              notices.map((notice) => (
                <div 
                  key={notice._id || notice.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div style={{ textAlign: 'left', maxWidth: '80%' }}>
                    <strong style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                      {notice.category}
                    </strong>
                    <p style={{ fontSize: '12px', marginTop: '2px', color: 'var(--text-primary)' }}>
                      {notice.title}
                    </p>
                    <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                      {notice.date}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(notice.id, notice._id)} 
                    style={{
                      background: 'rgba(139,26,26,0.3)',
                      border: '1px solid rgba(139,26,26,0.5)',
                      color: '#E87070',
                      fontSize: '10px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: '0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(139,26,26,0.6)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(139,26,26,0.3)'}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="drawer-footer">
          <button 
            className="btn-drawer-action" 
            style={{ background: 'rgba(139,26,26,0.25)', color: '#E87070', border: '1px solid rgba(139,26,26,0.5)' }} 
            onClick={onLogout}
          >
            Logout Session
          </button>
        </div>
      </div>
    </div>
  );
}
