import React from 'react';

export const ProgressBar = ({ progress = 0, color = 'var(--brand-accent)' }) => {
  const containerStyle = {
    width: '100%',
    height: '6px',
    backgroundColor: 'var(--surface-light)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  };

  const fillStyle = {
    height: '100%',
    width: `${Math.min(100, Math.max(0, progress))}%`,
    backgroundColor: color,
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.5s ease-in-out',
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        {progress}%
      </div>
      <div style={containerStyle}>
        <div style={fillStyle} />
      </div>
    </div>
  );
};
