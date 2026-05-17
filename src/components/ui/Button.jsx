import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', // primary, secondary, outline, danger
  size = 'md', // sm, md, lg
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-button)',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--brand-accent)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--surface-hover)',
      color: 'var(--text-primary)',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--border-light)',
      color: 'var(--text-primary)',
    },
    danger: {
      backgroundColor: 'var(--status-critical)',
      color: 'white',
    }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '0.875rem' },
    md: { padding: '8px 16px', fontSize: '1rem' },
    lg: { padding: '12px 24px', fontSize: '1.125rem' }
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  };

  return (
    <button 
      style={styles} 
      className={className} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
