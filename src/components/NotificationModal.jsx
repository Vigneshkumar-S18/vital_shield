import React from 'react';
import { useApp } from '../context/AppContext';

export const NotificationModal = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, setNotifications } = useApp();

  if (!isNotificationsOpen) return null;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
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
      onClick={() => setIsNotificationsOpen(false)}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px 32px 20px',
          maxHeight: '80%',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#D1D5DB',
            borderRadius: '2px',
            margin: '0 auto 16px auto',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1B2C1E' }}>Notifications</h3>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>Vital updates & safety alerts</p>
          </div>
          <button
            onClick={markAllRead}
            style={{ fontSize: '12px', fontWeight: '600', color: '#2F4D34', padding: '6px 10px', borderRadius: '8px', backgroundColor: '#E2ECE2' }}
          >
            Mark read
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => {
            const isAlert = n.level >= 3;
            return (
              <div
                key={n.id}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  backgroundColor: isAlert ? '#FEF2F2' : '#F9FAFB',
                  border: isAlert ? '1px solid #FECACA' : '1px solid #E5E7EB',
                  display: 'flex',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isAlert ? '#FEE2E2' : '#E0E7FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {isAlert ? '⚠️' : '🌿'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: isAlert ? '#991B1B' : '#1F2937' }}>
                      {n.title}
                    </h4>
                    <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#4B5563', marginTop: '4px', lineHeight: '1.4' }}>
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setIsNotificationsOpen(false)}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '12px',
            borderRadius: '14px',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
