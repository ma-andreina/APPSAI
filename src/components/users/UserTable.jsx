import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { MoreVertical, Edit2, ShieldAlert, ShieldCheck } from 'lucide-react';

export const UserTable = ({ users, onEdit, onToggleStatus }) => {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-hover)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Usuario</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Rol Institucional</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>2FA</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Estado</th>
              <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Avatar initials={user.avatar} />
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <Badge status="default">{user.role}</Badge>
                </td>
                <td style={{ padding: '1rem' }}>
                  {user.twoFactorEnabled ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-closed)' }}>
                      <ShieldCheck size={16} />
                      <span style={{ fontSize: '0.875rem' }}>Activo</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-review)' }}>
                      <ShieldAlert size={16} />
                      <span style={{ fontSize: '0.875rem' }}>Inactivo</span>
                    </div>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  <Badge status={user.status === 'Activo' ? 'closed' : 'critical'}>
                    {user.status}
                  </Badge>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button variant="outline" size="sm" onClick={() => onToggleStatus(user.id)} title={user.status === 'Activo' ? 'Desactivar Usuario' : 'Activar Usuario'}>
                      {user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(user)} title="Editar Usuario">
                      <Edit2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
