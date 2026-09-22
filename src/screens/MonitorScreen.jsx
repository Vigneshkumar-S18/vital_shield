import React from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';

// Smooth sparkline generator for live/history data
function generateSparkline(dataPoints, minVal, maxVal, width = 120, height = 36, defaultPoints = [20, 24, 18, 22, 16, 25, 20, 15, 22, 18, 24, 16]) {
  const pts = dataPoints && dataPoints.length >= 2 ? dataPoints : defaultPoints;
  const step = width / (pts.length - 1);
  const range = maxVal - minVal || 1;

  const coords = pts.map((val, idx) => {
    const safeVal = val !== null && val !== undefined ? val : (minVal + maxVal) / 2;
    const clamped = Math.max(minVal, Math.min(maxVal, safeVal));
    const x = idx * step;
    const y = height - ((clamped - minVal) / range) * (height - 8) - 4;
    return { x, y };
  });

  const lineD = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '');
  const areaD = `${lineD} L ${width} ${height} L 0 ${height} Z`;

  return { areaD, lineD };
}

export const MonitorScreen = () => {
  const {
    goBack,
    monitorSubTab,
    setMonitorSubTab,
    vitals,
    gpsData,
    esp32Status,
    setIsDeviceModalOpen,
    navigateTo,
    vitalsHistory = [],
  } = useApp();

  // Heart rate sparkline data
  const hrPoints = vitalsHistory.map((p) => p.heartRate).filter((v) => v !== null && v !== undefined);
  const hrWave = generateSparkline(hrPoints, 40, 180, 120, 36, [14, 16, 12, 14, 18, 22, 16, 11, 15, 14, 10]);

  // SpO2 sparkline data
  const spo2Points = vitalsHistory.map((p) => p.spo2).filter((v) => v !== null && v !== undefined);
  const spo2Wave = generateSparkline(spo2Points, 85, 100, 120, 36, [18, 12, 16, 14, 16, 10, 12, 18, 14, 11]);

  // Temp sparkline data
  const tempPoints = vitalsHistory.map((p) => p.bodyTemp).filter((v) => v !== null && v !== undefined);
  const tempWave = generateSparkline(tempPoints, 30, 42, 120, 36, [16, 14, 16, 14, 12, 10, 13, 17, 12]);

  // Ambient Temp sparkline data
  const ambPoints = vitalsHistory.map((p) => p.ambientTemp).filter((v) => v !== null && v !== undefined);
  const ambWave = generateSparkline(ambPoints, 20, 50, 120, 36, [18, 15, 17, 13, 11, 14, 12, 14, 16]);

  // Humidity sparkline data
  const humPoints = vitalsHistory.map((p) => p.humidity).filter((v) => v !== null && v !== undefined);
  const humWave = generateSparkline(humPoints, 0, 100, 120, 36, [14, 12, 15, 13, 15, 17, 12, 14, 16]);

  // Altitude wave data
  const altWave = generateSparkline(null, 40, 65, 120, 36, [16, 14, 11, 14, 16, 13, 15, 11, 14]);

  // Pressure wave data
  const pressWave = generateSparkline(null, 990, 1020, 120, 36, [14, 16, 12, 14, 11, 13, 16, 12, 14]);

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
      <TopStatusBar />

      {/* Screen Header (redesign1.png & redesign2.png) */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 18px 12px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={goBack}
            aria-label="Go Back"
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#1B2C1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px 4px',
              cursor: 'pointer',
            }}
          >
            ‹
          </button>
          <div>
            <h1
              style={{
                fontSize: '19px',
                fontWeight: '800',
                color: '#1B2C1E',
                letterSpacing: '-0.3px',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Live Monitoring
            </h1>
            <p
              style={{
                fontSize: '11.5px',
                color: '#687667',
                margin: 0,
                marginTop: '2px',
                fontWeight: '500',
              }}
            >
              Real-time data from your VitalShield
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Device Connected Status Pill */}
          <button
            onClick={() => setIsDeviceModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#E2ECE2',
              padding: '5px 10px',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span
              style={{
                width: '7.5px',
                height: '7.5px',
                borderRadius: '50%',
                backgroundColor: esp32Status === 'connected' ? '#16A34A' : '#16A34A',
                boxShadow: '0 0 4px rgba(22, 163, 74, 0.4)',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534' }}>
              Device Connected
            </span>
          </button>

          {/* Settings Gear Button */}
          <button
            onClick={() => navigateTo('settings')}
            aria-label="Settings"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2C3A2E',
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2C3A2E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </header>

      {/* Segmented Sub-Tab Switcher: Vitals | Environment */}
      <div style={{ padding: '0 18px 14px 18px' }}>
        <div
          role="tablist"
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
            width: '100%',
          }}
        >
          <button
            id="tab-vitals"
            role="tab"
            aria-selected={monitorSubTab === 'vitals'}
            onClick={() => setMonitorSubTab('vitals')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 0',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: monitorSubTab === 'vitals' ? '700' : '600',
              color: monitorSubTab === 'vitals' ? '#FFFFFF' : '#334A37',
              backgroundColor: monitorSubTab === 'vitals' ? '#1C3722' : 'transparent',
              boxShadow: monitorSubTab === 'vitals' ? '0 2px 8px rgba(28, 55, 34, 0.22)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            {/* ECG Pulse Waveform Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={monitorSubTab === 'vitals' ? '#FFFFFF' : '#334A37'}
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>Vitals</span>
          </button>

          <button
            id="tab-environment"
            role="tab"
            aria-selected={monitorSubTab === 'environment'}
            onClick={() => setMonitorSubTab('environment')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 0',
              borderRadius: '999px',
              fontSize: '13.5px',
              fontWeight: monitorSubTab === 'environment' ? '700' : '600',
              color: monitorSubTab === 'environment' ? '#FFFFFF' : '#334A37',
              backgroundColor: monitorSubTab === 'environment' ? '#1C3722' : 'transparent',
              boxShadow: monitorSubTab === 'environment' ? '0 2px 8px rgba(28, 55, 34, 0.22)' : 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            {/* Leaf Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={monitorSubTab === 'environment' ? '#FFFFFF' : 'none'}
              stroke={monitorSubTab === 'environment' ? '#FFFFFF' : '#334A37'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span>Environment</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Content Area */}
      <div
        style={{
          flex: 1,
          padding: '0 18px 84px 18px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {monitorSubTab === 'vitals' ? (
          /* ====================================================
             TAB 1: VITALS (redesign2.png)
             ==================================================== */
          <>
            {/* 2x2 Grid of Vital Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Card 1: Heart Rate */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="#E53935">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Heart Rate</span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: '#E3F5E7',
                        color: '#1E7535',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Normal
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#1A281C' }}>
                      {vitals.heartRate !== null && vitals.heartRate !== undefined ? vitals.heartRate : 42}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#4A584D' }}>BPM</span>
                  </div>
                </div>

                {/* Red Wave Sparkline */}
                <div style={{ marginTop: '6px', position: 'relative' }}>
                  <svg viewBox="0 0 120 36" style={{ width: '100%', height: '36px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="hrRedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="18" x2="120" y2="18" stroke="#F3F4F6" strokeDasharray="2 2" strokeWidth="1" />
                    <path d={hrWave.areaD} fill="url(#hrRedGrad)" />
                    <path d={hrWave.lineD} fill="none" stroke="#E53935" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#9CA3AF', marginTop: '1px' }}>
                    <span>40</span>
                    <span>180</span>
                  </div>
                </div>
              </div>

              {/* Card 2: SpO2 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>SpO₂</span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: '#E3F5E7',
                        color: '#1E7535',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Normal
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#1A281C' }}>
                      {vitals.spo2 !== null && vitals.spo2 !== undefined ? vitals.spo2 : 98}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#4A584D' }}>%</span>
                  </div>
                </div>

                {/* Blue Wave Sparkline */}
                <div style={{ marginTop: '6px', position: 'relative' }}>
                  <svg viewBox="0 0 120 36" style={{ width: '100%', height: '36px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="spo2BlueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="18" x2="120" y2="18" stroke="#F3F4F6" strokeDasharray="2 2" strokeWidth="1" />
                    <path d={spo2Wave.areaD} fill="url(#spo2BlueGrad)" />
                    <path d={spo2Wave.lineD} fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#9CA3AF', marginTop: '1px' }}>
                    <span>85</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Body Temperature */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill="#EA580C" fillOpacity="0.2" />
                          <circle cx="11.5" cy="17.5" r="2" fill="#EA580C" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Body Temperature</span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: '#E3F5E7',
                        color: '#1E7535',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Normal
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#1A281C' }}>
                      {vitals.bodyTemp !== null && vitals.bodyTemp !== undefined ? vitals.bodyTemp : 32.8}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#4A584D' }}>°C</span>
                  </div>
                </div>

                {/* Orange Wave Sparkline */}
                <div style={{ marginTop: '6px', position: 'relative' }}>
                  <svg viewBox="0 0 120 36" style={{ width: '100%', height: '36px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="tempOrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="18" x2="120" y2="18" stroke="#F3F4F6" strokeDasharray="2 2" strokeWidth="1" />
                    <path d={tempWave.areaD} fill="url(#tempOrGrad)" />
                    <path d={tempWave.lineD} fill="none" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#9CA3AF', marginTop: '1px' }}>
                    <span>30</span>
                    <span>42</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Activity (Bar Chart) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="13" cy="4" r="2" fill="#16A34A" />
                          <path d="m9 20 3-6 3 2 2 4" />
                          <path d="m6 17 3-5 3 1 3-5" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Activity</span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: '#E3F5E7',
                        color: '#1E7535',
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Idle
                    </span>
                  </div>

                  <div style={{ marginTop: '2px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#1A281C', letterSpacing: '-0.2px' }}>
                      {vitals.activity ? vitals.activity.toUpperCase() : 'RESTING'}
                    </span>
                  </div>
                </div>

                {/* Vertical Bar Chart (12 Bars from redesign2.png) */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '32px', gap: '3px' }}>
                    {[8, 12, 16, 20, 24, 28, 20, 24, 28, 32, 26, 30].map((h, i) => {
                      const isFilled = i < 6;
                      return (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: `${h}px`,
                            borderRadius: '3px',
                            backgroundColor: isFilled ? '#1E7535' : '#CBD5E1',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#9CA3AF', marginTop: '3px' }}>
                    <span>0g</span>
                    <span>1.0g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Motion & Acceleration (Full Width from redesign2.png) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: '0 0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#F3E8FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Motion & Acceleration</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      backgroundColor: '#E3F5E7',
                      color: '#1E7535',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      marginLeft: '6px',
                    }}
                  >
                    Normal
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '800', color: '#1A281C' }}>
                    {vitals.acceleration !== null && vitals.acceleration !== undefined ? vitals.acceleration : '1.05'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#4A584D' }}>g</span>
                </div>
              </div>

              {/* Purple Sine Wave Graphic */}
              <div style={{ width: '130px', height: '36px' }}>
                <svg viewBox="0 0 130 36" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 18 Q 15 8 30 18 T 60 18 T 90 10 T 115 22 T 130 18 L 130 36 L 0 36 Z"
                    fill="url(#purpleGrad)"
                  />
                  <path
                    d="M 0 18 Q 15 8 30 18 T 60 18 T 90 10 T 115 22 T 130 18"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Card 6: Personal Baseline Context (redesign2.png) */}
            <div
              style={{
                backgroundColor: 'rgba(235, 241, 234, 0.75)',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(35, 64, 45, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#1E2C1E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1B2C1E' }}>Personal Baseline Context</div>
                  <div style={{ fontSize: '11.5px', color: '#5A685B', marginTop: '1px' }}>
                    Resting baseline: 68 BPM • Current: {vitals.heartRate ?? 42} BPM
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  backgroundColor: '#D1E7DD',
                  color: '#15803D',
                  padding: '4px 10px',
                  borderRadius: '999px',
                }}
              >
                Stable
              </span>
            </div>

            {/* Card 7: Banner - All vitals are within normal range (redesign2.png) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1B2C1E' }}>
                    All vitals are within your normal range.
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#5A685B', marginTop: '1px' }}>
                    Keep up the good work!
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ====================================================
             TAB 2: ENVIRONMENT (redesign1.png)
             ==================================================== */
          <>
            {/* 2x2 Grid of Environment Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Card 1: Ambient Temperature */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
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
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill="#EA580C" fillOpacity="0.2" />
                        <circle cx="11.5" cy="17.5" r="2" fill="#EA580C" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Ambient Temperature</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#1A281C' }}>
                      {vitals.ambientTemp !== null && vitals.ambientTemp !== undefined ? vitals.ambientTemp : '31.4'}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#4A584D' }}>°C</span>
                  </div>
                </div>

                {/* Orange Wave Sparkline & Moderate Heat Pill */}
                <div style={{ marginTop: '6px', position: 'relative' }}>
                  <svg viewBox="0 0 120 36" style={{ width: '100%', height: '36px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="ambOrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F97316" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={ambWave.areaD} fill="url(#ambOrGrad)" />
                    <path d={ambWave.lineD} fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>20</span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        padding: '1px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Moderate Heat
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>50</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Relative Humidity */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Relative Humidity</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#1A281C' }}>
                      {vitals.humidity !== null && vitals.humidity !== undefined ? vitals.humidity : '62'}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#4A584D' }}>%</span>
                  </div>
                </div>

                {/* Blue Wave Sparkline & Comfortable Pill */}
                <div style={{ marginTop: '6px', position: 'relative' }}>
                  <svg viewBox="0 0 120 36" style={{ width: '100%', height: '36px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="humBlueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={humWave.areaD} fill="url(#humBlueGrad)" />
                    <path d={humWave.lineD} fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>0</span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        padding: '1px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Comfortable
                    </span>
                    <span style={{ fontSize: '10.5px', color: '#9CA3AF' }}>100</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Altitude (HW-611) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
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
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m8 3 4 8 5-5 5 15H2L8 3z" fill="#166534" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Altitude (HW-611)</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '26px', fontWeight: '800', color: '#1A281C' }}>
                      {vitals.altitude !== null && vitals.altitude !== undefined ? vitals.altitude : '50.95'}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#4A584D' }}>m</span>
                  </div>
                </div>

                {/* Green Wave & Filtered Relative Pill */}
                <div style={{ marginTop: '6px', position: 'relative' }}>
                  <svg viewBox="0 0 120 36" style={{ width: '100%', height: '36px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="altGreenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={altWave.areaD} fill="url(#altGreenGrad)" />
                    <path d={altWave.lineD} fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        backgroundColor: '#E2ECE2',
                        color: '#15803D',
                        padding: '1px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      Filtered Relative
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Barometric Pressure */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '13px 14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '144px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#F3E8FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m12 14 4-4" />
                        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2C3A2E' }}>Barometric Pressure</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#1A281C' }}>
                      {vitals.pressure !== null && vitals.pressure !== undefined ? vitals.pressure : '1007.15'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#4A584D' }}>hPa</span>
                  </div>
                </div>

                {/* Purple Wave & Ground Calibrated Pill */}
                <div style={{ marginTop: '6px', position: 'relative' }}>
                  <svg viewBox="0 0 120 36" style={{ width: '100%', height: '36px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="pressPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={pressWave.areaD} fill="url(#pressPurpleGrad)" />
                    <path d={pressWave.lineD} fill="none" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        backgroundColor: '#F3E8FF',
                        color: '#7C3AED',
                        padding: '1px 10px',
                        borderRadius: '999px',
                      }}
                    >
                      Ground Calibrated
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Heat & Hydration Risk Status (redesign1.png) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#FFEDD5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="4" fill="#EA580C" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1B2C1E' }}>
                      Heat & Hydration Risk Status
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      backgroundColor: '#15803D',
                      color: '#FFFFFF',
                      padding: '3px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    Low Risk
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#5A685B', lineHeight: '1.45', paddingLeft: '42px' }}>
                Exposure duration: 45 min in outdoor conditions:
                <br />
                Thermal strain index is within your safe physiological corridor.
              </div>
            </div>

            {/* Card 6: GPS Location (redesign1.png) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#DC2626">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#718078' }}>GPS Location</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: gpsData.fix ? '#16A34A' : '#DC2626', marginTop: '1px' }}>
                    {gpsData.fix && gpsData.latitude
                      ? `${gpsData.latitude.toFixed(4)}°, ${gpsData.longitude.toFixed(4)}°`
                      : 'NO FIX'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#718078', marginTop: '2px' }}>
                    {gpsData.fix ? `Accuracy ±5m • ${gpsData.satellites || 0} Sats` : 'Location not available'}
                  </div>
                </div>
              </div>

              {/* Slanted Map Preview Graphic */}
              <div
                style={{
                  width: '90px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#E5E7EB',
                  backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px), linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                  backgroundSize: '8px 8px, 100% 100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 4px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Roads overlay */}
                <svg viewBox="0 0 90 52" style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.35 }}>
                  <path d="M-10 15 Q 30 25 100 20 M 45 -10 L 45 60" stroke="#FFFFFF" strokeWidth="4" />
                </svg>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(55, 65, 81, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M21 10c0 7-9 13-9 13s-1.7-1.13-3.46-3.26" />
                    <path d="M6.3 6.3C4.85 7.8 4 9.68 4 10c0 7 9 13 9 13" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card 7: Hardware Signal Health (redesign1.png) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: '#E2ECE2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="16" height="16" x="4" y="4" rx="2" />
                      <rect width="6" height="6" x="9" y="9" rx="1" />
                      <path d="M15 2v2" />
                      <path d="M15 20v2" />
                      <path d="M2 15h2" />
                      <path d="M2 9h2" />
                      <path d="M20 15h2" />
                      <path d="M20 9h2" />
                      <path d="M9 2v2" />
                      <path d="M9 20v2" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1B2C1E' }}>Hardware Signal Health</span>
                </div>

                <button
                  onClick={() => setIsDeviceModalOpen(true)}
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#15803D',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  Diagnostics ›
                </button>
              </div>

              {/* 4 Sensor rows with green checkmarks from redesign1.png */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '40px' }}>
                {[
                  { name: 'Heart Rate (MAX30102)', status: esp32Status === 'connected' ? 'Good' : 'Offline' },
                  { name: 'SpO₂ Sensor (MAX30102)', status: esp32Status === 'connected' ? 'Good' : 'Offline' },
                  { name: 'Skin/Body Temp (BMP280)', status: esp32Status === 'connected' ? 'Good' : 'Offline' },
                  { name: 'Motion & Activity (MPU6050)', status: esp32Status === 'connected' ? 'Good' : 'Offline' },
                ].map((sensor, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#4A584D', fontWeight: '500' }}>{sensor.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: '#16A34A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#1E2C1E' }}>{sensor.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mountain Landscape Background Illustration at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: 0,
          right: 0,
          height: '120px',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M0 85 L45 54 L95 78 L150 42 L210 70 L280 38 L340 64 L400 48 L400 120 L0 120 Z"
            fill="#D3DFCF"
            opacity="0.65"
          />
          <path
            d="M0 92 L55 64 L115 82 L185 52 L250 78 L320 56 L380 78 L400 68 L400 120 L0 120 Z"
            fill="#A7BEA0"
            opacity="0.8"
          />
          <path
            d="M0 102 Q 15 90 35 100 T 75 96 T 115 100 T 155 92 T 195 98 T 240 92 T 285 99 T 330 90 T 370 98 T 400 92 L400 120 L0 120 Z"
            fill="#5E7D58"
            opacity="0.9"
          />
          <path d="M0 110 Q 40 105 90 110 T 180 106 T 270 110 T 350 106 T 400 108 L400 120 L0 120 Z" fill="#2A4328" />
        </svg>
      </div>
    </div>
  );
};
