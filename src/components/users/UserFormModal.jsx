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
    'Coordinador de Auditoría',
    'Auditor',
    'Abogado Actuante',
    'Dir. de Det. de Resp.'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        password: '',
        confirmPassword: '',
        role: initialData.role || 'Auditor',
        status: initialData.status || 'Activo',
        twoFactorEnabled: initialData.twoFactorEnabled || false
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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
    
    const { password, confirmPassword } = formData;
    const isPasswordFilled = password && password.length > 0;

    if (!isEditing || isPasswordFilled) {
      if (!password || password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden. Por favor, verifícalas.");
        return;
      }

      // Exigir: letras minúsculas, mayúsculas, números y al menos un signo o símbolo especial
      const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':",.<>\/?\\|~]).{6,}$/;
      if (!complexityRegex.test(password)) {
        alert("La contraseña debe incluir:\n- Al menos 6 caracteres\n- Letras minúsculas\n- Letras mayúsculas\n- Números\n- Al menos un signo o símbolo especial (ej. !, @, #, $, etc.)");
        return;
      }
    }

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

        <div>
          <label style={labelStyle}>
            {isEditing ? 'Nueva Contraseña (Dejar en blanco para no cambiar)' : 'Contraseña de Acceso'}
          </label>
          <input 
            type="password" 
            name="password" 
            value={formData.password || ''} 
            onChange={handleChange} 
            style={inputStyle} 
            required={!isEditing} 
            placeholder={isEditing ? 'Opcional (letras, mayúscula, números y signo)' : 'Mínimo 6 caracteres (letras, mayúscula, números y signo)'}
          />
        </div>

        {(!isEditing || isPasswordFilled) && (
          <div>
            <label style={labelStyle}>Confirmar Contraseña</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={formData.confirmPassword || ''} 
              onChange={handleChange} 
              style={inputStyle} 
              required 
              placeholder="Escribe la contraseña nuevamente"
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

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
            <input 
              type="checkbox" 
              name="twoFactorEnabled"
              checked={formData.twoFactorEnabled}
              onChange={handleChange}
              style={{ width: '16px', height: '16px', accentColor: 'var(--brand-accent)' }}
            />
            Requerir Autenticación 2FA
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
