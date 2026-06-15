import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { cryptoWrapper } from './cryptoWrapper';

// Verificar si Firebase está completamente configurado
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const storageService = {
  /**
   * Sube un archivo de evidencia para un control específico.
   * @param {File} file Archivo a subir.
   * @param {string} auditId ID de la auditoría.
   * @param {string} controlId ID del control normativo.
   * @returns {Promise<{fileName: string, fileUrl: string, sha256: string, uploadedAt: string}>}
   */
  uploadEvidence: async (file, auditId, controlId) => {
    if (!file) {
      throw new Error('No se proporcionó un archivo para subir.');
    }

    // Paso obligatorio de seguridad: Calcular el hash SHA-256 localmente antes de subir
    const sha256 = await cryptoWrapper.calculateSHA256(file);

    if (!isFirebaseConfigured) {
      console.warn('Firebase API Key no configurada. Usando fallback local para simulación.');
      // Simulamos la subida creando un ObjectURL local para visualización temporal
      const mockUrl = URL.createObjectURL(file);
      
      return {
        fileName: file.name,
        fileUrl: mockUrl,
        sha256,
        uploadedAt: new Date().toISOString()
      };
    }

    try {
      const fileExtension = file.name.split('.').pop() || 'bin';
      const storagePath = `audits/${auditId}/evidence/${controlId}/${sha256}.${fileExtension}`;
      const fileRef = ref(storage, storagePath);

      // Subida de bytes
      await uploadBytes(fileRef, file);
      
      // Obtener URL pública
      const fileUrl = await getDownloadURL(fileRef);

      return {
        fileName: file.name,
        fileUrl,
        sha256,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error al subir evidencia a Firebase Storage:', error);
      throw new Error(`Fallo en la subida del archivo: ${error.message}`);
    }
  },

  /**
   * Elimina un archivo del storage a partir de su URL pública.
   * @param {string} fileUrl URL pública del archivo.
   */
  deleteEvidence: async (fileUrl) => {
    if (!fileUrl) return;

    if (!isFirebaseConfigured || fileUrl.startsWith('blob:')) {
      console.log('Modo simulación: Evidencia local eliminada conceptualmente.', fileUrl);
      if (fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl);
      }
      return;
    }

    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error al eliminar evidencia de Firebase Storage:', error);
    }
  }
};
