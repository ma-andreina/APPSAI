import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { UserTable } from '../components/users/UserTable';
import { UserFormModal } from '../components/users/UserFormModal';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { Plus, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const { addNotification } = useAppContext();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      addNotification('Error al cargar los usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
        addNotification('Usuario actualizado correctamente', 'success');
      } else {
        await userService.createUser(formData);
        addNotification('Usuario creado exitosamente', 'success');
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      alert(
        'Error al guardar el usuario en Firebase:\n\n' +
        error.message +
        '\n\nCausas comunes:\n' +
        '1. Las Reglas de Seguridad (Rules) de Firestore en tu consola de Firebase están bloqueando las escrituras.\n' +
        '2. No has habilitado el proveedor de inicio de sesión "Correo electrónico/contraseña" en Firebase Authentication (pestaña Sign-in method).'
      );
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await userService.toggleUserStatus(id);
      addNotification('Estado del usuario actualizado', 'success');
      fetchUsers();
    } catch (error) {
      addNotification('Error al actualizar estado', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: 'var(--brand-accent)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: 'var(--radius-button)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem' }}>Gestión de Usuarios y Roles</h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
              Control de acceso (RBAC) y administración de credenciales (2FA).
            </p>
          </div>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()} style={{ gap: '8px' }}>
          <Plus size={18} />
          Nuevo Usuario
        </Button>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="60px" borderRadius="var(--radius-card)" />
            <Skeleton height="60px" borderRadius="var(--radius-card)" />
            <Skeleton height="60px" borderRadius="var(--radius-card)" />
            <Skeleton height="60px" borderRadius="var(--radius-card)" />
          </div>
        ) : (
          <UserTable 
            users={users} 
            onEdit={handleOpenModal} 
            onToggleStatus={handleToggleStatus} 
          />
        )}
      </div>

      {/* Modal */}
      <UserFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingUser}
      />
    </div>
  );
};
