import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeIcon, MonitorIcon, SafetyIcon, ReportsIcon, MoreIcon } from '../data/svgIcons';

export const BottomNav = () => {
  const { activeBottomTab, selectBottomTab, isSosActive, currentScreen } = useApp();

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'monitor', label: 'Monitor', icon: MonitorIcon },
    { id: 'safety', label: 'Safety', icon: SafetyIcon, isAlert: isSosActive || currentScreen === 'live_location' },
    { id: 'reports', label: 'Reports', icon: ReportsIcon },
    { id: 'more', label: 'More', icon: MoreIcon },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F6F4ED',
        borderTop: '1px solid rgba(0, 0, 0, 0.07)',
        paddingTop: '8px',
        paddingBottom: '20px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.03)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeBottomTab === tab.id;
        const isSafetyAlert = tab.id === 'safety' && (isSosActive || currentScreen === 'live_location');
        
        let labelColor = '#849183';
        if (isActive) {
          labelColor = isSafetyAlert ? '#B82828' : '#1C2B1D';
        }

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => selectBottomTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              minWidth: '58px',
              borderRadius: '8px',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={22}
                active={isActive}
                isAlert={isSafetyAlert}
                color={isActive ? (isSafetyAlert ? '#B82828' : '#1C2B1D') : '#849183'}
              />
              {isSafetyAlert && (
                <span
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#B82828',
                    boxShadow: '0 0 8px #B82828',
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? '700' : '500',
                color: labelColor,
                letterSpacing: '-0.1px',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
