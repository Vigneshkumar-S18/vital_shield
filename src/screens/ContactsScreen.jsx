import React from 'react';
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
  } = useApp();

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
          Emergency Contacts
        </h2>
      </div>

      {/* Scrollable container */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 88px 20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Explanatory subtitle */}
        <p
          style={{
            fontSize: '12px',
            color: '#6B7280',
            lineHeight: '1.45',
            padding: '0 4px',
          }}
        >
          These contacts will be notified during an SOS event with your location and selected data.
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
                      backgroundColor: '#E5D6D6',
                      color: '#4B5563',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '15px',
                    }}
                  >
                    {c.avatarInitials || 'VS'}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#1B2C1E' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '1px' }}>{c.phone}</div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      backgroundColor: c.priority === 'Primary' ? '#DCFCE7' : '#F3F4F6',
                      color: c.priority === 'Primary' ? '#166534' : '#4B5563',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '3px',
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
            {/* Toggle 1: Location */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Location</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '1px' }}>
                  Share your live location
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

            {/* Toggle 2: Health Snapshot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#1B2C1E' }}>Health Snapshot</div>
                <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '1px' }}>
                  HR, SpO₂, Temperature, Activity
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
      </div>
    </div>
  );
};
