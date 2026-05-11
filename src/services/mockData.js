// Datos de demostración para el Sistema de Auditoría Informática (SAI)

export const mockUsers = [
  { id: '1', name: 'Carlos Mendoza', role: 'Contralor Municipal', email: 'cmendoza@cmp.gob.ve', avatar: 'CM', status: 'Activo', twoFactorEnabled: true, createdAt: '2025-01-15' },
  { id: '2', name: 'Ana Silva', role: 'Director General', email: 'asilva@cmp.gob.ve', avatar: 'AS', status: 'Activo', twoFactorEnabled: true, createdAt: '2025-02-01' },
  { id: '3', name: 'Luis Ramos', role: 'Director de Control', email: 'lramos@cmp.gob.ve', avatar: 'LR', status: 'Activo', twoFactorEnabled: false, createdAt: '2025-03-10' },
  { id: '4', name: 'María Gonzalez', role: 'Coordinador de Auditoría', email: 'mgonzalez@cmp.gob.ve', avatar: 'MG', status: 'Inactivo', twoFactorEnabled: false, createdAt: '2025-04-20' },
  { id: '5', name: 'José Pérez', role: 'Auditor', email: 'jperez@cmp.gob.ve', avatar: 'JP', status: 'Activo', twoFactorEnabled: true, createdAt: '2025-05-05' },
  { id: '6', name: 'Laura Gómez', role: 'Abogado Actuante', email: 'lgomez@cmp.gob.ve', avatar: 'LG', status: 'Activo', twoFactorEnabled: false, createdAt: '2026-01-10' },
  { id: '7', name: 'Pedro Díaz', role: 'Dir. de Det. de Resp.', email: 'pdiaz@cmp.gob.ve', avatar: 'PD', status: 'Activo', twoFactorEnabled: true, createdAt: '2026-02-15' }
];

export const mockAudits = [
  {
    id: 'AUD-2026-001',
    title: 'Evaluación de Seguridad BD',
    organism: 'Alcaldía de Pedraza',
    status: 'in-progress',
    progress: 45,
    startDate: '2026-04-15',
    endDate: '2026-05-30',
    team: ['4', '5'],
    priority: 'Alta',
    tasks: { total: 24, completed: 11 }
  },
  {
    id: 'AUD-2026-002',
    title: 'Auditoría Redes Internas',
    organism: 'Concejo Municipal',
    status: 'review',
    progress: 90,
    startDate: '2026-03-01',
    endDate: '2026-05-10',
    team: ['3', '4'],
    priority: 'Media',
    tasks: { total: 15, completed: 14 }
  },
  {
    id: 'AUD-2026-003',
    title: 'Planificación Anual SO',
    organism: 'Contraloría Municipal',
    status: 'open',
    progress: 0,
    startDate: '2026-06-01',
    endDate: '2026-07-15',
    team: ['2', '3'],
    priority: 'Baja',
    tasks: { total: 30, completed: 0 }
  },
  {
    id: 'AUD-2026-004',
    title: 'Revisión PAC 2025',
    organism: 'Alcaldía de Pedraza',
    status: 'closed',
    progress: 100,
    startDate: '2026-01-10',
    endDate: '2026-02-28',
    team: ['5'],
    priority: 'Alta',
    tasks: { total: 10, completed: 10 }
  }
];

