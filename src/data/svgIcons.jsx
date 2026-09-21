import React from 'react';

// VitalShield Tri-Petal Leaf Crest
export const VitalShieldCrest = ({ size = 28, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Center petal */}
    <path
      d="M20 4C20 4 24.5 12.5 24.5 18C24.5 21.5 22.5 24 20 24C17.5 24 15.5 21.5 15.5 18C15.5 12.5 20 4 20 4Z"
      fill={color}
    />
    {/* Left winged leaf */}
    <path
      d="M14.5 13C14.5 13 9 18.5 10 24C10.8 28.5 14.5 29.5 17 28C19 26.8 19.5 23.5 18 21.5C16.5 19.5 14.5 13 14.5 13Z"
      fill={color}
    />
    {/* Right winged leaf */}
    <path
      d="M25.5 13C25.5 13 31 18.5 30 24C29.2 28.5 25.5 29.5 23 28C21 26.8 20.5 23.5 22 21.5C23.5 19.5 25.5 13 25.5 13Z"
      fill={color}
    />
    {/* Lower anchor point */}
    <path
      d="M20 27L18.5 33.5C18.5 33.5 19.5 35 20 35C20.5 35 21.5 33.5 21.5 33.5L20 27Z"
      fill={color}
    />
  </svg>
);

// Navigation icons
export const HomeIcon = ({ size = 22, active = false, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? (color || "#1B2C1E") : "none"} stroke={color || (active ? "#1B2C1E" : "#8A9689")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" fill={active ? "#F6F4ED" : "none"} stroke={active ? "#F6F4ED" : (color || "#8A9689")} />
  </svg>
);

export const MonitorIcon = ({ size = 22, active = false, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || (active ? "#1B2C1E" : "#8A9689")} strokeWidth={active ? "2.3" : "1.9"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export const SafetyIcon = ({ size = 22, active = false, isAlert = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={isAlert ? "#B82828" : (active ? "#1B2C1E" : "none")} stroke={isAlert ? "#B82828" : (active ? "#1B2C1E" : "#8A9689")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v4" stroke={active || isAlert ? "#FFFFFF" : "#8A9689"} strokeWidth="2" />
    <path d="M12 16h.01" stroke={active || isAlert ? "#FFFFFF" : "#8A9689"} strokeWidth="2" />
  </svg>
);

export const ReportsIcon = ({ size = 22, active = false, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || (active ? "#1B2C1E" : "#8A9689")} strokeWidth={active ? "2.3" : "1.9"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export const MoreIcon = ({ size = 22, active = false, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || (active ? "#1B2C1E" : "#8A9689")} strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="4" y1="12" x2="16" y2="12" />
    <line x1="4" y1="17" x2="11" y2="17" />
  </svg>
);

// Vitals Icons
export const HeartIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#E53935" stroke="#E53935" strokeWidth="1" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const DropletIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#2563EB" stroke="#2563EB" strokeWidth="1" className={className}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

export const TempIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" fill="#EA580C" fillOpacity="0.2" />
    <circle cx="11.5" cy="17.5" r="2" fill="#EA580C" />
  </svg>
);

export const ActivityWalkingIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="13" cy="4" r="2" fill="#2E7D32" />
    <path d="m9 20 3-6 3 2 2 4" />
    <path d="m6 17 3-5 3 1 3-5" />
  </svg>
);

export const CallIcon = ({ size = 18, color = "#233827" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const BellIcon = ({ size = 20, count = 0 }) => (
  <div style={{ position: 'relative', display: 'inline-flex' }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1A251B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
    {count > 0 && (
      <span
        style={{
          position: 'absolute',
          top: -3,
          right: -4,
          backgroundColor: '#B82828',
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: '700',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid #F6F4ED',
        }}
      >
        {count}
      </span>
    )}
  </div>
);
