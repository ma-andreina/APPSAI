import React from 'react';

export const DonutChart = ({ percentage, size = 160, strokeWidth = 16, color = 'var(--brand-accent)' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-chart-wrapper" style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="donut-chart-svg" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-light)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="donut-chart-text" style={{ position: 'absolute', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
        {percentage}%
      </div>
    </div>
  );
};
