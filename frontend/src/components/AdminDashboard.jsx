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
        background: '#FAF6F0',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' stroke='rgba%28184, 92, 56, 0.015%29' stroke-width='1.2' fill='none'/%3E%3C/svg%3E")`,
        color: '#2E2A27',
        fontFamily: "'Inter', sans-sans-serif",
        overflowX: 'hidden'
      }}
    >
      {/* Dynamic styles */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(184, 92, 56, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(184, 92, 56, 0.25);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(184, 92, 56, 0.45);
        }
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(46, 125, 50, 0); }
          100% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
        }
        .pulsing-dot-green {
          animation: pulse-green 2s infinite;
        }
      `}</style>

      {/* ==========================================
          SIDEBAR NAVIGATION (FORMAL HERITAGE CREAM)
      ========================================== */}
      <aside 
        style={{
          width: isSidebarOpen ? '260px' : '0px',
          background: '#FCFAF7',
          color: '#2E2A27',
          display: 'flex',
          flexDirection: 'column',
          borderRight: isSidebarOpen ? '1px solid rgba(184, 92, 56, 0.2)' : 'none',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-right 0.3s ease'
        }}
      >
        {/* Brand Header */}
        <div 
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(184, 92, 56, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #B85C38, #8c4125)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#FFFFFF',
            fontSize: '15px',
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: '0 4px 8px rgba(184, 92, 56, 0.15)'
          }}>
            व
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#B85C38', letterSpacing: '0.8px', fontFamily: "'Montserrat', sans-serif" }}>
              MP HERITAGE
            </h1>
            <span style={{ fontSize: '9px', color: '#8c8070', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Government of MP
            </span>
          </div>
        </div>

        {/* User Badge Info */}
        <div 
          style={{
            padding: '18px 20px',
            background: 'rgba(184, 92, 56, 0.03)',
            borderBottom: '1px solid rgba(184, 92, 56, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulsing-dot-green" style={{ background: '#2e7d32', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ fontSize: '9px', letterSpacing: '0.8px', color: '#2e7d32', fontWeight: 700, textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>
              Active Database Session
            </span>
          </div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#2E2A27', marginTop: '2px', fontFamily: "'Montserrat', sans-serif" }}>
            {activeRoleName}
          </div>
          <div style={{ fontSize: '11px', color: '#8c8070', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {activeEmailText}
          </div>
        </div>

        {/* Menu Links */}
        <nav 
          style={{
            padding: '24px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flexGrow: 1,
            overflowY: 'auto'
          }}
        >
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#8c8070', fontWeight: 700, letterSpacing: '1px', paddingLeft: '8px', display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif" }}>
              General Desk
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    width: '100%',
                    background: activeTab === 'dashboard' ? 'rgba(184, 92, 56, 0.06)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === 'dashboard' ? '3px solid #B85C38' : '3px solid transparent',
                    borderRadius: '0 4px 4px 0',
                    padding: '10px 12px',
                    color: activeTab === 'dashboard' ? '#B85C38' : '#6E6558',
                    fontSize: '13px',
                    fontWeight: activeTab === 'dashboard' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
                  </svg>
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#8c8070', fontWeight: 700, letterSpacing: '1px', paddingLeft: '8px', display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif" }}>
              Directorate Operations
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('content')}
                  style={{
                    width: '100%',
                    background: activeTab === 'content' ? 'rgba(184, 92, 56, 0.06)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === 'content' ? '3px solid #B85C38' : '3px solid transparent',
                    borderRadius: '0 4px 4px 0',
                    padding: '10px 12px',
                    color: activeTab === 'content' ? '#B85C38' : '#6E6558',
                    fontSize: '13px',
                    fontWeight: activeTab === 'content' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                  </svg>
                  Content workspace
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('approvals')}
                  style={{
                    width: '100%',
                    background: activeTab === 'approvals' ? 'rgba(184, 92, 56, 0.06)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === 'approvals' ? '3px solid #B85C38' : '3px solid transparent',
                    borderRadius: '0 4px 4px 0',
                    padding: '10px 12px',
                    color: activeTab === 'approvals' ? '#B85C38' : '#6E6558',
                    fontSize: '13px',
                    fontWeight: activeTab === 'approvals' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Approvals
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#8c8070', fontWeight: 700, letterSpacing: '1px', paddingLeft: '8px', display: 'block', marginBottom: '8px', fontFamily: "'Montserrat', sans-serif" }}>
              Administration
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('users')}
                  style={{
                    width: '100%',
                    background: activeTab === 'users' ? 'rgba(184, 92, 56, 0.06)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === 'users' ? '3px solid #B85C38' : '3px solid transparent',
                    borderRadius: '0 4px 4px 0',
                    padding: '10px 12px',
                    color: activeTab === 'users' ? '#B85C38' : '#6E6558',
                    fontSize: '13px',
                    fontWeight: activeTab === 'users' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Users
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('roles')}
                  style={{
                    width: '100%',
                    background: activeTab === 'roles' ? 'rgba(184, 92, 56, 0.06)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === 'roles' ? '3px solid #B85C38' : '3px solid transparent',
                    borderRadius: '0 4px 4px 0',
                    padding: '10px 12px',
                    color: activeTab === 'roles' ? '#B85C38' : '#6E6558',
                    fontSize: '13px',
                    fontWeight: activeTab === 'roles' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Roles &amp; permissions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('flags')}
                  style={{
                    width: '100%',
                    background: activeTab === 'flags' ? 'rgba(184, 92, 56, 0.06)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === 'flags' ? '3px solid #B85C38' : '3px solid transparent',
                    borderRadius: '0 4px 4px 0',
                    padding: '10px 12px',
                    color: activeTab === 'flags' ? '#B85C38' : '#6E6558',
                    fontSize: '13px',
                    fontWeight: activeTab === 'flags' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                  Feature flags
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('audit')}
                  style={{
                    width: '100%',
                    background: activeTab === 'audit' ? 'rgba(184, 92, 56, 0.06)' : 'transparent',
                    border: 'none',
                    borderLeft: activeTab === 'audit' ? '3px solid #B85C38' : '3px solid transparent',
                    borderRadius: '0 4px 4px 0',
                    padding: '10px 12px',
                    color: activeTab === 'audit' ? '#B85C38' : '#6E6558',
                    fontSize: '13px',
                    fontWeight: activeTab === 'audit' ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
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
            borderBottom: '1px solid rgba(184, 92, 56, 0.15)',
            background: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6E6558' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: '#6E6558',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                borderRadius: '4px',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(184, 92, 56, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              aria-label="Toggle sidebar"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <span style={{ fontWeight: 700, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.8px', color: '#B85C38' }}>Portal Console</span>
            <span style={{ color: 'rgba(184, 92, 56, 0.3)' }}>/</span>
            <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#2E2A27' }}>
              {activeTab === 'dashboard' ? 'General Dashboard' : activeTab}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(184, 92, 56, 0.25)',
                borderRadius: '2px',
                padding: '6px 14px',
                color: '#B85C38',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '11px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                fontFamily: "'Montserrat', sans-serif",
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(184, 92, 56, 0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ← Exit Console
            </button>

            <button 
              onClick={onLogout}
              style={{
                background: '#B85C38',
                border: 'none',
                borderRadius: '2px',
                padding: '7px 16px',
                color: '#FFFFFF',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '11px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: '0 4px 8px rgba(184, 92, 56, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#8c4125';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#B85C38';
              }}
            >
              Log Out Session
            </button>
          </div>
        </header>

        {/* Inner Content Area */}
        <div style={{ padding: '36px', flexGrow: 1 }}>

          {/* 1. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2E2A27', margin: 0, letterSpacing: '0.5px', fontFamily: "'Montserrat', sans-serif" }}>
                  Administrative Dashboard
                </h2>
                <p style={{ fontSize: '13.5px', color: '#6E6558', margin: '4px 0 0 0', fontWeight: 500 }}>
                  Overview of the Madhya Pradesh Heritage Platform.
                </p>
              </div>

              {/* Stats Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070', letterSpacing: '1px', fontFamily: "'Montserrat', sans-serif" }}>Total Notices</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: '#B85C38', marginTop: '10px', fontFamily: "'Montserrat', sans-serif" }}>{notices.length}</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070', letterSpacing: '1px', fontFamily: "'Montserrat', sans-serif" }}>Active Staff</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: '#B85C38', marginTop: '10px', fontFamily: "'Montserrat', sans-serif" }}>7 <span style={{ fontSize: '14px', color: '#6E6558' }}>Registered</span></div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070', letterSpacing: '1px', fontFamily: "'Montserrat', sans-serif" }}>Ticket Bookings</div>
                  <div style={{ fontSize: '36px', fontWeight: 700, color: '#B85C38', marginTop: '10px', fontFamily: "'Montserrat', sans-serif" }}>148 <span style={{ fontSize: '14px', color: '#6E6558' }}>Active</span></div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070', letterSpacing: '1px', fontFamily: "'Montserrat', sans-serif" }}>System Integrity</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#2e7d32', marginTop: '24px', letterSpacing: '1.2px', textShadow: '0 0 10px rgba(46,125,50,0.08)' }}>SECURE &amp; STABLE</div>
                </div>
              </div>

              {/* Split Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px', alignItems: 'start' }}>
                {/* Publish announcement form */}
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '32px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)' }}>
                  <h3 style={{ fontSize: '15px', color: '#B85C38', margin: '0 0 20px 0', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '12px', fontFamily: "'Montserrat', sans-serif" }}>
                    Publish Portal Announcement
                  </h3>
                  <form onSubmit={handlePublish}>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#8c8070', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid rgba(184, 92, 56, 0.25)',
                          borderRadius: '2px',
                          fontSize: '13px',
                          background: '#FFFFFF',
                          color: '#2E2A27',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Tender">Tender</option>
                        <option value="Recruitment">Recruitment</option>
                        <option value="Circular">Circular</option>
                        <option value="EOI">EOI</option>
                        <option value="General Notice">General Notice</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#8c8070', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title / Description</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Museum upgrades works"
                        required 
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid rgba(184, 92, 56, 0.25)',
                          borderRadius: '2px',
                          fontSize: '13px',
                          background: '#FFFFFF',
                          color: '#2E2A27',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#8c8070', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</label>
                      <input 
                        type="text" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required 
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid rgba(184, 92, 56, 0.25)',
                          borderRadius: '2px',
                          fontSize: '13px',
                          background: '#FFFFFF',
                          color: '#2E2A27',
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
                        padding: '12px',
                        background: 'linear-gradient(135deg, #B85C38, #8c4125)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '2px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 12px rgba(184, 92, 56, 0.2)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
                    </button>
                  </form>
                </div>

                {/* Quick actions panel */}
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '32px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)', maxHeight: '500px', overflowY: 'auto' }}>
                  <h3 style={{ fontSize: '15px', color: '#B85C38', margin: '0 0 20px 0', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '12px', fontFamily: "'Montserrat', sans-serif" }}>
                    Quick Notice Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notices.map((n) => (
                      <div key={n.id || n._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '4px' }}>
                        <div style={{ textAlign: 'left', maxWidth: '75%' }}>
                          <span style={{ fontSize: '9px', color: '#B85C38', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{n.category}</span>
                          <div style={{ fontSize: '13px', fontWeight: 600, margin: '4px 0', color: '#2E2A27' }}>{n.title}</div>
                          <span style={{ fontSize: '10px', color: '#8c8070' }}>{n.date}</span>
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
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FCA5A5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FEE2E2';
                          }}
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
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2E2A27', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
                  Content Workspace
                </h2>
                <p style={{ fontSize: '13.5px', color: '#6E6558', margin: '4px 0 0 0' }}>
                  Manage site pages, announcements, resources, and catalogued artifacts.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '32px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#B85C38', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '12px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: "'Montserrat', sans-serif" }}>
                  Active Notices &amp; Announcements ({notices.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notices.map((notice) => (
                    <div 
                      key={notice._id || notice.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: 'rgba(184, 92, 56, 0.02)',
                        border: '1px solid rgba(184, 92, 56, 0.08)',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ textAlign: 'left', maxWidth: '75%' }}>
                        <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#B85C38', fontWeight: 700, letterSpacing: '0.5px' }}>{notice.category}</span>
                        <p style={{ fontSize: '14px', fontWeight: 600, margin: '4px 0', color: '#2E2A27' }}>{notice.title}</p>
                        <span style={{ fontSize: '10.5px', color: '#8c8070' }}>Published Date: {notice.date}</span>
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
                          fontWeight: '600',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FCA5A5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FEE2E2';
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
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2E2A27', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
                  Pending Approvals
                </h2>
                <p style={{ fontSize: '13.5px', color: '#6E6558', margin: '4px 0 0 0' }}>
                  Review and authorize portal edits and visitor e-ticket booking confirmations.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(184, 92, 56, 0.2)', color: '#B85C38', fontWeight: 700 }}>
                      <th style={{ padding: '14px' }}>Request ID</th>
                      <th style={{ padding: '14px' }}>Type</th>
                      <th style={{ padding: '14px' }}>Details</th>
                      <th style={{ padding: '14px' }}>Requested By</th>
                      <th style={{ padding: '14px' }}>Status</th>
                      <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(184, 92, 56, 0.08)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#2E2A27' }}>#ET-89481</td>
                      <td style={{ padding: '14px' }}>e-Ticket Booking Approval</td>
                      <td style={{ padding: '14px', color: '#6E6558' }}>5 Adults ticket booking for Bhimbetka Rock Shelters</td>
                      <td style={{ padding: '14px', fontFamily: 'monospace', color: '#8c8070' }}>web-gate@mp.gov.in</td>
                      <td style={{ padding: '14px' }}><span style={{ color: '#D97706', background: 'rgba(217,119,6,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>PENDING GATEWAY</span></td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button onClick={() => alert('Booking Approved')} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '11px', fontWeight: 600 }}>Approve</button>
                        <button onClick={() => alert('Booking Rejected')} style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Reject</button>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(184, 92, 56, 0.08)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#2E2A27' }}>#ET-89480</td>
                      <td style={{ padding: '14px' }}>e-Ticket Booking Approval</td>
                      <td style={{ padding: '14px', color: '#6E6558' }}>2 Adults, 1 Child ticket booking for Bhopal Museum</td>
                      <td style={{ padding: '14px', fontFamily: 'monospace', color: '#8c8070' }}>web-gate@mp.gov.in</td>
                      <td style={{ padding: '14px' }}><span style={{ color: '#D97706', background: 'rgba(217,119,6,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>PENDING GATEWAY</span></td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button onClick={() => alert('Booking Approved')} style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '11px', fontWeight: 600 }}>Approve</button>
                        <button onClick={() => alert('Booking Rejected')} style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Reject</button>
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
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2E2A27', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
                  User Management
                </h2>
                <p style={{ fontSize: '13.5px', color: '#6E6558', margin: '4px 0 0 0' }}>
                  Create, suspend and assign authorization groups to staff users.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '32px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#B85C38', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: "'Montserrat', sans-serif" }}>Active User Database ({SEEDED_ROLES.length})</span>
                  <button onClick={() => alert('Create user form')} style={{ background: 'linear-gradient(135deg, #B85C38, #8c4125)', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '2px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Montserrat', sans-serif" }}>+ Add New User</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {SEEDED_ROLES.map((role) => (
                    <div 
                      key={role.email}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 18px',
                        background: 'rgba(184, 92, 56, 0.02)',
                        border: '1px solid rgba(184, 92, 56, 0.08)',
                        borderRadius: '4px'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '14px', color: '#2E2A27' }}>{role.name}</strong>
                        <div style={{ fontSize: '11px', color: '#8c8070', marginTop: '3px', fontFamily: 'monospace' }}>{role.email}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '9px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', padding: '3px 10px', borderRadius: '100px', fontWeight: 700, letterSpacing: '0.5px' }}>
                          ACTIVE
                        </span>
                        <button 
                          onClick={() => alert(`Modify permissions for: ${role.name}`)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(184, 92, 56, 0.25)',
                            fontSize: '11px',
                            color: '#B85C38',
                            padding: '6px 12px',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontFamily: "'Montserrat', sans-serif",
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(184, 92, 56, 0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2E2A27', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
                  Roles &amp; Permissions capability matrix
                </h2>
                <p style={{ fontSize: '13.5px', color: '#6E6558', margin: '4px 0 0 0' }}>
                  The capability matrix that gates the whole platform.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(184, 92, 56, 0.2)', color: '#B85C38', fontWeight: 700 }}>
                      <th style={{ padding: '14px' }}>Role Group</th>
                      <th style={{ padding: '14px' }}>Publish Notices</th>
                      <th style={{ padding: '14px' }}>Modify Tickets</th>
                      <th style={{ padding: '14px' }}>Database Access</th>
                      <th style={{ padding: '14px' }}>Admin Console</th>
                      <th style={{ padding: '14px' }}>Feature Toggles</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(184, 92, 56, 0.08)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#2E2A27' }}>System Administrator</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(184, 92, 56, 0.08)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#2E2A27' }}>Directorate Admin</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#d32f2f' }}>✗ Restricted</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#d32f2f' }}>✗ Restricted</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(184, 92, 56, 0.08)' }}>
                      <td style={{ padding: '14px', fontWeight: 700, color: '#2E2A27' }}>Museum / Site Admin</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#d32f2f' }}>✗ Restricted</td>
                      <td style={{ padding: '14px', color: '#d32f2f' }}>✗ Restricted</td>
                      <td style={{ padding: '14px', color: '#2e7d32', fontWeight: 700 }}>✓ Granted</td>
                      <td style={{ padding: '14px', color: '#d32f2f' }}>✗ Restricted</td>
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
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2E2A27', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
                  Feature flags
                </h2>
                <p style={{ fontSize: '13.5px', color: '#6E6558', margin: '4px 0 0 0' }}>
                  Runtime governance &amp; phase toggles.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '32px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '14.5px', color: '#2E2A27' }}>e-Ticket Booking Gateway</strong>
                      <p style={{ fontSize: '12px', color: '#6E6558', margin: '4px 0 0 0' }}>Enables live ticketing and seat selection on monument detail views.</p>
                    </div>
                    <button 
                      onClick={() => toggleFlag('eTicketBooking')} 
                      style={{
                        background: flags.eTicketBooking ? 'rgba(46,125,50,0.1)' : 'rgba(211,47,47,0.1)',
                        border: flags.eTicketBooking ? '1px solid rgba(46,125,50,0.3)' : '1px solid rgba(211,47,47,0.3)',
                        color: flags.eTicketBooking ? '#2e7d32' : '#d32f2f',
                        padding: '8px 18px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        letterSpacing: '0.8px',
                        fontFamily: "'Montserrat', sans-serif",
                        transition: 'all 0.2s'
                      }}
                    >
                      {flags.eTicketBooking ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '14.5px', color: '#2E2A27' }}>Museum Audio Guide Streaming</strong>
                      <p style={{ fontSize: '12px', color: '#6E6558', margin: '4px 0 0 0' }}>Enable voice guide playbacks inside museum sub-panels.</p>
                    </div>
                    <button 
                      onClick={() => toggleFlag('museumAudioGuide')} 
                      style={{
                        background: flags.museumAudioGuide ? 'rgba(46,125,50,0.1)' : 'rgba(211,47,47,0.1)',
                        border: flags.museumAudioGuide ? '1px solid rgba(46,125,50,0.3)' : '1px solid rgba(211,47,47,0.3)',
                        color: flags.museumAudioGuide ? '#2e7d32' : '#d32f2f',
                        padding: '8px 18px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        letterSpacing: '0.8px',
                        fontFamily: "'Montserrat', sans-serif",
                        transition: 'all 0.2s'
                      }}
                    >
                      {flags.museumAudioGuide ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '4px' }}>
                    <div>
                      <strong style={{ fontSize: '14.5px', color: '#2E2A27' }}>Virtual 3D Tour Rendering</strong>
                      <p style={{ fontSize: '12px', color: '#6E6558', margin: '4px 0 0 0' }}>Enables WebGL-based virtual interactive tours of historical sites.</p>
                    </div>
                    <button 
                      onClick={() => toggleFlag('virtualTour3D')} 
                      style={{
                        background: flags.virtualTour3D ? 'rgba(46,125,50,0.1)' : 'rgba(211,47,47,0.1)',
                        border: flags.virtualTour3D ? '1px solid rgba(46,125,50,0.3)' : '1px solid rgba(211,47,47,0.3)',
                        color: flags.virtualTour3D ? '#2e7d32' : '#d32f2f',
                        padding: '8px 18px',
                        fontSize: '11px',
                        fontWeight: 700,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        letterSpacing: '0.8px',
                        fontFamily: "'Montserrat', sans-serif",
                        transition: 'all 0.2s'
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
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2E2A27', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>
                  Security and activity audit trail
                </h2>
                <p style={{ fontSize: '13.5px', color: '#6E6558', margin: '4px 0 0 0' }}>
                  Security and activity audit trail of active administrative database sessions.
                </p>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(184,92,56,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(184, 92, 56, 0.2)', color: '#B85C38', fontWeight: 700 }}>
                      <th style={{ padding: '14px' }}>Timestamp</th>
                      <th style={{ padding: '14px' }}>Initiated By</th>
                      <th style={{ padding: '14px' }}>Action Log</th>
                      <th style={{ padding: '14px' }}>Target Resource</th>
                      <th style={{ padding: '14px', textAlign: 'right' }}>Security Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid rgba(184, 92, 56, 0.08)' }}>
                        <td style={{ padding: '14px', fontFamily: 'monospace', color: '#B85C38', fontWeight: 600 }}>{log.time}</td>
                        <td style={{ padding: '14px', fontWeight: 700, color: '#2E2A27' }}>{log.user}</td>
                        <td style={{ padding: '14px', color: '#6E6558' }}>{log.action}</td>
                        <td style={{ padding: '14px', fontStyle: 'italic', color: '#8c8070' }}>{log.target}</td>
                        <td style={{ padding: '14px', textAlign: 'right', color: '#2e7d32', fontWeight: 700, letterSpacing: '0.5px' }}>LEVEL 1 SECURITY</td>
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
