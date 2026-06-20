import React, { useState } from 'react';

const SEEDED_ROLES = [
  { name: 'System Administrator', email: 'superadmin@mp.gov.in' },
  { name: 'Directorate Admin', email: 'diradmin@mp.gov.in' },
  { name: 'A. Officer', email: 'officer@mp.gov.in' },
  { name: 'Museum Admin (Bhopal)', email: 'museum@mp.gov.in' },
  { name: 'Site Incharge (Bhimbetka)', email: 'site@mp.gov.in' },
  { name: 'Institute Admin (Wakankar)', email: 'institute@mp.gov.in' },
  { name: 'Trust Admin', email: 'trust@mp.gov.in' }
];

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validEmails = SEEDED_ROLES.map(r => r.email.toLowerCase());
    const inputEmail = email.toLowerCase().trim();

    const isDemoLogin = validEmails.includes(inputEmail) && password === 'demo123';
    const isLegacyLogin = inputEmail === 'admin' && password === 'admin';

    if (isDemoLogin || isLegacyLogin) {
      sessionStorage.setItem('mp_heritage_admin', 'true');
      sessionStorage.setItem('mp_heritage_user_role', inputEmail);
      onSuccess();
    } else {
      setError('Invalid administrative credentials or role unauthorized.');
    }
  };

  return (
    <div className="login-modal open" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className="login-modal-overlay" onClick={onClose}></div>
      <div className="login-modal-content" style={{ maxWidth: '440px' }}>
        <button className="btn-login-close" onClick={onClose} aria-label="Close modal">×</button>
        
        <div className="login-modal-header" style={{ marginBottom: '20px' }}>
          <div className="login-modal-emblem" aria-hidden="true" style={{ margin: '0 auto 12px' }}>मध्य</div>
          <h3 className="login-modal-title" id="login-title" style={{ fontSize: '20px', fontFamily: "'Cinzel', serif" }}>
            Staff &amp; institution login
          </h3>
          <p className="login-modal-subtitle" style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
            Authorised personnel only. Access is role-scoped and audited.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-form-group" style={{ marginBottom: '14px' }}>
            <label className="login-form-label" htmlFor="login-email">Email</label>
            <input 
              type="email" 
              className="login-form-input" 
              id="login-email" 
              placeholder="Enter email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="login-form-group" style={{ marginBottom: '16px' }}>
            <label className="login-form-label" htmlFor="login-password">Password</label>
            <input 
              type="password" 
              className="login-form-input" 
              id="login-password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && (
            <div style={{ color: '#E87070', fontSize: '12px', marginBottom: '14px', textAlign: 'center', fontWeight: '600' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-login-submit" style={{ width: '100%' }}>Sign in</button>
        </form>

        {/* Demo role picker section */}
        <div 
          className="demo-roles-container" 
          style={{ 
            marginTop: '20px', 
            borderTop: '1px solid rgba(184, 92, 56, 0.16)', 
            paddingTop: '14px',
            textAlign: 'left' 
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.5px' }}>
            Demo: pick any seeded role below to sign in. (password: demo123)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {SEEDED_ROLES.map((role) => (
              <button
                key={role.email}
                type="button"
                onClick={() => {
                  setEmail(role.email);
                  setPassword('demo123');
                }}
                style={{
                  background: 'rgba(184, 92, 56, 0.04)',
                  border: '1px solid rgba(184, 92, 56, 0.12)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  textAlign: 'left',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 92, 56, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--gold)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(184, 92, 56, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(184, 92, 56, 0.12)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <span style={{ fontWeight: '600', color: 'var(--gold)' }}>{role.name}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{role.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
