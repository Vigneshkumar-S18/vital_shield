import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopStatusBar } from '../components/TopStatusBar';
import { CallIcon } from '../data/svgIcons';

export const ContactsScreen = () => {
  const {
    goBack,
    contacts,
    setIsAddContactModalOpen,
    sharingSettings,
    setSharingSettings,
    showToast,
    nearbyPoliceStations,
  } = useApp();

  const [contactsTab, setContactsTab] = useState('contacts'); // 'contacts' | 'police'

  const handleToggle = (key) => {
    setSharingSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`${key.toUpperCase()} sharing ${updated[key] ? 'enabled' : 'disabled'}`);
      return updated;
    });
  };

  const handleCall = (contact) => {
    showToast(`Calling ${contact.name} (${contact.phone})...`);
  };

  const handleCallPolice = (station) => {
    showToast(`🚨 Calling ${station.name} (${station.phone})...`);
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
            cursor: 'pointer',
            border: 'none',
            background: 'transparent',
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
          Emergency Contacts
        </h2>
      </div>

      {/* Segmented Pill: Emergency Contacts | Nearby Police Stations */}
      <div style={{ padding: '0 20px 10px 20px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ECE8DC',
            borderRadius: '999px',
            padding: '4px',
          }}
        >
          <button
            onClick={() => setContactsTab('contacts')}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: contactsTab === 'contacts' ? '700' : '500',
              color: contactsTab === 'contacts' ? '#FFFFFF' : '#687767',
              backgroundColor: contactsTab === 'contacts' ? '#243827' : 'transparent',
              boxShadow: contactsTab === 'contacts' ? '0 2px 8px rgba(36, 56, 39, 0.2)' : 'none',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Contacts ({contacts.length})
          </button>
          <button
            onClick={() => setContactsTab('police')}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: contactsTab === 'police' ? '700' : '500',
              color: contactsTab === 'police' ? '#FFFFFF' : '#687767',
              backgroundColor: contactsTab === 'police' ? '#243827' : 'transparent',
              boxShadow: contactsTab === 'police' ? '0 2px 8px rgba(36, 56, 39, 0.2)' : 'none',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            🚓 Police Stations ({(nearbyPoliceStations || []).length})
          </button>
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
        {/* TAB 1: EMERGENCY CONTACTS */}
        {contactsTab === 'contacts' && (
          <>
            <p
              style={{
                fontSize: '12px',
                color: '#6B7280',
                lineHeight: '1.45',
                padding: '0 4px',
              }}
            >
              These contacts receive your live GPS coordinates and automated alerts during an SOS.
            </p>

            {/* Contacts List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contacts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {c.avatar ? (
                      <img
                        src={c.avatar}
                        alt={c.name}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: '#EBE5D8',
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '14px',
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
                      <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#1B2C1E' }}>
                        {c.name}
                      </div>
                      {/* Contact Number */}
                      <div style={{ fontSize: '12px', color: '#374151', fontWeight: '600', marginTop: '1px' }}>
                        📞 {c.phone}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            backgroundColor: c.priority === 'Primary' ? '#DCFCE7' : '#F3F4F6',
                            color: c.priority === 'Primary' ? '#166534' : '#4B5563',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {c.priority}
                        </span>
                        {c.relation && (
                          <span style={{ fontSize: '10.5px', color: '#6B7280' }}>
                            • {c.relation}
                          </span>
                        )}
                      </div>
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
                      color: '#243827',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    title={`Call ${c.name}`}
                  >
                    <CallIcon size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Contact Button */}
            <button
              onClick={() => setIsAddContactModalOpen(true)}
              style={{
                width: '100%',
                backgroundColor: '#ECE7DC',
                color: '#1B2C1E',
                padding: '13px 20px',
                borderRadius: '999px',
                fontSize: '14px',
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
              <span>Add New Contact</span>
            </button>

            {/* Data to Share During SOS */}
            <div style={{ marginTop: '8px' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: '800', color: '#1B2C1E', marginBottom: '12px' }}>
                Data to Share During SOS
              </h3>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '16px 18px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Toggle 1: Location to Family */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Family Location Sharing</div>
                    <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '1px' }}>
                      Share real-time GPS with family members
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('location')}
                    style={{
                      width: '46px',
                      height: '26px',
                      backgroundColor: sharingSettings.location ? '#203322' : '#D1D5DB',
                      borderRadius: '999px',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sharingSettings.location ? 'flex-end' : 'flex-start',
                      transition: 'background-color 0.2s ease',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* Toggle 2: Nearby Police Branch */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Nearby Police Branch</div>
                    <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '1px' }}>
                      Notify & relay coordinates to nearest police station
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('healthSnapshot')}
                    style={{
                      width: '46px',
                      height: '26px',
                      backgroundColor: sharingSettings.healthSnapshot ? '#203322' : '#D1D5DB',
                      borderRadius: '999px',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sharingSettings.healthSnapshot ? 'flex-end' : 'flex-start',
                      transition: 'background-color 0.2s ease',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>

                {/* Toggle 3: Device Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Device Status</div>
                    <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '1px' }}>
                      Battery, connection status
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('deviceStatus')}
                    style={{
                      width: '46px',
                      height: '26px',
                      backgroundColor: sharingSettings.deviceStatus ? '#203322' : '#D1D5DB',
                      borderRadius: '999px',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sharingSettings.deviceStatus ? 'flex-end' : 'flex-start',
                      transition: 'background-color 0.2s ease',
                      cursor: 'pointer',
                      border: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: NEARBY POLICE STATIONS */}
        {contactsTab === 'police' && (
          <>
            <p
              style={{
                fontSize: '12px',
                color: '#6B7280',
                lineHeight: '1.45',
                padding: '0 4px',
              }}
            >
              Nearest police branches and emergency desks linked to VitalShield automated dispatch.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(nearbyPoliceStations || []).map((station) => (
                <div
                  key={station.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF',
                        color: '#1E40AF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        flexShrink: 0,
                      }}
                    >
                      🚓
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#1B2C1E' }}>
                        {station.name}
                      </div>
                      {/* Police Contact Number */}
                      <div style={{ fontSize: '12.5px', color: '#1E40AF', fontWeight: '700', marginTop: '2px' }}>
                        📞 {station.phone}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                        📍 {station.distance} • {station.address}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: '600', marginTop: '3px' }}>
                        Duty: {station.officerOnDuty} • {station.status}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCallPolice(station)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1E40AF',
                      border: '1px solid #BFDBFE',
                      cursor: 'pointer',
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(30, 64, 175, 0.1)',
                    }}
                    title={`Call ${station.name}`}
                  >
                    <CallIcon size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick 112 SOS Dispatch Banner */}
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                borderRadius: '16px',
                padding: '14px 16px',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '24px' }}>🛡️</span>
              <div style={{ fontSize: '12px', color: '#166534' }}>
                <div style={{ fontWeight: '800', fontSize: '13px' }}>Emergency Police Relay (112)</div>
                <div style={{ marginTop: '2px', lineHeight: '1.35' }}>
                  Live coordinates and physiological telemetry are prioritized for rapid law enforcement response.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
