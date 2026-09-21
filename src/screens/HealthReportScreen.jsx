import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';
import { HeartIcon, DropletIcon, TempIcon, ActivityWalkingIcon } from '../data/svgIcons';

export const HealthReportScreen = () => {
  const { goBack, reportsSubTab, setReportsSubTab, healthReportsData, showToast } = useApp();
  const [dayOffset, setDayOffset] = useState(0);
  const [showFullModal, setShowFullModal] = useState(false);

  const currentReport = healthReportsData[reportsSubTab] || healthReportsData.day;

  const handleExport = (format) => {
    showToast(`✓ Exported ${reportsSubTab} report as ${format}`);
    setShowFullModal(false);
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
          Health Report
        </h2>
      </div>

      {/* Segmented Pill: Day | Week | Month */}
      <div style={{ padding: '0 20px 8px 20px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
          }}
        >
          {[
            { id: 'day', label: 'Day' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' },
          ].map((tab) => {
            const isActive = reportsSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setReportsSubTab(tab.id)}
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

      {/* Date Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '6px 0 12px 0',
          fontSize: '13.5px',
          fontWeight: '700',
          color: '#1B2C1E',
        }}
      >
        <button
          onClick={() => setDayOffset((prev) => prev - 1)}
          style={{ color: '#6B7280', fontSize: '15px' }}
        >
          ‹
        </button>
        <span>{currentReport.date}</span>
        <button
          onClick={() => setDayOffset((prev) => Math.min(0, prev + 1))}
          style={{ color: '#6B7280', fontSize: '15px' }}
        >
          ›
        </button>
      </div>

      {/* Scrollable Content */}
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
        {/* Overall Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#6A7869', fontWeight: '600', marginBottom: '12px' }}>
            Overall Summary
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Circular Progress Gauge */}
            <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="9"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="9"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - currentReport.healthScore / 100)}
                  strokeLinecap="round"
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#1B2C1E', lineHeight: '1' }}>
                  {currentReport.healthScore}
                </span>
                <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: '600', marginTop: '2px' }}>
                  of 100
                </span>
              </div>
            </div>

            {/* Right Status */}
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#2E7D32' }}>
                {currentReport.statusText}
              </div>
              <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px', lineHeight: '1.4' }}>
                {currentReport.statusDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: '13.5px', color: '#1B2C1E', fontWeight: '800', marginBottom: '14px' }}>
            Detailed Metrics
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Metric 1: Heart Rate */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HeartIcon size={18} />
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Heart Rate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>Avg 78 bpm</span>
                <span style={{ fontSize: '10px', backgroundColor: '#DCFCE7', color: '#166534', fontWeight: '700', padding: '2px 7px', borderRadius: '999px' }}>
                  Normal
                </span>
              </div>
            </div>

            {/* Metric 2: SpO2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DropletIcon size={18} />
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>SpO₂</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>Avg 98%</span>
                <span style={{ fontSize: '10px', backgroundColor: '#DCFCE7', color: '#166534', fontWeight: '700', padding: '2px 7px', borderRadius: '999px' }}>
                  Normal
                </span>
              </div>
            </div>

            {/* Metric 3: Body Temp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TempIcon size={18} />
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Body Temperature</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>Avg 36.6°C</span>
                <span style={{ fontSize: '10px', backgroundColor: '#DCFCE7', color: '#166534', fontWeight: '700', padding: '2px 7px', borderRadius: '999px' }}>
                  Normal
                </span>
              </div>
            </div>

            {/* Metric 4: Active Time */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ActivityWalkingIcon size={18} />
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Active Time</span>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>2h 18m</span>
            </div>

            {/* Metric 5: Steps */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>👟</span>
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Steps</span>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>8,420</span>
            </div>

            {/* Metric 6: Calories Burned */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>🔥</span>
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '600' }}>Calories Burned</span>
              </div>
              <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>420 kcal</span>
            </div>
          </div>
        </div>

        {/* Action Button: View Full Report */}
        <button
          onClick={() => setShowFullModal(true)}
          style={{
            width: '100%',
            backgroundColor: '#243827',
            color: '#FFFFFF',
            padding: '15px 20px',
            borderRadius: '999px',
            fontSize: '15px',
            fontWeight: '700',
            boxShadow: '0 4px 14px rgba(36, 56, 39, 0.25)',
            cursor: 'pointer',
          }}
        >
          View Full Report
        </button>
      </div>

      {/* Full Report & Export Modal */}
      {showFullModal && (
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
          onClick={() => setShowFullModal(false)}
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

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E' }}>
              Full Physiological Health Summary
            </h3>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', marginBottom: '16px' }}>
              Monitoring time: 42h 18m • Elevated events: 4 • Sensor uptime: 99.4%
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', fontSize: '12.5px' }}>
                <span style={{ fontWeight: '700', color: '#1F2937' }}>Heat Strain Index: </span>
                <span style={{ color: '#4B5563' }}>Low-Moderate (peak at 14:00 with 33.2°C ambient)</span>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '12px', fontSize: '12.5px' }}>
                <span style={{ fontWeight: '700', color: '#1F2937' }}>Cardiac Recovery Rate: </span>
                <span style={{ color: '#15803D' }}>Optimal (-22 BPM within 3 minutes of rest)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleExport('PDF')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: '#243827',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '13.5px',
                }}
              >
                Export PDF
              </button>
              <button
                onClick={() => handleExport('CSV')}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  backgroundColor: '#F3EFE6',
                  color: '#1B2C1E',
                  fontWeight: '700',
                  fontSize: '13.5px',
                }}
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
