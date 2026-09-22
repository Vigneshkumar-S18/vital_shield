import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';

export const SettingsScreen = () => {
  const { goBack, userProfile, setIsDeviceModalOpen, navigateTo, showToast, esp32Status } = useApp();
  const [activeSubView, setActiveSubView] = useState(null); // 'app_pref', 'safety_pref', 'privacy', 'help', 'about'

  const handleRowClick = (key) => {
    if (key === 'safety_pref') {
      navigateTo('contacts');
    } else {
      setActiveSubView(key);
    }
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
          Settings
        </h2>
      </div>

      {/* Scrollable container */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 88px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* My Device Card */}
        <div
          onClick={() => setIsDeviceModalOpen(true)}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src="/smartband.jpg"
              alt="VitalShield band"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                objectFit: 'cover',
                backgroundColor: '#F3EFE6',
              }}
            />
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#1B2C1E' }}>ESP32 Body Monitor</div>
              <div
                style={{
                  fontSize: '12px',
                  color: esp32Status === 'connected' ? '#16A34A' : '#DC2626',
                  fontWeight: '600',
                  marginTop: '2px',
                }}
              >
                {esp32Status === 'connected' ? 'Connected • 10.99.16.90' : 'Disconnected'}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '16px', color: '#9CA3AF' }}>›</span>
        </div>

        {/* Menu Items Container */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '4px 18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Item 1: App Preferences */}
          <div
            onClick={() => handleRowClick('app_pref')}
            style={{
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F3F4F6',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>App Preferences</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280' }}>Notifications, theme, language</div>
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#9CA3AF' }}>›</span>
          </div>

          {/* Item 2: Safety Settings */}
          <div
            onClick={() => handleRowClick('safety_pref')}
            style={{
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F3F4F6',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Safety Settings</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280' }}>SOS trigger, data sharing</div>
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#9CA3AF' }}>›</span>
          </div>

          {/* Item 3: Privacy */}
          <div
            onClick={() => handleRowClick('privacy')}
            style={{
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F3F4F6',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '18px' }}>🔒</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Privacy</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280' }}>Manage your data</div>
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#9CA3AF' }}>›</span>
          </div>

          {/* Item 4: Help & Support */}
          <div
            onClick={() => handleRowClick('help')}
            style={{
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F3F4F6',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '18px' }}>❓</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Help & Support</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280' }}>FAQs, contact us</div>
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#9CA3AF' }}>›</span>
          </div>

          {/* Item 5: About VitalShield */}
          <div
            onClick={() => handleRowClick('about')}
            style={{
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #F3F4F6',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '18px' }}>ℹ️</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>About VitalShield</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280' }}>Version 1.0.0</div>
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#9CA3AF' }}>›</span>
          </div>

          {/* Item 6: Welcome / Splash Screen */}
          <div
            onClick={() => navigateTo('welcome')}
            style={{
              padding: '14px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '18px' }}>🌄</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Welcome Screen</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280' }}>View initial splash screen</div>
              </div>
            </div>
            <span style={{ fontSize: '16px', color: '#9CA3AF' }}>›</span>
          </div>
        </div>

        {/* Script Cursive Sign-off Accent (Screenshot 9) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '28px',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '34px',
              lineHeight: '1.2',
              color: '#344535',
              textAlign: 'center',
              transform: 'rotate(-2.5deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>You Matter</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Stay Safe</span>
              <span style={{ fontSize: '24px' }}>♡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-view modal for About/Privacy/Support */}
      {activeSubView && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(20, 32, 22, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={() => setActiveSubView(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '24px 20px 32px 20px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: '#D1D5DB',
                borderRadius: '2px',
                margin: '0 auto 16px auto',
              }}
            />
            {activeSubView === 'about' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E' }}>VitalShield Platform</h3>
                <p style={{ fontSize: '13px', color: '#4B5563', marginTop: '6px', lineHeight: '1.45' }}>
                  VitalShield interprets wearable physiological data, environmental conditions, and user baselines
                  to provide early heat-stress awareness and life-critical emergency SOS communication.
                </p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280' }}>
                  Build 2026.09.21 • Hardware Target: ESP32 + MAX30102 + BME280
                </div>
              </>
            )}
            {activeSubView === 'privacy' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E' }}>Privacy Architecture</h3>
                <p style={{ fontSize: '13px', color: '#4B5563', marginTop: '6px', lineHeight: '1.45' }}>
                  Your detailed physiological and location data remains strictly private on your device. During an active
                  SOS emergency, only user-approved snapshots are securely relayed to configured primary contacts.
                </p>
              </>
            )}
            {activeSubView === 'help' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E' }}>Help & Troubleshooting</h3>
                <p style={{ fontSize: '13px', color: '#4B5563', marginTop: '6px', lineHeight: '1.45' }}>
                  For optimal signal quality, wear the band snug against your skin, two fingers above the wrist bone.
                  Keep optical sensor clean with a soft dry cloth.
                </p>
              </>
            )}
            {activeSubView === 'app_pref' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E' }}>App Preferences</h3>
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Vibration Alerts</span>
                    <span style={{ color: '#16A34A', fontWeight: '700' }}>Enabled</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Temperature Units</span>
                    <span style={{ color: '#243827', fontWeight: '700' }}>Celsius (°C)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Language</span>
                    <span style={{ color: '#243827', fontWeight: '700' }}>English (IN)</span>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setActiveSubView(null)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: '#243827',
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: '14px',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
