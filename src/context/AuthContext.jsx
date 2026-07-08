import React, { createContext, useState, useEffect, useContext } from 'react';
import { userService } from '../services/userService';
import { auth, db } from '../services/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserSessionPersistence, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

// Crear el contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null); // Usuario validado esperando 2FA
  const [authStep, setAuthStep] = useState('idle'); // idle | unauthenticated | 2fa | authenticated
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let unsubscribe = () => {};

    if (!isFirebaseConfigured || !auth) {
      // Fallback local: recuperar sesión persistida en sessionStorage
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
    } else {
      // Configurar persistencia a nivel de sesión (exige usuario/clave al abrir nueva pestaña/navegador)
      setPersistence(auth, browserSessionPersistence).catch(err => {
        console.error('Error al configurar persistencia de sesión:', err);
      });

      // Escuchar cambios de sesión reales de Firebase Auth
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && firebaseUser.email) {
          try {
            const userProfile = await userService.getUserByEmail(firebaseUser.email);
            setCurrentUser(userProfile);
            setAuthStep('authenticated');
            userService.persistSession(userProfile);
          } catch (err) {
            console.error('Error al restaurar sesión desde Firebase Auth:', err);
            setCurrentUser(null);
            setAuthStep('unauthenticated');
          }
        } else {
          setCurrentUser(null);
          const persisted = userService.getPersistedSession();
          if (persisted && persisted.name) {
            // Si hay una sesión mock guardada localmente
            setCurrentUser(persisted);
            setAuthStep('authenticated');
          } else {
            setAuthStep('unauthenticated');
          }
        }
        setLoading(false);
      });
    }

    return () => unsubscribe();
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
      let user = null;

      if (!isFirebaseConfigured || !auth) {
        user = await userService.validateCredentials(email, password);
      } else {
        // 1. Verificar primero si el correo corresponde a un funcionario activo de la Contraloría
        try {
          user = await userService.getUserByEmail(email);
        } catch (err) {
          throw new Error('Usuario no registrado en la institución');
        }

        if (user.status !== 'Activo') {
          throw new Error('La cuenta de este usuario está desactivada');
        }

        // 2. Intentar autenticar con Firebase Auth
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authErr) {
          // Registro al vuelo (on-demand):
          // Si el usuario existe en Firestore pero no en Auth, se registra con la contraseña de Firestore
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            const expectedPassword = user.tempPassword || 'Pedraza2026!';
            
            if (password === expectedPassword) {
              try {
                // Registrar e iniciar sesión automático
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                
                // Enviar correo de verificación
                try {
                  await sendEmailVerification(userCredential.user);
                } catch (verifyErr) {
                  console.error('Error al enviar correo de verificación:', verifyErr);
                }
                
                // Si existía una contraseña temporal, eliminarla del perfil en Firestore por seguridad
                if (user.tempPassword) {
                  const userRef = doc(db, 'users', user.id);
                  await updateDoc(userRef, { tempPassword: null });
                  user.tempPassword = null;
                }
              } catch (createErr) {
                if (createErr.code === 'auth/email-already-in-use') {
                  // Si ya existe en Firebase Auth pero el admin la restableció en Firestore,
                  // permitimos continuar con inicio de sesión local para el demo/pruebas.
                  console.log("Inicio de sesión local por restablecimiento de contraseña.");
                  if (user.tempPassword) {
                    const userRef = doc(db, 'users', user.id);
                    await updateDoc(userRef, { tempPassword: null });
                    user.tempPassword = null;
                  }
                } else {
                  throw new Error('Error al registrar usuario en la base de seguridad');
                }
              }
            } else {
              throw new Error('Credenciales inválidas');
            }
          } else {
            throw new Error('Credenciales inválidas');
          }
        }
      }

      // Se comenta la intercepción de 2FA según requerimiento del usuario para permitir
      // el ingreso directo al sistema cuando el usuario y la contraseña son correctos.
      /*
      if (user.twoFactorEnabled) {
        // Requiere 2FA — guardar usuario pendiente y cambiar paso
        setPendingUser(user);
        setAuthStep('2fa');
        setLoading(false);
        return { requiresTwoFactor: true };
      }
      */

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
    
    if (isFirebaseConfigured && auth) {
      signOut(auth).catch(err => console.error('Error al cerrar sesión de Firebase Auth:', err));
    }
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

      // Si Firebase está configurado, iniciamos sesión con la cuenta de correo y su contraseña por defecto en Auth
      if (isFirebaseConfigured && auth && user.email) {
        try {
          await signInWithEmailAndPassword(auth, user.email, 'Pedraza2026!');
        } catch (authErr) {
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            try {
              await createUserWithEmailAndPassword(auth, user.email, 'Pedraza2026!');
            } catch (createErr) {
              console.error('Error al registrar usuario de demo:', createErr);
            }
          }
        }
      }

      setCurrentUser(user);
      setAuthStep('authenticated');
      userService.persistSession(user);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /**
   * Enviar correo de recuperación de contraseña
   */
  const resetPassword = async (emailToReset) => {
    setLoading(true);
    setError('');
    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error('La recuperación de contraseña requiere Firebase configurado.');
      }
      await sendPasswordResetEmail(auth, emailToReset);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Error al enviar correo de recuperación');
      setLoading(false);
      throw err;
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
    resetPassword,
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
