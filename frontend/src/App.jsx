import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Newsroom from './components/Newsroom';
import Categories from './components/Categories';
import Stats from './components/Stats';
import Monuments from './components/Monuments';
import Museums from './components/Museums';
import Research from './components/Research';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DetailDrawer from './components/DetailDrawer';
import SearchOverlay from './components/SearchOverlay';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import BookingModal from './components/BookingModal';
import ShopPage from './components/ShopPage';

export default function App() {
  // Notices states
  const [notices, setNotices] = useState([]);
  const [activeNoticeCategory, setActiveNoticeCategory] = useState('all');

  // Overlay states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeDrawerId, setActiveDrawerId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'login', 'admin'
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedBookingId, setPreselectedBookingId] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem('mp_heritage_admin') === 'true'
  );

  // Load notices from localStorage
  const fetchNotices = () => {
    const DEFAULT_NOTICES = [
      { id: 1, category: 'Tender', date: '8 June 2026', title: 'Conservation works at Bagh Caves' },
      { id: 2, category: 'Recruitment', date: '2 June 2026', title: 'Museum Curators (Contract)' },
      { id: 3, category: 'Circular', date: '26 May 2026', title: 'Revised summer visiting hours for museums' },
      { id: 4, category: 'EOI', date: '15 May 2026', title: 'Empanelment of digitization partners' },
      { id: 5, category: 'General Notice', date: '5 May 2026', title: 'Nominations open for Dr. V.S. Wakankar Rashtriya Samman' }
    ];
    let stored = localStorage.getItem('mp_heritage_notices');
    if (!stored) {
      localStorage.setItem('mp_heritage_notices', JSON.stringify(DEFAULT_NOTICES));
      stored = JSON.stringify(DEFAULT_NOTICES);
    }
    setNotices(JSON.parse(stored));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Set up float particles background
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;
    container.innerHTML = '';
    const PARTICLE_COUNT = 25;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const x = Math.random() * 100;
      const dur = 15 + Math.random() * 25;
      const delay = Math.random() * 20;
      const size = 1 + Math.random() * 2;
      const dx = (Math.random() - 0.5) * 2;
      p.style.cssText = `
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${dur}s;
        animation-delay: -${delay}s;
        --dx: ${dx};
      `;
      container.appendChild(p);
    }
  }, []);

  // Parallax and scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Navbar scrolling transparency
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }

      // Hero Parallax background offset
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg && window.scrollY < window.innerHeight) {
        heroBg.style.transform = `scale(1.0) translateY(${window.scrollY * 0.12}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for 3D reveal triggers
  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          if (entry.target.classList.contains('section-3d-reveal')) {
            entry.target.classList.add('active');
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .section-3d-reveal').forEach(el => {
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, [notices, activeNoticeCategory]); // Re-observe when notices (dynamic list) or filter changes

  // Toggle detail drawer
  const handleOpenDrawer = (id) => {
    setActiveDrawerId(id);
    setIsDrawerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    document.body.style.overflow = '';
    setActiveDrawerId(null);
  };

  // Toggle booking modal
  const handleOpenBooking = (destId = null) => {
    setPreselectedBookingId(destId);
    setIsBookingOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    document.body.style.overflow = '';
    setPreselectedBookingId(null);
  };

  // Staff Authentication
  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setCurrentView('admin');
    document.body.style.overflow = '';
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mp_heritage_admin');
    setIsAdminAuthenticated(false);
    setCurrentView('home');
    document.body.style.overflow = '';
    alert('Administrative session terminated.');
  };

  if (currentView === 'login') {
    return (
      <>
        {/* Floating particles background */}
        <div id="particles" className="particles" />
        <LoginPage 
          onClose={() => setCurrentView('home')} 
          onSuccess={handleLoginSuccess} 
        />
      </>
    );
  }

  if (currentView === 'shop') {
    return (
      <>
        {/* Floating particles background */}
        <div id="particles" className="particles" />
        <ShopPage 
          onBackToPortal={() => {
            setCurrentView('home');
            window.scrollTo(0, 0);
          }} 
        />
      </>
    );
  }

  if (currentView === 'admin') {
    return (
      <>
        {/* Floating particles background */}
        <div id="particles" className="particles" />
        <AdminDashboard 
          notices={notices}
          onClose={() => setCurrentView('home')}
          onNoticeUpdate={fetchNotices}
          onLogout={handleLogout}
        />
      </>
    );
  }

  return (
    <>
      {/* Floating particles background */}
      <div id="particles" className="particles" />

      {/* Structured Site Layout */}
      <Navbar 
        onSearchClick={() => setIsSearchOpen(true)}
        onStaffLoginClick={() => {
          if (isAdminAuthenticated) {
            setCurrentView('admin');
          } else {
            setCurrentView('login');
          }
        }}
        isAdmin={isAdminAuthenticated}
        onReplicaClick={() => {
          setCurrentView('shop');
          window.scrollTo(0, 0);
        }}
      />

      <Hero 
        latestNotice={notices.length > 0 ? notices[0] : null}
        onPlanVisitClick={() => handleOpenBooking()}
        onShopClick={() => {
          setCurrentView('shop');
          window.scrollTo(0, 0);
        }}
      />

      <Newsroom 
        notices={notices}
        activeCategory={activeNoticeCategory}
        onCategoryChange={setActiveNoticeCategory}
      />

      <Categories />

      <Stats />

      <Monuments onOpenDetails={handleOpenDrawer} />

      <Museums onOpenDetails={handleOpenDrawer} />

      <Research />

      <CTA onPlanVisitClick={() => handleOpenBooking()} />

      <Footer />

      {/* Dynamic Overlays & Modals */}
      {isDrawerOpen && (
        <DetailDrawer 
          id={activeDrawerId}
          onClose={handleCloseDrawer}
          onBook={handleOpenBooking}
        />
      )}

      {isSearchOpen && (
        <SearchOverlay 
          notices={notices}
          onClose={() => setIsSearchOpen(false)}
          onSelectResult={handleOpenDrawer}
        />
      )}

      {isBookingOpen && (
        <BookingModal 
          preselectedId={preselectedBookingId}
          onClose={handleCloseBooking}
        />
      )}
    </>
  );
}
