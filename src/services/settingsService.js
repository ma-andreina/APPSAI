import { db } from './firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { mockSystemConfig, mockAuditLogs, mockUsers, mockAudits, mockFindings, mockReports, mockPACs } from './mockData';

const STORAGE_KEY = 'sai_system_config';
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

/**
 * Obtiene la configuración persistida en localStorage o devuelve el mock por defecto.
 */
const getPersistedConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    
    // Invalidar si tiene datos viejos o escalas incompletas
    if (parsed && (
      (parsed.institutional && (parsed.institutional.rif !== 'G-20002278-7' || parsed.institutional.email !== 'contraloria_pedraza@hotmail.com')) ||
      (parsed.audit && parsed.audit.isoScales && parsed.audit.isoScales.length < 3)
    )) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const persistConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const settingsService = {
  /**
   * Retorna la configuración completa del sistema.
   * Si está en Firebase, la lee de la colección 'settings/institutional_config'.
   * Si es la primera ejecución, sube los datos existentes (localStorage o mockData) a Firestore.
   */
  getSystemConfig: async () => {
    const persisted = getPersistedConfig();
    const fallbackConfig = persisted 
      ? { ...mockSystemConfig, ...persisted }
      : { ...mockSystemConfig };

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(fallbackConfig), 400);
      });
    }

    try {
      const docRef = doc(db, 'settings', 'institutional_config');
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log('Sembrando configuración institucional en Firestore...');
        await setDoc(docRef, fallbackConfig);
        return fallbackConfig;
      }

      // Combinar los valores cargados de Firestore con mockSystemConfig
      const remoteData = docSnap.data();
      const mergedConfig = {
        ...mockSystemConfig,
        ...remoteData,
        institutional: { ...mockSystemConfig.institutional, ...remoteData.institutional },
        audit: { ...mockSystemConfig.audit, ...remoteData.audit },
        appearance: { ...mockSystemConfig.appearance, ...remoteData.appearance }
      };

      // Sincronizar localmente como caché de respaldo
      persistConfig(mergedConfig);
      return mergedConfig;
    } catch (error) {
      console.error('Error al recuperar configuración de Firestore, usando cache:', error);
      return fallbackConfig;
    }
  },

  /**
   * Actualiza parámetros institucionales.
   */
  updateInstitutionalParams: async (data) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const current = getPersistedConfig() || { ...mockSystemConfig };
          current.institutional = { ...current.institutional, ...data };
          persistConfig(current);
          resolve(current.institutional);
        }, 500);
      });
    }

    try {
      const docRef = doc(db, 'settings', 'institutional_config');
      const docSnap = await getDoc(docRef);
      const currentConfig = docSnap.exists() ? docSnap.data() : { ...mockSystemConfig };
      
      const updatedInstitutional = { ...currentConfig.institutional, ...data };
      await setDoc(docRef, { ...currentConfig, institutional: updatedInstitutional }, { merge: true });
      
      return updatedInstitutional;
    } catch (error) {
      console.error('Error al actualizar parámetros institucionales en Firestore:', error);
      throw error;
    }
  },

  /**
   * Actualiza configuración de auditorías (plazos, escalas, etc.).
   */
  updateAuditConfig: async (data) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const current = getPersistedConfig() || { ...mockSystemConfig };
          current.audit = { ...current.audit, ...data };
          persistConfig(current);
          resolve(current.audit);
        }, 500);
      });
    }

    try {
      const docRef = doc(db, 'settings', 'institutional_config');
      const docSnap = await getDoc(docRef);
      const currentConfig = docSnap.exists() ? docSnap.data() : { ...mockSystemConfig };

      const updatedAudit = { ...currentConfig.audit, ...data };
      await setDoc(docRef, { ...currentConfig, audit: updatedAudit }, { merge: true });

      return updatedAudit;
    } catch (error) {
      console.error('Error al actualizar configuración de auditoría en Firestore:', error);
      throw error;
    }
  },

  /**
   * Actualiza preferencias de apariencia (tema, zona horaria, formato fecha).
   */
  updateAppearance: async (preferences) => {
    // Aplicar tema inmediatamente al DOM
    if (preferences.theme) {
      document.documentElement.setAttribute(
        'data-theme',
        preferences.theme === 'dark' ? 'dark' : ''
      );
    }

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const current = getPersistedConfig() || { ...mockSystemConfig };
          current.appearance = { ...current.appearance, ...preferences };
          persistConfig(current);
          resolve(current.appearance);
        }, 300);
      });
    }

    try {
      const docRef = doc(db, 'settings', 'institutional_config');
      const docSnap = await getDoc(docRef);
      const currentConfig = docSnap.exists() ? docSnap.data() : { ...mockSystemConfig };

      const updatedAppearance = { ...currentConfig.appearance, ...preferences };
      await setDoc(docRef, { ...currentConfig, appearance: updatedAppearance }, { merge: true });

      return updatedAppearance;
    } catch (error) {
      console.error('Error al actualizar preferencias de apariencia en Firestore:', error);
      throw error;
    }
  },

  /**
   * Obtiene entradas de la bitácora con filtros opcionales.
   */
  getAuditLogs: async (filters = {}) => {
    // Nota: Por simplicidad y consistencia en el demo del POA, los logs siguen siendo consultados de mockData
    // En producción se cambiaría a una lectura de la colección '/audit_logs' ordenada cronológicamente.
    return new Promise((resolve) => {
      setTimeout(() => {
        let logs = [...mockAuditLogs];

        if (filters.startDate) {
          logs = logs.filter((log) => log.timestamp >= filters.startDate);
        }
        if (filters.endDate) {
          const endOfDay = filters.endDate + 'T23:59:59';
          logs = logs.filter((log) => log.timestamp <= endOfDay);
        }
        if (filters.userId) {
          logs = logs.filter((log) => log.userId === filters.userId);
        }
        if (filters.actionType) {
          logs = logs.filter((log) => log.action === filters.actionType);
        }

        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(logs);
      }, 300);
    });
  },

  /**
   * Retorna estadísticas generales del sistema para el panel de respaldos.
   */
  getSystemHealth: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          firebaseStatus: isFirebaseConfigured ? 'connected' : 'simulation',
          lastBackup: new Date().toISOString(),
          stats: {
            totalUsers: mockUsers.length,
            totalAudits: mockAudits.length,
            totalFindings: mockFindings.length,
            totalReports: mockReports.length,
            totalPACs: mockPACs.length,
            totalLogs: mockAuditLogs.length
          },
          storageUsed: '0.4 MB',
          storageLimit: '5 GB'
        });
      }, 500);
    });
  },

  /**
   * Exporta toda la data del sistema como un archivo JSON descargable.
   */
  exportData: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exportPayload = {
          exportDate: new Date().toISOString(),
          system: 'SAI - Contraloría del Municipio Pedraza',
          version: '1.0.0',
          data: {
            users: mockUsers,
            audits: mockAudits,
            findings: mockFindings,
            reports: mockReports,
            pacs: mockPACs,
            config: getPersistedConfig() || mockSystemConfig,
            auditLogs: mockAuditLogs
          }
        };

        const jsonString = JSON.stringify(exportPayload, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `SAI_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);

        resolve({ success: true, message: 'Respaldo exportado exitosamente' });
      }, 800);
    });
  }
};

