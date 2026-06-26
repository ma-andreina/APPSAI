import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { mockReports, mockAudits, mockFindings } from './mockData';
import { auditService } from './auditService';
import { findingService } from './findingService';
import { settingsService } from './settingsService';

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
      querySnapshot.forEach((docSnap) => {
        let item = { id: docSnap.id, ...docSnap.data() };
        if (item.auditId && (item.auditId.startsWith('AUD-17') || item.auditId.length > 13)) {
          item.auditId = 'AUD-2026-001';
        }
        if (item.id === 'REP-001' && !item.definitive?.chapter4) {
          item.definitive = { status: 'pendiente', date: null };
          item.executive = { status: 'pendiente', date: null };
          updateDoc(docSnap.ref, { 'definitive': item.definitive, 'executive': item.executive }).catch(()=>{});
        }
        if (item.definitive?.status && item.definitive.status !== 'pendiente' && item.executive?.status === 'pendiente') {
          item.executive = { status: 'generado', date: item.definitive.date || new Date().toISOString().split('T')[0] };
          updateDoc(docSnap.ref, { 'executive': item.executive }).catch(()=>{});
        }
        list.push(item);
      });
      return list;
    } catch (error) {
      console.error('Error al recuperar reportes de Firestore, usando fallback local:', error);
      return localReports.map(item => {
        let res = { ...item };
        if (res.auditId && (res.auditId.startsWith('AUD-17') || res.auditId.length > 13)) {
          res.auditId = 'AUD-2026-001';
        }
        if (res.id === 'REP-001' && !res.definitive?.chapter4) {
          res.definitive = { status: 'pendiente', date: null };
          res.executive = { status: 'pendiente', date: null };
        }
        if (res.definitive?.status && res.definitive.status !== 'pendiente' && res.executive?.status === 'pendiente') {
          res.executive = { status: 'generado', date: res.definitive.date || new Date().toISOString().split('T')[0] };
        }
        return res;
      });
    }
  },

  // Generador parametrizado dinámico y fresco
  generateReportData: async (auditId, reportType, report) => {
    try {
      const allAudits = await auditService.getAll();
      let audit = allAudits.find(a => a.id === auditId || a.codigo === auditId);
      if (!audit && allAudits.length > 0) {
        // Si no coincide exactamente el ID (ej: en demo se hace clic en reporte REP-001 de AUD-2026-001 pero el usuario creó una auditoría nueva con otro ID), tomamos la auditoría más reciente
        audit = allAudits[allAudits.length - 1];
      }
      if (!audit) {
        audit = mockAudits.find(a => a.id === auditId) || mockAudits[0];
      }

      if (!report) {
        const allReports = await reportService.getAll();
        report = allReports.find(r => r.auditId === auditId || r.auditId === audit?.id || r.auditId === audit?.codigo || r.id === 'REP-001');
      }

      const allFindings = await findingService.getAll();
      let findings = allFindings.filter(f => f.auditId === auditId || f.auditId === audit?.id || f.auditId === audit?.codigo);
      
      // En demostración, si el usuario acaba de registrar un hallazgo (guardado con AUD-SEC-2026 por defecto en Findings.jsx) o hay hallazgos registrados, los vinculamos dinámicamente
      if (findings.length === 0 && allFindings.length > 0) {
        findings = allFindings;
      }

      const sysConfig = await settingsService.getSystemConfig();
      const inst = sysConfig?.institutional || {};

      const generatedData = reportService.buildReportDataStructure(audit, findings, reportType, report, inst);

      // Persistir de forma asíncrona en caché de Firestore sin bloquear el renderizado visual
      if (isFirebaseConfigured) {
        const reportDocId = `${audit?.id || auditId}_${reportType}`;
        const docRef = doc(db, 'reports_data', reportDocId);
        setDoc(docRef, generatedData, { merge: true }).catch(err => console.log('Sincronización en caché secundaria omitida:', err.message));
      }

      return generatedData;
    } catch (error) {
      console.error('Error en generateReportData, usando fallback local en memoria:', error);
      const audit = mockAudits.find(a => a.id === auditId) || mockAudits[0];
      const findings = [...mockFindings];
      const sysConfig = await settingsService.getSystemConfig().catch(()=>null);
      return reportService.buildReportDataStructure(audit, findings, reportType, report, sysConfig?.institutional || {});
    }
  },

  // Método auxiliar para estructurar los datos del reporte (SoC)
  buildReportDataStructure: (audit, findings, reportType, report, inst = {}) => {
    const p = audit?.planning || {};
    const organismName = audit?.organism || audit?.entity || 'LA INSTITUCIÓN';
    const reportData = {
      portada: {
        unidadOrganizativa: 'DIRECCIÓN DE CONTROL DE LA ADMINISTRACIÓN CENTRAL Y DESCENTRALIZADA',
        tituloActuacion: `AUDITORÍA INFORMÁTICA PRACTICADA EN ${organismName.toUpperCase()}`,
        tipoInforme: reportType === 'preliminar' ? 'INFORME PRELIMINAR' : reportType === 'definitivo' ? 'INFORME DEFINITIVO' : 'RESUMEN EJECUTIVO'
      },
      capitulo1: {
        origen: p.origen || 'En cumplimiento del Plan Operativo Anual (POA)...',
        alcance: typeof (p.alcance || `La evaluación comprende el período del ${audit?.startDate || 'N/D'} al ${audit?.endDate || 'N/D'}.`) === 'string' ? (p.alcance || `La evaluación comprende el período del ${audit?.startDate || 'N/D'} al ${audit?.endDate || 'N/D'}.`).replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, '$3-$2-$1') : p.alcance,
        objetivos: {
          general: p.objetivos?.general || `Evaluar los controles de seguridad de la información en ${organismName}.`,
          especificos: p.objetivos?.especificos?.length > 0 ? p.objetivos.especificos : ['1. Verificar controles físicos y organizacionales.', '2. Evaluar controles de red y lógicos.']
        },
        enfoque: p.enfoque || 'Cumplimiento normativo y evaluación de riesgos de seguridad de la información.',
        metodos: p.metodos || 'Inspección in-situ, entrevistas estructuradas, revisión documental (Checklist ISO 27001:2022).'
      },
      capitulo2: {
        creacion: p.creacion || 'Gaceta Municipal Nro. X...',
        baseLegal: p.baseLegal || 'Constitución de la República Bolivariana de Venezuela, Ley Orgánica de la Contraloría...'
      },
      capitulo3: findings.map((f, i) => ({
        titulo: f.title || `Hallazgo ${i + 1}`,
        condicion: f.condition || f.ccce?.condition || '',
        criterio: f.criterion || f.ccce?.criterion || '',
        causa: f.cause || f.ccce?.cause || '',
        efecto: f.effect || f.ccce?.effect || ''
      })),
      capitulo4: {
        conclusion: report?.definitive?.chapter4?.conclusion || (findings.length > 0
          ? 'Se determinaron debilidades y oportunidades de mejora significativas en la gestión de seguridad de la información de acuerdo con la norma ISO 27001:2022.'
          : 'Se concluye que el organismo evaluado cumple de forma razonable con los estándares mínimos evaluados.'),
        recomendaciones: report?.definitive?.chapter4?.recomendaciones || findings.map((f, i) => `${i + 1}. Solventar la desviación: ${f.condition || f.ccce?.condition || ''}`)
      },
      pieFirma: {
        institucion: (inst.institutionName || 'CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS').toUpperCase(),
        firmanteNombre: inst.maxAuthority || 'Jose Alexander Jimenez Devia',
        firmanteCargo: inst.maxAuthorityRole || 'Contralor Interino del Municipio Pedraza',
        acta: inst.maxAuthorityAppointment || 'Acta de Sesión Extraordinaria Nro. 003-2019 de fecha 15-05-2019',
        publicacion: inst.maxAuthorityGazette || 'Gaceta Municipal Nro 1025 de fecha 15-05-2019'
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
            if (localReports[reportIndex].executive) {
              localReports[reportIndex].executive.status = 'generado';
            }
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
        'executive.status': 'generado',
        updatedAt: new Date().toISOString()
      };

      await updateDoc(docRef, updateData);
      
      const docSnap = await getDoc(docRef);
      return { id: reportId, ...docSnap.data() };
    } catch (error) {
      console.error('Error al firmar reporte en Firestore:', error);
      throw error;
    }
  },

  saveDefinitiveChapter4: async (reportId, chapter4Data) => {
    const reportIndex = localReports.findIndex(r => r.id === reportId);
    if (reportIndex > -1) {
      if (!localReports[reportIndex].definitive) localReports[reportIndex].definitive = {};
      localReports[reportIndex].definitive.chapter4 = chapter4Data;
      localReports[reportIndex].definitive.status = 'generado';
      if (!localReports[reportIndex].executive) localReports[reportIndex].executive = {};
      localReports[reportIndex].executive.status = 'generado';
    }

    if (!isFirebaseConfigured) {
      return localReports[reportIndex];
    }

    try {
      const docRef = doc(db, 'reports', reportId);
      await updateDoc(docRef, {
        'definitive.chapter4': chapter4Data,
        'definitive.status': 'generado',
        'executive.status': 'generado',
        updatedAt: new Date().toISOString()
      });
      const docSnap = await getDoc(docRef);
      return { id: reportId, ...docSnap.data() };
    } catch (error) {
      console.error('Error al guardar capítulo 4 en Firestore, usando cache local:', error);
      return localReports[reportIndex];
    }
  },

  approveExecutive: async (reportId) => {
    const reportIndex = localReports.findIndex(r => r.id === reportId);
    if (reportIndex > -1) {
      if (!localReports[reportIndex].executive) localReports[reportIndex].executive = {};
      localReports[reportIndex].executive.status = 'aprobado';
      localReports[reportIndex].executive.date = new Date().toISOString().split('T')[0];
    }

    if (!isFirebaseConfigured) {
      return localReports[reportIndex];
    }

    try {
      const docRef = doc(db, 'reports', reportId);
      await updateDoc(docRef, {
        'executive.status': 'aprobado',
        'executive.date': new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString()
      });
      const docSnap = await getDoc(docRef);
      return { id: reportId, ...docSnap.data() };
    } catch (error) {
      console.error('Error al aprobar resumen ejecutivo en Firestore:', error);
      return localReports[reportIndex];
    }
  }
};
