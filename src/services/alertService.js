import { mockPACs, mockAudits, mockReports } from './mockData';

// Generador de alertas dinámico
export const alertService = {
  getAlerts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const alerts = [];
        const today = new Date();
        
        // --- Regla 1: Alertas del PAC (Acciones Correctivas Vencidas) ---
        mockPACs.forEach(pac => {
          if (pac.status === 'Conformado') return; // Si ya está conformado, no hay alertas de plazo
          
          pac.actions.forEach(action => {
            if (!action.estimatedDate) return;
            
            const estDate = new Date(action.estimatedDate);
            const diffTime = estDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let status = 'a-tiempo';
            if (diffDays < 0) {
              status = 'vencido';
            } else if (diffDays <= 5) {
              status = 'proximo';
            }

            // Solo mostramos alertas si están próximas o vencidas para no saturar,
            // pero para propósitos del Kanban enviaremos todas.
            alerts.push({
              id: `AL-PAC-${pac.id}-${action.recommendationId}`,
              type: 'PAC',
              title: `Acción Correctiva PAC`,
              description: `Responsable: ${action.responsible || 'No asignado'} - ${action.correctiveAction.substring(0, 50)}...`,
              auditId: pac.auditId,
              targetDate: action.estimatedDate,
              daysRemaining: diffDays,
              status: status,
              escalated: false // Flag para escalamiento
            });
          });
        });

        // --- Regla 2: Informes Definitivos sin Firmar ---
        mockReports.forEach(report => {
          if (report.definitive.status === 'pendiente') {
            const createDate = new Date(report.createdAt);
            const diffTime = today - createDate;
            const daysSinceCreation = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            // Asumimos un plazo de 15 días desde la creación del preliminar para firmar el definitivo
            const deadlineDays = 15;
            const daysRemaining = deadlineDays - daysSinceCreation;

            let status = 'a-tiempo';
            if (daysRemaining < 0) status = 'vencido';
            else if (daysRemaining <= 5) status = 'proximo';

            alerts.push({
              id: `AL-REP-${report.id}`,
              type: 'Informe',
              title: `Firma de Informe Pendiente`,
              description: `Informe Definitivo de ${report.entity} requiere firma.`,
              auditId: report.auditId,
              targetDate: new Date(createDate.getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
              daysRemaining: daysRemaining,
              status: status,
              escalated: false
            });
          }
        });

        // Ordenamos las alertas para que las vencidas salgan primero en sus respectivas columnas
        alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);

        resolve(alerts);
      }, 500);
    });
  },

  escalateAlert: async (alertId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // En un entorno real, esto haría un PATCH a la base de datos
        // Aquí simulamos que se completó exitosamente
        resolve({
          success: true,
          message: "Escalado a Dirección General. Se ha emitido la recomendación de incluir una Auditoría de Seguimiento en el próximo POA."
        });
      }, 600);
    });
  }
};
