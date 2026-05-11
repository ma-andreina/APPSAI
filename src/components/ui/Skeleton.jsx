import React from 'react';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = 'var(--radius-button)', style = {} }) => {
  return (
    <div 
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--surface-hover)',
        animation: 'pulse 1.5s infinite ease-in-out',
        ...style
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};
