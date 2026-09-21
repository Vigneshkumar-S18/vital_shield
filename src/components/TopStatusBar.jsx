import React, { useState, useEffect } from 'react';

export const TopStatusBar = ({ dark = false, isWelcome = false }) => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = d.getHours();
      const m = d.getMinutes();
      const formatted = `${h % 12 || 12}:${m < 10 ? '0' : ''}${m}`;
      setTimeStr(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = isWelcome ? '#1B2C1E' : (dark ? '#FFFFFF' : '#1C271E');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px 6px 24px',
        fontSize: '14px',
        fontWeight: '600',
        color: textColor,
        zIndex: 40,
        position: 'relative',
      }}
    >
      {/* Time */}
      <span style={{ letterSpacing: '-0.2px', fontSize: '15px' }}>{timeStr}</span>

      {/* Dynamic Island Pill / Speaker Notch */}
      <div
        style={{
          width: '88px',
          height: '24px',
          backgroundColor: '#000000',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '8px',
          gap: '5px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#1E293B',
            boxShadow: 'inset 0 0 2px rgba(255,255,255,0.4)',
          }}
        />
      </div>

      {/* Status Icons: Cellular, Wifi, Battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Cellular bars */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          <rect x="0.5" y="7.5" width="2.5" height="3" rx="0.75" fill={textColor} />
          <rect x="4.5" y="5.5" width="2.5" height="5" rx="0.75" fill={textColor} />
          <rect x="8.5" y="3" width="2.5" height="7.5" rx="0.75" fill={textColor} />
          <rect x="12.5" y="0.5" width="2.5" height="10" rx="0.75" fill={textColor} />
        </svg>

        {/* Wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill={textColor}>
          <path d="M7.5 10.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM10.8 7a4.67 4.67 0 0 0-6.6 0 .7.7 0 1 1-1-.98 6.07 6.07 0 0 1 8.6 0 .7.7 0 1 1-1 .98zM13.5 4.3a8.5 8.5 0 0 0-12 0 .7.7 0 0 1-1-.98 9.9 9.9 0 0 1 14 0 .7.7 0 0 1-1 .98z" />
        </svg>

        {/* Battery */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1px',
          }}
        >
          <div
            style={{
              width: '21px',
              height: '11px',
              border: `1.5px solid ${textColor}`,
              borderRadius: '3.5px',
              padding: '1.2px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '82%',
                height: '100%',
                backgroundColor: textColor,
                borderRadius: '1.5px',
              }}
            />
          </div>
          <div
            style={{
              width: '1.5px',
              height: '4px',
              backgroundColor: textColor,
              borderRadius: '0 1px 1px 0',
            }}
          />
        </div>
      </div>
    </div>
  );
};
