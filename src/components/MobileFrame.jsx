import React from 'react';
import { useApp } from '../context/AppContext';
import { BottomNav } from './BottomNav';
import { NotificationModal } from './NotificationModal';
import { DeviceModal } from './DeviceModal';
import { AddContactModal } from './AddContactModal';

export const MobileFrame = ({ children }) => {
  const { currentScreen, toastMessage } = useApp();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: '100dvh',
        backgroundColor: '#F7F5EE',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Active Screen View */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          flex: 1,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>

      {/* Fixed Mobile Bottom Navigation (All screens except Welcome) */}
      {currentScreen !== 'welcome' && <BottomNav />}

      {/* Floating Alert/Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '16px',
            right: '16px',
            backgroundColor: 'rgba(35, 64, 45, 0.96)',
            color: '#FFFFFF',
            padding: '12px 16px',
            borderRadius: '14px',
            fontSize: '12.5px',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
            zIndex: 120,
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Global Modals */}
      <NotificationModal />
      <DeviceModal />
      <AddContactModal />
    </div>
  );
};
