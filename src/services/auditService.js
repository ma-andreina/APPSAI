import { mockAudits } from './mockData';

// Wrapper para futura conexión a Firebase
export const auditService = {
  getAll: async () => {
    return new Promise(resolve => setTimeout(() => resolve(mockAudits), 500));
  },
  
  getById: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const audit = mockAudits.find(a => a.id === id);
        resolve(audit);
      }, 300);
    });
  },

  create: async (auditData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newAudit = { ...auditData, id: `AUD-${Date.now()}` };
        mockAudits.push(newAudit);
        resolve(newAudit);
      }, 800);
    });
  },
  
  updateStatus: async (id, newStatus) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const audit = mockAudits.find(a => a.id === id);
        if(audit) audit.status = newStatus;
        resolve(audit);
      }, 400);
    });
  }
};
