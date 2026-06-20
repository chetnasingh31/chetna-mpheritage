import React, { useState, useEffect, useRef } from 'react';
import { HERITAGE_DATA } from '../data/heritageData';

export default function SearchOverlay({ notices, onClose, onSelectResult }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus search input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle escape key to close search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Index and prepare database
  const searchDatabase = [];

  // Index heritage sites & museums
  Object.keys(HERITAGE_DATA).forEach((id) => {
    const item = HERITAGE_DATA[id];
    searchDatabase.push({
      id: id,
      title: item.title,
      type: item.type,
      location: item.location,
      tags: [item.title, item.type, item.location, item.region, item.tag].join(' ').toLowerCase()
    });
  });

  // Index notices
  notices.forEach((notice) => {
    searchDatabase.push({
      id: 'section-notices',
      title: notice.title,
      type: `Notice: ${notice.category}`,
      location: notice.date,
      tags: [notice.title, notice.category, notice.date].join(' ').toLowerCase()
    });
  });

  // Filter based on input query
  const cleanQuery = query.trim().toLowerCase();
  const filteredResults = cleanQuery === ''
    ? searchDatabase.slice(0, 5) // Show default suggestions when query is empty
    : searchDatabase.filter((item) => item.tags.includes(cleanQuery));

  const handleResultClick = (item) => {
    onClose();
    if (item.id === 'section-notices') {
      const el = document.getElementById('section-notices');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const sectionId = item.id.startsWith('museum-') ? 'section-museums' : 'section-monuments';
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      // Slight delay to allow smooth scroll or transition, then open drawer
      setTimeout(() => {
        onSelectResult(item.id);
      }, 350);
    }
  };

  return (
    <div className="search-overlay open" role="dialog" aria-modal="true" aria-label="Search Portal">
      <button className="btn-search-close" onClick={onClose} aria-label="Close search">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      <div className="search-container">
        <input 
          ref={inputRef}
          type="text" 
          className="search-input" 
          placeholder="Search monuments, museums, notices..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search field"
        />

        <div className="search-results">
          {filteredResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)' }}>
              No results found matching "{query}"
            </div>
          ) : (
            filteredResults.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className="search-result-item"
                onClick={() => handleResultClick(item)}
              >
                <div className="search-result-title">{item.title}</div>
                <span className="search-result-type">{item.type}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
