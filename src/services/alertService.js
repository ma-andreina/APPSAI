import { pacService } from './pacService';
import { reportService } from './reportService';
import { auditService } from './auditService';
import { settingsService } from './settingsService';
import { mockPACs, mockReports, mockAudits } from './mockData';

// Generador de alertas dinámico conforme a la información guardada en el sistema
export const alertService = {
  getAlerts: async () => {
    try {
      const [allPACs, allReports, allAudits, sysConfig] = await Promise.all([
        pacService.getAllPACs().catch(() => mockPACs),
        reportService.getAll().catch(() => mockReports),
        auditService.getAll().catch(() => mockAudits),
        settingsService.getSystemConfig().catch(() => null)
      ]);

      const alerts = [];
      const today = new Date();
      const alertAdvanceDays = sysConfig?.audit?.alertAdvanceDays || 5;
      const reportDeadlineDays = sysConfig?.audit?.reportSignatureDeadlineDays || 15;

      // --- Regla 1: Alertas de Auditorías en Ejecución o Planificación ---
      allAudits.forEach(audit => {
        if (audit.status === 'closed' || !audit.endDate) return;

        const estDate = new Date(audit.endDate);
        const diffTime = estDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let status = 'a-tiempo';
        if (diffDays < 0) {
          status = 'vencido';
        } else if (diffDays <= alertAdvanceDays) {
          status = 'proximo';
        }

        alerts.push({
          id: `AL-AUD-${audit.id}`,
          type: 'Auditoria',
          title: `Plazo de Ejecución de Auditoría`,
          description: `Auditoría "${audit.title || 'Evaluación técnica'}" en ${audit.organism || audit.entity || 'la institución'} — Cierre programado para el ${audit.endDate}.`,
          auditId: audit.codigo || audit.id,
          targetDate: audit.endDate,
          daysRemaining: diffDays,
          status: status,
          escalated: false
        });
      });

      // --- Regla 2: Alertas del PAC (Acciones Correctivas Vencidas o Pendientes) ---
      allPACs.forEach(pac => {
        if (pac.status === 'Conformado') return; // Si ya está conformado, no hay alertas de plazo

        const actions = Array.isArray(pac.actions) ? pac.actions : [];
        actions.forEach((action, index) => {
          if (!action.estimatedDate) return;

          const estDate = new Date(action.estimatedDate);
          const diffTime = estDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let status = 'a-tiempo';
          if (diffDays < 0) {
            status = 'vencido';
          } else if (diffDays <= alertAdvanceDays) {
            status = 'proximo';
          }

          alerts.push({
            id: `AL-PAC-${pac.id}-${action.recommendationId || index}`,
            type: 'PAC',
            title: `Acción Correctiva PAC`,
            description: `Responsable: ${action.responsible || 'No asignado'} - ${(action.correctiveAction || '').substring(0, 60)}...`,
            auditId: pac.auditId,
            targetDate: action.estimatedDate,
            daysRemaining: diffDays,
            status: status,
            escalated: false
          });
        });
      });

      // --- Regla 3: Informes Definitivos sin Firmar ---
      allReports.forEach(report => {
        if (report.definitive?.status === 'pendiente' || !report.definitive?.status) {
          const createDate = new Date(report.createdAt || new Date());
          const diffTime = today - createDate;
          const daysSinceCreation = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const daysRemaining = reportDeadlineDays - daysSinceCreation;

          let status = 'a-tiempo';
          if (daysRemaining < 0) status = 'vencido';
          else if (daysRemaining <= alertAdvanceDays) status = 'proximo';

          const targetDateObj = new Date(createDate.getTime() + (reportDeadlineDays * 24 * 60 * 60 * 1000));
          const targetDateStr = !isNaN(targetDateObj.getTime()) ? targetDateObj.toISOString().split('T')[0] : 'Por definir';

          alerts.push({
            id: `AL-REP-${report.id}`,
            type: 'Informe',
            title: `Firma de Informe Pendiente`,
            description: `Informe Definitivo de ${report.entity || report.auditTitle || 'la auditoría'} requiere firma.`,
            auditId: report.auditId,
            targetDate: targetDateStr,
            daysRemaining: daysRemaining,
            status: status,
            escalated: false
          });
        }
      });

      // Ordenamos las alertas para que las vencidas salgan primero
      alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);

      return alerts;
    } catch (error) {
      console.error('Error al generar alertas dinámicas, usando fallback local:', error);
      return [];
    }
  },

  escalateAlert: async (alertId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Escalado a Dirección General. Se ha emitido la recomendación de incluir una Auditoría de Seguimiento en el próximo POA."
        });
      }, 600);
    });
  }
};
