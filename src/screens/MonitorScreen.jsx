import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';

export const MonitorScreen = () => {
  const {
    goBack,
    monitorSubTab,
    setMonitorSubTab,
    vitals,
    sensorDiagnostics,
    setIsDeviceModalOpen,
  } = useApp();

  const [selectedTimeRange, setSelectedTimeRange] = useState('15m');

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
          Live Monitoring
        </h2>
      </div>

      {/* Segmented Pill: Vitals | Environment */}
      <div style={{ padding: '0 20px 14px 20px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
          }}
        >
          {[
            { id: 'vitals', label: 'Vitals' },
            { id: 'environment', label: 'Environment' },
          ].map((tab) => {
            const isActive = monitorSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMonitorSubTab(tab.id)}
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
      </div>

      {/* Content Area */}
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
        {monitorSubTab === 'vitals' ? (
          <>
            {/* 2x2 Grid of Vital Cards with Sparklines */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Card 1: Heart Rate */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '14px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>Heart Rate</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginTop: '2px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#1B2C1E' }}>{vitals.heartRate}</span>
                    <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '600' }}>bpm</span>
                  </div>
                </div>

                {/* Animated Red Sparkline Wave */}
                <div style={{ marginTop: '8px', position: 'relative' }}>
                  <svg viewBox="0 0 120 40" style={{ width: '100%', height: '40px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Dotted threshold line */}
                    <line x1="0" y1="20" x2="120" y2="20" stroke="#E5E7EB" strokeDasharray="2 2" strokeWidth="1" />
                    {/* Gradient Area */}
                    <path
                      d="M0 25 Q 15 15 30 24 T 60 14 T 90 26 T 120 18 L 120 40 L 0 40 Z"
                      fill="url(#hrGrad)"
                    />
                    {/* Red Wave Stroke */}
                    <path
                      d="M0 25 Q 15 15 30 24 T 60 14 T 90 26 T 120 18"
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
                    <span>60</span>
                    <span>120</span>
                  </div>
                </div>
              </div>

              {/* Card 2: SpO2 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '14px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>SpO₂</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginTop: '2px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#1B2C1E' }}>{vitals.spo2}</span>
                    <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '600' }}>%</span>
                  </div>
                </div>

                {/* Animated Blue Sparkline Wave */}
                <div style={{ marginTop: '8px', position: 'relative' }}>
                  <svg viewBox="0 0 120 40" style={{ width: '100%', height: '40px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="20" x2="120" y2="20" stroke="#E5E7EB" strokeDasharray="2 2" strokeWidth="1" />
                    <path
                      d="M0 22 Q 20 25 40 18 T 80 23 T 105 14 T 120 19 L 120 40 L 0 40 Z"
                      fill="url(#spo2Grad)"
                    />
                    <path
                      d="M0 22 Q 20 25 40 18 T 80 23 T 105 14 T 120 19"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
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
                  padding: '14px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>Body Temperature</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginTop: '2px' }}>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#1B2C1E' }}>{vitals.bodyTemp}</span>
                    <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '600' }}>°C</span>
                  </div>
                </div>

                {/* Animated Orange Sparkline Wave */}
                <div style={{ marginTop: '8px', position: 'relative' }}>
                  <svg viewBox="0 0 120 40" style={{ width: '100%', height: '40px', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EA580C" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="20" x2="120" y2="20" stroke="#FDE68A" strokeDasharray="2 2" strokeWidth="1" />
                    <path
                      d="M0 24 Q 25 28 50 22 T 90 20 T 120 22 L 120 40 L 0 40 Z"
                      fill="url(#tempGrad)"
                    />
                    <path
                      d="M0 24 Q 25 28 50 22 T 90 20 T 120 22"
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
                    <span>35</span>
                    <span>40</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Activity Histogram */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '14px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '140px',
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#6A7869', fontWeight: '500' }}>Activity</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E', marginTop: '2px' }}>
                    {vitals.activityLevel}
                  </div>
                </div>

                {/* Histogram Bars */}
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      height: '40px',
                      padding: '0 2px',
                    }}
                  >
                    {[16, 22, 18, 30, 24, 38, 28, 44, 52, 65, 80, 58].map((h, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: '4.5px',
                          height: `${(h / 80) * 36}px`,
                          backgroundColor: idx >= 8 ? '#2E7D32' : '#88B285',
                          borderRadius: '2px',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
                    <span>50</span>
                    <span>50</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Live Stress Index */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '16px 18px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '13px', color: '#6A7869', fontWeight: '600' }}>Live Stress Index</div>
              <div
                style={{
                  fontSize: '26px',
                  fontWeight: '700',
                  color: '#1B2C1E',
                  fontFamily: 'var(--font-serif)',
                  marginTop: '2px',
                }}
              >
                {vitals.stressIndex}
              </div>

              {/* Wide flowing green wave */}
              <div style={{ margin: '8px 0', position: 'relative' }}>
                <svg viewBox="0 0 280 50" style={{ width: '100%', height: '52px', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A7C59" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4A7C59" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 38 Q 40 38 70 32 T 130 35 T 190 28 T 240 16 Q 260 14 280 40 L 280 50 L 0 50 Z"
                    fill="url(#stressGrad)"
                  />
                  <path
                    d="M0 38 Q 40 38 70 32 T 130 35 T 190 28 T 240 16 Q 260 14 280 40"
                    fill="none"
                    stroke="#3E6B4B"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div style={{ fontSize: '11px', color: '#889887' }}>Based on your personal baseline</div>
            </div>

            {/* Baseline comparison card (PRD Section 7.C) */}
            <div
              style={{
                backgroundColor: '#F0EFE8',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#243827' }}>
                  Personal Baseline Context
                </span>
                <p style={{ fontSize: '11px', color: '#687767', marginTop: '2px' }}>
                  Resting baseline: 68 BPM • Current: +10 BPM (activity-adjusted normal)
                </p>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  fontWeight: '700',
                }}
              >
                Stable
              </span>
            </div>
          </>
        ) : (
          /* Environment Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '12px', color: '#6A7869' }}>Ambient Temperature</span>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#1B2C1E', marginTop: '4px' }}>
                  {vitals.ambientTemp} <span style={{ fontSize: '14px', color: '#6B7280' }}>°C</span>
                </div>
                <span style={{ fontSize: '11px', color: '#D97706', fontWeight: '600' }}>Moderate heat</span>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: '12px', color: '#6A7869' }}>Relative Humidity</span>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#1B2C1E', marginTop: '4px' }}>
                  {vitals.humidity} <span style={{ fontSize: '14px', color: '#6B7280' }}>%</span>
                </div>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: '600' }}>Comfortable</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1B2C1E' }}>
                  Heat & Hydration Risk Status
                </span>
                <span style={{ fontSize: '11px', backgroundColor: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '999px', fontWeight: '700' }}>
                  Low Risk
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.4' }}>
                Exposure duration: 45 min in outdoor conditions. Thermal strain index is within your safe physiological corridor.
              </p>
            </div>

            {/* Sensor Diagnostic Overview */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1B2C1E' }}>Hardware Signal Health</span>
                <button
                  onClick={() => setIsDeviceModalOpen(true)}
                  style={{ fontSize: '11px', color: '#2E7D32', fontWeight: '700' }}
                >
                  Diagnostics ›
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sensorDiagnostics.slice(0, 4).map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#4B5563' }}>{s.name}</span>
                    <span style={{ color: '#16A34A', fontWeight: '700' }}>✓ {s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
