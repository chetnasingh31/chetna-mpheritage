import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, Sparkles, Navigation, ArrowLeft } from 'lucide-react';
import { HERITAGE_DATA } from '../data/heritageData';

const MUSEUMS_LIST = Object.values(HERITAGE_DATA).filter(item => item.id.startsWith('museum-'));

export default function MuseumsListingPage({ onViewChange, onOpenDetails }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedFee, setSelectedFee] = useState('All');
  const [hoveredMapMarker, setHoveredMapMarker] = useState(null);

  // Region and Type lists
  const regions = ['All', 'Central Region', 'Western Region', 'Northern Region'];
  const types = ['All', 'State Museum', 'District Museum', 'Site Museum', 'Local Museum'];

  // Filters logic
  const filteredMuseums = useMemo(() => {
    return MUSEUMS_LIST.filter(museum => {
      const matchesSearch = museum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            museum.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            museum.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'All' || museum.region === selectedRegion;
      const matchesType = selectedType === 'All' || museum.tag === selectedType;
      
      let matchesFee = true;
      if (selectedFee !== 'All') {
        const numericFee = parseInt(museum.fees.match(/\d+/)?.[0] || '0', 10);
        if (selectedFee === 'Free/Low') {
          matchesFee = numericFee <= 10;
        } else if (selectedFee === 'Medium') {
          matchesFee = numericFee > 10 && numericFee <= 20;
        }
      }

      return matchesSearch && matchesRegion && matchesType && matchesFee;
    });
  }, [searchQuery, selectedRegion, selectedType, selectedFee]);

  // Editor's pick: state museum, bhopal
  const editorsPick = HERITAGE_DATA['museum-bhopal'];

  return (
    <div className="museums-listing-page">
      {/* Immersive Listing Hero */}
      <section className="listing-hero">
        <button className="btn-back-nav listing-back-btn" onClick={() => onViewChange('explore')}>
          <ArrowLeft size={16} /> Back to Explore
        </button>
        <div className="listing-hero-overlay"></div>
        <div className="listing-hero-content">
          <span className="listing-hero-label">STATE COLLECTIONS & GALLERIES</span>
          <h1 className="listing-hero-title">Museums of <em>Madhya Pradesh</em></h1>
          <p className="listing-hero-desc">
            Explore centuries of stone sculptures, prehistoric rock art, terracotta models, 
            and royal armaments preserved across the heartland of India.
          </p>
        </div>
      </section>

      {/* Editor's Pick Row */}
      {editorsPick && (
        <section className="editors-pick-section">
          <div className="editors-pick-card">
            <div className="editors-pick-badge">
              <Sparkles size={14} /> EDITOR'S CHOICE
            </div>
            <div className="editors-pick-grid">
              <div className="editors-pick-img-wrap">
                <img src={editorsPick.img} alt={editorsPick.title} />
              </div>
              <div className="editors-pick-content">
                <span className="editors-pick-tag">{editorsPick.tag}</span>
                <h2 className="editors-pick-title">{editorsPick.title}</h2>
                <p className="editors-pick-desc">{editorsPick.desc}</p>
                <div className="editors-pick-highlights">
                  <strong>Exhibition Highlights:</strong>
                  <ul>
                    {editorsPick.highlights.slice(0, 2).map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                </div>
                <button className="btn-gold-primary" onClick={() => onOpenDetails(editorsPick.id)}>
                  Explore Exhibition
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search & Advanced Sticky Filters */}
      <section className="filters-bar-wrapper">
        <div className="filters-bar">
          <div className="search-input-group">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search museums by name, city, or collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="dropdowns-group">
            <div className="filter-dropdown">
              <span className="filter-label">Region</span>
              <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="filter-dropdown">
              <span className="filter-label">Type</span>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="filter-dropdown">
              <span className="filter-label">Entry Fees</span>
              <select value={selectedFee} onChange={(e) => setSelectedFee(e.target.value)}>
                <option value="All">All Fees</option>
                <option value="Free/Low">Low (≤ ₹10)</option>
                <option value="Medium">Standard (&gt; ₹10)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Layout Grid: Listings & Interactive Map */}
      <section className="listing-main-layout">
        {/* Results Listings */}
        <div className="results-pane">
          <div className="results-count">
            Found <strong>{filteredMuseums.length}</strong> archaeological institutions
          </div>

          <motion.div 
            layout 
            className="museums-grid-listing"
          >
            <AnimatePresence>
              {filteredMuseums.map(museum => (
                <motion.div
                  key={museum.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="premium-museum-card"
                  onClick={() => onOpenDetails(museum.id)}
                >
                  <div className="card-image-wrap">
                    <img src={museum.img} alt={museum.title} />
                    <div className="card-tag">{museum.tag}</div>
                  </div>
                  <div className="card-info">
                    <div className="card-location"><MapPin size={12} /> {museum.location}</div>
                    <h3 className="card-title">{museum.title}</h3>
                    <p className="card-desc">{museum.desc.substring(0, 100)}...</p>
                    <div className="card-footer">
                      <span className="card-hours">{museum.hours.split(' (')[0]}</span>
                      <span className="card-action-link">View Details →</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredMuseums.length === 0 && (
              <div className="empty-results">
                <h3>No institutions matched your filters.</h3>
                <p>Try resetting the search query or applying wider filter parameters.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Map Pane (Sticky) */}
        <div className="map-pane">
          <div className="map-card">
            <h3 className="map-card-title">
              <Navigation size={16} /> Heritage Map View
            </h3>
            <p className="map-card-subtitle">Select markers to locate institutions on the regional grid.</p>
            
            <div className="interactive-map-area">
              {/* Simulated Map Outline */}
              <div className="map-svg-mock">
                {/* SVG Outline for MP */}
                <svg viewBox="0 0 400 300" className="map-svg-path">
                  <path 
                    d="M 50,120 Q 80,60 180,50 T 320,80 Q 360,120 340,180 T 260,250 Q 150,260 80,210 Z" 
                    fill="rgba(201, 168, 76, 0.04)" 
                    stroke="rgba(201, 168, 76, 0.2)" 
                    strokeWidth="1.5" 
                  />
                  
                  {/* Regions labels */}
                  <text x="180" y="30" fill="rgba(255,255,255,0.2)" fontSize="10" letterSpacing="2">NORTHERN REGION</text>
                  <text x="50" y="160" fill="rgba(255,255,255,0.2)" fontSize="10" letterSpacing="2">WESTERN REGION</text>
                  <text x="210" y="150" fill="rgba(255,255,255,0.2)" fontSize="10" letterSpacing="2">CENTRAL REGION</text>
                </svg>

                {/* Map Markers Overlay */}
                {MUSEUMS_LIST.map((m, index) => {
                  // Coordinate offset for plotting on the mock SVG map
                  const coords = {
                    'museum-bhopal': { x: 190, y: 150 },
                    'museum-indore': { x: 120, y: 190 },
                    'museum-gwalior': { x: 200, y: 70 },
                    'museum-sanchi': { x: 215, y: 135 },
                    'museum-khajuraho': { x: 270, y: 100 },
                    'museum-dhubela': { x: 250, y: 110 }
                  }[m.id] || { x: 200, y: 150 };

                  const isVisible = filteredMuseums.some(fm => fm.id === m.id);

                  if (!isVisible) return null;

                  return (
                    <div 
                      key={m.id}
                      className="map-marker-pin"
                      style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
                      onMouseEnter={() => setHoveredMapMarker(m)}
                      onMouseLeave={() => setHoveredMapMarker(null)}
                      onClick={() => onOpenDetails(m.id)}
                    >
                      <div className="marker-dot"></div>
                      <div className="marker-pulse"></div>

                      {/* Tooltip */}
                      {hoveredMapMarker?.id === m.id && (
                        <div className="marker-tooltip">
                          <span className="tooltip-tag">{m.tag}</span>
                          <h4 className="tooltip-title">{m.title}</h4>
                          <span className="tooltip-click">Click to inspect</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
