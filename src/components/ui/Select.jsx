import React from 'react';

export const Select = ({ label, name, value, onChange, options = [], disabled = false, placeholder }) => {
  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-input, 8px)',
    border: '1px solid var(--border-light, #E2E8F0)',
    backgroundColor: disabled ? 'var(--surface-hover, #F8FAFC)' : 'var(--surface-light, #FFFFFF)',
    color: disabled ? 'var(--text-secondary, #64748B)' : 'var(--text-primary, #0F172A)',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center'
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={selectStyle}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
