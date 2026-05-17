import React from 'react';

export const Input = ({ label, type = 'text', name, value, onChange, placeholder, disabled }) => {
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-input, 8px)',
    border: '1px solid var(--border-light, #E2E8F0)',
    backgroundColor: disabled ? 'var(--surface-hover, #F8FAFC)' : 'var(--surface-light, #FFFFFF)',
    color: disabled ? 'var(--text-secondary, #64748B)' : 'var(--text-primary, #0F172A)',
    fontFamily: 'inherit',
    fontSize: '0.95rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: 'var(--text-secondary, #64748B)',
    fontSize: '0.875rem'
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
      />
    </div>
  );
};
