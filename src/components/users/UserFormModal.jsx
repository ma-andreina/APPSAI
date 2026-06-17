import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const UserFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Auditor',
    status: 'Activo',
    twoFactorEnabled: false
  });

  const roles = [
    'Contralor Municipal',
    'Director General',
    'Director de Control',
    'Coordinador',
    'Auditor',
    'Abogado',
    'Director de Determinación de Responsabilidades'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        role: initialData.role || 'Auditor',
        status: initialData.status || 'Activo',
        twoFactorEnabled: initialData.twoFactorEnabled || false
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Auditor',
        status: 'Activo',
        twoFactorEnabled: false
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-button)',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--surface-light)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: '0.95rem',
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
        
        <div>
          <label style={labelStyle}>Nombre Completo</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div>
          <label style={labelStyle}>Correo Electrónico Institucional</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
            placeholder="ejemplo@cmp.gob.ve"
          />
        </div>

        {!isEditing && (
          <div>
            <label style={labelStyle}>Contraseña Inicial de Acceso</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password || ''} 
              onChange={handleChange} 
              style={inputStyle} 
              required 
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>Rol en el Sistema (RBAC)</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange} 
            style={inputStyle}
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-button)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
            <input 
              type="checkbox" 
              name="status"
              checked={formData.status === 'Activo'}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'Activo' : 'Inactivo' }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-accent)' }}
            />
            Usuario Activo
          </label>

        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
