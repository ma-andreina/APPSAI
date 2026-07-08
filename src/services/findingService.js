import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { mockFindings } from './mockData';

// Determinar si Firebase está configurado para pruebas reales
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

// Fallback local en memoria para desarrollo
let currentFindings = [...mockFindings];

export const findingService = {
  /**
   * Obtiene todos los hallazgos registrados.
   * @returns {Promise<Array>} Listado de hallazgos.
   */
  getAll: async () => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...currentFindings]), 250);
      });
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'findings'));
      const list = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        list.push({ 
          id: doc.id, 
          ...d,
          condition: d.condition || d.ccce?.condition || '',
          criterion: d.criterion || d.ccce?.criterion || '',
          cause: d.cause || d.ccce?.cause || '',
          effect: d.effect || d.ccce?.effect || ''
        });
      });
      return list;
    } catch (error) {
      console.error('Error al recuperar hallazgos de Firestore, usando cache local:', error);
      return [...currentFindings];
    }
  },

  /**
   * Crea y registra un hallazgo estructurado (CCCE).
   * La escritura es resiliente y se guarda localmente si no hay red.
   * @param {object} findingData Datos del hallazgo.
   * @returns {Promise<object>} El hallazgo creado con su ID correspondiente.
   */
  create: async (findingData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newFinding = {
            id: `HALL-${String(currentFindings.length + 1).padStart(3, '0')}`,
            status: 'Abierto',
            createdAt: new Date().toISOString(),
            ...findingData
          };
          currentFindings = [newFinding, ...currentFindings];
          resolve(newFinding);
        }, 300);
      });
    }

    try {
      // Usar un nuevo ID autogenerado por Firestore
      const newDocRef = doc(collection(db, 'findings'));
      
      const newFinding = {
        auditId: findingData.auditId || 'AUD-SEC-2026',
        controlId: findingData.controlId || '',
        title: findingData.title || `Desviación Control A.${findingData.controlId}`,
        status: 'Abierto',
        severity: findingData.severity || 'Medio',
        condition: findingData.condition || '',
        criterion: findingData.criterion || '',
        cause: findingData.cause || '',
        effect: findingData.effect || '',
        ccce: {
          condition: findingData.condition || '',
          criterion: findingData.criterion || '',
          cause: findingData.cause || '',
          effect: findingData.effect || ''
        },
        evidenceFiles: findingData.evidenceFiles || [], // [{ fileName, fileUrl, sha256, uploadedAt }]
        createdAt: new Date().toISOString()
      };

      // Guardar de inmediato en la caché local IndexedDB
      await setDoc(newDocRef, newFinding);

      return {
        id: newDocRef.id,
        ...newFinding
      };
    } catch (error) {
      console.error('Error al crear hallazgo en Firestore:', error);
      throw error;
    }
  },

  /**
   * Actualiza un hallazgo existente en Firestore y en caché local.
   * @param {string} id ID del hallazgo.
   * @param {object} findingData Datos a actualizar.
   * @returns {Promise<object>} El hallazgo actualizado.
   */
  update: async (id, findingData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = currentFindings.findIndex((f) => f.id === id);
          if (index !== -1) {
            currentFindings[index] = {
              ...currentFindings[index],
              ...findingData,
              condition: findingData.condition || findingData.ccce?.condition || currentFindings[index].condition,
              criterion: findingData.criterion || findingData.ccce?.criterion || currentFindings[index].criterion,
              cause: findingData.cause || findingData.ccce?.cause || currentFindings[index].cause,
              effect: findingData.effect || findingData.ccce?.effect || currentFindings[index].effect,
              ccce: {
                condition: findingData.condition || '',
                criterion: findingData.criterion || '',
                cause: findingData.cause || '',
                effect: findingData.effect || ''
              },
              updatedAt: new Date().toISOString()
            };
            resolve(currentFindings[index]);
          } else {
            resolve(null);
          }
        }, 250);
      });
    }

    try {
      const docRef = doc(db, 'findings', id);
      const updatedData = {
        ...findingData,
        condition: findingData.condition || '',
        criterion: findingData.criterion || '',
        cause: findingData.cause || '',
        effect: findingData.effect || '',
        ccce: {
          condition: findingData.condition || '',
          criterion: findingData.criterion || '',
          cause: findingData.cause || '',
          effect: findingData.effect || ''
        },
        updatedAt: new Date().toISOString()
      };
      await updateDoc(docRef, updatedData);
      return { id, ...updatedData };
    } catch (error) {
      console.error('Error al actualizar hallazgo en Firestore:', error);
      throw error;
    }
  }
};
