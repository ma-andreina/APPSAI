import { mockReports, mockAudits, mockFindings } from './mockData';

export const reportService = {
  getAll: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockReports]), 400));
  },

  // Generador parametrizado basado en los modelos
  generateReportData: async (auditId, reportType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const audit = mockAudits.find(a => a.id === auditId);
        const findings = mockFindings.filter(f => f.auditId === auditId);

        // Mapeo Estándar (Las 6 Partes parametrizadas)
        const reportData = {
          portada: {
            unidadOrganizativa: 'DIRECCIÓN DE CONTROL DE LA ADMINISTRACIÓN CENTRAL Y DESCENTRALIZADA',
            tituloActuacion: `AUDITORÍA INFORMÁTICA PRACTICADA EN ${audit?.organism?.toUpperCase()}`,
            tipoInforme: reportType === 'preliminar' ? 'INFORME PRELIMINAR' : reportType === 'definitivo' ? 'INFORME DEFINITIVO' : 'RESUMEN EJECUTIVO'
          },
          capitulo1: {
            origen: 'En cumplimiento del Plan Operativo Anual (POA)...',
            alcance: `La evaluación comprende el período de ${audit?.startDate} al ${audit?.endDate}...`,
            objetivos: {
              general: `Evaluar los controles de seguridad de la información en ${audit?.organism}.`,
              especificos: ['1. Verificar controles físicos.', '2. Evaluar controles lógicos y de red.']
            },
            enfoque: 'Cumplimiento normativo y evaluación de riesgos.',
            metodos: 'Inspección in-situ, entrevistas, revisión documental (Checklist ISO 27001).'
          },
          capitulo2: {
            creacion: 'Gaceta Municipal Nro. X...',
            mision: 'Ejercer el control, vigilancia y fiscalización...',
            vision: 'Ser el órgano de control fiscal modelo...',
            organigrama: 'Estructura vertical...',
            baseLegal: 'Constitución CRBV, LOCGRSNC, ISO 27001:2022.'
          },
          capitulo3: findings.map(f => ({
            objetivoVinculado: 'Verificar controles tecnológicos',
            titulo: 'Ausencia de software antivirus',
            condicion: f.condition,
            criterio: f.criterion,
            causa: f.cause,
            efecto: f.effect
          })),
          capitulo4: {
            conclusion: 'El sistema presenta debilidades significativas en los controles tecnológicos...',
            recomendaciones: findings.map((f, i) => `${i+1}. Mitigar la condición: ${f.condition}`)
          },
          pieFirma: {
            institucion: 'CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS',
            firmanteNombre: 'Carlos Mendoza',
            firmanteCargo: 'Contralor Municipal'
          }
        };

        // Si es Resumen Ejecutivo, extraemos solo lo necesario
        if (reportType === 'ejecutivo') {
          resolve({
            portada: reportData.portada,
            objetivoGeneral: reportData.capitulo1.objetivos.general,
            alcance: reportData.capitulo1.alcance,
            observacionesRelevantes: findings.map(f => f.condition),
            conclusion: reportData.capitulo4.conclusion,
            recomendaciones: reportData.capitulo4.recomendaciones,
            pieFirma: reportData.pieFirma
          });
        } else {
          resolve(reportData);
        }
      }, 500);
    });
  },

  signReport: async (reportId, signType, signedBy) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const reportIndex = mockReports.findIndex(r => r.id === reportId);
        if (reportIndex > -1) {
          // Simulamos la validación del PIN del gatekeeper (esto se hará en la UI)
          mockReports[reportIndex].definitive.status = 'firmado';
          mockReports[reportIndex].definitive.date = new Date().toISOString().split('T')[0];
          mockReports[reportIndex].definitive.signedBy = signedBy;
          mockReports[reportIndex].definitive.signType = signType; // 'fisica' o 'digital'
          resolve(mockReports[reportIndex]);
        } else {
          reject(new Error("Report not found"));
        }
      }, 800);
    });
  }
};
