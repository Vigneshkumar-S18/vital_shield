import React from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';
import {
  VitalShieldCrest,
  BellIcon,
  HeartIcon,
  DropletIcon,
  TempIcon,
  ActivityWalkingIcon,
} from '../data/svgIcons';

export const HomeScreen = () => {
  const {
    userProfile,
    vitals,
    vitalsHistory = [],
    homeSubTab,
    setHomeSubTab,
    navigateTo,
    setIsNotificationsOpen,
    notifications = [],
    isSosActive,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length || 3;

  // Compute Today's averages from live history buffer or clinical baseline
  const hrHistoryVals = vitalsHistory.map((p) => p.heartRate).filter((v) => v !== null && v !== undefined);
  const avgHr = hrHistoryVals.length > 0
    ? Math.round(hrHistoryVals.reduce((a, b) => a + b, 0) / hrHistoryVals.length)
    : 74;

  const spo2HistoryVals = vitalsHistory.map((p) => p.spo2).filter((v) => v !== null && v !== undefined);
  const avgSpo2 = spo2HistoryVals.length > 0
    ? (spo2HistoryVals.reduce((a, b) => a + b, 0) / spo2HistoryVals.length).toFixed(1)
    : '98.2';

  const tempHistoryVals = vitalsHistory.map((p) => p.bodyTemp).filter((v) => v !== null && v !== undefined);
  const avgTemp = tempHistoryVals.length > 0
    ? (tempHistoryVals.reduce((a, b) => a + b, 0) / tempHistoryVals.length).toFixed(1)
    : '36.5';

  // Check alert detection for Today
  const highLevelAlerts = notifications.filter((n) => n.level >= 2);
  const hasAlertsToday = isSosActive || highLevelAlerts.length > 0;
  const alertCount = isSosActive ? 1 : highLevelAlerts.length || 1;
  const primaryAlertTitle = isSosActive
    ? 'Emergency SOS Alert Active'
    : highLevelAlerts[0]?.title || 'Elevated Ambient Heat (33.4°C)';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F7F5EE',
        overflow: 'hidden',
      }}
    >
      {/* Top Status & Safe Area */}
      <TopStatusBar />

      {/* Main Scrollable Flow Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 18px 84px 18px',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header: Avatar, Greeting & Bell */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              }}
            />
            <div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#718078',
                  fontWeight: '500',
                  lineHeight: '1.2',
                }}
              >
                Good Morning,
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#23402D',
                  letterSpacing: '-0.3px',
                  lineHeight: '1.2',
                  marginTop: '2px',
                }}
              >
                {userProfile.name}
              </div>
            </div>
          </div>

          <button
            id="btn-open-notifications"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notifications"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ECE8DD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <BellIcon size={20} count={unreadCount} />
          </button>
        </header>

        {/* Top Segmented Tab Switcher: Live | Today | Insights */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
            marginBottom: '14px',
            width: '100%',
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
                id={`home-subtab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
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
                  color: isActive ? '#FFFFFF' : '#718078',
                  backgroundColor: isActive ? '#23402D' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(35, 64, 45, 0.22)' : 'none',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
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
            margin: '2px 0 16px 0',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '210px',
              height: '210px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer Subtle Watercolor Glow */}
            <div
              style={{
                position: 'absolute',
                width: '216px',
                height: '216px',
                borderRadius: '48% 52% 49% 51% / 53% 47% 53% 47%',
                background:
                  homeSubTab === 'today' && hasAlertsToday
                    ? 'radial-gradient(circle, rgba(217, 119, 6, 0.35) 0%, rgba(175, 197, 170, 0) 74%)'
                    : 'radial-gradient(circle, rgba(175, 197, 170, 0.45) 0%, rgba(175, 197, 170, 0) 74%)',
                animation: 'breathingAura 6s ease-in-out infinite',
              }}
            />

            {/* Middle Layered Organic Aura Ring */}
            <div
              style={{
                position: 'absolute',
                width: '190px',
                height: '190px',
                borderRadius: '52% 48% 54% 46% / 47% 53% 47% 53%',
                backgroundColor: homeSubTab === 'today' && hasAlertsToday ? '#A38B6B' : '#95B090',
                opacity: 0.6,
                transform: 'rotate(-8deg)',
              }}
            />

            {/* Inner Primary Circle */}
            <div
              style={{
                position: 'relative',
                width: '168px',
                height: '168px',
                borderRadius: '50% 50% 48% 52% / 52% 48% 52% 48%',
                background:
                  homeSubTab === 'today' && hasAlertsToday
                    ? 'linear-gradient(145deg, #4A4633 0%, #293826 100%)'
                    : 'linear-gradient(145deg, #3C5F40 0%, #23402D 100%)',
                boxShadow: '0 10px 28px rgba(35, 64, 45, 0.26)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '16px',
                color: '#FFFFFF',
              }}
            >
              {/* Crest Logo */}
              <div style={{ marginBottom: '6px', opacity: 0.9 }}>
                {homeSubTab === 'today' && hasAlertsToday ? (
                  <span style={{ fontSize: '24px' }}>⚠️</span>
                ) : (
                  <VitalShieldCrest size={28} color="#D2E2D0" />
                )}
              </div>

              {/* Status Title */}
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  lineHeight: '1.15',
                  marginBottom: '4px',
                  letterSpacing: '-0.2px',
                }}
              >
                {homeSubTab === 'today' ? (
                  <>
                    Today's
                    <br />
                    Average
                  </>
                ) : (
                  <>
                    You're
                    <br />
                    doing well
                  </>
                )}
              </h2>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '11px',
                  color: '#C6D8C4',
                  fontWeight: '400',
                  lineHeight: '1.25',
                  maxWidth: '124px',
                }}
              >
                {homeSubTab === 'today' ? (
                  hasAlertsToday ? (
                    <>
                      1 alert detected
                      <br />
                      Averages within range
                    </>
                  ) : (
                    <>
                      0 alerts detected
                      <br />
                      Optimal stability
                    </>
                  )
                ) : (
                  <>
                    Vitals are within
                    <br />
                    your normal range
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Alert Detection Banner (Shown in Today tab) */}
        {homeSubTab === 'today' && (
          <div
            onClick={() => setIsNotificationsOpen(true)}
            style={{
              backgroundColor: hasAlertsToday ? '#FFFBEB' : '#ECFDF5',
              border: `1px solid ${hasAlertsToday ? '#FDE68A' : '#A7F3D0'}`,
              borderRadius: '14px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>{hasAlertsToday ? '⚠️' : '🛡️'}</span>
              <div>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: '700',
                    color: hasAlertsToday ? '#92400E' : '#065F46',
                  }}
                >
                  {hasAlertsToday ? `${alertCount} Alert Detected Today` : 'No Critical Alerts Detected'}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: hasAlertsToday ? '#B45309' : '#047857',
                    marginTop: '1px',
                  }}
                >
                  {hasAlertsToday
                    ? `${primaryAlertTitle} • Resolved with hydration break`
                    : 'All sensor telemetry remained within normal physiological limits'}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: hasAlertsToday ? '#B45309' : '#047857',
                paddingLeft: '6px',
              }}
            >
              View
            </span>
          </div>
        )}

        {/* 2 × 2 Vital Cards Grid (Live vs Today Averages) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '12px',
            width: '100%',
            marginBottom: '16px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Card 1: Heart Rate */}
          <div
            id="vital-card-heart"
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '13px 14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className={homeSubTab === 'live' && vitals.heartRate ? 'heart-beat-anim' : ''}>
                    <HeartIcon size={16} />
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#718078', fontWeight: '500' }}>
                  {homeSubTab === 'today' ? 'Avg Heart Rate' : 'Heart Rate'}
                </span>
              </div>
              {homeSubTab === 'today' && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    backgroundColor: '#E2ECE2',
                    color: '#166534',
                    padding: '2px 6px',
                    borderRadius: '999px',
                  }}
                >
                  Avg
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#23402D' }}>
                  {homeSubTab === 'today'
                    ? avgHr
                    : vitals.heartRate !== null && vitals.heartRate !== undefined
                    ? vitals.heartRate
                    : 78}
                </span>
                <span style={{ fontSize: '12px', color: '#718078', fontWeight: '600' }}>bpm</span>
              </div>
              {homeSubTab === 'today' && (
                <div style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '2px' }}>
                  Daily range: 62–84 bpm
                </div>
              )}
            </div>
          </div>

          {/* Card 2: SpO2 */}
          <div
            id="vital-card-spo2"
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '13px 14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#E0EDFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DropletIcon size={16} />
                </div>
                <span style={{ fontSize: '12px', color: '#718078', fontWeight: '500' }}>
                  {homeSubTab === 'today' ? 'Avg SpO₂' : 'SpO₂'}
                </span>
              </div>
              {homeSubTab === 'today' && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    padding: '2px 6px',
                    borderRadius: '999px',
                  }}
                >
                  Optimal
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#23402D' }}>
                  {homeSubTab === 'today'
                    ? avgSpo2
                    : vitals.spo2 !== null && vitals.spo2 !== undefined
                    ? vitals.spo2
                    : 98}
                </span>
                <span style={{ fontSize: '12px', color: '#718078', fontWeight: '600' }}>%</span>
              </div>
              {homeSubTab === 'today' && (
                <div style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '2px' }}>
                  Daily compliance: 99.2%
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Body Temp */}
          <div
            id="vital-card-temp"
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '13px 14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#FFEDD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TempIcon size={16} />
                </div>
                <span style={{ fontSize: '12px', color: '#718078', fontWeight: '500' }}>
                  {homeSubTab === 'today' ? 'Avg Body Temp' : 'Body Temp'}
                </span>
              </div>
              {homeSubTab === 'today' && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    backgroundColor: '#E2ECE2',
                    color: '#166534',
                    padding: '2px 6px',
                    borderRadius: '999px',
                  }}
                >
                  Stable
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#23402D' }}>
                  {homeSubTab === 'today'
                    ? avgTemp
                    : vitals.bodyTemp !== null && vitals.bodyTemp !== undefined
                    ? vitals.bodyTemp
                    : '36.6'}
                </span>
                <span style={{ fontSize: '12px', color: '#718078', fontWeight: '600' }}>°C</span>
              </div>
              {homeSubTab === 'today' && (
                <div style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '2px' }}>
                  Thermoregulated zone
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Activity */}
          <div
            id="vital-card-activity"
            onClick={() => navigateTo('monitor')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '13px 14px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#E2ECE2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ActivityWalkingIcon size={16} />
                </div>
                <span style={{ fontSize: '12px', color: '#718078', fontWeight: '500' }}>
                  {homeSubTab === 'today' ? 'Total Activity' : 'Activity'}
                </span>
              </div>
              {homeSubTab === 'today' && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    backgroundColor: '#E2ECE2',
                    color: '#166534',
                    padding: '2px 6px',
                    borderRadius: '999px',
                  }}
                >
                  Goal Met
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                <span
                  style={{
                    fontSize: homeSubTab === 'today' ? '22px' : '18px',
                    fontWeight: '800',
                    color: '#23402D',
                    textTransform: homeSubTab === 'today' ? 'none' : 'capitalize',
                  }}
                >
                  {homeSubTab === 'today'
                    ? '8,420'
                    : typeof vitals.activity === 'string'
                    ? vitals.activity.charAt(0).toUpperCase() + vitals.activity.slice(1).toLowerCase()
                    : 'Walking'}
                </span>
                {homeSubTab === 'today' && (
                  <span style={{ fontSize: '12px', color: '#718078', fontWeight: '600' }}>steps</span>
                )}
              </div>
              {homeSubTab === 'today' && (
                <div style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '2px' }}>
                  2h 18m active time
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scenic Mountain Landscape Illustration at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: 0,
          right: 0,
          height: '130px',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <svg
          viewBox="0 0 400 130"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Distant soft mountain peaks */}
          <path
            d="M0 92 L45 58 L95 82 L150 45 L210 75 L280 40 L340 68 L400 50 L400 130 L0 130 Z"
            fill="#D3DFCF"
            opacity="0.65"
          />
          {/* Midground mountain ridges */}
          <path
            d="M0 98 L55 68 L115 88 L185 55 L250 82 L320 60 L380 82 L400 72 L400 130 L0 130 Z"
            fill="#A7BEA0"
            opacity="0.8"
          />
          {/* Forest foothills & evergreen tree silhouettes */}
          <path
            d="M0 110 Q 15 96 35 108 T 75 102 T 115 106 T 155 98 T 195 104 T 240 98 T 285 105 T 330 96 T 370 104 T 400 98 L400 130 L0 130 Z"
            fill="#5E7D58"
            opacity="0.9"
          />
          {/* Foreground rich forest line */}
          <path
            d="M0 118 Q 40 112 90 118 T 180 114 T 270 118 T 350 113 T 400 116 L400 130 L0 130 Z"
            fill="#2A4328"
          />
          {/* Botanical side pines (left) */}
          <path
            d="M10 130 L10 102 L4 110 L10 102 L16 110 M10 112 L5 120 L10 112 L15 120 M25 130 L25 108 L20 115 L25 108 L30 115"
            stroke="#20361F"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Botanical side pines (right) */}
          <path
            d="M385 130 L385 100 L378 108 L385 100 L392 108 M385 110 L380 118 L385 110 L390 118 M370 130 L370 106 L364 114 L370 106 L376 114"
            stroke="#20361F"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
