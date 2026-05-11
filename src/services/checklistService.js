import { mockChecklist } from './mockData';

// Estado en memoria para simular persistencia durante la sesión
let currentChecklist = [...mockChecklist];

export const checklistService = {
  getChecklistForAudit: async (auditId) => {
    // En una app real filtraríamos por auditId. Por ahora devolvemos el mock.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...currentChecklist]);
      }, 300);
    });
  },

  updateControl: async (auditId, controlId, updateData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulamos autoguardado actualizando el estado en memoria
        currentChecklist = currentChecklist.map(control => 
          control.id === controlId ? { ...control, ...updateData } : control
        );
        const updatedControl = currentChecklist.find(c => c.id === controlId);
        resolve(updatedControl);
      }, 200); // Simulamos respuesta rápida de autoguardado
    });
  }
};
