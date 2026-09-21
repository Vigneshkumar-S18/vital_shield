import React from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';

export const LiveLocationScreen = () => {
  const { goBack, contacts, cancelSos, showToast } = useApp();

  const handleShareTrackingLink = () => {
    navigator.clipboard?.writeText('https://vitalshield.safety/live-track/vs-session-98421');
    showToast('✓ Secure tracking link copied to clipboard');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F6F4ED',
        overflow: 'hidden',
      }}
    >
      <TopStatusBar />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 20px',
          position: 'relative',
        }}
      >
        <button
          onClick={goBack}
          style={{
            padding: '6px 10px',
            fontSize: '18px',
            color: '#1B2C1E',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ‹
        </button>
        <h2
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '17px',
            fontWeight: '700',
            color: '#1B2C1E',
            pointerEvents: 'none',
          }}
        >
          Live Location
        </h2>
      </div>

      {/* SOS Active Badge */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}>
        <div
          style={{
            backgroundColor: '#B82828',
            color: '#FFFFFF',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '12.5px',
            fontWeight: '800',
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(184, 40, 40, 0.35)',
          }}
        >
          <span style={{ fontSize: '13px' }}>★</span>
          <span>SOS ACTIVE</span>
        </div>
        <span style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '4px' }}>
          Last updated: 2 min ago
        </span>
      </div>

      {/* Scrollable container */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 88px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Stylized Realistic Map Card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #E5E2D8',
            backgroundColor: '#EBE5D8',
          }}
        >
          {/* Street Grid Graphic */}
          <svg
            viewBox="0 0 400 240"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            {/* Background block shapes */}
            <rect width="400" height="240" fill="#EAE5D9" />
            
            {/* Parks / Green spaces */}
            <path d="M10 20 L90 10 L110 80 L30 110 Z" fill="#D2DEC8" opacity="0.6" />
            <path d="M300 120 L390 110 L380 220 L270 210 Z" fill="#D2DEC8" opacity="0.6" />

            {/* River / Water body */}
            <path d="M0 160 Q 40 180 80 160 T 160 170 T 240 150" fill="none" stroke="#B8D5E5" strokeWidth="18" opacity="0.7" />

            {/* Road networks */}
            <line x1="0" y1="90" x2="400" y2="150" stroke="#FFFFFF" strokeWidth="8" />
            <line x1="0" y1="90" x2="400" y2="150" stroke="#FDE68A" strokeWidth="4" />

            <line x1="120" y1="0" x2="280" y2="240" stroke="#FFFFFF" strokeWidth="10" />
            <line x1="120" y1="0" x2="280" y2="240" stroke="#F59E0B" strokeWidth="4" />

            <line x1="40" y1="0" x2="380" y2="220" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="280" y1="0" x2="60" y2="240" stroke="#FFFFFF" strokeWidth="7" />
            <line x1="20" y1="180" x2="360" y2="40" stroke="#FFFFFF" strokeWidth="5" />
          </svg>

          {/* Central Pulsating Radar Rings */}
          <div
            style={{
              position: 'absolute',
              top: '46%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div className="radar-ring" style={{ width: '170px', height: '170px' }} />
            <div className="radar-ring radar-ring-2" style={{ width: '120px', height: '120px' }} />
            <div className="radar-ring radar-ring-3" style={{ width: '70px', height: '70px' }} />

            {/* Beacon Center Pin */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#B82828',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(184, 40, 40, 0.6)',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>
          </div>

          {/* Overlaid Location Info Card */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              padding: '12px 14px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              📍
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#1B2C1E' }}>Your Location</div>
              <div style={{ fontSize: '11.5px', color: '#4B5563', marginTop: '1px' }}>
                12.9716° N, 77.5946° E
              </div>
              <div style={{ fontSize: '10.5px', color: '#6B7280' }}>Accuracy: 8 m • Relayed via Safety Node</div>
            </div>
          </div>
        </div>

        {/* Share Live Tracking Link Button */}
        <button
          onClick={handleShareTrackingLink}
          style={{
            width: '100%',
            backgroundColor: '#B82828',
            color: '#FFFFFF',
            padding: '14px 20px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 6px 18px rgba(184, 40, 40, 0.28)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '16px' }}>📤</span>
          <span>Share Live Tracking Link</span>
        </button>

        {/* Notified Contacts List */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1B2C1E', marginBottom: '12px' }}>
            Notified Contacts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {contacts.slice(0, 3).map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #F3F4F6',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={c.avatar}
                    alt={c.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1B2C1E' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Notified • 2 min ago</div>
                  </div>
                </div>
                <span style={{ fontSize: '14px', color: '#9CA3AF' }}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel SOS option */}
        <button
          onClick={cancelSos}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '14px',
            backgroundColor: '#F3F4F6',
            color: '#4B5563',
            fontSize: '13.5px',
            fontWeight: '600',
            border: '1px solid #E5E7EB',
          }}
        >
          End SOS Session (I am safe now)
        </button>
      </div>
    </div>
  );
};
