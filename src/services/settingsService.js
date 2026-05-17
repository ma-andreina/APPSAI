import { mockSystemConfig, mockAuditLogs, mockUsers, mockAudits, mockFindings, mockReports, mockPACs } from './mockData';

const STORAGE_KEY = 'sai_system_config';

/**
 * Obtiene la configuración persistida en localStorage o devuelve el mock por defecto.
 * En Fase 2 se reemplazará por una lectura a Firestore /system_config.
 */
const getPersistedConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const persistConfig = (config) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const settingsService = {
  /**
   * Retorna la configuración completa del sistema (merge de mock + localStorage).
   */
  getSystemConfig: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const persisted = getPersistedConfig();
        const config = persisted
          ? { ...mockSystemConfig, ...persisted }
          : { ...mockSystemConfig };
        resolve(config);
      }, 400);
    });
  },

  /**
   * Actualiza parámetros institucionales.
   */
  updateInstitutionalParams: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getPersistedConfig() || { ...mockSystemConfig };
        current.institutional = { ...current.institutional, ...data };
        persistConfig(current);
        resolve(current.institutional);
      }, 500);
    });
  },

  /**
   * Actualiza configuración de auditorías (plazos, escalas, etc.).
   */
  updateAuditConfig: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getPersistedConfig() || { ...mockSystemConfig };
        current.audit = { ...current.audit, ...data };
        persistConfig(current);
        resolve(current.audit);
      }, 500);
    });
  },

  /**
   * Actualiza preferencias de apariencia (tema, zona horaria, formato fecha).
   */
  updateAppearance: async (preferences) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const current = getPersistedConfig() || { ...mockSystemConfig };
        current.appearance = { ...current.appearance, ...preferences };
        persistConfig(current);

        // Aplicar tema inmediatamente al DOM
        if (preferences.theme) {
          document.documentElement.setAttribute(
            'data-theme',
            preferences.theme === 'dark' ? 'dark' : ''
          );
        }

        resolve(current.appearance);
      }, 300);
    });
  },

  /**
   * Obtiene entradas de la bitácora con filtros opcionales.
   * @param {Object} filters — { startDate, endDate, userId, actionType }
   */
  getAuditLogs: async (filters = {}) => {
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

        // Ordenar por fecha descendente (más reciente primero)
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
          firebaseStatus: 'connected',
          lastBackup: '2026-05-17T06:00:00',
          stats: {
            totalUsers: mockUsers.length,
            totalAudits: mockAudits.length,
            totalFindings: mockFindings.length,
            totalReports: mockReports.length,
            totalPACs: mockPACs.length,
            totalLogs: mockAuditLogs.length
          },
          storageUsed: '2.4 MB',
          storageLimit: '10 GB'
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
