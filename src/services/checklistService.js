import { db } from './firebaseConfig';
import { collection, query, where, getDocs, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { mockChecklist } from './mockData';

// Determinar si Firebase está configurado para pruebas reales
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

// Fallback en memoria para desarrollo local sin credenciales
let currentChecklist = [...mockChecklist];

export const checklistService = {
  /**
   * Obtiene la lista de controles de auditoría para un auditId.
   * Inicializa la colección en Firestore con los 93 controles si es la primera vez.
   * @param {string} auditId ID de la auditoría.
   * @returns {Promise<Array>} Listado de controles ordenados normativamente.
   */
  getChecklistForAudit: async (auditId) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...currentChecklist]);
        }, 150);
      });
    }

    try {
      const checklistsRef = collection(db, 'checklists');
      const q = query(checklistsRef, where('auditId', '==', auditId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Se ejecuta un sembrado automático (Seed) de los 93 controles de la ISO 27001
        console.log(`Sembrando checklist de 93 controles en Firestore para la auditoría: ${auditId}`);
        const batch = writeBatch(db);
        const seededControls = [];

        for (const control of mockChecklist) {
          const docId = `${auditId}_${control.id}`;
          const docRef = doc(db, 'checklists', docId);
          const newDoc = {
            ...control,
            status: null,
            observations: '',
            auditId,
            controlId: control.id,
            updatedAt: new Date().toISOString()
          };
          batch.set(docRef, newDoc);
          seededControls.push(newDoc);
        }

        await batch.commit();
        return seededControls.sort((a, b) => {
          return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
        });
      }

      // Devolver los documentos recuperados de Firestore
      const list = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Si el control tiene la información predeterminada antigua, la limpiamos a la fuerza
        if (data.observations === 'Definidos en el manual de organización.' || 
            data.observations === 'Falta control de acceso biométrico en el servidor central.') {
          data.status = null;
          data.observations = '';
          updateDoc(doc(db, 'checklists', docSnap.id), { status: null, observations: '' });
        }
        list.push(data);
      });

      return list.sort((a, b) => {
        return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' });
      });
    } catch (error) {
      console.error('Error al recuperar checklist desde Firestore, usando cache local:', error);
      return [...currentChecklist];
    }
  },

  /**
   * Actualiza el estado o las observaciones de un control normativo.
   * Si está offline, se guarda de inmediato en la caché local IndexedDB y se sincroniza después.
   * @param {string} auditId ID de la auditoría.
   * @param {string} controlId ID del control.
   * @param {object} updateData Campos modificados (status, observations).
   * @returns {Promise<object>} El objeto con los datos actualizados.
   */
  updateControl: async (auditId, controlId, updateData) => {
    const updatedFields = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        currentChecklist = currentChecklist.map((c) =>
          c.id === controlId ? { ...c, ...updatedFields } : c
        );
        resolve(currentChecklist.find((c) => c.id === controlId));
      });
    }

    try {
      const docId = `${auditId}_${controlId}`;
      const docRef = doc(db, 'checklists', docId);
      
      // La escritura es instantánea a nivel local (IndexedDB)
      await updateDoc(docRef, updatedFields);
      
      return {
        id: controlId,
        ...updatedFields
      };
    } catch (error) {
      console.error('Error al actualizar control en Firestore:', error);
      throw error;
    }
  }
};
