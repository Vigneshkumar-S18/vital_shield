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
    <nav
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(247, 245, 238, 0.92)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(35, 64, 45, 0.08)',
        paddingTop: '8px',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 60,
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.03)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeBottomTab === tab.id;
        const isSafetyAlert = tab.id === 'safety' && (isSosActive || currentScreen === 'live_location');
        
        let activeColor = '#23402D';
        let inactiveColor = '#718078';
        if (isSafetyAlert) {
          activeColor = '#B82828';
          inactiveColor = '#B82828';
        }

        const color = isActive ? activeColor : inactiveColor;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => selectBottomTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '4px 10px',
              minWidth: '56px',
              borderRadius: '8px',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isActive ? '3px 16px' : '3px 8px',
                backgroundColor: isActive ? '#EAE7DC' : 'transparent',
                borderRadius: '999px',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon
                size={22}
                active={isActive}
                isAlert={isSafetyAlert}
                color={color}
              />
              {isSafetyAlert && (
                <span
                  style={{
                    position: 'absolute',
                    top: 1,
                    right: 10,
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#B82828',
                    boxShadow: '0 0 6px #B82828',
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? '700' : '500',
                color: color,
                letterSpacing: '-0.1px',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
