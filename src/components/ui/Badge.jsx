import React from 'react';

export const Badge = ({ children, status = 'default', className = '' }) => {
  const statusColors = {
    'open': 'var(--status-open)',
    'in-progress': 'var(--status-progress)',
    'review': 'var(--status-review)',
    'closed': 'var(--status-closed)',
    'critical': 'var(--status-critical)',
    'default': 'var(--text-secondary)'
  };

  const color = statusColors[status] || statusColors.default;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: `${color}1A`, // 10% opacity
    color: color,
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};
