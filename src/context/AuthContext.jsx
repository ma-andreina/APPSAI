import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService } from '../services/userService';

// Crear el contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Estados de autenticación:
 * - 'idle'           → Verificando sesión persistida
 * - 'unauthenticated' → No hay sesión, mostrar login
 * - '2fa'            → Credenciales válidas, esperando código 2FA
 * - 'authenticated'  → Sesión activa
 */

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null); // Usuario validado esperando 2FA
  const [authStep, setAuthStep] = useState('idle'); // idle | unauthenticated | 2fa | authenticated
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Al cargar, verificamos si hay una sesión persistida en sessionStorage
    const restoreSession = () => {
      const persisted = userService.getPersistedSession();
      if (persisted) {
        setCurrentUser(persisted);
        setAuthStep('authenticated');
      } else {
        setAuthStep('unauthenticated');
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Paso 1: Validar credenciales (email + password).
   * Si el usuario tiene 2FA activado, pasa al paso 2FA.
   * Si no, autentica directamente.
   */
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const user = await userService.validateCredentials(email, password);

      if (user.twoFactorEnabled) {
        // Requiere 2FA — guardar usuario pendiente y cambiar paso
        setPendingUser(user);
        setAuthStep('2fa');
        setLoading(false);
        return { requiresTwoFactor: true };
      }

      // Sin 2FA — autenticar directamente
      setCurrentUser(user);
      setAuthStep('authenticated');
      userService.persistSession(user);
      setLoading(false);
      return { requiresTwoFactor: false };
    } catch (err) {
      setError(err.message || 'Credenciales inválidas');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Paso 2: Verificar código 2FA.
   */
  const verify2FA = async (code) => {
    setLoading(true);
    setError('');
    try {
      await userService.verify2FACode(code);

      // 2FA verificado — autenticar con el usuario pendiente
      setCurrentUser(pendingUser);
      setAuthStep('authenticated');
      userService.persistSession(pendingUser);
      setPendingUser(null);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Código 2FA inválido');
      setLoading(false);
      throw err;
    }
  };

  /**
   * Cancelar el paso 2FA y volver a credenciales.
   */
  const cancel2FA = () => {
    setPendingUser(null);
    setAuthStep('unauthenticated');
    setError('');
  };

  /**
   * Cerrar sesión.
   */
  const logout = () => {
    setCurrentUser(null);
    setPendingUser(null);
    setAuthStep('unauthenticated');
    setError('');
    userService.clearSession();
    // En Fase 2: firebase.auth().signOut()
  };

  /**
   * Login rápido para demo — seleccionar usuario directamente sin credenciales.
   */
  const quickLogin = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const allUsers = await userService.getAll();
      const user = allUsers.find((u) => u.id === userId);
      if (!user) throw new Error('Usuario no encontrado');

      setCurrentUser(user);
      setAuthStep('authenticated');
      userService.persistSession(user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    pendingUser,
    authStep,
    login,
    verify2FA,
    cancel2FA,
    logout,
    quickLogin,
    loading,
    error,
    setError,
    // Utilidades para RBAC (Control de acceso basado en roles)
    isAdmin: ['Contralor Municipal', 'Director General'].includes(currentUser?.role),
    isAuditor: ['Coordinador de Auditoría', 'Auditor'].includes(currentUser?.role),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
