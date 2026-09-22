import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';
import { CallIcon } from '../data/svgIcons';

export const LiveLocationScreen = () => {
  const { goBack, contacts, cancelSos, showToast, gpsData, nearbyPoliceStations } = useApp();

  // Tab switcher in contacts section: 'contacts' | 'police'
  const [contactTab, setContactTab] = useState('contacts');

  // After SOS, directly initialized to active sharing in GREEN
  const [isSharingLive, setIsSharingLive] = useState(true);

  // Security PIN state to end SOS or pause sharing
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState('end_sos'); // 'end_sos' | 'pause'
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  const CORRECT_PIN = '8080';

  const handleToggleSharing = () => {
    if (isSharingLive) {
      // Require security PIN to pause live location broadcasting
      handleOpenPinModal('pause');
    } else {
      setIsSharingLive(true);
      showToast('✓ Live location sharing resumed');
    }
  };

  const handleOpenPinModal = (action = 'end_sos') => {
    setPinAction(action);
    setEnteredPin('');
    setPinError(false);
    setPinSuccess(false);
    setIsPinModalOpen(true);
  };

  const handleClosePinModal = () => {
    if (pinSuccess) return;
    setIsPinModalOpen(false);
    setEnteredPin('');
    setPinError(false);
  };

  const handlePinInput = (digit) => {
    if (pinSuccess || pinError) return;
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (pinSuccess || pinError) return;
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleClearPin = () => {
    if (pinSuccess || pinError) return;
    setEnteredPin('');
    setPinError(false);
  };

  const verifyPin = (pinToTest) => {
    if (pinToTest === CORRECT_PIN) {
      setPinSuccess(true);

      // Vibrate if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([80, 50, 80]);
      }

      if (pinAction === 'pause') {
        showToast('✓ Security PIN verified. Live location sharing paused');
        setTimeout(() => {
          setIsPinModalOpen(false);
          setIsSharingLive(false);
        }, 500);
      } else {
        showToast('✓ Security PIN verified. Deactivating SOS session...');
        setTimeout(() => {
          setIsPinModalOpen(false);
          cancelSos();
        }, 500);
      }
    } else {
      setPinError(true);
      showToast('⚠️ Incorrect security PIN. Please try again.');

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([150, 100, 150]);
      }

      setTimeout(() => {
        setEnteredPin('');
        setPinError(false);
      }, 700);
    }
  };

  // Allow physical keyboard typing when modal is open
  useEffect(() => {
    if (!isPinModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handlePinInput(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClosePinModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPinModalOpen, enteredPin, pinSuccess, pinError]);

  const latitude =
    gpsData && gpsData.fix && gpsData.latitude !== null
      ? gpsData.latitude.toFixed(5)
      : '13.35682';
  const longitude =
    gpsData && gpsData.fix && gpsData.longitude !== null
      ? gpsData.longitude.toFixed(5)
      : '80.14227';

  const toDms = (val, isLat) => {
    const num = parseFloat(val);
    if (isNaN(num)) return '';
    const deg = Math.floor(Math.abs(num));
    const minFloat = (Math.abs(num) - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    const dir = isLat ? (num >= 0 ? 'N' : 'S') : (num >= 0 ? 'E' : 'W');
    return `${deg}° ${min}′ ${sec}″ ${dir}`;
  };

  const dmsCoords =
    latitude === '13.35682' && longitude === '80.14227'
      ? '13° 21′ 25″ N, 80° 8′ 32″ E'
      : `${toDms(latitude, true)}, ${toDms(longitude, false)}`;

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
        userSelect: 'none',
        WebkitUserSelect: 'none',
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
            cursor: 'pointer',
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
          Live Location
        </h2>
      </div>

      {/* Top Status Pill - Pure Green */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '10px',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#15803D',
            color: '#FFFFFF',
            padding: '6px 18px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '800',
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)',
          }}
        >
          <span style={{ fontSize: '13px' }}>📡</span>
          <span>{isSharingLive ? 'LIVE LOCATION IS SHARING' : 'LOCATION SHARING PAUSED'}</span>
        </div>

        <span style={{ fontSize: '11.5px', color: '#556557', marginTop: '4px', fontWeight: '500' }}>
          {isSharingLive
            ? 'Broadcasting real-time coordinates to emergency relay'
            : 'Standby mode • Ready to resume broadcast'}
        </span>
      </div>

      {/* Live Sharing Notification Banner */}
      <div style={{ padding: '0 20px 8px 20px' }}>
        <div
          style={{
            backgroundColor: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            color: '#166534',
            padding: '10px 14px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.1)',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#16A34A',
              boxShadow: '0 0 8px #16A34A',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, fontSize: '12px' }}>
            <div style={{ fontWeight: '800' }}>
              {isSharingLive ? 'Live location is actively sharing!' : 'Location sharing is paused'}
            </div>
            <div style={{ color: '#15803D', fontSize: '11px', marginTop: '1px' }}>
              {isSharingLive
                ? 'All emergency contacts receive continuous live telemetry updates.'
                : 'Tap Resume to start sending live updates again.'}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable container */}
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
        {/* Stylized Realistic Map Card */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #E5E2D8',
            backgroundColor: '#EBE5D8',
          }}
        >
          {/* Street Grid Graphic */}
          <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', display: 'block' }}>
            <rect width="400" height="240" fill="#EAE5D9" />
            <path d="M10 20 L90 10 L110 80 L30 110 Z" fill="#D2DEC8" opacity="0.6" />
            <path d="M300 120 L390 110 L380 220 L270 210 Z" fill="#D2DEC8" opacity="0.6" />
            <path d="M0 160 Q 40 180 80 160 T 160 170 T 240 150" fill="none" stroke="#B8D5E5" strokeWidth="18" opacity="0.7" />
            <line x1="0" y1="90" x2="400" y2="150" stroke="#FFFFFF" strokeWidth="8" />
            <line x1="0" y1="90" x2="400" y2="150" stroke="#FDE68A" strokeWidth="4" />
            <line x1="120" y1="0" x2="280" y2="240" stroke="#FFFFFF" strokeWidth="10" />
            <line x1="120" y1="0" x2="280" y2="240" stroke="#F59E0B" strokeWidth="4" />
            <line x1="40" y1="0" x2="380" y2="220" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="280" y1="0" x2="60" y2="240" stroke="#FFFFFF" strokeWidth="7" />
            <line x1="20" y1="180" x2="360" y2="40" stroke="#FFFFFF" strokeWidth="5" />
          </svg>

          {/* Central Pulsating Green Radar Rings */}
          <div
            style={{
              position: 'absolute',
              top: '46%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div className="radar-ring" style={{ width: '170px', height: '170px' }} />
            <div className="radar-ring radar-ring-2" style={{ width: '120px', height: '120px' }} />
            <div className="radar-ring radar-ring-3" style={{ width: '70px', height: '70px' }} />

            {/* Pure Green Beacon Center Pin */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.65)',
                zIndex: 20,
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>
          </div>

          {/* Overlaid Location Info Card - Pure Green theme */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              borderRadius: '16px',
              padding: '12px 14px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              📍
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#1B2C1E' }}>
                  Broadcasting Live Location
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                  }}
                >
                  SHARING LIVE
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#374151', marginTop: '2px', lineHeight: '1.35' }}>
                Real-time telemetry stream active: <strong>{latitude}° N, {longitude}° E</strong>
              </div>
              <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '600', marginTop: '1px' }}>
                {dmsCoords}
              </div>
              <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '1px' }}>
                Continuous 1 Hz Emergency Broadcast • Relayed via Safety Node
              </div>
            </div>
          </div>
        </div>

        {/* Live Location Controller Button - Green */}
        {isSharingLive ? (
          <div
            style={{
              backgroundColor: '#15803D',
              borderRadius: '20px',
              padding: '16px 18px',
              boxShadow: '0 6px 20px rgba(21, 128, 61, 0.3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}
              >
                📡
              </div>
              <div>
                <div style={{ fontSize: '14.5px', fontWeight: '800' }}>
                  Live Location is Sharing
                </div>
                <div style={{ fontSize: '11.5px', opacity: 0.9, marginTop: '2px' }}>
                  Broadcasting directly to emergency contacts
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleSharing}
              style={{
                padding: '7px 14px',
                borderRadius: '999px',
                backgroundColor: '#FFFFFF',
                color: '#15803D',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                flexShrink: 0,
              }}
            >
              Pause
            </button>
          </div>
        ) : (
          <button
            onClick={handleToggleSharing}
            style={{
              width: '100%',
              backgroundColor: '#243827',
              color: '#FFFFFF',
              padding: '15px 20px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '14.5px',
              fontWeight: '800',
              boxShadow: '0 4px 14px rgba(36, 56, 39, 0.25)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span>📡</span>
            <span>Resume Live Location Sharing</span>
          </button>
        )}

        {/* Notified Contacts List - Pure Green Live Badges */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1B2C1E', margin: 0 }}>
              Live Dispatch Feed
            </h3>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: '700',
                color: '#15803D',
                backgroundColor: '#DCFCE7',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              ● LIVE FEED ACTIVE
            </span>
          </div>

          {/* TWO TABS: Contacts vs Nearby Police */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#ECE7DC',
              borderRadius: '12px',
              padding: '3px',
              marginBottom: '12px',
            }}
          >
            <button
              onClick={() => setContactTab('contacts')}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: contactTab === 'contacts' ? '700' : '600',
                color: contactTab === 'contacts' ? '#FFFFFF' : '#4B5563',
                backgroundColor: contactTab === 'contacts' ? '#243827' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Emergency Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setContactTab('police')}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: '9px',
                fontSize: '12px',
                fontWeight: contactTab === 'police' ? '700' : '600',
                color: contactTab === 'police' ? '#FFFFFF' : '#4B5563',
                backgroundColor: contactTab === 'police' ? '#243827' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🚓 Nearby Police ({(nearbyPoliceStations || []).length})
            </button>
          </div>

          {/* TAB 1: Emergency Contacts with Phone Numbers */}
          {contactTab === 'contacts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {contacts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: '#EBE5D8',
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '12.5px',
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
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#1B2C1E' }}>
                        {c.name}
                      </div>
                      {/* Contact Number Display */}
                      <div style={{ fontSize: '11.5px', color: '#374151', fontWeight: '600' }}>
                        📞 {c.phone}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#15803D', fontWeight: '600', marginTop: '1px' }}>
                        Receiving Live Location • Active
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => showToast(`Calling ${c.name} (${c.phone})...`)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#F3EFE6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#243827',
                      }}
                      title={`Call ${c.name}`}
                    >
                      <CallIcon size={14} />
                    </button>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: '800',
                        color: '#15803D',
                        backgroundColor: '#DCFCE7',
                        padding: '2px 6px',
                        borderRadius: '999px',
                      }}
                    >
                      LIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Nearby Police Stations with Station Name & Helpline Number */}
          {contactTab === 'police' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(nearbyPoliceStations || []).map((station) => (
                <div
                  key={station.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '8px',
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF',
                        color: '#1E40AF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      🚓
                    </div>
                    <div>
                      {/* Police Station Name */}
                      <div style={{ fontSize: '13px', fontWeight: '800', color: '#1B2C1E' }}>
                        {station.name}
                      </div>
                      {/* Contact Number */}
                      <div style={{ fontSize: '11.5px', color: '#1E40AF', fontWeight: '700' }}>
                        📞 {station.phone}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#6B7280', marginTop: '1px' }}>
                        📍 {station.distance} • {station.address}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#15803D', fontWeight: '600' }}>
                        {station.status}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`🚨 Calling ${station.name} (${station.phone})...`)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #BFDBFE',
                      cursor: 'pointer',
                      color: '#1E40AF',
                      flexShrink: 0,
                    }}
                    title={`Call ${station.name}`}
                  >
                    <CallIcon size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* End SOS Button (Security PIN Protected) */}
        <button
          onClick={() => handleOpenPinModal('end_sos')}
          style={{
            width: '100%',
            padding: '13px 20px',
            borderRadius: '16px',
            backgroundColor: '#F3F4F6',
            color: '#374151',
            fontSize: '13.5px',
            fontWeight: '700',
            border: '1.5px solid #E5E7EB',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ fontSize: '14px' }}>🔒</span>
          <span>End SOS Session (Security PIN Required)</span>
        </button>
      </div>

      {/* SECURITY PIN VERIFICATION MODAL TO END SOS */}
      {isPinModalOpen && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 17, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
          onClick={handleClosePinModal}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              padding: '24px 20px 32px 20px',
              boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: '#D1D5DB',
                borderRadius: '2px',
                marginBottom: '16px',
              }}
            />

            {/* Lock Crest Icon */}
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: pinSuccess ? '#DCFCE7' : pinError ? '#FEE2E2' : '#F0FDF4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '12px',
                transition: 'all 0.2s ease',
              }}
            >
              {pinSuccess ? '✓' : pinError ? '⚠️' : '🛡️'}
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1B2C1E', textAlign: 'center' }}>
              {pinSuccess
                ? pinAction === 'pause'
                  ? 'Pausing Live Sharing...'
                  : 'Deactivating SOS...'
                : pinAction === 'pause'
                ? 'Security PIN to Pause'
                : 'Security PIN Required'}
            </h3>

            <p
              style={{
                fontSize: '12.5px',
                color: '#6B7280',
                textAlign: 'center',
                marginTop: '4px',
                marginBottom: '20px',
                maxWidth: '280px',
                lineHeight: '1.4',
              }}
            >
              {pinAction === 'pause'
                ? 'Enter your 4-digit security PIN to authorize pausing live location broadcasting.'
                : 'Enter your 4-digit security PIN to confirm you are safe and deactivate the emergency beacon.'}
            </p>

            {/* 4 PIN Digit Dots Display */}
            <div
              className={pinError ? 'shake-anim' : ''}
              style={{
                display: 'flex',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = enteredPin.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '48px',
                      height: '54px',
                      borderRadius: '14px',
                      border: pinError
                        ? '2px solid #EF4444'
                        : pinSuccess
                        ? '2px solid #16A34A'
                        : isFilled
                        ? '2px solid #243827'
                        : '1.5px solid #E5E7EB',
                      backgroundColor: isFilled ? '#F6F4ED' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      fontWeight: '800',
                      color: pinError ? '#EF4444' : pinSuccess ? '#16A34A' : '#1B2C1E',
                      boxShadow: isFilled ? '0 2px 8px rgba(36, 56, 39, 0.1)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {isFilled ? '●' : ''}
                  </div>
                );
              })}
            </div>

            {/* Status Message */}
            <div
              style={{
                height: '20px',
                fontSize: '12px',
                fontWeight: '700',
                color: pinError ? '#DC2626' : pinSuccess ? '#16A34A' : 'transparent',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              {pinError
                ? 'Incorrect PIN. Please try again.'
                : pinSuccess
                ? pinAction === 'pause'
                  ? 'PIN Verified. Pausing live stream...'
                  : 'PIN Verified. Returning to safe state...'
                : 'Enter PIN'}
            </div>

            {/* Numeric Keypad Grid */}
            <div
              style={{
                width: '100%',
                maxWidth: '280px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginBottom: '18px',
              }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handlePinInput(digit)}
                  style={{
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: '#F7F5EE',
                    border: '1px solid #EAE5D9',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1B2C1E',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {digit}
                </button>
              ))}

              {/* Clear button */}
              <button
                onClick={handleClearPin}
                style={{
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Clear
              </button>

              {/* 0 digit */}
              <button
                onClick={() => handlePinInput('0')}
                style={{
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#F7F5EE',
                  border: '1px solid #EAE5D9',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1B2C1E',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                0
              </button>

              {/* Backspace button */}
              <button
                onClick={handleBackspace}
                style={{
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#4B5563',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ⌫
              </button>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleClosePinModal}
              style={{
                width: '100%',
                maxWidth: '280px',
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: 'transparent',
                color: '#6B7280',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Keep SOS Active (Cancel)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
