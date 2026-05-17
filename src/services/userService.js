import { mockUsers } from './mockData';

export const userService = {
  getAll: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockUsers]), 300));
  },
  
  getCurrentUser: async () => {
    // Simulando que el usuario logueado es el Auditor (id: 5)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockUsers.find(u => u.id === '5'));
      }, 200);
    });
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
