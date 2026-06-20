import React, { useState } from 'react';
import OrnamentalDivider from './OrnamentalDivider';

const SEEDED_ROLES = [
  { name: 'System Administrator', email: 'superadmin@mp.gov.in' },
  { name: 'Directorate Admin', email: 'diradmin@mp.gov.in' },
  { name: 'A. Officer', email: 'officer@mp.gov.in' },
  { name: 'Museum Admin (Bhopal)', email: 'museum@mp.gov.in' },
  { name: 'Site Incharge (Bhimbetka)', email: 'site@mp.gov.in' },
  { name: 'Institute Admin (Wakankar)', email: 'institute@mp.gov.in' },
  { name: 'Trust Admin', email: 'trust@mp.gov.in' }
];

const CornerOrnament = ({ style }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    style={{ position: 'absolute', color: 'var(--gold)', pointerEvents: 'none', ...style }}
  >
    <path d="M 2 24 L 2 2 L 24 2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M 6 24 L 6 6 L 24 6" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="11" cy="11" r="2.5" fill="currentColor" />
  </svg>
);

const SanchiTorana = ({ size = 80, style = {} }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    style={{ color: 'var(--gold)', ...style }}
  >
    {/* Horizontal curved beams */}
    <path d="M 15 25 C 30 20, 70 20, 85 25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 15 35 C 30 30, 70 30, 85 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M 15 45 C 30 40, 70 40, 85 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Scroll details on ends of beams */}
    <path d="M 15 25 C 10 25, 10 20, 15 20" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 85 25 C 90 25, 90 20, 85 20" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 15 35 C 10 35, 10 30, 15 30" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 85 35 C 90 35, 90 30, 85 30" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 15 45 C 10 45, 10 40, 15 40" stroke="currentColor" strokeWidth="1" />
    <path d="M 85 45 C 90 45, 90 40, 85 40" stroke="currentColor" strokeWidth="1" />

    {/* Vertical pillars */}
    <rect x="32" y="25" width="6" height="65" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <rect x="62" y="25" width="6" height="65" stroke="currentColor" strokeWidth="1.5" fill="none" />
    
    {/* Connector struts */}
    <line x1="35" y1="25" x2="35" y2="45" stroke="currentColor" strokeWidth="1.5" />
    <line x1="45" y1="25" x2="45" y2="45" stroke="currentColor" strokeWidth="1" />
    <line x1="55" y1="25" x2="55" y2="45" stroke="currentColor" strokeWidth="1" />
    <line x1="65" y1="25" x2="65" y2="45" stroke="currentColor" strokeWidth="1.5" />

    <line x1="22" y1="25" x2="22" y2="45" stroke="currentColor" strokeWidth="1" />
    <line x1="78" y1="25" x2="78" y2="45" stroke="currentColor" strokeWidth="1" />

    {/* Top Dharmachakra motif */}
    <circle cx="50" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="50" y1="19" x2="50" y2="22" stroke="currentColor" strokeWidth="1.5" />
    
    {/* step base */}
    <path d="M 20 90 L 80 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default function LoginPage({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validEmails = SEEDED_ROLES.map(r => r.email.toLowerCase());
    const inputEmail = email.toLowerCase().trim();

    const isDemoLogin = validEmails.includes(inputEmail) && password === 'demo123';
    const isLegacyLogin = inputEmail === 'admin' && password === 'admin';

    if (isDemoLogin || isLegacyLogin) {
      // Generate a secure random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setShowVerification(true);
    } else {
      setError('Invalid administrative credentials or role unauthorized.');
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');

    if (verificationCode.trim() === generatedCode) {
      const inputEmail = email.toLowerCase().trim();
      sessionStorage.setItem('mp_heritage_admin', 'true');
      sessionStorage.setItem('mp_heritage_user_role', inputEmail);
      onSuccess();
    } else {
      setError('Incorrect verification code. Please try again.');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#F5EFE6',
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(240, 230, 215, 0.9) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '40px 20px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* Background Heritage Gateway Watermark (Bottom Right) */}
      <SanchiTorana 
        size={360} 
        style={{ 
          position: 'absolute', 
          bottom: '-60px', 
          right: '-40px', 
          color: 'var(--gold)', 
          opacity: 0.05, 
          zIndex: 0,
          pointerEvents: 'none'
        }} 
      />

      {/* Background Mandala Watermark (Top Left) */}
      <svg 
        width="380" 
        height="380" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-80px',
          color: 'var(--gold)',
          opacity: 0.04,
          zIndex: 0,
          pointerEvents: 'none'
        }}
      >
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line 
            key={i} 
            x1="100" y1="100" x2="100" y2="10" 
            transform={`rotate(${i * 30} 100 100)`} 
            stroke="currentColor" 
            strokeWidth="0.5" 
          />
        ))}
      </svg>

      {/* Back button on top left */}
      <button 
        onClick={onClose}
        className="back-btn-anim"
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          background: '#FDFBF7',
          border: '1px solid rgba(184, 92, 56, 0.25)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 16px',
          color: 'var(--gold)',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(184,92,56,0.04)',
          fontFamily: "'Cinzel', serif",
          fontSize: '11px',
          letterSpacing: '1px',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(184, 92, 56, 0.06)';
          e.currentTarget.style.transform = 'translateX(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#FDFBF7';
          e.currentTarget.style.transform = 'none';
        }}
      >
        ← Back to Portal
      </button>

      {/* Parchment Login Card */}
      <div 
        className="login-page-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#FCFAF5',
          border: '1px solid rgba(184, 92, 56, 0.25)',
          borderRadius: '4px',
          boxShadow: 'inset 0 0 60px rgba(184, 92, 56, 0.03), 0 20px 50px rgba(13, 11, 8, 0.05)',
          padding: '48px 40px',
          boxSizing: 'border-box',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Intricate Corner Ornaments */}
        <CornerOrnament style={{ top: 12, left: 12 }} />
        <CornerOrnament style={{ top: 12, right: 12, transform: 'rotate(90deg)' }} />
        <CornerOrnament style={{ bottom: 12, left: 12, transform: 'rotate(-90deg)' }} />
        <CornerOrnament style={{ bottom: 12, right: 12, transform: 'rotate(180deg)' }} />

        <div style={{ marginBottom: '24px' }}>
          {/* Branded Heritage Sanchi Torana Emblem */}
          <div className="login-emblem-glow" style={{ display: 'inline-block', marginBottom: '12px' }}>
            <SanchiTorana size={64} />
          </div>
          <h3 style={{ fontSize: '22px', fontFamily: "'Cinzel', serif", color: 'var(--gold)', margin: '0 0 8px 0', letterSpacing: '1px', fontWeight: 600 }}>
            Staff &amp; Institution Login
          </h3>
          <p style={{ fontSize: '12px', fontFamily: "'Inter', sans-serif", color: 'var(--text-dim)', margin: 0, fontWeight: 500, letterSpacing: '0.2px' }}>
            Authorised personnel only. Access is role-scoped and audited.
          </p>
        </div>

        {!showVerification ? (
          <form 
            onSubmit={handleSubmit} 
            style={{ 
              textAlign: 'left',
              border: '1px solid rgba(184, 92, 56, 0.14)',
              borderRadius: '4px',
              padding: '24px 20px',
              background: 'rgba(255, 255, 255, 0.45)',
              boxShadow: '0 6px 18px rgba(184, 92, 56, 0.02)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <label 
                htmlFor="login-email" 
                style={{ display: 'block', fontSize: '10px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: '700', color: '#8c8070', marginBottom: '6px' }}
              >
                Email
              </label>
              <input 
                type="email" 
                id="login-email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid rgba(184, 92, 56, 0.25)',
                  borderRadius: '2px',
                  fontSize: '13px',
                  background: '#FCFAF5',
                  color: '#111111',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', sans-serif"
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="login-password" 
                style={{ display: 'block', fontSize: '10px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: '700', color: '#8c8070', marginBottom: '6px' }}
              >
                Password
              </label>
              <input 
                type="password" 
                id="login-password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid rgba(184, 92, 56, 0.25)',
                  borderRadius: '2px',
                  fontSize: '13px',
                  background: '#FCFAF5',
                  color: '#111111',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "'Inter', sans-serif"
                }}
              />
            </div>

            {error && (
              <div style={{ color: '#E87070', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '600', fontFamily: "'Inter', sans-serif" }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, var(--gold), #9A4B29)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                fontSize: '11px',
                fontFamily: "'Cinzel', serif",
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(184,92,56,0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(184,92,56,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(184,92,56,0.2)';
              }}
            >
              Sign in
            </button>
          </form>
        ) : (
          <form 
            onSubmit={handleVerify} 
            style={{ 
              textAlign: 'left',
              border: '1px solid rgba(184, 92, 56, 0.14)',
              borderRadius: '4px',
              padding: '24px 20px',
              background: 'rgba(255, 255, 255, 0.45)',
              boxShadow: '0 6px 18px rgba(184, 92, 56, 0.02)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ marginBottom: '16px', background: 'rgba(184, 92, 56, 0.06)', border: '1px dashed rgba(184, 92, 56, 0.3)', borderRadius: '4px', padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              A security verification code has been generated. For demonstration, please enter the following code to proceed:
              <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--gold)', marginTop: '8px', textAlign: 'center', fontFamily: 'monospace' }}>
                {generatedCode}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="verification-code" 
                style={{ display: 'block', fontSize: '10px', fontFamily: "'Inter', sans-serif", letterSpacing: '0.8px', textTransform: 'uppercase', fontWeight: '700', color: '#8c8070', marginBottom: '6px' }}
              >
                Verification Code
              </label>
              <input 
                type="text" 
                id="verification-code" 
                placeholder="Enter 6-digit code" 
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required 
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px solid rgba(184, 92, 56, 0.25)',
                  borderRadius: '2px',
                  fontSize: '16px',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  background: '#FCFAF5',
                  color: '#111111',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: "monospace"
                }}
              />
            </div>

            {error && (
              <div style={{ color: '#E87070', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '600', fontFamily: "'Inter', sans-serif" }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, var(--gold), #9A4B29)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '2px',
                fontSize: '11px',
                fontFamily: "'Cinzel', serif",
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(184,92,56,0.2)',
                transition: 'all 0.2s ease',
                marginBottom: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(184,92,56,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(184,92,56,0.2)';
              }}
            >
              Verify &amp; Sign In
            </button>

            <button 
              type="button"
              onClick={() => {
                setShowVerification(false);
                setVerificationCode('');
                setError('');
              }}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                color: 'var(--text-dim)',
                border: '1px solid rgba(184, 92, 56, 0.15)',
                borderRadius: '2px',
                fontSize: '10px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(184, 92, 56, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              ← Back to Login
            </button>
          </form>
        )}

        {!showVerification && (
          <>
            {/* Ornamental Divider Accent */}
            <div style={{ marginTop: '24px', marginBottom: '16px', opacity: 0.85 }}>
              <OrnamentalDivider />
            </div>

            {/* Demo role picker section */}
            <div 
              style={{ 
                textAlign: 'left' 
              }}
            >
              <div style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: '700', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px', letterSpacing: '0.8px' }}>
                Demo Role Accounts (Password: demo123)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {SEEDED_ROLES.map((role) => (
                  <button
                    key={role.email}
                    type="button"
                    onClick={() => {
                      setEmail(role.email);
                      setPassword('demo123');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid rgba(184, 92, 56, 0.08)',
                      padding: '10px 0',
                      textAlign: 'left',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: "'Inter', sans-serif",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderBottomColor = 'var(--gold)';
                      e.currentTarget.style.paddingLeft = '6px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderBottomColor = 'rgba(184, 92, 56, 0.08)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    <span style={{ fontWeight: '600', color: 'var(--gold)' }}>{role.name}</span>
                    <span style={{ fontSize: '11px', color: '#111111', fontWeight: 500 }}>{role.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
