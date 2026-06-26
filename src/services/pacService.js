import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { mockPACs, mockAudits, mockFindings, mockReports, mockUsers } from './mockData';
import { auditService } from './auditService';
import { findingService } from './findingService';
import { reportService } from './reportService';

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
let localPACs = [...mockPACs];

export const pacService = {
  getAllPACs: async () => {
    if (!isFirebaseConfigured) {
      return new Promise(resolve => setTimeout(() => resolve([...localPACs]), 400));
    }

    try {
      const pacsRef = collection(db, 'pacs');
      const querySnapshot = await getDocs(pacsRef);

      if (querySnapshot.empty) {
        console.log('Sembrando PACs iniciales en Firestore...');
        for (const pac of mockPACs) {
          await setDoc(doc(db, 'pacs', pac.id), pac);
        }
        return [...mockPACs];
      }

      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list;
    } catch (error) {
      console.error('Error al recuperar PACs de Firestore, usando fallback local:', error);
      return [...localPACs];
    }
  },

  // Obtiene los datos base de la auditoría y los cruza con las recomendaciones del reporte definitivo
  getPACDataByAudit: async (auditId) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const audit = mockAudits.find(a => a.id === auditId || a.codigo === auditId) || mockAudits[0];
          const allReports = await reportService.getAll();
          const report = allReports.find(r => r.auditId === auditId || r.auditId === audit?.id || r.id === 'REP-001') || mockReports[0];
          let findings = mockFindings.filter(f => f.auditId === auditId || f.auditId === audit?.id);
          if (findings.length === 0) findings = mockFindings;
          
          let pac = localPACs.find(p => p.auditId === auditId || p.auditId === audit?.id);
          const defReport = await reportService.generateReportData(audit?.id || auditId, 'definitivo', report);
          
          const { baseData, recommendations, resolvedPac } = pacService.buildPACDataStructure(audit, report, findings, pac, defReport);
          resolve({ baseData, recommendations, pac: resolvedPac });
        }, 500);
      });
    }

    try {
      // 1. Obtener la auditoría
      const allAudits = await auditService.getAll().catch(() => mockAudits);
      let audit = allAudits.find(a => a.id === auditId || a.codigo === auditId) || mockAudits.find(a => a.id === auditId) || mockAudits[0];
      
      // 2. Obtener los reportes para ver el estado definitivo
      const allReports = await reportService.getAll();
      const report = allReports.find(r => r.auditId === auditId || r.auditId === audit?.id || r.id === 'REP-001');

      // 3. Obtener los hallazgos para las recomendaciones
      const allFindings = await findingService.getAll();
      let findings = allFindings.filter(f => f.auditId === auditId || f.auditId === audit?.id || f.auditId === audit?.codigo);
      if (findings.length === 0 && allFindings.length > 0) findings = allFindings;

      // 4. Buscar si existe un PAC en Firestore para este auditId
      const pacsRef = collection(db, 'pacs');
      const q = query(pacsRef, where('auditId', '==', audit?.id || auditId));
      const querySnapshot = await getDocs(q);

      let pac = null;
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          pac = { id: doc.id, ...doc.data() };
        });
      }

      const defReport = await reportService.generateReportData(audit?.id || auditId, 'definitivo', report);
      const { baseData, recommendations, resolvedPac } = pacService.buildPACDataStructure(audit, report, findings, pac, defReport);
      return { baseData, recommendations, pac: resolvedPac };
    } catch (error) {
      console.error('Error al estructurar PAC desde Firestore, usando cache:', error);
      const audit = mockAudits.find(a => a.id === auditId) || mockAudits[0];
      const report = mockReports.find(r => r.auditId === auditId) || mockReports[0];
      const findings = [...mockFindings];
      let pac = localPACs.find(p => p.auditId === auditId);
      const defReport = await reportService.generateReportData(audit?.id || auditId, 'definitivo', report);
      
      const { baseData, recommendations, resolvedPac } = pacService.buildPACDataStructure(audit, report, findings, pac, defReport);
      return { baseData, recommendations, pac: resolvedPac };
    }
  },

  // Método auxiliar para estructurar los datos del PAC extrayendo estrictamente del Informe Definitivo
  buildPACDataStructure: (audit, report, findings, pac, defReport) => {
    const orgName = defReport?.portada?.tituloActuacion?.replace(/.*EN\s+/i, '') || audit?.organism || audit?.entity || 'Alcaldía de Pedraza';
    let rawCode = audit?.codigo || audit?.id || 'AUD-2026-001';
    if (rawCode.startsWith('AUD-17') || rawCode.length > 14) rawCode = 'AUD-2026-001';

    const baseData = {
      auditId: rawCode,
      organism: orgName,
      objetivoGeneral: defReport?.capitulo1?.objetivos?.general || audit?.planning?.objetivos?.general || `Evaluar los controles de seguridad de la información en ${orgName}.`,
      alcance: defReport?.capitulo1?.alcance || audit?.planning?.alcance || `La evaluación comprende el período del 15-04-2026 al 30-05-2026.`,
      reportStatus: (report?.definitive?.status || 'generado').toUpperCase()
    };

    const recList = Array.isArray(defReport?.capitulo4?.recomendaciones) && defReport.capitulo4.recomendaciones.length > 0
      ? defReport.capitulo4.recomendaciones
      : findings.map((f, i) => `${i + 1}. Solventar la desviación: ${f.condition || f.ccce?.condition || ''}`);

    const recommendations = recList.map((recText, i) => {
      const cleanText = typeof recText === 'string' ? recText.replace(/<[^>]*>?/gm, '') : 'Acción recomendada';
      const fMatch = findings[i] || findings[0] || {};
      let recTitle = fMatch.title || `Recomendación ${i + 1}`;
      if (recTitle.includes('undefined')) recTitle = `Recomendación Nro. ${i + 1}`;
      return {
        id: fMatch.id || `REC-${i + 1}`,
        title: recTitle,
        description: cleanText
      };
    });

    let coordName = 'María Gonzalez';
    let coordRole = 'Coordinador de Auditoría';
    if (audit?.team && Array.isArray(audit.team)) {
      for (const t of audit.team) {
        if (typeof t === 'string') {
          const u = mockUsers.find(user => user.id === t || user.name === t);
          if (u && (u.role?.includes('Coordinador') || u.role?.includes('Coord'))) {
            coordName = u.name;
            coordRole = u.role;
            break;
          }
        } else if (typeof t === 'object' && t !== null) {
          if (t.cargo?.includes('Coordinador') || t.role?.includes('Coordinador')) {
            coordName = t.nombre || t.name;
            coordRole = t.cargo || t.role;
            break;
          }
        }
      }
    }

    let resolvedPac = pac;
    if (!resolvedPac) {
      resolvedPac = {
        id: `PAC-TEMP-${Date.now()}`,
        auditId: rawCode,
        status: 'Nuevo',
        actions: [],
        signatures: {
          elaborated: { status: 'pendiente', name: '', cedula: '', role: '' },
          approved: { status: 'firmado', name: coordName, role: coordRole },
          conformed: { status: 'pendiente', name: null, role: 'Contralor Municipal' }
        }
      };
    } else {
      resolvedPac.auditId = rawCode;
      if (!resolvedPac.signatures) resolvedPac.signatures = {};
      if (!resolvedPac.signatures.elaborated || !resolvedPac.signatures.elaborated.cedula) {
        resolvedPac.signatures.elaborated = { status: 'pendiente', name: '', cedula: '', role: '' };
      }
      resolvedPac.signatures.approved = { status: 'firmado', name: coordName, role: coordRole };
      if (!resolvedPac.signatures.conformed) resolvedPac.signatures.conformed = { status: 'pendiente', name: null, role: 'Contralor Municipal' };
    }

    return { baseData, recommendations, resolvedPac };
  },

  // Guarda el borrador del PAC
  saveDraft: async (pacData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = localPACs.findIndex(p => p.id === pacData.id);
          const updatedPAC = { ...pacData, status: 'Borrador' };
          if (index > -1) {
            localPACs[index] = updatedPAC;
          } else {
            localPACs.push(updatedPAC);
          }
          resolve(true);
        }, 300);
      });
    }

    try {
      const docRef = doc(db, 'pacs', pacData.id);
      const updatedPAC = { 
        ...pacData, 
        status: 'Borrador',
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(docRef, updatedPAC, { merge: true });
      return true;
    } catch (error) {
      console.error('Error al guardar borrador del PAC en Firestore:', error);
      throw error;
    }
  },

  // Firmar el PAC
  signPAC: async (pacId, roleType, signatureData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const pac = localPACs.find(p => p.id === pacId);
          if (pac) {
            pac.signatures[roleType] = { ...pac.signatures[roleType], status: 'firmado', ...signatureData };
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

    try {
      const docRef = doc(db, 'pacs', pacId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("PAC no encontrado en Firestore");
      }

      const pac = docSnap.data();
      const updatedSignatures = { ...pac.signatures };
      updatedSignatures[roleType] = {
        ...updatedSignatures[roleType],
        status: 'firmado',
        ...signatureData
      };

      const updateData = {
        signatures: updatedSignatures,
        updatedAt: new Date().toISOString()
      };

      if (roleType === 'conformed') {
        updateData.status = 'Conformado';
      }

      await updateDoc(docRef, updateData);
      
      const updatedSnap = await getDoc(docRef);
      return { id: pacId, ...updatedSnap.data() };
    } catch (error) {
      console.error('Error al firmar PAC en Firestore:', error);
      throw error;
    }
  }
};

