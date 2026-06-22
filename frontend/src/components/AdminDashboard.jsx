import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const CornerOrnament = ({ style }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    style={{ position: 'absolute', color: 'var(--gold)', opacity: 0.8, pointerEvents: 'none', ...style }}
  >
    <path d="M 2 24 L 2 2 L 24 2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M 6 24 L 6 6 L 24 6" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="11" cy="11" r="2.5" fill="currentColor" />
  </svg>
);

export default function AdminDashboard({ notices, onClose, onNoticeUpdate, onLogout }) {
  // Retrieve user session info
  const token = sessionStorage.getItem('mp_heritage_admin_token');
  const role = sessionStorage.getItem('mp_heritage_user_role') || 'SYSTEM_ADMIN';
  const userEmail = sessionStorage.getItem('mp_heritage_user_email') || 'superadmin@mp.gov.in';
  const userName = sessionStorage.getItem('mp_heritage_user_name') || 'Administrator';
  const userInstitution = sessionStorage.getItem('mp_heritage_user_institution') || '';

  // Tab & UI state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dynamic API states
  const [widgets, setWidgets] = useState({});
  const [contentList, setContentList] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [featureFlags, setFeatureFlags] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Forms
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('notice');
  const [metaDetails, setMetaDetails] = useState(''); // JSON metadata string
  const [editorialComment, setEditorialComment] = useState('');

  // Admin user form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('MUSEUM_ADMIN');
  const [newUserInstitution, setNewUserInstitution] = useState('');

  // Fetch Dashboard Data
  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Fetch widgets
      const widgetsRes = await fetch(`${API_BASE}/dashboard/widgets`, { headers });
      if (widgetsRes.ok) setWidgets(await widgetsRes.json());

      // Fetch content
      const contentRes = await fetch(`${API_BASE}/content`, { headers });
      if (contentRes.ok) setContentList(await contentRes.json());

      // Fetch notifications
      const notificationsRes = await fetch(`${API_BASE}/dashboard/notifications`, { headers });
      if (notificationsRes.ok) setNotifications(await notificationsRes.json());

      // SYSTEM_ADMIN only queries
      if (role === 'SYSTEM_ADMIN') {
        const logsRes = await fetch(`${API_BASE}/admin/logs`, { headers });
        if (logsRes.ok) setAuditLogs(await logsRes.json());

        const flagsRes = await fetch(`${API_BASE}/admin/flags`, { headers });
        if (flagsRes.ok) setFeatureFlags(await flagsRes.json());

        const usersRes = await fetch(`${API_BASE}/admin/users`, { headers });
        if (usersRes.ok) setUsersList(await usersRes.json());
      }
    } catch (e) {
      console.error('Failed to retrieve dashboard details', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  // Handle Mark Notifications as Read
  const handleMarkNotificationsRead = async () => {
    try {
      await fetch(`${API_BASE}/dashboard/notifications/read`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Create content submit handler
  const handleCreateContent = async (e, submitDirectly = false) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    let parsedMetadata = {};
    try {
      if (metaDetails) parsedMetadata = JSON.parse(metaDetails);
    } catch (e) {
      alert('Metadata must be a valid JSON string');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          contentType,
          metadata: parsedMetadata,
          institution: userInstitution || 'State Museum, Bhopal',
          submit: submitDirectly
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Creation failed');
      }

      setTitle('');
      setDescription('');
      setMetaDetails('');
      alert(submitDirectly ? 'Content submitted for review!' : 'Draft saved!');
      fetchData();
      if (onNoticeUpdate) onNoticeUpdate();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Workflow status updates
  const handleWorkflowTransition = async (contentId, action) => {
    try {
      const res = await fetch(`${API_BASE}/content/${contentId}/workflow`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, comments: editorialComment })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Workflow transition failed');
      }

      setEditorialComment('');
      alert(`Workflow transition "${action}" executed successfully!`);
      fetchData();
      if (onNoticeUpdate) onNoticeUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Content handler
  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      const res = await fetch(`${API_BASE}/content/${contentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Deletion failed');
      }

      alert('Content deleted successfully.');
      fetchData();
      if (onNoticeUpdate) onNoticeUpdate();
    } catch (err) {
      alert(err.message);
    }
  };

  // Admin: Toggle Feature flag
  const handleToggleFlag = async (key, enabled) => {
    try {
      const res = await fetch(`${API_BASE}/admin/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key, enabled })
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Admin: Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) return;

    try {
      const res = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          institution: newUserInstitution || null
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Creation failed');
      }

      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserInstitution('');
      alert('Administrative account created successfully.');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Admin: Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('User removed.');
        fetchData();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Dynamic Menus per Role
  const getMenus = () => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'users', name: 'Users' },
          { id: 'flags', name: 'Feature Flags' },
          { id: 'audit', name: 'Audit Logs' },
          { id: 'settings', name: 'System Settings' }
        ];
      case 'DIRECTORATE_ADMIN':
        return [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'workspace', name: 'Content Workspace' },
          { id: 'approvals', name: 'Approvals' },
          { id: 'reports', name: 'Reports' }
        ];
      case 'DIRECTORATE_OFFICER':
        return [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'workspace', name: 'Content Workspace' },
          { id: 'approvals', name: 'Approvals' }
        ];
      case 'MUSEUM_ADMIN':
        return [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'museum', name: 'My Museum' },
          { id: 'workspace', name: 'Content Creator' }
        ];
      case 'SITE_INCHARGE':
        return [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'site', name: 'My Site' },
          { id: 'workspace', name: 'Content Creator' }
        ];
      case 'INSTITUTE_ADMIN':
        return [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'institute', name: 'Institute Workspace' },
          { id: 'workspace', name: 'Content Creator' }
        ];
      case 'TRUST_ADMIN':
        return [
          { id: 'dashboard', name: 'Dashboard' },
          { id: 'trust', name: 'Trust Projects' },
          { id: 'workspace', name: 'Content Creator' }
        ];
      default:
        return [{ id: 'dashboard', name: 'Dashboard' }];
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FCFAF6', color: 'var(--gold)' }}>
        <h2 style={{ fontFamily: 'monospace' }}>Authenticating Session &amp; Loading RBAC Console...</h2>
      </div>
    );
  }

  return (
    <div 
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#FCFAF6',
        backgroundImage: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.5) 0%, rgba(245, 240, 232, 0.7) 100%)',
        color: '#2E2A27',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden'
      }}
    >
      {/* Sidebar Navigation */}
      <aside 
        style={{
          width: isSidebarOpen ? '260px' : '0px',
          background: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          borderRight: isSidebarOpen ? '1px solid rgba(184, 92, 56, 0.12)' : 'none',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'width 0.3s ease'
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #B85C38, #8c4125)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#FFFFFF' }}>
            व
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--gold)', letterSpacing: '0.8px' }}>
              MP HERITAGE
            </h1>
            <span style={{ fontSize: '9px', color: '#8c8070', fontWeight: 600, textTransform: 'uppercase' }}>
              Scope: {role.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* User Info */}
        <div style={{ padding: '18px 20px', background: 'rgba(184, 92, 56, 0.03)', borderBottom: '1px solid rgba(184, 92, 56, 0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ background: '#10B981', width: '8px', height: '8px', borderRadius: '50%' }}></span>
            <span style={{ fontSize: '9px', color: '#10B981', fontWeight: 700 }}>VERIFIED 2FA SESSION</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2E2A27' }}>{userName}</div>
          <div style={{ fontSize: '11px', color: '#6E6558', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
          {userInstitution && (
            <div style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600, marginTop: '4px' }}>
              {userInstitution}
            </div>
          )}
        </div>

        <nav style={{ padding: '24px 14px', display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#8c8070', fontWeight: 700, paddingLeft: '8px', display: 'block', marginBottom: '8px' }}>
              Operations
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {getMenus().map((menu) => (
                <li key={menu.id}>
                  <button 
                    onClick={() => setActiveTab(menu.id)}
                    style={{
                      width: '100%',
                      background: activeTab === menu.id ? 'rgba(184, 92, 56, 0.05)' : 'transparent',
                      border: 'none',
                      borderLeft: activeTab === menu.id ? '3px solid var(--gold)' : '3px solid transparent',
                      borderRadius: '0 4px 4px 0',
                      padding: '10px 12px',
                      color: activeTab === menu.id ? 'var(--gold)' : '#6E6558',
                      fontSize: '13px',
                      fontWeight: activeTab === menu.id ? 700 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {menu.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <header style={{ padding: '16px 32px', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', background: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E6558', marginRight: '8px', fontSize: '18px' }}>
              ☰
            </button>
            <span style={{ fontWeight: 700, color: 'var(--gold)' }}>RBAC Portal</span>
            <span style={{ color: 'rgba(184, 92, 56, 0.3)' }}>/</span>
            <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#2E2A27' }}>{activeTab}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notification indicator */}
            {notifications.length > 0 && (
              <button 
                onClick={handleMarkNotificationsRead}
                style={{ background: 'rgba(184, 92, 56, 0.05)', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', color: 'var(--gold)', cursor: 'pointer' }}
                title="Mark all notifications as read"
              >
                🔔 {notifications.filter(n => !n.read).length} Unread
              </button>
            )}

            <button onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', padding: '6px 14px', color: 'var(--gold)', fontWeight: 700, cursor: 'pointer', fontSize: '11px', transition: 'all 0.2s' }}>
              ← Portal Homepage
            </button>
            <button onClick={onLogout} style={{ background: 'linear-gradient(135deg, var(--gold), #9A4B29)', border: 'none', borderRadius: '4px', padding: '7px 16px', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', fontSize: '11px', boxShadow: '0 4px 12px rgba(184,92,56,0.15)' }}>
              End Session
            </button>
          </div>
        </header>

        <div style={{ padding: '36px', flexGrow: 1 }}>
          {/* Notifications Center Banner */}
          {notifications.filter(n => !n.read).length > 0 && (
            <div style={{ background: 'rgba(184, 92, 56, 0.04)', border: '1px dashed var(--gold)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--gold)' }}>Recent Alerts &amp; Workflow Notifications:</strong>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '12px', color: '#6E6558' }}>
                {notifications.filter(n => !n.read).map(n => (
                  <li key={n._id} style={{ marginBottom: '4px' }}>{n.message}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 1. DASHBOARD VIEW (Role-Specific widgets display) */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--gold)', fontFamily: "'Montserrat', sans-serif" }}>
                  Welcome back, {userName}!
                </h2>
                <p style={{ fontSize: '13px', color: '#6E6558', margin: '4px 0 0 0' }}>
                  Role Dashboard: <strong style={{ color: 'var(--gold)' }}>{role.replace('_', ' ')}</strong> {userInstitution ? ` - ${userInstitution}` : ''}
                </p>
              </div>

              {/* Grid Widgets mapping to prompt specifications */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {role === 'SYSTEM_ADMIN' && (
                  <>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Total Users</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.totalUsers || 0}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Total Institutions</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.totalInstitutions || 0}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Active Sessions</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.activeSessions || 0}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>System Health</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981', marginTop: '16px' }}>{widgets.systemHealth}</div>
                    </div>
                  </>
                )}

                {role === 'DIRECTORATE_ADMIN' && (
                  <>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Pending Approvals</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.pendingApprovals || 0}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Visitor Stats (Monthly)</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--gold)', marginTop: '12px' }}>{widgets.monthlyVisitorStats}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Performance</div>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', marginTop: '12px' }}>{widgets.institutionPerformance}</div>
                    </div>
                  </>
                )}

                {role === 'DIRECTORATE_OFFICER' && (
                  <>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Review Requests</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.reviewRequests || 0}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>My Drafts</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#6E6558', marginTop: '6px' }}>{widgets.myDrafts || 0}</div>
                    </div>
                  </>
                )}

                {role === 'MUSEUM_ADMIN' && (
                  <>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Galleries</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.galleriesCount}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Artefacts</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.artefactsCount}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Visitor Insights</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#6E6558', marginTop: '16px' }}>{widgets.visitorInsights}</div>
                    </div>
                  </>
                )}

                {role === 'SITE_INCHARGE' && (
                  <>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Condition Reports</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.conditionReports}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Visitor Stats</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#6E6558', marginTop: '16px' }}>{widgets.visitorStatistics}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Maintenance tasks</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#EF4444', marginTop: '16px' }}>{widgets.maintenanceTasks}</div>
                    </div>
                  </>
                )}

                {role === 'INSTITUTE_ADMIN' && (
                  <>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Research Publications</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.researchPublications}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Academic Events</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: '#6E6558', marginTop: '6px' }}>{widgets.eventsCount}</div>
                    </div>
                  </>
                )}

                {role === 'TRUST_ADMIN' && (
                  <>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>Active Projects</div>
                      <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--gold)', marginTop: '6px' }}>{widgets.projectsCount}</div>
                    </div>
                    <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '20px', borderRadius: '6px', position: 'relative', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                      <CornerOrnament style={{ top: 6, right: 6, transform: 'rotate(90deg)' }} />
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#8c8070' }}>CSR Funding Status</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981', marginTop: '16px' }}>{widgets.fundingStatus}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Split view: Content status and actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px', alignItems: 'start' }}>
                {/* 1. Quick Info list / Activities */}
                <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                  <h3 style={{ fontSize: '14px', color: 'var(--gold)', margin: '0 0 16px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                    Portal Content Workspace ({contentList.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {contentList.map(c => (
                      <div key={c._id} style={{ padding: '12px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--gold)' }}>
                            {c.contentType}
                          </span>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '20px',
                            background: c.status === 'Published' ? '#D1FAE5' : c.status === 'Draft' ? '#F3F4F6' : '#FEF3C7',
                            color: c.status === 'Published' ? '#065F46' : c.status === 'Draft' ? '#374151' : '#92400E'
                          }}>
                            {c.status}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '13px', margin: '6px 0 2px 0', color: '#2E2A27' }}>{c.title}</h4>
                        <p style={{ fontSize: '11px', color: '#6E6558', margin: '0 0 8px 0' }}>{c.description}</p>
                        <span style={{ fontSize: '10px', color: '#8c8070' }}>Institution: {c.institution}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Quick Actions / Interactive features per Role */}
                {['MUSEUM_ADMIN', 'SITE_INCHARGE', 'INSTITUTE_ADMIN', 'TRUST_ADMIN'].includes(role) && (
                  <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                    <h3 style={{ fontSize: '14px', color: 'var(--gold)', margin: '0 0 16px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                      Draft New Entry / Update
                    </h3>
                    <form onSubmit={(e) => handleCreateContent(e, false)}>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>CONTENT TYPE</label>
                        <select 
                          value={contentType} 
                          onChange={(e) => setContentType(e.target.value)}
                          style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none' }}
                        >
                          {role === 'MUSEUM_ADMIN' && (
                            <>
                              <option value="gallery">Gallery Details</option>
                              <option value="artefact">Artefact Inventory</option>
                              <option value="announcement">Museum Notice</option>
                            </>
                          )}
                          {role === 'SITE_INCHARGE' && (
                            <>
                              <option value="condition_report">Condition Report</option>
                              <option value="notice">Visitor Notice/Alert</option>
                            </>
                          )}
                          {role === 'INSTITUTE_ADMIN' && (
                            <>
                              <option value="publication">Research Publication</option>
                              <option value="announcement">Academic Event</option>
                            </>
                          )}
                          {role === 'TRUST_ADMIN' && (
                            <>
                              <option value="project">Trust Project update</option>
                              <option value="csr_activity">CSR activity report</option>
                              <option value="annual_report">Annual Report PDF link</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>TITLE</label>
                        <input 
                          type="text" 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          required 
                          style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>DESCRIPTION/BODY</label>
                        <textarea 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          required 
                          rows="3"
                          style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>METADATA (JSON format)</label>
                        <textarea 
                          value={metaDetails} 
                          onChange={(e) => setMetaDetails(e.target.value)} 
                          placeholder='e.g., { "visitorCount": 200 }'
                          rows="2"
                          style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" disabled={submitting} style={{ flexGrow: 1, padding: '10px', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>
                          Save as Draft
                        </button>
                        <button type="button" onClick={(e) => handleCreateContent(e, true)} disabled={submitting} style={{ flexGrow: 1, padding: '10px', background: 'linear-gradient(135deg, var(--gold), #9A4B29)', border: 'none', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>
                          Submit for Review
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--gold)', margin: '0 0 16px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                Direct Workspace Items
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contentList.map(c => (
                  <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '6px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--gold)' }}>{c.contentType} ({c.status})</span>
                      <h4 style={{ fontSize: '14px', margin: '4px 0', color: '#2E2A27' }}>{c.title}</h4>
                      <p style={{ fontSize: '12px', color: '#6E6558', margin: '0' }}>{c.description}</p>
                      {c.comments && (
                        <div style={{ fontSize: '11px', color: '#92400E', marginTop: '6px', background: '#FEF3C7', padding: '6px 10px', borderRadius: '4px' }}>
                          Editorial Comment: "{c.comments}"
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Draft', 'Rejected'].includes(c.status) && (
                        <button 
                          onClick={() => handleWorkflowTransition(c._id, 'recommend')} // Simulates resubmitting to reviews
                          style={{ padding: '6px 12px', background: 'var(--gold)', border: 'none', color: '#FFFFFF', fontSize: '11px', cursor: 'pointer', fontWeight: 700, borderRadius: '4px' }}
                        >
                          Submit
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteContent(c._id)}
                        style={{ padding: '6px 12px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '11px', cursor: 'pointer', fontWeight: 700, borderRadius: '4px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. APPROVALS WORKFLOW TAB */}
          {activeTab === 'approvals' && (
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--gold)', margin: '0 0 20px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                Editorial Approvals &amp; Workflows
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#8c8070', marginBottom: '6px' }}>EDITORIAL / REVISION FEEDBACK COMMENT</label>
                <input 
                  type="text" 
                  value={editorialComment}
                  onChange={(e) => setEditorialComment(e.target.value)}
                  placeholder="Provide approval comment or rejection reason..."
                  style={{ width: '100%', padding: '10px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {contentList.filter(c => c.status !== 'Draft' && c.status !== 'Published').map(c => (
                  <div key={c._id} style={{ border: '1px solid rgba(184, 92, 56, 0.12)', padding: '16px', borderRadius: '6px', background: 'rgba(184, 92, 56, 0.01)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--gold)' }}>{c.institution}</span>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '3px 8px', borderRadius: '20px' }}>{c.status}</span>
                    </div>
                    <h4 style={{ fontSize: '14px', margin: '0 0 4px 0', color: '#2E2A27' }}>{c.title}</h4>
                    <p style={{ fontSize: '12px', color: '#6E6558', margin: '0 0 12px 0' }}>{c.description}</p>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {role === 'DIRECTORATE_OFFICER' && c.status === 'Submitted' && (
                        <button onClick={() => handleWorkflowTransition(c._id, 'review')} style={{ padding: '6px 12px', background: '#3B82F6', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '11px', borderRadius: '4px' }}>
                          Start Review
                        </button>
                      )}
                      {role === 'DIRECTORATE_OFFICER' && c.status === 'Under Review' && (
                        <button onClick={() => handleWorkflowTransition(c._id, 'recommend')} style={{ padding: '6px 12px', background: '#10B981', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '11px', borderRadius: '4px' }}>
                          Recommend Approval
                        </button>
                      )}
                      {(role === 'DIRECTORATE_ADMIN' || role === 'SYSTEM_ADMIN') && c.status === 'Approved' && (
                        <button onClick={() => handleWorkflowTransition(c._id, 'publish')} style={{ padding: '6px 12px', background: '#10B981', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '11px', borderRadius: '4px' }}>
                          Approve &amp; Publish
                        </button>
                      )}
                      {['DIRECTORATE_OFFICER', 'DIRECTORATE_ADMIN', 'SYSTEM_ADMIN'].includes(role) && (
                        <button onClick={() => handleWorkflowTransition(c._id, 'reject')} style={{ padding: '6px 12px', background: '#EF4444', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '11px', borderRadius: '4px' }}>
                          Reject &amp; Resubmit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SUPER ADMIN ONLY: USERS TAB */}
          {activeTab === 'users' && role === 'SYSTEM_ADMIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 16px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                  Create New Staff User
                </h3>
                <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>FULL NAME</label>
                    <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>EMAIL</label>
                    <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>PASSWORD</label>
                    <input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>ROLE ASSIGNMENT</label>
                    <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none' }}>
                      <option value="SYSTEM_ADMIN">Super Admin (SYSTEM_ADMIN)</option>
                      <option value="DIRECTORATE_ADMIN">Directorate Admin</option>
                      <option value="DIRECTORATE_OFFICER">Directorate Officer</option>
                      <option value="MUSEUM_ADMIN">Museum Admin</option>
                      <option value="SITE_INCHARGE">Site Incharge</option>
                      <option value="INSTITUTE_ADMIN">Institute Admin</option>
                      <option value="TRUST_ADMIN">Trust Admin</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#8c8070', marginBottom: '4px' }}>INSTITUTION ASSIGNMENT (If Institution Role)</label>
                    <input type="text" value={newUserInstitution} onChange={(e) => setNewUserInstitution(e.target.value)} placeholder="e.g. State Museum, Bhopal" style={{ width: '100%', padding: '8px', border: '1px solid rgba(184, 92, 56, 0.25)', borderRadius: '4px', background: '#FFFFFF', color: '#2E2A27', outline: 'none' }} />
                  </div>
                  <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', background: 'linear-gradient(135deg, var(--gold), #9A4B29)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>
                    Create &amp; Authorise User
                  </button>
                </form>
              </div>

              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 16px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                  Active Platform Users ({usersList.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {usersList.map(u => (
                    <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '6px' }}>
                      <div>
                        <strong style={{ color: '#2E2A27' }}>{u.name}</strong> ({u.role})
                        <div style={{ fontSize: '11px', color: '#6E6558' }}>Email: {u.email} | Institution: {u.institution || 'Global Access'}</div>
                      </div>
                      <button onClick={() => handleDeleteUser(u._id)} style={{ padding: '6px 12px', background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '11px', cursor: 'pointer', fontWeight: 700, borderRadius: '4px' }}>
                        Revoke Access
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. FEATURE FLAGS TAB */}
          {activeTab === 'flags' && role === 'SYSTEM_ADMIN' && (
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 16px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                Feature Toggle Center
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {featureFlags.map(f => (
                  <div key={f._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(184, 92, 56, 0.02)', border: '1px solid rgba(184, 92, 56, 0.08)', borderRadius: '6px' }}>
                    <div>
                      <strong style={{ color: '#2E2A27' }}>{f.key}</strong>
                      <div style={{ fontSize: '12px', color: '#6E6558' }}>{f.description}</div>
                    </div>
                    <button 
                      onClick={() => handleToggleFlag(f.key, !f.enabled)}
                      style={{
                        padding: '8px 16px',
                        background: f.enabled ? '#D1FAE5' : '#FEE2E2',
                        border: f.enabled ? '1px solid #10B981' : '1px solid #EF4444',
                        color: f.enabled ? '#065F46' : '#991B1B',
                        fontWeight: 700,
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {f.enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. AUDIT LOGS TAB */}
          {activeTab === 'audit' && role === 'SYSTEM_ADMIN' && (
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 16px 0', borderBottom: '1px solid rgba(184, 92, 56, 0.12)', paddingBottom: '8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>
                Full System Security Audit Trail (Last 100 Actions)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '500px', overflowY: 'auto' }}>
                {auditLogs.map((log) => (
                  <div key={log._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(184, 92, 56, 0.01)', borderBottom: '1px solid rgba(184, 92, 56, 0.08)', fontSize: '12px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontWeight: 700, color: 'var(--gold)' }}>[{log.role}] {log.user}</span>
                      <div style={{ color: '#2E2A27', marginTop: '3px' }}>Action: {log.action} {log.target ? `on "${log.target}"` : ''}</div>
                    </div>
                    <span style={{ fontSize: '10px', color: '#8c8070' }}>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INSTITUTION SPECIFIC DETAILED WORKSPACES (Advanced Features Showcase) */}
          {activeTab === 'museum' && role === 'MUSEUM_ADMIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* QR Code Generator */}
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>Artefact QR Code Label Generator</h3>
                <p style={{ fontSize: '12px', color: '#6E6558', marginBottom: '16px' }}>Generate printable labels with QR codes for visitor guidance displays.</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ border: '2px solid var(--gold)', padding: '10px', background: 'white' }}>
                    {/* Simulated QR Code */}
                    <div style={{ width: '80px', height: '80px', background: `repeating-conic-gradient(from 45deg, #111 0% 25%, #fff 0% 50%) 50% / 10px 10px` }}></div>
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#2E2A27' }}>Bhopal State Museum Exhibit #M-882</strong>
                    <div style={{ fontSize: '11px', color: '#6E6558', marginTop: '2px' }}>Description: 11th Century Parmara Dynasty Ganesha sculpture.</div>
                    <button onClick={() => alert('Sending label to Bhopal Museum printer...')} style={{ marginTop: '10px', padding: '6px 12px', background: 'var(--gold)', border: 'none', color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer', borderRadius: '4px' }}>Print Label</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'site' && role === 'SITE_INCHARGE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* GIS Map integration */}
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>Bhimbetka GIS Rock Shelters Map</h3>
                <p style={{ fontSize: '12px', color: '#6E6558', marginBottom: '16px' }}>Interactive geo-coordinates map overlay for structural erosion tracking.</p>
                <div style={{ height: '240px', background: '#F3F4F6', border: '1px solid rgba(184, 92, 56, 0.12)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                  {/* Simulated map graphic */}
                  <div style={{ position: 'absolute', top: '50px', left: '120px', width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
                  <div style={{ position: 'absolute', top: '100px', left: '160px', width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                  <div style={{ position: 'absolute', top: '180px', left: '80px', width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'white', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '6px', fontSize: '10px', borderRadius: '4px', color: '#2E2A27', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    🔴 Shelter 4: Active erosion alert
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'institute' && role === 'INSTITUTE_ADMIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>Scholar Profiles &amp; Citations</h3>
                <p style={{ fontSize: '12px', color: '#6E6558', marginBottom: '16px' }}>Academic research registration database matching international heritage indexing.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(184, 92, 56, 0.08)', color: '#2E2A27' }}>
                    <span>Dr. Ramesh K. Sharma (Paleolithic Tools Specialist)</span>
                    <strong style={{ color: 'var(--gold)' }}>148 Citations</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid rgba(184, 92, 56, 0.08)', color: '#2E2A27' }}>
                    <span>Prof. Anand Verma (Bhimbetka Cave Art Restoration)</span>
                    <strong style={{ color: 'var(--gold)' }}>92 Citations</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trust' && role === 'TRUST_ADMIN' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid rgba(184, 92, 56, 0.15)', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(184,92,56,0.02)' }}>
                <h3 style={{ fontSize: '15px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 700, fontFamily: "'Montserrat', sans-serif" }}>Corporate CSR Partnerships &amp; Grants</h3>
                <p style={{ fontSize: '12px', color: '#6E6558', marginBottom: '16px' }}>Project funding oversight dashboard for archaeological restoration.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ border: '1px solid rgba(184, 92, 56, 0.12)', padding: '12px', borderRadius: '6px', background: '#FCFAF7' }}>
                    <strong style={{ color: '#2E2A27' }}>National Coal Corp CSR</strong>
                    <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>₹1.8 Cr allocated (Bagh Caves site)</div>
                  </div>
                  <div style={{ border: '1px solid rgba(184, 92, 56, 0.12)', padding: '12px', borderRadius: '6px', background: '#FCFAF7' }}>
                    <strong style={{ color: '#2E2A27' }}>MP Tourism Dev Corp</strong>
                    <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>₹2.4 Cr allocated (Infrastructure development)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
