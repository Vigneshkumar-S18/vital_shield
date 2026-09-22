import React from 'react';

export const TopStatusBar = () => {
  return (
    <div
      style={{
        width: '100%',
        height: 'max(8px, env(safe-area-inset-top))',
        flexShrink: 0,
      }}
    />
  );
};
