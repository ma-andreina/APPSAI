import React from 'react';

export const Card = ({ children, className = '', style = {}, onClick }) => {
  const cardStyle = {
    backgroundColor: 'var(--surface-card)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-card)',
    padding: '1.5rem',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ...style
  };

  return (
    <div 
      style={cardStyle} 
      className={className} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};
