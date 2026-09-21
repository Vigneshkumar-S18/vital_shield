import React from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';
import { VitalShieldCrest, BellIcon, HeartIcon, DropletIcon, TempIcon, ActivityWalkingIcon } from '../data/svgIcons';

export const HomeScreen = () => {
  const {
    userProfile,
    vitals,
    homeSubTab,
    setHomeSubTab,
    navigateTo,
    setIsNotificationsOpen,
    notifications,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

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

      {/* Main scrollable body */}
      <div
        style={{
          flex: 1,
          padding: '8px 20px 84px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header: Avatar, Greeting, Bell */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            marginTop: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            />
            <div>
              <div style={{ fontSize: '13px', color: '#6A7869', fontWeight: '500' }}>Good Morning,</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1A271B', letterSpacing: '-0.3px' }}>
                {userProfile.name}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            style={{
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: '#ECE8DD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BellIcon size={20} count={unreadCount} />
          </button>
        </div>

        {/* Segmented Control: Live | Today | Insights */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
            marginBottom: '20px',
          }}
        >
          {[
            { id: 'live', label: 'Live' },
            { id: 'today', label: 'Today' },
            { id: 'insights', label: 'Insights' },
          ].map((tab) => {
            const isActive = homeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setHomeSubTab(tab.id);
                  if (tab.id === 'insights') {
                    navigateTo('insights');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#FFFFFF' : '#687767',
                  backgroundColor: isActive ? '#243827' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(36, 56, 39, 0.2)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Central Hero Circle Component */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '4px 0 24px 0',
          }}
        >
          {/* Layered Organic Watercolor Aura Circles */}
          <div
            style={{
              position: 'relative',
              width: '230px',
              height: '230px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer subtle glow circle */}
            <div
              style={{
                position: 'absolute',
                width: '240px',
                height: '240px',
                borderRadius: '48% 52% 49% 51% / 53% 47% 53% 47%',
                background: 'radial-gradient(circle, rgba(142, 172, 137, 0.35) 0%, rgba(142, 172, 137, 0) 72%)',
                animation: 'breathingAura 6s ease-in-out infinite',
              }}
            />

            {/* Middle layered aura shape */}
            <div
              style={{
                position: 'absolute',
                width: '210px',
                height: '210px',
                borderRadius: '52% 48% 54% 46% / 47% 53% 47% 53%',
                backgroundColor: '#7A9876',
                opacity: 0.65,
                transform: 'rotate(-8deg)',
              }}
            />

            {/* Inner primary organic green circle */}
            <div
              style={{
                position: 'relative',
                width: '190px',
                height: '190px',
                borderRadius: '50% 50% 48% 52% / 52% 48% 52% 48%',
                background: 'linear-gradient(145deg, #436445 0%, #2A442C 100%)',
                boxShadow: '0 12px 32px rgba(42, 68, 44, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '20px',
                color: '#FFFFFF',
              }}
            >
              {/* Crest outline */}
              <div style={{ marginBottom: '8px', opacity: 0.85 }}>
                <VitalShieldCrest size={32} color="#D2E2D0" />
              </div>

              <h2
                style={{
                  fontSize: '19px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '4px',
                  letterSpacing: '-0.2px',
                }}
              >
                You're
                <br />
                doing well
              </h2>

              <p
                style={{
                  fontSize: '11px',
                  color: '#C6D8C4',
                  fontWeight: '400',
                  lineHeight: '1.3',
                  maxWidth: '130px',
                }}
              >
                Vitals are within your normal range
              </p>
            </div>
          </div>
        </div>

        {/* 4 Grid Vital Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
            zIndex: 10,
          }}
        >
          {/* Card 1: Heart Rate */}
          <div
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="heart-beat-anim">
                <HeartIcon size={18} />
              </span>
              <span style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>Heart Rate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#1B2C1E' }}>{vitals.heartRate}</span>
              <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '600' }}>bpm</span>
            </div>
          </div>

          {/* Card 2: SpO2 */}
          <div
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <DropletIcon size={18} />
              <span style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>SpO₂</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#1B2C1E' }}>{vitals.spo2}</span>
              <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: '600' }}>%</span>
            </div>
          </div>

          {/* Card 3: Body Temp */}
          <div
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <TempIcon size={18} />
              <span style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>Body Temp</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: '#1B2C1E' }}>{vitals.bodyTemp}</span>
              <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: '600' }}>°C</span>
            </div>
          </div>

          {/* Card 4: Activity */}
          <div
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ActivityWalkingIcon size={18} />
              <span style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>Activity</span>
            </div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E' }}>{vitals.activity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mountain Landscape Backdrop at Bottom (above BottomNav) */}
      <div
        style={{
          position: 'absolute',
          bottom: '58px',
          left: 0,
          right: 0,
          height: '110px',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <svg
          viewBox="0 0 400 110"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Distant mountain layer */}
          <path
            d="M0 80 L60 40 L120 70 L180 32 L260 65 L330 38 L400 70 L400 110 L0 110 Z"
            fill="#D5DFD1"
            opacity="0.6"
          />
          {/* Middle mountain layer */}
          <path
            d="M0 88 L75 52 L140 82 L220 48 L290 78 L370 54 L400 80 L400 110 L0 110 Z"
            fill="#A7BEA0"
            opacity="0.75"
          />
          {/* Foreground pine trees silhouette */}
          <path
            d="M0 100 Q 20 85 45 98 T 90 92 T 135 97 T 180 88 T 230 96 T 280 89 T 340 98 T 400 90 L400 110 L0 110 Z"
            fill="#617F5B"
            opacity="0.9"
          />
          {/* Darkest ground line */}
          <path
            d="M0 106 Q 60 101 130 107 T 260 102 T 400 106 L400 110 L0 110 Z"
            fill="#324C30"
          />
        </svg>
      </div>
    </div>
  );
};
