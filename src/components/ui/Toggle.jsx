import React from 'react';

export const Toggle = ({ label, checked, onChange, disabled = false, description }) => {
  const trackStyle = {
    width: '44px',
    height: '24px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: checked ? 'var(--brand-accent)' : 'var(--border-light)',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.25s ease',
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0
  };

  const thumbStyle = {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: 'white',
    position: 'absolute',
    top: '3px',
    left: checked ? '23px' : '3px',
    transition: 'left 0.25s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  };

  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '0.5rem 0'
    }}>
      <div style={trackStyle} onClick={handleClick} role="switch" aria-checked={checked}>
        <div style={thumbStyle} />
      </div>
      <div>
        {label && (
          <span style={{
            fontWeight: 500,
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            cursor: disabled ? 'not-allowed' : 'pointer'
          }} onClick={handleClick}>
            {label}
          </span>
        )}
        {description && (
          <p style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4'
          }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
