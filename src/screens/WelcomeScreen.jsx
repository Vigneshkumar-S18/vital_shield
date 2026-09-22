import React from 'react';
import { useApp } from '../context/AppContext';
import { VitalShieldCrest } from '../data/svgIcons';
import { TopStatusBar } from '../components/TopStatusBar';

export const WelcomeScreen = () => {
  const { navigateTo } = useApp();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundImage: `linear-gradient(180deg, rgba(246, 244, 237, 0.95) 0%, rgba(246, 244, 237, 0.5) 28%, rgba(0, 0, 0, 0.15) 65%, rgba(18, 28, 20, 0.88) 100%), url('/welcome_hiker.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Top Status Area */}
      <TopStatusBar dark={false} isWelcome={true} />

      {/* Top Center Crest & Branding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '10px',
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: '8px', color: '#1B2C1E' }}>
          <VitalShieldCrest size={38} color="#1B2C1E" />
        </div>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '800',
            letterSpacing: '2.5px',
            color: '#1B2C1E',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)',
            margin: 0,
            lineHeight: '1.2',
          }}
        >
          VITALSHIELD
        </h1>
        <p
          style={{
            fontSize: '13px',
            fontWeight: '500',
            color: '#344537',
            marginTop: '3px',
            letterSpacing: '0.2px',
          }}
        >
          For a Safer, Healthier You
        </p>
      </div>

      {/* Script Accent Typography */}
      <div
        style={{
          paddingLeft: '28px',
          marginTop: '14px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: '38px',
            lineHeight: '1.08',
            color: '#243827',
            transform: 'rotate(-4deg)',
            textShadow: '0 1px 3px rgba(255,255,255,0.7)',
            letterSpacing: '0.5px',
          }}
        >
          Stronger.
          <br />
          Safer.
          <br />
          Brighter.
        </div>
      </div>

      {/* Bottom Content & Button */}
      <div
        style={{
          padding: '0 24px max(32px, env(safe-area-inset-bottom)) 24px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: '400',
            lineHeight: '1.45',
            marginBottom: '26px',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
          }}
        >
          Your health.
          <br />
          Your safety.
          <br />
          Our priority.
        </div>

        <button
          id="btn-welcome-begin"
          onClick={() => navigateTo('home', 'home')}
          style={{
            width: '100%',
            backgroundColor: '#F3EFE6',
            color: '#1B2C1E',
            padding: '16px 24px',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>Let's Begin</span>
          <span style={{ fontSize: '18px', fontWeight: '700' }}>→</span>
        </button>
      </div>
    </div>
  );
};
