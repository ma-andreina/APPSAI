import { mockFindings } from './mockData';

let currentFindings = [...mockFindings];

export const findingService = {
  getAll: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...currentFindings]), 400);
    });
  },

  create: async (findingData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newFinding = {
          id: `HALL-${String(currentFindings.length + 1).padStart(3, '0')}`,
          status: 'Abierto',
          createdAt: new Date().toISOString(),
          ...findingData
        };
        currentFindings = [newFinding, ...currentFindings];
        resolve(newFinding);
      }, 600);
    });
  }
};
