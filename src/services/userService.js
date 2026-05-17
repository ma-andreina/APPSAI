import { mockUsers } from './mockData';

const SESSION_KEY = 'sai_current_user';

export const userService = {
  getAll: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockUsers]), 300));
  },

  /**
   * Busca un usuario por email en la base mock.
   * En Fase 2 se reemplaza por Firebase Auth.
   */
  getUserByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (!user) {
          reject(new Error('Usuario no encontrado'));
          return;
        }
        if (user.status !== 'Activo') {
          reject(new Error('La cuenta de este usuario está desactivada'));
          return;
        }
        resolve({ ...user });
      }, 400);
    });
  },

  /**
   * Valida contraseña simulada. En Fase 1, cualquier contraseña no vacía es válida.
   * En Fase 2 se delega a Firebase Auth.
   */
  validateCredentials: async (email, password) => {
    if (!password || password.length < 1) {
      throw new Error('Debe ingresar una contraseña');
    }
    const user = await userService.getUserByEmail(email);
    return { ...user };
  },

  /**
   * Simula verificación de código 2FA. Acepta cualquier código de 6 dígitos.
   * En Fase 2 se usa Firebase MFA / TOTP.
   */
  verify2FACode: async (code) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!code || code.length !== 6) {
          reject(new Error('El código debe tener 6 dígitos'));
          return;
        }
        resolve(true);
      }, 500);
    });
  },

  /**
   * Persiste el usuario autenticado en sessionStorage.
   */
  persistSession: (user) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  /**
   * Recupera la sesión persistida, si existe.
   */
  getPersistedSession: () => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  /**
   * Limpia la sesión persistida.
   */
  clearSession: () => {
    sessionStorage.removeItem(SESSION_KEY);
  },

  createUser: async (userData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newUser = {
          ...userData,
          id: `USR-${Date.now()}`,
          avatar: userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          status: userData.status || 'Activo',
          twoFactorEnabled: userData.twoFactorEnabled || false,
          createdAt: new Date().toISOString().split('T')[0]
        };
        mockUsers.push(newUser);
        resolve(newUser);
      }, 500);
    });
  },

  updateUser: async (id, userData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...userData };
          resolve(mockUsers[index]);
        } else {
          resolve(null);
        }
      }, 400);
    });
  },

  toggleUserStatus: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === id);
        if (user) {
          user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
        }
        resolve(user);
      }, 300);
    });
  }
};
