import React from 'react';

export const Avatar = ({ name, initials, src, size = 32, style = {} }) => {
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

  // Función para obtener iniciales del nombre
  const getInitials = () => {
    if (initials && !name) return initials;
    if (!name) return 'U';
    
    const parts = name.trim().split(' ').filter(p => p.length > 0);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    
    // Tomar la primera letra del primer nombre y la primera letra del apellido (usualmente la segunda palabra o la última)
    const firstInitial = parts[0][0];
    const lastInitial = parts.length > 1 ? parts[1][0] : '';
    
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div style={baseStyle}>
      {getInitials()}
    </div>
  );
};
