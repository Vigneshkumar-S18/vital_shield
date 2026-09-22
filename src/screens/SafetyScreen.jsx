import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';
import { VitalShieldCrest, CallIcon } from '../data/svgIcons';

export const SafetyScreen = () => {
  const {
    goBack,
    safetySubTab,
    setSafetySubTab,
    contacts,
    triggerSos,
    navigateTo,
    showToast,
    setIsAddContactModalOpen,
  } = useApp();

  // Hold-to-activate SOS (3 seconds)
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(progressIntervalRef.current);
      }
    }, 50);

    holdTimerRef.current = setTimeout(() => {
      setIsHolding(false);
      setHoldProgress(0);
      triggerSos();
    }, duration);
  };

  const cancelHold = () => {
    if (isHolding && holdProgress < 100) {
      showToast('Hold for a full 3 seconds to trigger emergency SOS');
    }
    setIsHolding(false);
    setHoldProgress(0);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleCall = (contact) => {
    showToast(`Calling ${contact.name} (${contact.phone})...`);
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
          Safety
        </h2>
      </div>

      {/* Segmented Pill: SOS | Safety Network */}
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
            { id: 'sos', label: 'SOS' },
            { id: 'network', label: 'Safety Network' },
          ].map((tab) => {
            const isActive = safetySubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSafetySubTab(tab.id)}
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

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 88px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {safetySubTab === 'sos' ? (
          <>
            {/* Pulsing Emergency SOS Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '10px 0 6px 0',
                position: 'relative',
              }}
            >
              {/* Concentric ripple rings */}
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
                {/* Outer Ripple 1 */}
                <div
                  style={{
                    position: 'absolute',
                    width: '210px',
                    height: '210px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(184, 40, 40, 0.28)',
                    animation: 'pulseRipple 2.8s ease-out infinite',
                  }}
                />
                {/* Outer Ripple 2 */}
                <div
                  style={{
                    position: 'absolute',
                    width: '185px',
                    height: '185px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(184, 40, 40, 0.12)',
                    animation: 'pulseRipple 2.8s ease-out 1s infinite',
                  }}
                />

                {/* Primary Button Body */}
                <div
                  id="btn-sos-trigger"
                  onMouseDown={startHold}
                  onMouseUp={cancelHold}
                  onMouseLeave={cancelHold}
                  onTouchStart={startHold}
                  onTouchEnd={cancelHold}
                  style={{
                    position: 'relative',
                    width: '154px',
                    height: '154px',
                    borderRadius: '50%',
                    backgroundColor: '#B82828',
                    background: isHolding
                      ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
                      : 'linear-gradient(135deg, #C53030 0%, #A11D1D 100%)',
                    boxShadow: isHolding
                      ? '0 0 35px rgba(220, 38, 38, 0.65)'
                      : '0 10px 28px rgba(184, 40, 40, 0.38)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transform: isHolding ? 'scale(0.96)' : 'scale(1)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    zIndex: 10,
                  }}
                >
                  {/* Circular hold-to-activate progress ring */}
                  {isHolding && (
                    <svg
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        width: '170px',
                        height: '170px',
                        transform: 'rotate(-90deg)',
                      }}
                    >
                      <circle
                        cx="85"
                        cy="85"
                        r="80"
                        fill="none"
                        stroke="#FCA5A5"
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 80}
                        strokeDashoffset={2 * Math.PI * 80 * (1 - holdProgress / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                  )}

                  {/* Icon */}
                  <div style={{ marginBottom: '4px' }}>
                    <VitalShieldCrest size={28} color="#FFFFFF" />
                  </div>

                  {/* SOS Text */}
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#FFFFFF',
                      letterSpacing: '1px',
                      lineHeight: '1',
                    }}
                  >
                    SOS
                  </div>

                  {/* Subtext */}
                  <div
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '600',
                      color: '#FEE2E2',
                      marginTop: '6px',
                      maxWidth: '110px',
                      lineHeight: '1.2',
                    }}
                  >
                    {isHolding ? `HOLD (${Math.ceil((3000 - holdProgress * 30) / 1000)}s)` : 'Press & Hold for 3 seconds'}
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Quick Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {/* Action 1: Share Live Location */}
              <button
                onClick={() => navigateTo('live_location')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  gap: '6px',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#F3EFE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📍</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1B2C1E', lineHeight: '1.2' }}>
                  Share<br />Live Location
                </span>
              </button>

              {/* Action 2: Alert Nearby Police */}
              <button
                onClick={() => showToast('🚓 Live location dispatched to Nearby Police Branch (Central Division - 1.2 km)')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  gap: '6px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#F3EFE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>🚓</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1B2C1E', lineHeight: '1.2' }}>
                  Nearby<br />Police Branch
                </span>
              </button>

              {/* Action 3: Notify Family Members */}
              <button
                onClick={() => showToast('👨‍👩‍👧 Live location shared with family members: Mom, Dad')}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '14px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  gap: '6px',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#F3EFE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>👨‍👩‍👧</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1B2C1E', lineHeight: '1.2' }}>
                  Notify<br />Family Members
                </span>
              </button>
            </div>

            {/* Emergency Contacts Section */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1B2C1E' }}>Emergency Contacts</h3>
                <button
                  onClick={() => navigateTo('contacts')}
                  style={{ fontSize: '12px', fontWeight: '700', color: '#243827' }}
                >
                  View All
                </button>
              </div>

              {/* Contacts List - All Contacts Displayed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt={c.name}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: '#EBE5D8',
                            color: '#4B5563',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '13px',
                          }}
                        >
                          {c.avatarInitials ||
                            c.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>{c.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#6B7280' }}>{c.phone}</div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            backgroundColor: c.priority === 'Primary' ? '#DCFCE7' : '#F3F4F6',
                            color: c.priority === 'Primary' ? '#166534' : '#4B5563',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginTop: '2px',
                          }}
                        >
                          {c.priority}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCall(c)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#F3EFE6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <CallIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Contact Button directly in Safety Tab */}
              <button
                onClick={() => setIsAddContactModalOpen(true)}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  backgroundColor: '#ECE7DC',
                  color: '#1B2C1E',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <span style={{ fontSize: '16px', fontWeight: '700' }}>+</span>
                <span>Add Emergency Contact</span>
              </button>
            </div>
          </>
        ) : (
          /* Safety Network Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1B2C1E', marginBottom: '8px' }}>
                Mesh & Gateway Relays
              </h4>
              <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: '1.4', marginBottom: '14px' }}>
                If cellular connectivity fails during an SOS, VitalShield hops over nearby encrypted LoRa safety nodes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1F2937' }}>● Gateway VS-GW-04</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>420 m • High Bandwidth Cellular Backhaul</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>Active</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1F2937' }}>● Relay Node Mesh-12</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>180 m • LoRa Sub-GHz 868 MHz</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>Relay Ready</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>Transmission Architecture</span>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E', marginTop: '6px' }}>
                Wearable → BLE / LoRa → Safety Node → Cloud Dispatch → Contacts
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
