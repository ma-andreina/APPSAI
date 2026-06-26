import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { mockAudits } from './mockData';

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;
let localAudits = [...mockAudits];

export const auditService = {
  getAll: async () => {
    if (!isFirebaseConfigured) {
      return new Promise(resolve => setTimeout(() => resolve([...localAudits]), 300));
    }

    try {
      const auditsRef = collection(db, 'audits');
      const querySnapshot = await getDocs(auditsRef);

      // Sembrar datos iniciales si la colección está vacía
      if (querySnapshot.empty) {
        console.log('Sembrando auditorías iniciales en Firestore...');
        for (const audit of mockAudits) {
          await setDoc(doc(db, 'audits', audit.id), audit);
        }
        return [...mockAudits];
      }

      const list = [];
      querySnapshot.forEach((docSnap) => {
        let item = { id: docSnap.id, ...docSnap.data() };
        if (item.id.startsWith('AUD-17') || item.id.length > 13) {
          item.id = 'AUD-2026-001';
          item.codigo = 'AUD-2026-001';
        }
        list.push(item);
      });
      return list;
    } catch (error) {
      console.error('Error al recuperar auditorías de Firestore, usando fallback local:', error);
      return localAudits.map(a => (a.id.startsWith('AUD-17') || a.id.length > 13) ? { ...a, id: 'AUD-2026-001', codigo: 'AUD-2026-001' } : a);
    }
  },
  
  getById: async (id) => {
    if (!isFirebaseConfigured) {
      return new Promise(resolve => {
        const audit = localAudits.find(a => a.id === id);
        resolve(audit ? { ...audit } : null);
      });
    }

    try {
      const docRef = doc(db, 'audits', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al recuperar auditoría de Firestore:', error);
      return localAudits.find(a => a.id === id) || null;
    }
  },

  create: async (auditData) => {
    const auditId = auditData.codigo || auditData.id || 'AUD-2026-001';
    const newAudit = { 
      ...auditData, 
      id: auditId, 
      progress: auditData.progress || 0,
      tasks: auditData.tasks || { total: 0, completed: 0 },
      createdAt: new Date().toISOString() 
    };

    if (!isFirebaseConfigured) {
      localAudits.push(newAudit);
      return newAudit;
    }

    try {
      await setDoc(doc(db, 'audits', auditId), newAudit);
      return newAudit;
    } catch (error) {
      console.error('Error al guardar auditoría en Firestore:', error);
      throw error;
    }
  },
  
  updateStatus: async (id, newStatus) => {
    if (!isFirebaseConfigured) {
      const audit = localAudits.find(a => a.id === id);
      if (audit) audit.status = newStatus;
      return audit;
    }

    try {
      const docRef = doc(db, 'audits', id);
      await updateDoc(docRef, { 
        status: newStatus, 
        updatedAt: new Date().toISOString() 
      });
      
      const docSnap = await getDoc(docRef);
      return { id, ...docSnap.data() };
    } catch (error) {
      console.error('Error al actualizar estado en Firestore:', error);
      throw error;
    }
  }
};

