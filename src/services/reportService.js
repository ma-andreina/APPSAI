import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { mockReports, mockAudits, mockFindings } from './mockData';
import { auditService } from './auditService';
import { findingService } from './findingService';

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
let localReports = [...mockReports];

export const reportService = {
  getAll: async () => {
    if (!isFirebaseConfigured) {
      return new Promise(resolve => setTimeout(() => resolve([...localReports]), 400));
    }

    try {
      const reportsRef = collection(db, 'reports');
      const querySnapshot = await getDocs(reportsRef);

      if (querySnapshot.empty) {
        console.log('Sembrando reportes iniciales en Firestore...');
        for (const report of mockReports) {
          await setDoc(doc(db, 'reports', report.id), report);
        }
        return [...mockReports];
      }

      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } catch (error) {
      console.error('Error al recuperar reportes de Firestore, usando fallback local:', error);
      return [...localReports];
    }
  },

  // Generador parametrizado basado en los modelos
  generateReportData: async (auditId, reportType) => {
    const reportDocId = `${auditId}_${reportType}`;

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const audit = mockAudits.find(a => a.id === auditId);
          const findings = mockFindings.filter(f => f.auditId === auditId);
          resolve(reportService.buildReportDataStructure(audit, findings, reportType));
        }, 500);
      });
    }

    try {
      // Intentar recuperar el reporte guardado en Firestore
      const docRef = doc(db, 'reports_data', reportDocId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      }

      // Si no existe, generarlo dinámicamente y guardarlo
      console.log(`Generando y guardando datos de reporte en Firestore para: ${reportDocId}`);
      const audit = await auditService.getById(auditId);
      const allFindings = await findingService.getAll();
      const findings = allFindings.filter(f => f.auditId === auditId);

      const generatedData = reportService.buildReportDataStructure(audit, findings, reportType);
      
      // Guardar en Firestore para persistencia
      await setDoc(docRef, generatedData);
      return generatedData;
    } catch (error) {
      console.error('Error al generar u obtener reporte de Firestore, usando simulación local:', error);
      const audit = mockAudits.find(a => a.id === auditId);
      const findings = mockFindings.filter(f => f.auditId === auditId);
      return reportService.buildReportDataStructure(audit, findings, reportType);
    }
  },

  // Método auxiliar para estructurar los datos del reporte (SoC)
  buildReportDataStructure: (audit, findings, reportType) => {
    const reportData = {
      portada: {
        unidadOrganizativa: 'DIRECCIÓN DE CONTROL DE LA ADMINISTRACIÓN CENTRAL Y DESCENTRALIZADA',
        tituloActuacion: `AUDITORÍA INFORMÁTICA PRACTICADA EN ${audit?.organism?.toUpperCase() || 'LA INSTITUCIÓN'}`,
        tipoInforme: reportType === 'preliminar' ? 'INFORME PRELIMINAR' : reportType === 'definitivo' ? 'INFORME DEFINITIVO' : 'RESUMEN EJECUTIVO'
      },
      capitulo1: {
        origen: 'En cumplimiento del Plan Operativo Anual (POA)...',
        alcance: `La evaluación comprende el período de ${audit?.startDate || 'N/D'} al ${audit?.endDate || 'N/D'}...`,
        objetivos: {
          general: `Evaluar los controles de seguridad de la información en ${audit?.organism || 'el ente auditado'}.`,
          especificos: ['1. Verificar controles físicos y organizacionales.', '2. Evaluar controles de red y lógicos.']
        },
        enfoque: 'Cumplimiento normativo y evaluación de riesgos de seguridad de la información.',
        metodos: 'Inspección in-situ, entrevistas estructuradas, revisión documental (Checklist ISO 27001:2022).'
      },
      capitulo2: {
        creacion: 'Gaceta Municipal Nro. X...',
        mision: 'Ejercer el control, vigilancia y fiscalización de los ingresos, gastos y bienes del Municipio...',
        vision: 'Ser el órgano de control fiscal modelo en la región...',
        organigrama: 'Estructura jerárquica vertical establecida...',
        baseLegal: 'Constitución de la República Bolivariana de Venezuela, Ley Orgánica de la Contraloría General de la República y del Sistema Nacional de Control Fiscal, Norma ISO 27001:2022.'
      },
      capitulo3: findings.map((f, i) => ({
        objetivoVinculado: 'Verificar controles tecnológicos y de seguridad',
        titulo: f.title || `Hallazgo ${i + 1}`,
        condicion: f.condition || f.ccce?.condition || '',
        criterio: f.criterion || f.ccce?.criterion || '',
        causa: f.cause || f.ccce?.cause || '',
        efecto: f.effect || f.ccce?.effect || ''
      })),
      capitulo4: {
        conclusion: findings.length > 0
          ? 'Se determinaron debilidades y oportunidades de mejora significativas en la gestión de seguridad de la información de acuerdo con la norma ISO 27001:2022.'
          : 'Se concluye que el organismo evaluado cumple de forma razonable con los estándares mínimos evaluados.',
        recomendaciones: findings.map((f, i) => `${i + 1}. Solventar la desviación: ${f.condition || f.ccce?.condition || ''}`)
      },
      pieFirma: {
        institucion: 'CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS',
        firmanteNombre: 'Jose Alexander Jimenez Devia',
        firmanteCargo: 'Contralor Interino del Municipio Pedraza'
      }
    };

    if (reportType === 'ejecutivo') {
      return {
        portada: reportData.portada,
        objetivoGeneral: reportData.capitulo1.objetivos.general,
        alcance: reportData.capitulo1.alcance,
        observacionesRelevantes: findings.map(f => f.condition || f.ccce?.condition || ''),
        conclusion: reportData.capitulo4.conclusion,
        recomendaciones: reportData.capitulo4.recomendaciones,
        pieFirma: reportData.pieFirma
      };
    }

    return reportData;
  },

  signReport: async (reportId, signType, signedBy) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const reportIndex = localReports.findIndex(r => r.id === reportId);
          if (reportIndex > -1) {
            localReports[reportIndex].definitive.status = 'firmado';
            localReports[reportIndex].definitive.date = new Date().toISOString().split('T')[0];
            localReports[reportIndex].definitive.signedBy = signedBy;
            localReports[reportIndex].definitive.signType = signType;
            resolve(localReports[reportIndex]);
          } else {
            reject(new Error("Reporte no encontrado"));
          }
        }, 800);
      });
    }

    try {
      const docRef = doc(db, 'reports', reportId);
      const updateData = {
        'definitive.status': 'firmado',
        'definitive.date': new Date().toISOString().split('T')[0],
        'definitive.signedBy': signedBy,
        'definitive.signType': signType,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(docRef, updateData);
      
      const docSnap = await getDoc(docRef);
      return { id: reportId, ...docSnap.data() };
    } catch (error) {
      console.error('Error al firmar reporte en Firestore:', error);
      throw error;
    }
  }
};

