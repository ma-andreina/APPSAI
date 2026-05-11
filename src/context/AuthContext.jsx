import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService } from '../services/userService';

// Crear el contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Al cargar, verificamos si hay un usuario logueado
    // En fase 1 esto es simulado. En fase 2 será Firebase onAuthStateChanged
    const loadUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        setError('Error al cargar la sesión');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulación de login (ignora credenciales y carga el usuario de prueba)
      const user = await userService.getCurrentUser();
      setCurrentUser(user);
      return true;
    } catch (err) {
      setError('Credenciales inválidas');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    // En fase 2 esto llamará a firebase.auth().signOut()
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    error,
    // Utilidades para RBAC (Control de acceso basado en roles)
    isAdmin: ['Contralor Municipal', 'Director General'].includes(currentUser?.role),
    isAuditor: ['Coordinador de Auditoría', 'Auditor'].includes(currentUser?.role),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
