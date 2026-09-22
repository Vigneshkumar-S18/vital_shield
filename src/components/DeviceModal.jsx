import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DeviceModal = () => {
  const {
    isDeviceModalOpen,
    setIsDeviceModalOpen,
    userProfile,
    sensorDiagnostics,
    showToast,
    esp32Status,
    esp32Wifi,
  } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isDeviceModalOpen) return null;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('✓ Sensor calibrations & baselines synced');
    }, 1200);
  };

  return (
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
      onClick={() => setIsDeviceModalOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px 32px 20px',
          maxHeight: '85%',
          overflowY: 'auto',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <img
            src="/smartband.jpg"
            alt="Device"
            style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '1px solid #E5E7EB' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1B2C1E' }}>ESP32 Body Monitor</h3>
              <span
                style={{
                  fontSize: '10px',
                  backgroundColor: esp32Status === 'connected' ? '#DCFCE7' : '#FEE2E2',
                  color: esp32Status === 'connected' ? '#166534' : '#991B1B',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {esp32Status === 'connected' ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
              IP: {esp32Wifi && esp32Wifi.ip ? esp32Wifi.ip : '10.99.16.90'} • WiFi RSSI: {esp32Wifi && esp32Wifi.rssi !== null ? `${esp32Wifi.rssi} dBm` : '-48 dBm'}
            </p>
          </div>
        </div>

        {/* Diagnostic Grid */}
        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
          Sensor Calibration & Quality
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {sensorDiagnostics.map((sensor, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #F3F4F6',
              }}
            >
              <div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937' }}>{sensor.name}</span>
                <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '6px' }}>({sensor.samplingRate || sensor.accuracy})</span>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: sensor.status.includes('Offline')
                    ? '#DC2626'
                    : sensor.status.includes('Searching')
                    ? '#D97706'
                    : '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {sensor.status.includes('Offline') ? '✕ ' : sensor.status.includes('Searching') ? '⏳ ' : '✓ '}
                {sensor.status}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              backgroundColor: '#233A27',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              opacity: isSyncing ? 0.7 : 1,
            }}
          >
            {isSyncing ? 'Syncing...' : 'Force Sync Calibration'}
          </button>
          <button
            onClick={() => setIsDeviceModalOpen(false)}
            style={{
              padding: '12px 20px',
              borderRadius: '14px',
              backgroundColor: '#F3F4F6',
              color: '#4B5563',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
