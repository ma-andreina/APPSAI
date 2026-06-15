import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { mockUsers } from './mockData';

const SESSION_KEY = 'sai_current_user';
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
let localUsers = [...mockUsers];

export const userService = {
  getAll: async () => {
    if (!isFirebaseConfigured) {
      return new Promise(resolve => setTimeout(() => resolve([...localUsers]), 300));
    }

    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);

      // Sembrar datos iniciales si la colección está vacía
      if (querySnapshot.empty) {
        console.log('Sembrando usuarios iniciales en Firestore...');
        for (const user of mockUsers) {
          await setDoc(doc(db, 'users', user.id), user);
        }
        return [...mockUsers];
      }

      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } catch (error) {
      console.error('Error al recuperar usuarios de Firestore, usando fallback local:', error);
      return [...localUsers];
    }
  },

  /**
   * Busca un usuario por email en Firestore o en la base mock.
   */
  getUserByEmail: async (email) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = localUsers.find(
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
    }

    try {
      // Primero verificar si la colección está vacía para sembrar si es necesario
      await userService.getAll();

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Usuario no encontrado en la institución');
      }

      let user = null;
      querySnapshot.forEach((doc) => {
        user = { id: doc.id, ...doc.data() };
      });

      if (user.status !== 'Activo') {
        throw new Error('La cuenta de este usuario está desactivada');
      }

      return user;
    } catch (error) {
      console.error('Error al obtener usuario por email en Firestore:', error);
      throw error;
    }
  },

  /**
   * Valida credenciales.
   */
  validateCredentials: async (email, password) => {
    if (!password || password.length < 1) {
      throw new Error('Debe ingresar una contraseña');
    }
    const user = await userService.getUserByEmail(email);
    return { ...user };
  },

  /**
   * Simula verificación de código 2FA.
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
      const parsed = JSON.parse(stored);
      // Auto-actualizar si es el usuario Carlos Mendoza anterior
      if (parsed && parsed.name === 'Carlos Mendoza') {
        parsed.name = 'Jose Alexander Jimenez Devia';
        parsed.avatar = 'JA';
        parsed.email = 'Contraloría_Pedraza@hotmail.com';
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
      }
      return parsed;
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
    const userId = `USR-${Date.now()}`;
    const { password, ...otherData } = userData;
    const newUser = {
      ...otherData,
      id: userId,
      avatar: userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      status: userData.status || 'Activo',
      twoFactorEnabled: userData.twoFactorEnabled || false,
      tempPassword: password || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (!isFirebaseConfigured) {
      localUsers.push({ ...newUser, password });
      return newUser;
    }

    try {
      // Guardar el perfil en la colección /users de Firestore
      // Nota: El registro en Firebase Auth se realizará on-demand al iniciar sesión por primera vez
      await setDoc(doc(db, 'users', userId), newUser);
      return newUser;
    } catch (error) {
      console.error('Error al crear usuario en Firestore:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    const { password, confirmPassword, ...otherData } = userData;
    const updatePayload = {
      ...otherData,
      updatedAt: new Date().toISOString()
    };
    
    if (password && password.length > 0) {
      updatePayload.tempPassword = password;
    }

    if (!isFirebaseConfigured) {
      const index = localUsers.findIndex(u => u.id === id);
      if (index !== -1) {
        localUsers[index] = { ...localUsers[index], ...updatePayload };
        if (password) {
          localUsers[index].password = password;
        }
        return localUsers[index];
      }
      return null;
    }

    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, updatePayload);
      const docSnap = await getDoc(docRef);
      return { id, ...docSnap.data() };
    } catch (error) {
      console.error('Error al actualizar usuario en Firestore:', error);
      throw error;
    }
  },

  toggleUserStatus: async (id) => {
    if (!isFirebaseConfigured) {
      const user = localUsers.find(u => u.id === id);
      if (user) {
        user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
      }
      return user;
    }

    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error('Usuario no encontrado');

      const currentStatus = docSnap.data().status;
      const newStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';

      await updateDoc(docRef, { status: newStatus });
      return { id, status: newStatus };
    } catch (error) {
      console.error('Error al cambiar estatus de usuario en Firestore:', error);
      throw error;
    }
  }
};
