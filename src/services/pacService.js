import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, query, where } from 'firebase/firestore';
import { mockPACs, mockAudits, mockFindings, mockReports } from './mockData';
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
        setTimeout(() => {
          const audit = mockAudits.find(a => a.id === auditId);
          const report = mockReports.find(r => r.auditId === auditId);
          const findings = mockFindings.filter(f => f.auditId === auditId);
          
          let pac = localPACs.find(p => p.auditId === auditId);
          
          const { baseData, recommendations, resolvedPac } = pacService.buildPACDataStructure(audit, report, findings, pac);
          resolve({ baseData, recommendations, pac: resolvedPac });
        }, 500);
      });
    }

    try {
      // 1. Obtener la auditoría
      const audit = await auditService.getById(auditId);
      
      // 2. Obtener los reportes para ver el estado definitivo
      const allReports = await reportService.getAll();
      const report = allReports.find(r => r.auditId === auditId);

      // 3. Obtener los hallazgos para las recomendaciones
      const allFindings = await findingService.getAll();
      const findings = allFindings.filter(f => f.auditId === auditId);

      // 4. Buscar si existe un PAC en Firestore para este auditId
      const pacsRef = collection(db, 'pacs');
      const q = query(pacsRef, where('auditId', '==', auditId));
      const querySnapshot = await getDocs(q);

      let pac = null;
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          pac = { id: doc.id, ...doc.data() };
        });
      }

      const { baseData, recommendations, resolvedPac } = pacService.buildPACDataStructure(audit, report, findings, pac);
      return { baseData, recommendations, pac: resolvedPac };
    } catch (error) {
      console.error('Error al estructurar PAC desde Firestore, usando cache:', error);
      const audit = mockAudits.find(a => a.id === auditId);
      const report = mockReports.find(r => r.auditId === auditId);
      const findings = mockFindings.filter(f => f.auditId === auditId);
      let pac = localPACs.find(p => p.auditId === auditId);
      
      const { baseData, recommendations, resolvedPac } = pacService.buildPACDataStructure(audit, report, findings, pac);
      return { baseData, recommendations, pac: resolvedPac };
    }
  },

  // Método auxiliar para estructurar los datos del PAC (SoC)
  buildPACDataStructure: (audit, report, findings, pac) => {
    const baseData = {
      auditId: audit?.id || 'N/D',
      organism: audit?.organism || 'N/D',
      objetivoGeneral: `Evaluar los controles de seguridad de la información en ${audit?.organism || 'el ente auditado'}.`,
      alcance: `La evaluación comprende el período de ${audit?.startDate || 'N/D'} al ${audit?.endDate || 'N/D'}...`,
      reportStatus: report?.definitive?.status || 'Pendiente'
    };

    const recommendations = findings.map((f, i) => ({
      id: f.id,
      title: f.title || `Recomendación ${i + 1}`,
      description: f.condition || f.ccce?.condition || `Mitigar la condición del hallazgo.`
    }));

    let resolvedPac = pac;
    if (!resolvedPac) {
      resolvedPac = {
        id: `PAC-TEMP-${Date.now()}`,
        auditId: audit?.id || 'N/D',
        status: 'Nuevo',
        actions: [],
        signatures: {
          elaborated: { status: 'pendiente', name: '', role: '' },
          approved: { status: 'pendiente', name: '', role: '' },
          conformed: { status: 'pendiente', name: null, role: 'Coordinador de Auditoría' }
        }
      };
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

