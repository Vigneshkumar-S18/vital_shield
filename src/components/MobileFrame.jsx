import React from 'react';
import { useApp } from '../context/AppContext';
import { BottomNav } from './BottomNav';
import { NotificationModal } from './NotificationModal';
import { DeviceModal } from './DeviceModal';
import { AddContactModal } from './AddContactModal';

export const MobileFrame = ({ children }) => {
  const {
    currentScreen,
    navigateTo,
    viewMode,
    setViewMode,
    isSosActive,
    toastMessage,
  } = useApp();

  const screens = [
    { id: 'welcome', label: '1. Welcome' },
    { id: 'home', label: '2. Home' },
    { id: 'monitor', label: '3. Monitor' },
    { id: 'safety', label: '4. Safety SOS' },
    { id: 'insights', label: '5. Insights' },
    { id: 'live_location', label: '6. Live Location' },
    { id: 'reports', label: '7. Health Report' },
    { id: 'contacts', label: '8. Contacts' },
    { id: 'settings', label: '9. Settings' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#E5E2D7',
        backgroundImage: 'radial-gradient(#D6D1C4 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: viewMode === 'phone' ? '20px 16px 40px 16px' : '0',
        fontFamily: 'var(--font-sans)',
        position: 'relative',
      }}
    >
      {/* Top Interactive Switcher & Control Toolbar */}
      <header
        style={{
          width: '100%',
          maxWidth: '840px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
          padding: '10px 18px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          zIndex: 80,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isSosActive ? '#DC2626' : '#16A34A',
              boxShadow: isSosActive ? '0 0 10px #DC2626' : '0 0 8px #16A34A',
            }}
          />
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#1B2C1E', letterSpacing: '0.5px' }}>
            VITALSHIELD
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '999px',
              backgroundColor: isSosActive ? '#FEE2E2' : '#E2ECE2',
              color: isSosActive ? '#991B1B' : '#1E3823',
            }}
          >
            {isSosActive ? 'EMERGENCY SOS ACTIVE' : 'SYSTEM HEALTHY'}
          </span>
        </div>

        {/* Screen Quick Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '600' }}>Jump to Screen:</span>
          <select
            value={currentScreen}
            onChange={(e) => navigateTo(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '12.5px',
              fontWeight: '600',
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {screens.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Toggle View Frame */}
          <button
            onClick={() => setViewMode(viewMode === 'phone' ? 'full' : 'phone')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#243827',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {viewMode === 'phone' ? '📱 Mobile Frame' : '🖥️ Full View'}
          </button>
        </div>
      </header>

      {/* Device Body Container */}
      <div
        style={{
          position: 'relative',
          width: viewMode === 'phone' ? '390px' : '100%',
          maxWidth: viewMode === 'phone' ? '390px' : '440px',
          height: viewMode === 'phone' ? '824px' : '100vh',
          backgroundColor: '#F6F4ED',
          borderRadius: viewMode === 'phone' ? '46px' : '0',
          boxShadow:
            viewMode === 'phone'
              ? '0 25px 60px -12px rgba(25, 38, 28, 0.35), 0 0 0 12px #1E2320, 0 0 0 14px #474E48, 0 0 0 15px #141715'
              : 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
        }}
      >
        {/* Main Children View */}
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {children}

          {/* Bottom Navigation (Shown on all screens except Welcome) */}
          {currentScreen !== 'welcome' && <BottomNav />}

          {/* Bottom Home Indicator Bar (iPhone gesture bar) */}
          <div
            style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '134px',
              height: '4.5px',
              backgroundColor: '#1E2922',
              borderRadius: '999px',
              zIndex: 70,
              pointerEvents: 'none',
              opacity: 0.85,
            }}
          />

          {/* Floating Toast Notification */}
          {toastMessage && (
            <div
              style={{
                position: 'absolute',
                top: '56px',
                left: '20px',
                right: '20px',
                backgroundColor: 'rgba(26, 38, 28, 0.95)',
                color: '#FFFFFF',
                padding: '12px 16px',
                borderRadius: '14px',
                fontSize: '12.5px',
                fontWeight: '600',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                zIndex: 120,
                textAlign: 'center',
                animation: 'floatGently 0.3s ease',
              }}
            >
              {toastMessage}
            </div>
          )}

          {/* Modals */}
          <NotificationModal />
          <DeviceModal />
          <AddContactModal />
        </div>
      </div>
    </div>
  );
};
