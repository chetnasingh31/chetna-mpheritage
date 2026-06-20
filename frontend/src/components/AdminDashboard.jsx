import React, { useState } from 'react';

const SEEDED_ROLES = [
  { name: 'System Administrator', email: 'superadmin@mp.gov.in', code: 'SA' },
  { name: 'Directorate Admin', email: 'diradmin@mp.gov.in', code: 'DA' },
  { name: 'A. Officer', email: 'officer@mp.gov.in', code: 'AO' },
  { name: 'Museum Admin (Bhopal)', email: 'museum@mp.gov.in', code: 'MA' },
  { name: 'Site Incharge (Bhimbetka)', email: 'site@mp.gov.in', code: 'SI' },
  { name: 'Institute Admin (Wakankar)', email: 'institute@mp.gov.in', code: 'IA' },
  { name: 'Trust Admin', email: 'trust@mp.gov.in', code: 'TA' }
];

export default function AdminDashboard({ notices, onClose, onNoticeUpdate, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [category, setCategory] = useState('Tender');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Retrieve user session info
  const userEmail = sessionStorage.getItem('mp_heritage_user_role') || 'superadmin@mp.gov.in';
  const roleMatch = SEEDED_ROLES.find(r => r.email.toLowerCase() === userEmail.toLowerCase());
  const activeRoleName = roleMatch ? roleMatch.name : (userEmail === 'admin' ? 'System Administrator' : 'Staff Officer');
  const activeEmailText = roleMatch ? roleMatch.email : (userEmail === 'admin' ? 'superadmin@mp.gov.in' : userEmail);

  // Simulated Audit Logs
  const [auditLogs] = useState([
    { time: '16:32:10', user: 'superadmin@mp.gov.in', action: 'Created new notice announcement', target: 'Conservation works at Bagh Caves' },
    { time: '15:10:45', user: 'museum@mp.gov.in', action: 'Updated visiting hours list', target: 'Bhopal Museum' },
    { time: '14:24:19', user: 'site@mp.gov.in', action: 'Approved booking request #B-88392', target: 'Bhimbetka Ticket Desk' },
    { time: '11:05:02', user: 'diradmin@mp.gov.in', action: 'Assigned permissions change', target: 'A. Officer role clearance' },
  ]);

  // Simulated Feature Flags
  const [flags, setFlags] = useState({
    eTicketBooking: true,
    museumAudioGuide: false,
    virtualTour3D: true,
    noticeScheduler: false,
  });

  const getFormattedDate = () => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  const [date, setDate] = useState(getFormattedDate());

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    setIsSubmitting(true);
    const newNotice = { category, title: title.trim(), date: date.trim() };

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
    await new Promise(resolve => setTimeout(resolve, 300));

    let localNotices = JSON.parse(localStorage.getItem('mp_heritage_notices') || '[]');
    localNotices = localNotices.filter((n) => n.id !== id && n._id !== targetId);
    localStorage.setItem('mp_heritage_notices', JSON.stringify(localNotices));
    onNoticeUpdate();
  };

  const toggleFlag = (flagName) => {
    setFlags(prev => ({ ...prev, [flagName]: !prev[flagName] }));
  };

  return (
    <div 
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        background: '#F9FAFB',
        color: '#111827',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflowX: 'hidden'
      }}
    >
      {/* ==========================================
          SIDEBAR NAVIGATION (FORMAL INK DARK)
      ========================================== */}
      <aside 
        style={{
          width: isSidebarOpen ? '260px' : '0px',
          background: '#111827',
          color: '#F9FAFB',
          display: 'flex',
          flexDirection: 'column',
          borderRight: isSidebarOpen ? '1px solid #E5E7EB' : 'none',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.2s ease, border-right 0.2s ease'
        }}
      >
        {/* Brand Header */}
        <div 
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid #1F2937',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            whiteSpace: 'nowrap'
          }}
        >
          <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
            MP Heritage
          </h1>
          <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 500, letterSpacing: '0.2px' }}>
            Government of Madhya Pradesh
          </span>
        </div>

        {/* User Badge Info */}
        <div 
          style={{
            padding: '16px 20px',
            background: '#1F2937',
            borderBottom: '1px solid #1F2937',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: '#22C55E', width: '6px', height: '6px', borderRadius: '50%' }}></span>
            <span style={{ fontSize: '9px', letterSpacing: '0.5px', color: '#22C55E', fontWeight: 700, textTransform: 'uppercase' }}>
              Live DB Connection
            </span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '2px' }}>
            {activeRoleName}
          </div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeEmailText}
          </div>
        </div>

        {/* Menu Links */}
        <nav 
          style={{
            padding: '24px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flexGrow: 1,
            overflowY: 'auto'
          }}
        >
          {/* General Section */}
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, letterSpacing: '0.8px', paddingLeft: '8px', display: 'block', marginBottom: '6px' }}>
              General
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    width: '100%',
                    background: activeTab === 'dashboard' ? '#1F2937' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: activeTab === 'dashboard' ? '#FFFFFF' : '#D1D5DB',
                    fontSize: '13px',
                    fontWeight: activeTab === 'dashboard' ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Directorate Section */}
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, letterSpacing: '0.8px', paddingLeft: '8px', display: 'block', marginBottom: '6px' }}>
              Directorate
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('content')}
                  style={{
                    width: '100%',
                    background: activeTab === 'content' ? '#1F2937' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: activeTab === 'content' ? '#FFFFFF' : '#D1D5DB',
                    fontSize: '13px',
                    fontWeight: activeTab === 'content' ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Content workspace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('approvals')}
                  style={{
                    width: '100%',
                    background: activeTab === 'approvals' ? '#1F2937' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: activeTab === 'approvals' ? '#FFFFFF' : '#D1D5DB',
                    fontSize: '13px',
                    fontWeight: activeTab === 'approvals' ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Approvals
                </button>
              </li>
            </ul>
          </div>

          {/* Administration Section */}
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700, letterSpacing: '0.8px', paddingLeft: '8px', display: 'block', marginBottom: '6px' }}>
              Administration
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('users')}
                  style={{
                    width: '100%',
                    background: activeTab === 'users' ? '#1F2937' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: activeTab === 'users' ? '#FFFFFF' : '#D1D5DB',
                    fontSize: '13px',
                    fontWeight: activeTab === 'users' ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Users
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('roles')}
                  style={{
                    width: '100%',
                    background: activeTab === 'roles' ? '#1F2937' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: activeTab === 'roles' ? '#FFFFFF' : '#D1D5DB',
                    fontSize: '13px',
                    fontWeight: activeTab === 'roles' ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Roles &amp; permissions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('flags')}
                  style={{
                    width: '100%',
                    background: activeTab === 'flags' ? '#1F2937' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: activeTab === 'flags' ? '#FFFFFF' : '#D1D5DB',
                    fontSize: '13px',
                    fontWeight: activeTab === 'flags' ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Feature flags
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('audit')}
                  style={{
                    width: '100%',
                    background: activeTab === 'audit' ? '#1F2937' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: activeTab === 'audit' ? '#FFFFFF' : '#D1D5DB',
                    fontSize: '13px',
                    fontWeight: activeTab === 'audit' ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  Audit log
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* ==========================================
          MAIN CONTENT WORKSPACE (FORMAL WHITE)
      ========================================== */}
      <main 
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Top Header Bar */}
        <header 
          style={{
            padding: '16px 32px',
            borderBottom: '1px solid #E5E7EB',
            background: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4B5563' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: '#4B5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                borderRadius: '4px',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              aria-label="Toggle sidebar"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <span style={{ fontWeight: 600 }}>Portal Console</span>
            <span style={{ color: '#D1D5DB' }}>/</span>
            <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>
              {activeTab === 'dashboard' ? 'General Dashboard' : activeTab}
            </span>
          </div>

          <button 
            onClick={onLogout}
            style={{
              background: '#FFFFFF',
              border: '1px solid #FCA5A5',
              borderRadius: '4px',
              padding: '6px 12px',
              color: '#DC2626',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FEE2E2';
              e.currentTarget.style.borderColor = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#FCA5A5';
            }}
          >
            Log Out
          </button>
        </header>

        {/* Inner Content Area */}
        <div style={{ padding: '32px', flexGrow: 1 }}>

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
                  Administrative Dashboard
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Overview of the Madhya Pradesh Heritage Platform.
                </p>
              </div>

              {/* Stats Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '20px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#6B7280', letterSpacing: '0.5px' }}>Total Notices</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginTop: '6px' }}>{notices.length}</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '20px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#6B7280', letterSpacing: '0.5px' }}>Active Staff</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginTop: '6px' }}>7 Registered</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '20px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#6B7280', letterSpacing: '0.5px' }}>Ticket Bookings</div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginTop: '6px' }}>148 Active</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '20px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: '#6B7280', letterSpacing: '0.5px' }}>System Integrity</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#15803D', marginTop: '16px' }}>SECURE &amp; STABLE</div>
                </div>
              </div>

              {/* Split Grid */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                <div style={{ flex: '1 1 360px', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '14px', color: '#111827', margin: '0 0 16px 0', fontWeight: 600, borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                    Publish Announcement
                  </h3>
                  <form onSubmit={handlePublish}>
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          background: '#FFFFFF',
                          color: '#111827',
                          outline: 'none'
                        }}
                      >
                        <option value="Tender">Tender</option>
                        <option value="Recruitment">Recruitment</option>
                        <option value="Circular">Circular</option>
                        <option value="EOI">EOI</option>
                        <option value="General Notice">General Notice</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Title / Description</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Museum upgrades works"
                        required 
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          background: '#FFFFFF',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '5px' }}>Date</label>
                      <input 
                        type="text" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required 
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '13px',
                          background: '#FFFFFF',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: '#111827',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1F2937'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#111827'}
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
                    </button>
                  </form>
                </div>

                <div style={{ flex: '1 1 500px', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxHeight: '500px', overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '14px', color: '#111827', margin: '0 0 16px 0', fontWeight: 600, borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                    Quick Notice Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notices.map((n) => (
                      <div key={n.id || n._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                        <div>
                          <strong style={{ fontSize: '10px', color: '#4B5563', textTransform: 'uppercase' }}>{n.category}</strong>
                          <div style={{ fontSize: '13px', fontWeight: 600, margin: '2px 0', color: '#111827' }}>{n.title}</div>
                          <span style={{ fontSize: '10px', color: '#6B7280' }}>{n.date}</span>
                        </div>
                        <button 
                          onClick={() => handleDelete(n.id, n._id)}
                          style={{
                            background: '#FEE2E2',
                            border: '1px solid #FCA5A5',
                            color: '#991B1B',
                            fontSize: '11px',
                            fontWeight: '600',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#FCA5A5'}
                          onMouseLeave={(e) => e.currentTarget.style.background = '#FEE2E2'}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. CONTENT WORKSPACE VIEW */}
          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Content Workspace
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Manage site pages, announcements, resources, and catalogued artifacts.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px', marginBottom: '16px' }}>
                  Active Notices &amp; Announcements ({notices.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notices.map((notice) => (
                    <div 
                      key={notice._id || notice.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 16px',
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ textAlign: 'left', maxWidth: '80%' }}>
                        <strong style={{ fontSize: '10px', textTransform: 'uppercase', color: '#4B5563' }}>{notice.category}</strong>
                        <p style={{ fontSize: '13.5px', fontWeight: 600, margin: '2px 0', color: '#111827' }}>{notice.title}</p>
                        <span style={{ fontSize: '10.5px', color: '#6B7280' }}>Published Date: {notice.date}</span>
                      </div>
                      <button 
                        onClick={() => handleDelete(notice.id, notice._id)} 
                        style={{
                          background: '#FEE2E2',
                          border: '1px solid #FCA5A5',
                          color: '#991B1B',
                          fontSize: '11px',
                          padding: '8px 14px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Delete Announcement
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. APPROVALS VIEW */}
          {activeTab === 'approvals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Pending Approvals
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Review and authorize portal edits and visitor e-ticket booking confirmations.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#4B5563', fontWeight: 700 }}>
                      <th style={{ padding: '12px' }}>Request ID</th>
                      <th style={{ padding: '12px' }}>Type</th>
                      <th style={{ padding: '12px' }}>Details</th>
                      <th style={{ padding: '12px' }}>Requested By</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>#ET-89481</td>
                      <td style={{ padding: '12px' }}>e-Ticket Booking Approval</td>
                      <td style={{ padding: '12px' }}>5 Adults ticket booking for Bhimbetka Rock Shelters</td>
                      <td style={{ padding: '12px' }}>web-gate@mp.gov.in</td>
                      <td style={{ padding: '12px', color: '#D97706', fontWeight: 600 }}>PENDING GATEWAY</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button onClick={() => alert('Booking Approved')} style={{ background: '#16A34A', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '11px', fontWeight: 600 }}>Approve</button>
                        <button onClick={() => alert('Booking Rejected')} style={{ background: '#DC2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Reject</button>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px', fontWeight: 600 }}>#ET-89480</td>
                      <td style={{ padding: '12px' }}>e-Ticket Booking Approval</td>
                      <td style={{ padding: '12px' }}>2 Adults, 1 Child ticket booking for Bhopal Museum</td>
                      <td style={{ padding: '12px' }}>web-gate@mp.gov.in</td>
                      <td style={{ padding: '12px', color: '#D97706', fontWeight: 600 }}>PENDING GATEWAY</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button onClick={() => alert('Booking Approved')} style={{ background: '#16A34A', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '11px', fontWeight: 600 }}>Approve</button>
                        <button onClick={() => alert('Booking Rejected')} style={{ background: '#DC2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Reject</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. USERS VIEW */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  User Management
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Create, suspend and assign roles to any user.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>Active Users ({SEEDED_ROLES.length})</span>
                  <button onClick={() => alert('Create user form')} style={{ background: '#111827', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>+ Add New User</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SEEDED_ROLES.map((role) => (
                    <div 
                      key={role.email}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderRadius: '4px'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#111827' }}>{role.name}</strong>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{role.email}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '10px', background: '#DEF7EC', color: '#03543F', padding: '2px 8px', borderRadius: '100px', fontWeight: 700 }}>
                          ACTIVE
                        </span>
                        <button 
                          onClick={() => alert(`Modify permissions for: ${role.name}`)}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #D1D5DB',
                            fontSize: '11px',
                            color: '#374151',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Modify Permissions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. ROLES & PERMISSIONS VIEW */}
          {activeTab === 'roles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Roles &amp; Permissions Matrix
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  The capability matrix that gates the whole platform.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#4B5563', fontWeight: 700 }}>
                      <th style={{ padding: '12px' }}>Role / Group</th>
                      <th style={{ padding: '12px' }}>Publish Notices</th>
                      <th style={{ padding: '12px' }}>Modify Tickets</th>
                      <th style={{ padding: '12px' }}>Database Access</th>
                      <th style={{ padding: '12px' }}>Admin Panel</th>
                      <th style={{ padding: '12px' }}>Feature Toggles</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>System Administrator</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>Directorate Admin</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#B91C1C' }}>✗ Restricted</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#B91C1C' }}>✗ Restricted</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>Museum / Site Admin</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#B91C1C' }}>✗ Restricted</td>
                      <td style={{ padding: '12px', color: '#B91C1C' }}>✗ Restricted</td>
                      <td style={{ padding: '12px', color: '#15803D', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '12px', color: '#B91C1C' }}>✗ Restricted</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. FEATURE FLAGS VIEW */}
          {activeTab === 'flags' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Feature Flags &amp; Toggles
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Runtime governance &amp; phase toggles.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>e-Ticket Booking Gateway</strong>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>Enables live ticketing and seat selection on monument detail views.</p>
                    </div>
                    <button 
                      onClick={() => toggleFlag('eTicketBooking')} 
                      style={{
                        background: flags.eTicketBooking ? '#16A34A' : '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {flags.eTicketBooking ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>Museum Audio Guide Streaming</strong>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>Enable voice guide playbacks inside museum sub-panels.</p>
                    </div>
                    <button 
                      onClick={() => toggleFlag('museumAudioGuide')} 
                      style={{
                        background: flags.museumAudioGuide ? '#16A34A' : '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {flags.museumAudioGuide ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>Virtual 3D Tour Rendering</strong>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>Enables WebGL-based virtual interactive tours of historical sites.</p>
                    </div>
                    <button 
                      onClick={() => toggleFlag('virtualTour3D')} 
                      style={{
                        background: flags.virtualTour3D ? '#16A34A' : '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {flags.virtualTour3D ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. AUDIT LOG VIEW */}
          {activeTab === 'audit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  System Audit Trail
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                  Security and activity audit trail of active administrative sessions.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '24px', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB', color: '#4B5563', fontWeight: 700 }}>
                      <th style={{ padding: '12px' }}>Timestamp</th>
                      <th style={{ padding: '12px' }}>Initiated By</th>
                      <th style={{ padding: '12px' }}>Action Log</th>
                      <th style={{ padding: '12px' }}>Target Resource</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Security Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
                        <td style={{ padding: '12px', fontFamily: 'monospace', color: '#4B5563' }}>{log.time}</td>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#111827' }}>{log.user}</td>
                        <td style={{ padding: '12px', color: '#374151' }}>{log.action}</td>
                        <td style={{ padding: '12px', fontStyle: 'italic', color: '#6B7280' }}>{log.target}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#15803D', fontWeight: 700 }}>LEVEL 1</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