export const mockChecklist = [
  {
    id: '5.1',
    category: 'Organizacionales',
    title: 'Políticas para la seguridad de la información',
    description: 'La política de seguridad de la información y las políticas específicas del tema deben ser definidas, aprobadas por la dirección, publicadas, comunicadas y reconocidas por los empleados relevantes.',
    status: null, // null significa "sin auditar" (círculo rojo)
    observations: ''
  },
  {
    id: '5.2',
    category: 'Organizacionales',
    title: 'Roles y responsabilidades de seguridad de la información',
    description: 'Todas las responsabilidades de seguridad de la información deben ser definidas y asignadas de acuerdo con las necesidades de la organización.',
    status: 'Cumple',
    observations: 'Definidos en el manual de organización.'
  },
  {
    id: '5.7',
    category: 'Organizacionales',
    title: 'Inteligencia de amenazas',
    description: 'La información relacionada con las amenazas de seguridad de la información debe ser recolectada y analizada para producir inteligencia de amenazas.',
    status: null,
    observations: ''
  },
  {
    id: '6.1',
    category: 'Personas',
    title: 'Investigación de antecedentes',
    description: 'Se deben realizar verificaciones de antecedentes para todos los candidatos a empleo de acuerdo con las leyes relevantes, regulaciones y la ética.',
    status: 'Parcial',
    observations: 'Solo se hace para personal fijo, no para contratistas temporales.'
  },
  {
    id: '6.2',
    category: 'Personas',
    title: 'Términos y condiciones de empleo',
    description: 'Los acuerdos contractuales con empleados y contratistas deben establecer sus responsabilidades y las de la organización respecto a la seguridad de la información.',
    status: null,
    observations: ''
  },
  {
    id: '7.1',
    category: 'Físicos',
    title: 'Perímetros de seguridad física',
    description: 'Los perímetros de seguridad deben definirse y utilizarse para proteger áreas que contienen información y otros activos asociados.',
    status: 'No Cumple',
    observations: 'Falta control de acceso biométrico en el servidor central.'
  },
  {
    id: '7.2',
    category: 'Físicos',
    title: 'Controles de entrada física',
    description: 'Las áreas seguras deben estar protegidas por controles de entrada adecuados para asegurar que solo el personal autorizado tenga acceso.',
    status: null,
    observations: ''
  },
  {
    id: '8.1',
    category: 'Tecnológicos',
    title: 'Dispositivos de punto final de usuario',
    description: 'La información almacenada, procesada o accesible a través de dispositivos de punto final de usuario debe estar protegida.',
    status: null,
    observations: ''
  },
  {
    id: '8.8',
    category: 'Tecnológicos',
    title: 'Gestión de vulnerabilidades técnicas',
    description: 'Debe obtenerse información sobre las vulnerabilidades técnicas de los sistemas de información que se están utilizando, evaluar la exposición y tomar medidas apropiadas.',
    status: null,
    observations: ''
  }
];

export const mockFindings = [
  {
    id: 'HALL-001',
    auditId: 'AUD-2026-001',
    condition: 'El 40% de los equipos de computación del departamento de finanzas no cuentan con software antivirus.',
    criterion: 'Control 8.1 ISO 27001:2022 y Norma 10 del Manual de Auditoría CGR.',
    cause: 'Falta de renovación de licencias anuales por déficit presupuestario.',
    effect: 'Riesgo alto de infección por malware que puede comprometer la integridad y disponibilidad de la data financiera del municipio.',
    severity: 'Crítico',
    status: 'Abierto'
  }
];

export const mockReports = [
  {
    id: 'REP-001',
    auditId: 'AUD-2026-001',
    auditTitle: 'Evaluación de Seguridad BD',
    entity: 'Alcaldía de Pedraza',
    preliminary: { status: 'generado', date: '2026-05-15' },
    definitive: { status: 'firmado', date: '2026-05-20', signedBy: 'Carlos Mendoza', signType: 'digital' },
    executive: { status: 'generado', date: '2026-05-20' },
    createdAt: '2026-05-15'
  },
  {
    id: 'REP-002',
    auditId: 'AUD-2026-002',
    auditTitle: 'Auditoría Redes Internas',
    entity: 'Concejo Municipal',
    preliminary: { status: 'generado', date: '2026-04-10' },
    definitive: { status: 'pendiente', date: null },
    executive: { status: 'pendiente', date: null },
    createdAt: '2026-04-10'
  }
];

export const mockPACs = [
  {
    id: 'PAC-001',
    auditId: 'AUD-2026-001',
    status: 'Borrador', // Borrador, Conformado
    actions: [
      {
        recommendationId: 'HALL-001',
        correctiveAction: 'Adquirir e instalar licencias de antivirus para todos los equipos de la unidad financiera.',
        verificationMethod: 'Factura de compra e informe de instalación técnica',
        responsible: 'Ing. María López (Soporte Técnico)',
        estimatedDate: '2026-06-30',
        observations: 'Presupuesto aprobado en punto de cuenta N° 45.'
      }
    ],
    signatures: {
      elaborated: { status: 'firmado', name: 'Lic. José Ramírez', role: 'Director de Finanzas' },
      approved: { status: 'firmado', name: 'Econ. Pedro Gómez', role: 'Alcalde (E)' },
      conformed: { status: 'pendiente', name: null, role: 'Coordinador de Auditoría' }
    },
    createdAt: '2026-05-21'
  }
];
