import React, { useState, useEffect } from 'react';
import { HERITAGE_DATA } from '../data/heritageData';

export default function BookingModal({ preselectedId, onClose }) {
  const [destinationId, setDestinationId] = useState(preselectedId || 'bhimbetka');
  const [origin, setOrigin] = useState('indian');
  
  // Default date to tomorrow
  const getTomorrowDateString = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTomorrowDateString());
  const [tickets, setTickets] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // If preselectedId changes, update state
  useEffect(() => {
    if (preselectedId) {
      setDestinationId(preselectedId);
    }
  }, [preselectedId]);

  // Calculate pricing
  const calculateTotal = () => {
    const data = HERITAGE_DATA[destinationId];
    if (!data) return 0;

    let unitPrice = 25;
    if (origin === 'indian') {
      const match = data.fees.match(/Indian Citizens:\s*₹(\d+)/i);
      if (match) unitPrice = parseInt(match[1], 10);
    } else {
      const match = data.fees.match(/Foreigners:\s*₹(\d+)/i);
      if (match) unitPrice = parseInt(match[1], 10);
    }

    return unitPrice * tickets;
  };

  const totalCost = calculateTotal();

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const selectedDestination = HERITAGE_DATA[destinationId];
    if (!selectedDestination) return;

    setIsSubmitting(true);

    // Simulate short network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const randomRef = `MPA-${Math.floor(100000 + Math.random() * 900000)}-${String(tickets).padStart(2, '0')}`;
    const confirmedBooking = {
      destinationId: destinationId,
      destinationName: selectedDestination.title,
      visitorOrigin: origin,
      visitDate: date,
      ticketQuantity: tickets,
      totalCost: totalCost,
      referenceNo: randomRef,
      createdAt: new Date()
    };

    // Save bookings to localStorage
    const offlineBookings = JSON.parse(localStorage.getItem('mp_heritage_bookings') || '[]');
    offlineBookings.push(confirmedBooking);
    localStorage.setItem('mp_heritage_bookings', JSON.stringify(offlineBookings));
    
    setBookingResult(confirmedBooking);
    setIsSubmitting(false);
  };

  const handleResetForm = () => {
    setBookingResult(null);
    setOrigin('indian');
    setDate(getTomorrowDateString());
    setTickets(1);
  };

  // Format date for printable ticket
  const getFormattedTicketDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="login-modal open" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <div className="login-modal-overlay" onClick={onClose}></div>
      <div className="login-modal-content" style={{ maxWidth: '460px' }}>
        <button className="btn-login-close" onClick={onClose} aria-label="Close modal">×</button>
        
        {!bookingResult ? (
          <div id="booking-form-container">
            <div className="login-modal-header" style={{ marginBottom: '20px' }}>
              <h3 className="login-modal-title" id="booking-title">E-Ticket Booking</h3>
              <p className="login-modal-subtitle">MP Archaeology Visitor Portal</p>
            </div>
            
            <form id="ticket-form" onSubmit={handleBookingSubmit}>
              <div className="login-form-group">
                <label className="login-form-label">Select Destination</label>
                <select 
                  className="login-form-input" 
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  style={{ background: '#ffffff', color: '#000000' }} 
                  required
                >
                  {Object.keys(HERITAGE_DATA).map((key) => {
                    const item = HERITAGE_DATA[key];
                    // Clean price extraction for display label
                    const indMatch = item.fees.match(/Indian Citizens:\s*₹(\d+)/i);
                    const forMatch = item.fees.match(/Foreigners:\s*₹(\d+)/i);
                    const indPrice = indMatch ? indMatch[1] : '25';
                    const forPrice = forMatch ? forMatch[1] : '300';
                    return (
                      <option key={key} value={key}>
                        {item.title} (₹{indPrice}/₹{forPrice})
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="login-form-group">
                <label className="login-form-label">Visitor Origin</label>
                <select 
                  className="login-form-input" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  style={{ background: '#ffffff', color: '#000000' }} 
                  required
                >
                  <option value="indian">Indian Citizen / SAARC / BIMSTEC</option>
                  <option value="foreigner">Foreigner / NRI</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="login-form-group">
                  <label className="login-form-label">Date of Visit</label>
                  <input 
                    type="date" 
                    className="login-form-input" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required 
                    style={{ colorScheme: 'dark' }} 
                  />
                </div>
                <div className="login-form-group">
                  <label className="login-form-label">Number of Tickets</label>
                  <input 
                    type="number" 
                    className="login-form-input" 
                    min="1" 
                    max="10" 
                    value={tickets}
                    onChange={(e) => setTickets(parseInt(e.target.value, 10) || 1)}
                    required 
                  />
                </div>
              </div>

              <div 
                style={{ 
                  background: 'rgba(201,168,76,0.06)', 
                  border: '1px solid rgba(201,168,76,0.15)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '12px', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}
              >
                <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
                  Estimated Total:
                </span>
                <strong style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', color: 'var(--gold-light)' }}>
                  ₹{totalCost.toFixed(2)}
                </strong>
              </div>

              <button type="submit" className="btn-login-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Generate E-Ticket'}
              </button>
            </form>
          </div>
        ) : (
          <div id="booking-receipt-container" style={{ textAlign: 'center' }}>
            <div style={{ border: '2px dashed rgba(201,168,76,0.3)', padding: '24px', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--gold)' }}>
                Govt. of Madhya Pradesh
              </div>
              <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'var(--text-primary)', marginTop: '4px' }}>
                Archaeology E-Ticket
              </h4>
              <hr style={{ border: 'none', borderBottom: '1px solid rgba(201,168,76,0.15)', margin: '12px 0' }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'left', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <div>
                  <strong style={{ color: 'var(--text-dim)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>
                    Ref No.
                  </strong>
                  <span style={{ fontFamily: 'monospace', color: 'var(--gold-light)' }}>{bookingResult.referenceNo}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-dim)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>
                    Date
                  </strong>
                  <span>{getFormattedTicketDate(bookingResult.visitDate)}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-dim)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>
                    Destination
                  </strong>
                  <span>{bookingResult.destinationName}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-dim)', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>
                    Quantity
                  </strong>
                  <span>
                    {bookingResult.ticketQuantity} x ({bookingResult.visitorOrigin === 'indian' ? 'Indian' : 'Foreigner'})
                  </span>
                </div>
              </div>

              {/* SVG Visual QR Code */}
              <div style={{ margin: '20px auto', width: '110px', height: '110px', background: '#fff', padding: '6px', borderRadius: '4px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                <svg width="98" height="98" viewBox="0 0 100 100" style={{ shapeRendering: 'crispEdges' }} aria-label="Visual ticket QR code">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <rect x="5" y="5" width="25" height="25" fill="black" />
                  <rect x="10" y="10" width="15" height="15" fill="white" />
                  <rect x="12" y="12" width="11" height="11" fill="black" />

                  <rect x="70" y="5" width="25" height="25" fill="black" />
                  <rect x="75" y="10" width="15" height="15" fill="white" />
                  <rect x="77" y="12" width="11" height="11" fill="black" />

                  <rect x="5" y="70" width="25" height="25" fill="black" />
                  <rect x="10" y="75" width="15" height="15" fill="white" />
                  <rect x="12" y="77" width="11" height="11" fill="black" />

                  {/* Procedural blocks to look like an authentic QR code */}
                  <rect x="35" y="15" width="10" height="5" fill="black" />
                  <rect x="50" y="5" width="5" height="15" fill="black" />
                  <rect x="60" y="20" width="8" height="8" fill="black" />
                  <rect x="40" y="35" width="20" height="5" fill="black" />
                  <rect x="15" y="45" width="5" height="20" fill="black" />
                  <rect x="30" y="50" width="15" height="12" fill="black" />
                  <rect x="55" y="55" width="12" height="12" fill="black" />
                  <rect x="75" y="40" width="15" height="5" fill="black" />
                  <rect x="85" y="50" width="10" height="15" fill="black" />
                  <rect x="35" y="75" width="15" height="15" fill="black" />
                  <rect x="60" y="75" width="5" height="20" fill="black" />
                  <rect x="75" y="75" width="20" height="5" fill="black" />
                </svg>
              </div>

              <div style={{ background: 'rgba(201,168,76,0.1)', borderRadius: '4px', padding: '10px', fontSize: '16px', fontWeight: '700', color: 'var(--gold-light)' }}>
                Paid Amount: <span>₹{bookingResult.totalCost.toFixed(2)}</span>
              </div>

              <div style={{ fontSize: '8px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '14px' }}>
                Show QR at entry gate. Ticket valid for selected date only.
              </div>
            </div>

            <button 
              className="btn-login-submit" 
              onClick={() => window.print()} 
              style={{ marginTop: '20px', background: 'var(--gold)', color: 'var(--ink)' }}
            >
              Print Ticket
            </button>
            <button 
              className="btn-login-submit" 
              onClick={handleResetForm} 
              style={{ marginTop: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(247,240,227,0.2)', color: 'var(--text-primary)' }}
            >
              Book Another Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
