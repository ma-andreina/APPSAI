import { mockPACs, mockAudits, mockFindings, mockReports } from './mockData';

export const pacService = {
  getAllPACs: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockPACs]), 400));
  },

  // Obtiene los datos base de la auditoría y los cruza con las recomendaciones del reporte definitivo
  getPACDataByAudit: async (auditId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const audit = mockAudits.find(a => a.id === auditId);
        const report = mockReports.find(r => r.auditId === auditId);
        const findings = mockFindings.filter(f => f.auditId === auditId);
        
        let pac = mockPACs.find(p => p.auditId === auditId);
        
        // Estructurar la Data Base (Paso 1 del Wizard)
        const baseData = {
          auditId: audit.id,
          organism: audit.organism,
          objetivoGeneral: `Evaluar los controles de seguridad de la información en ${audit?.organism}.`,
          alcance: `La evaluación comprende el período de ${audit?.startDate} al ${audit?.endDate}...`,
          reportStatus: report?.definitive?.status || 'Pendiente'
        };

        // Generar lista de recomendaciones basadas en los hallazgos
        // El PAC solo atiende auditorías con informe definitivo firmado (para efectos prácticos)
        const recommendations = findings.map((f, i) => ({
          id: f.id,
          title: `Recomendación ${i+1}`,
          description: `Mitigar la condición: ${f.condition}`
        }));

        // Si no existe un PAC todavía, devolvemos uno inicializado
        if (!pac) {
          pac = {
            id: `PAC-TEMP-${Date.now()}`,
            auditId: audit.id,
            status: 'Nuevo',
            actions: [],
            signatures: {
              elaborated: { status: 'pendiente', name: '', role: '' },
              approved: { status: 'pendiente', name: '', role: '' },
              conformed: { status: 'pendiente', name: null, role: 'Coordinador de Auditoría' }
            }
          };
        }

        resolve({ baseData, recommendations, pac });
      }, 500);
    });
  },

  // Simula el autoguardado del draft
  saveDraft: async (pacData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockPACs.findIndex(p => p.id === pacData.id);
        if (index > -1) {
          mockPACs[index] = { ...pacData, status: 'Borrador' };
        } else {
          mockPACs.push({ ...pacData, status: 'Borrador' });
        }
        resolve(true);
      }, 300); // Guardado rápido
    });
  },

  // Firmar el PAC
  signPAC: async (pacId, roleType, signatureData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const pac = mockPACs.find(p => p.id === pacId);
        if (pac) {
          pac.signatures[roleType] = { ...pac.signatures[roleType], status: 'firmado', ...signatureData };
          
          // Si el coordinador conforma, el PAC cambia a estado "Conformado"
          if (roleType === 'conformed') {
            pac.status = 'Conformado';
          }
          resolve(pac);
        } else {
          reject(new Error("PAC no encontrado"));
        }
      }, 600);
    });
  }
};
