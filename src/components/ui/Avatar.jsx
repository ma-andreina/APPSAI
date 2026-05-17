import React from 'react';

export const Avatar = ({ initials, src, size = 32, style = {} }) => {
  const baseStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--brand-primary-light)',
    color: 'white',
    fontSize: `${size * 0.4}px`,
    fontWeight: '500',
    overflow: 'hidden',
    flexShrink: 0,
    ...style
  };

  if (src) {
    return (
      <div style={baseStyle}>
        <img src={src} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={baseStyle}>
      {initials}
    </div>
  );
};
